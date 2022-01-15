using Core.Enums;

namespace Core.Interfaces.Hubs;

public interface IPlayerHub
{
    public Task UpdateVideoState(string idVideo, RoomState state);
}