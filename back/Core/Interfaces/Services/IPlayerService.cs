using Core.Enums;
using Core.Models;

namespace Core.Interfaces.Services;

public interface IPlayerService
{
    Task UpdateState(string roomId, VideoState state);
    Task<Room> CreateRoom(string videoId);
    Task DeleteRoom(string roomId);
}