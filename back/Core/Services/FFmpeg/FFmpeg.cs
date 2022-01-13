using System.Diagnostics;
using Core.Enums;
using Core.Utils;

namespace Core.Services.FFmpeg;

public class FFmpeg
{
    private readonly string input;

    private readonly string output = Env.Get("OUTPUT_FILE_PATH", Path.GetTempFileName())!;
    private readonly Process proc;

    private readonly string ffmpegPath = Env.Get("FFMPEG_PATH", "ffmpeg.exe");


    public Action<double> OnProgress = d => { };

    public FFmpeg(string input, VideoFormat format)
    {
        this.input = input;

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
                Arguments = $"-i '{input}' -c:v {formatStr} -vf subtitles='{input}'  -pix_fmt yuvj420p -y '{output}' ",
                UseShellExecute = false,

                RedirectStandardOutput = true,
                CreateNoWindow = true
            }
        };
    }

    /// <summary>
    ///     Convert input file to a streamable format
    /// </summary>
    /// <returns></returns>
    public async Task<byte[]> Convert()
    {
        var nbFrames = await GetFramesCount();

        proc.OutputDataReceived += (_, e) =>
        {
            if (e.Data == null) return;
            var currentFrame = GetCurrentFrame(e.Data);
            var percentage = currentFrame / (double)nbFrames * 100;
            OnProgress(percentage);
        };

        proc.Start();
        await proc.WaitForExitAsync();
        return await File.ReadAllBytesAsync(output);
    }


    private async Task<long> GetFramesCount()
    {
        var properties = await FFprobe.GetFileInfos(input);
        var stream = properties.Streams.Find(stream => stream.CodecType == "video")!;
        var parts = stream.AvgFrameRate.Split("/");
        var framerate = (long)(double.Parse(parts[0]) / double.Parse(parts[1]));

        var replace = properties.Format.Duration.Replace(".", ",");
        return (long) (framerate * double.Parse(replace));
    }


    private long GetCurrentFrame(string chunk)
    {
        var data = chunk.Split("\n").Select(line => line.Split("=")).ToArray();

        return long.Parse(data[0][1]);
    }

    public void Clean()
    {
        if(File.Exists(output))
        {
            File.Delete(output);
        }
    }
}
// ffmpeg  -i '.\Mushoku Tensei - 01.mkv' -c:v h264_nvenc -vf subtitles='Mushoku Tensei - 01.mkv'  -pix_fmt yuvj420p -y '.\Mushoku Tensei - 01.mp4'