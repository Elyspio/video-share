using Core.Enums;

namespace Core.Interfaces.Hubs;

public interface IRoomHub
{
    public Task UpdateVideoState(string idRoom, RoomState state);
    void SeekTime(string idRoom, long time);
}