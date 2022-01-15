using Core.Enums;
using Core.Models;

namespace Core.Interfaces.Repositories;

public interface IRoomRepository
{
    Task<Room> UpdateRoomState(string idRoom, RoomState state);
    Task<Room> CreateRoom(string idVideo, string filename, string location);
    Task DeleteRoom(string idRoom);

    Task<Room> GetRoom(string idRoom);
    Task<List<Room>> GetRooms();
}