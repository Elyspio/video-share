namespace Core.Exceptions;

public class RoomNotFoundException : Exception
{
    public RoomNotFoundException(string idRoom) : base(
        $"Could not find the room {idRoom}")
    {
    }
}