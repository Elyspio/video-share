using Core.Models;

namespace Core.Interfaces.Services;

public interface IVideoService
{
    /// <summary>
    ///     Get all videos available
    /// </summary>
    /// <returns></returns>
    Task<List<Video>> GetVideos();

    /// <summary>
    ///     Add a new video
    /// </summary>
    /// <param name="container"></param>
    /// <param name="filename"></param>
    /// <param name="mime"></param>
    /// <param name="content"></param>
    /// <returns></returns>
    Task<Video> AddVideo(string container, string filename, string mime, Stream content);

    /// <summary>
    ///     Delete a video with its associated file
    /// </summary>
    /// <param name="idVideo"></param>
    /// <returns></returns>
    Task DeleteVideo(string idVideo);
}