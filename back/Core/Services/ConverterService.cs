using Adapters.FileServe;
using Core.Enums;
using Core.Interfaces.Hubs;
using Core.Interfaces.Services;

namespace Core.Services;

internal class ConverterService : IConverterService
{
    private readonly IAuthenticationService authenticationService;
    private readonly IConversionHub conversionHub;

    private readonly IUserFilesClient filesClient;
    private readonly IVideoService videoService;

    public ConverterService(IUserFilesClient filesClient, IVideoService videoService,
        IAuthenticationService authenticationService, IConversionHub conversionHub)
    {
        this.filesClient = filesClient;
        this.videoService = videoService;
        this.authenticationService = authenticationService;
        this.conversionHub = conversionHub;
    }

    public async Task<string> Convert(string idVideo, VideoFormat format)
    {

        var video = await this.videoService.GetVideo(idVideo);

        if (video.IdConvertedFile != null) return video.IdConvertedFile;

        var rawVideoPath = Path.GetTempFileName();
        var ffmpeg = new FFmpeg.FFmpeg(rawVideoPath, VideoFormat.Streamable);

        try
        {
            await videoService.DownloadVideo(idVideo, rawVideoPath);


            ffmpeg.OnProgress += progression => { conversionHub.UpdateConversionProgression(idVideo, progression); };

            var data = await ffmpeg.Convert();

            var token = await authenticationService.Login();
            var rawFileMetadata = await filesClient.GetFile2Async(video.IdFile, token, token);


            var container = rawFileMetadata.Location[..rawFileMetadata.Location.LastIndexOf("/")];
            var created = await filesClient.AddFile2Async(token, token, rawFileMetadata.Filename, $"{container}/converted",
                new FileParameter(new MemoryStream(data), rawFileMetadata.Filename, rawFileMetadata.Mime));

            await videoService.LinkVideo(idVideo, created.Id);
            await conversionHub.UpdateConversionProgression(idVideo, 100);

            return created.Id;
        }
        finally
        {
            if (File.Exists(rawVideoPath))
            {
                File.Delete(rawVideoPath);
            }
            ffmpeg.Clean();
        }

        return video.IdConvertedFile;



    }


    public async Task<bool> IsConverted(string idVideo)
    {
        var video = await videoService.GetVideo(idVideo);
        return video.IdConvertedFile != null;
    }
}