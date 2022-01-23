using Core.Enums;
using Core.Models;

namespace Core.Interfaces.Services;

public interface IRoomService
{
    Task UpdateState(string idRoom, RoomState state);
    Task<Room> CreateRoom(string idVideo);
    Task<Room> GetRoom(string idRoom);
    Task<List<Room>> GetRooms();
    Task DeleteRoom(string idRoom);
    Task SeekTime(string idRoom, double time);
}