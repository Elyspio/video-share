using Adapters.FileServe;
using Core.Interfaces.Repositories;
using Core.Interfaces.Services;
using Core.Interfaces.Utils;
using Core.Models;

namespace Core.Services;

internal class VideoService : IVideoService
{
    private readonly IUserFilesClient filesClient;
    private readonly IVideoRepository videoRepository;
    private readonly IAuthContext authContext;

    public VideoService(IUserFilesClient filesClient, IAuthenticationService authenticationService,
        IVideoRepository videoRepository, IAuthContext authContext)
    {
        this.filesClient = filesClient;
        this.videoRepository = videoRepository;
        this.authContext = authContext;
    }

    public Task<List<Video>> GetVideos()
    {
        return videoRepository.GetVideos();
    }

    public async Task<Video> AddVideo(string container, string filename, string mime, Stream content)
    {

        if (container[0] == '/')
        {
            container = container[1..];
        }

        var file = await filesClient.AddFile2Async(authContext.Token, authContext.Token, filename, $"/{container}/raw",
            new FileParameter(content, filename, mime));

        var video = await videoRepository.CreateVideo(file.Id);

        return video;
    }


    public async Task DownloadVideo(string idVideo, string path)
    {
        var video = await videoRepository.GetVideo(idVideo);

        var fileResponse = await filesClient.GetFileContent2Async(video.IdFile, authContext.Token, authContext.Token);


        await using var memoryStream = new MemoryStream();
        await fileResponse.Stream.CopyToAsync(memoryStream);

        await File.WriteAllBytesAsync(path, memoryStream.ToArray());
    }

    public async Task<Video> LinkVideo(string idVideo, string idCreated)
    {
        return await videoRepository.LinkVideo(idVideo, idCreated);
    }

    public async Task DeleteVideo(string idVideo)
    {
        var file = await videoRepository.GetVideo(idVideo);

        var tasks = new List<Task>
        {
            filesClient.DeleteFile2Async(file.IdFile, authContext.Token, authContext.Token),
            videoRepository.DeleteVideo(idVideo)
        };

        if (file.IdConvertedFile != null) tasks.Add(filesClient.DeleteFile2Async(file.IdConvertedFile, authContext.Token, authContext.Token));

        await Task.WhenAll(tasks);
    }

    public async Task<Video> GetVideo(string idVideo)
    {
        return await videoRepository.GetVideo(idVideo);
    }
}