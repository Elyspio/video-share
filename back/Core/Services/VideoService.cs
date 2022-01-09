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

    public async Task DeleteVideo(string idVideo)
    {
        var token = await authenticationService.Login();
        var file = await videoRepository.GetVideo(idVideo);
        await filesClient.DeleteFile2Async(file.IdFile, token, token);
        await videoRepository.DeleteVideo(idVideo);
    }
}