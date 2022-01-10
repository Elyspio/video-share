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
        IAuthenticationService authenticationService)
    {
        this.filesClient = filesClient;
        this.videoService = videoService;
        this.authenticationService = authenticationService;
    }

    public async Task<string> Convert(string idVideo, VideoFormat format)
    {
        var rawVideoPath = Path.GetTempFileName();
        await videoService.DownloadVideo(idVideo, rawVideoPath);

        var ffmpeg = new FFmpeg.FFmpeg(rawVideoPath, VideoFormat.Streamable);

        ffmpeg.OnProgress += progression => { conversionHub.UpdateConversionProgression(idVideo, progression); };

        var data = await ffmpeg.Convert();

        var token = await authenticationService.Login();
        var video = await videoService.GetVideo(idVideo);
        var rawFileMetadata = await filesClient.GetFile2Async(video.IdFile, token, token);


        var container = rawFileMetadata.Location[..rawFileMetadata.Location.LastIndexOf("/")];
        var created = await filesClient.AddFile2Async(token, token, rawFileMetadata.Filename, $"{container}/converted",
            new FileParameter(new MemoryStream(data), rawFileMetadata.Filename));

        await videoService.LinkVideo(idVideo, created.Id);
        await conversionHub.UpdateConversionProgression(idVideo, 100);

        return created.Id;
    }


    public async Task<bool> IsConverted(string idVideo)
    {
        var video = await videoService.GetVideo(idVideo);
        return video.IdConvertedFile != null;
    }
}