using Core.Models;

namespace Core.Interfaces.Repositories;

public interface IVideoRepository
{
    Task<Video> CreateVideo(string idFile);
    Task DeleteVideo(string idVideo);

    Task<Video> GetVideo(string idVideo);
    Task<List<Video>> GetVideos();
    Task<Video> LinkVideo(string idVideo, string idCreated);
}