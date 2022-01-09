using Adapters.Authentication;
using Core.Enums;
using Core.Interfaces.Repositories;
using Core.Interfaces.Services;

namespace Core.Services;

internal class ConverterService : IConverterService
{
    private const string PublicUser = "public";

    private readonly IUsersClient userClient;
    private readonly IVideoRepository videoRepository;

    public ConverterService(IUsersClient userClient, IVideoRepository videoRepository)
    {
        this.userClient = userClient;
        this.videoRepository = videoRepository;
    }

    public Task<string> Convert(string fileId, VideoFormat format)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> IsConverted(string idVideo)
    {
        var video = await videoRepository.GetVideo(idVideo);
        return video.Converted;
    }
}