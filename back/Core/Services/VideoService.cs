using Adapters.FileServe;
using Core.Interfaces.Repositories;
using Core.Interfaces.Services;
using Core.Models;

namespace Core.Services;

internal class VideoService : IVideoService
{
    private readonly IAuthenticationService authenticationService;
    private readonly IUserFilesClient filesClient;
    private readonly IVideoRepository videoRepository;

    public VideoService(IUserFilesClient filesClient, IAuthenticationService authenticationService,
        IVideoRepository videoRepository)
    {
        this.filesClient = filesClient;
        this.authenticationService = authenticationService;
        this.videoRepository = videoRepository;
    }

    public Task<List<Video>> GetVideos()
    {
        return videoRepository.GetVideos();
    }

    public async Task<Video> AddVideo(string container, string filename, string mime, Stream content)
    {
        var token = await authenticationService.Login();
        var file = await filesClient.AddFile2Async(token, token, filename, $"/{container}/raw",
            new FileParameter(content, filename, mime));

        var video = await videoRepository.CreateVideo(file.Id);

        return video;
    }


    public async Task DownloadVideo(string idVideo, string path)
    {
        var video = await videoRepository.GetVideo(idVideo);
        var token = await authenticationService.Login();

        var fileResponse = await filesClient.GetFileContent2Async(video.IdFile, token, token);


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
        var token = await authenticationService.Login();
        var file = await videoRepository.GetVideo(idVideo);

        var tasks = new List<Task>
        {
            filesClient.DeleteFile2Async(file.IdFile, token, token),
            videoRepository.DeleteVideo(idVideo)
        };

        if (file.IdConvertedFile != null) tasks.Add(filesClient.DeleteFile2Async(file.IdConvertedFile, token, token));

        await Task.WhenAll(tasks);
    }

    public async Task<Video> GetVideo(string idVideo)
    {
        return await videoRepository.GetVideo(idVideo);
    }
}