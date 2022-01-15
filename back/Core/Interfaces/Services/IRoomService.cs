using Core.Enums;
using Core.Models;

namespace Core.Interfaces.Services;

public interface IRoomService
{
    Task UpdateState(string roomId, RoomState state);
    Task<Room> CreateRoom(string videoId);
    Task<Room> GetRoom(string videoId);
    Task<List<Room>> GetRooms();
    Task DeleteRoom(string roomId);
}