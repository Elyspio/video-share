namespace Core.Exceptions;

public class RoomNotFoundException : Exception
{
    public RoomNotFoundException(string idRoom) : base(
        $"Could not found the room {idRoom}")
    {
    }
}