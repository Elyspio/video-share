namespace Core.Exceptions;

public class VideoNotFoundException : Exception
{
    public VideoNotFoundException(string idVideo) : base(
        $"Could not find the video {idVideo}")
    {
    }
}