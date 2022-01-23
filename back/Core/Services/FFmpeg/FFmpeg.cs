﻿using Core.Enums;
using Core.Utils;
using System.Diagnostics;
using System.Text;

namespace Core.Services.FFmpeg;

public class FFmpeg
{
    private readonly string ffmpegPath = Env.Get("FFMPEG_PATH", @"C:\Program Files\FFmpeg\bin\ffmpeg.exe")!;
    private readonly string input;

    private readonly string output;


    private readonly string outputFolder = Env.Get("OUTPUT_FOLDER_PATH", Path.Join(Path.GetTempPath(), "video-share"))!;
    private readonly Process proc;


    public Action<double> OnProgress = d => { };

    public FFmpeg(string input, VideoFormat format)
    {
        this.input = input;
        output = Path.Join(outputFolder, "output.mp4");
        EnsureOutputFolder();
        var formatStr = format switch
        {
            VideoFormat.Streamable => "h264_nvenc",
            _ => throw new ArgumentOutOfRangeException(nameof(format), $"Not expected format value: {format}")
        };


        proc = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = ffmpegPath,
                Arguments = $"-i \"{input}\" -c:v \"{formatStr}\"   -pix_fmt yuv420p -y \"{output}\" ",
                WorkingDirectory = Path.GetDirectoryName(input),
                CreateNoWindow = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                WindowStyle = ProcessWindowStyle.Hidden
            }
        };

        proc.EnableRaisingEvents = true;
    }

    /// <summary>
    ///     Convert input file to a streamable format
    /// </summary>
    /// <returns></returns>
    public async Task<byte[]> Convert()
    {
        var nbFrames = await GetFramesCount();

        var stderr = new StringBuilder();

        proc.ErrorDataReceived += (proc, e) =>
        {
            if (e.Data == null) return;
            stderr.AppendLine(e.Data.ToString());
            Console.WriteLine("Error " + e.Data?.ToString());

            if (e.Data!.Contains("frame="))
            {
                var currentFrame = GetCurrentFrame(e.Data);
                var percentage = currentFrame / (double)nbFrames * 100;

                if (percentage > 100) percentage = 100;

                OnProgress(percentage);
            }
        };


        proc.Start();
        proc.BeginErrorReadLine();
        await proc.WaitForExitAsync();

        if (proc.ExitCode != 0) throw new Exception("FFmpeg error: " + stderr);

        var content = await File.ReadAllBytesAsync(output);
        return content;
    }


    private async Task<long> GetFramesCount()
    {
        var properties = await FFprobe.GetFileInfos(input);
        var stream = properties.Streams.Find(stream => stream.CodecType == "video")!;
        var parts = stream.AvgFrameRate.Split("/");
        var framerate = (long)Math.Round(double.Parse(parts[0]) / double.Parse(parts[1]));

        var replace = properties.Format.Duration.Replace(".", ",");
        return (long)Math.Round(framerate * double.Parse(replace));
    }


    private long GetCurrentFrame(string chunk)
    {
        var data = chunk.Split("\n").Select(line => line.Split("=")).ToArray();

        return long.Parse(data[0][1].Trim().Split(" ")[0]);
    }

    public void Clean()
    {
        if (File.Exists(output)) File.Delete(output);
    }


    private void EnsureOutputFolder()
    {
        Directory.CreateDirectory(outputFolder);
    }
}
// ffmpeg  -i '.\Mushoku Tensei - 01.mkv' -c:v h264_nvenc -vf subtitles='Mushoku Tensei - 01.mkv'  -pix_fmt yuvj420p -y '.\Mushoku Tensei - 01.mp4'