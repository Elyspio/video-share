using Core.Enums;

namespace Core.Interfaces.Services;

public interface IConverterService
{
    /// <summary>
    ///     Convert a video to a different format
    /// </summary>
    /// <param name="fileId">video (file)'s id</param>
    /// <param name="format">new format</param>
    /// <returns></returns>
    Task<string> Convert(string fileId, VideoFormat format);


    /// <summary>
    ///     Check if a video is already converted to a steamable format
    /// </summary>
    /// <param name="idVideo">video (file)'s id</param>
    /// <returns></returns>
    Task<bool> IsConverted(string idVideo);
}