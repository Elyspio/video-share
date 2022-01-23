using Adapters.FileServe;
using Core.Enums;
using Core.Interfaces.Hubs;
using Core.Interfaces.Services;
using Core.Interfaces.Utils;

namespace Core.Services;

internal class ConverterService : IConverterService
{
    private readonly IAuthenticationService authenticationService;
    private readonly IConversionHub conversionHub;
    private readonly IAuthContext authContext;
    private readonly IUserFilesClient filesClient;
    private readonly IVideoService videoService;

    public ConverterService(IUserFilesClient filesClient, IVideoService videoService,
        IAuthenticationService authenticationService, IConversionHub conversionHub, IAuthContext authContext)
    {
        this.filesClient = filesClient;
        this.videoService = videoService;
        this.authenticationService = authenticationService;
        this.conversionHub = conversionHub;
        this.authContext = authContext;
    }

    public async Task<string> Convert(string idVideo, VideoFormat format)
    {
        var video = await videoService.GetVideo(idVideo);

        if (video.IdConvertedFile != null) return video.IdConvertedFile;

        var rawVideoPath = Path.GetTempFileName();
        var ffmpeg = new FFmpeg.FFmpeg(rawVideoPath, VideoFormat.Streamable);

        try
        {
            await videoService.DownloadVideo(idVideo, rawVideoPath);


            ffmpeg.OnProgress = progression =>
            {
                Console.WriteLine("FFmpeg Progression " + progression);
                conversionHub.UpdateConversionProgression(idVideo, progression);
            };

            var data = await ffmpeg.Convert();
            await conversionHub.UpdateConversionProgression(idVideo, 100);

            var rawFileMetadata = await filesClient.GetFile2Async(video.IdFile, authContext.Token, authContext.Token);


            var container = rawFileMetadata.Location[..rawFileMetadata.Location.LastIndexOf("/")];

            var createdFilename = $"{Path.GetFileNameWithoutExtension(rawFileMetadata.Filename)}.mp4";

            string idCreated;

            using (var stream = new MemoryStream(data))
            {
                var created = await filesClient.AddFile2Async(
                    authContext.Token,
                    authContext.Token,
                    createdFilename,
                    $"{container}/converted",
                    new FileParameter(stream, createdFilename, "video/mp4")
                );

                idCreated = created.Id;
            }

            await videoService.LinkVideo(idVideo, idCreated);

            return idCreated;
        }
        finally
        {
            if (File.Exists(rawVideoPath)) File.Delete(rawVideoPath);
            ffmpeg.Clean();
        }
    }


    public async Task<bool> IsConverted(string idVideo)
    {
        var video = await videoService.GetVideo(idVideo);
        return video.IdConvertedFile != null;
    }
}