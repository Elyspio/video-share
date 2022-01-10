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

    /// <summary>
    ///     Get a video from its id
    /// </summary>
    /// <param name="idVideo">id of the video</param>
    /// <returns></returns>
    Task<Video> GetVideo(string idVideo);


    /// <summary>
    ///     Download a video into a path
    /// </summary>
    /// <param name="idVideo"></param>
    /// <param name="path"></param>
    /// <returns></returns>
    public Task DownloadVideo(string idVideo, string path);

    /// <summary>
    ///     Link a video to its converted file
    /// </summary>
    /// <param name="idVideo"></param>
    /// <param name="idCreated"></param>
    /// <returns></returns>
    Task<Video> LinkVideo(string idVideo, string idCreated);
}