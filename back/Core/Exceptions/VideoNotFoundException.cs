namespace Core.Exceptions;

public class VideoNotFoundException : Exception
{
    public VideoNotFoundException(string idVideo) : base(
        $"Could not found the video {idVideo}")
    {
    }
}