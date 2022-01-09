using Core.Models;

namespace Core.Interfaces.Repositories;

public interface IVideoRepository
{
    Task<Video> SetVideoConverted(string idVideo, bool converted);
    Task<Video> CreateVideo(string idFile, bool converted = false);
    Task DeleteVideo(string idVideo);

    Task<Video> GetVideo(string idVideo);
    Task<List<Video>> GetVideos();
}