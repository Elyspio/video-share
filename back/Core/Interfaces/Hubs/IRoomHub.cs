using Core.Enums;

namespace Core.Interfaces.Hubs;

public interface IRoomHub
{
    public Task UpdateVideoState(string idRoom, RoomState state);
    public Task SeekTime(string idRoom, long time);
}