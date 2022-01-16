namespace Core.Exceptions;

public class VideoNotConvertedException : Exception
{
    public VideoNotConvertedException(string idVideo) : base(
        $"The video {idVideo} is not converted")
    {
    }
}