using Core.Enums;
using Core.Exceptions;
using Core.Interfaces.Repositories;
using Core.Models;
using Db.Assemblers;
using Db.Entities;
using Db.Repositories.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Db.Repositories;

internal class RoomRepository : BaseRepository<RoomEntity>, IRoomRepository
{
    private readonly RoomAssembler assembler;
    private readonly ILogger<RoomRepository> logger;

    public RoomRepository(IConfiguration configuration, ILogger<RoomRepository> logger) : base(configuration, logger)
    {
        this.logger = logger;
        assembler = new RoomAssembler();
    }


    public async Task<Room> UpdateRoomState(string idRoom, RoomState state)
    {
        var room = await EntityCollection
            .Find(room => room.Id == new ObjectId(idRoom))
            .FirstOrDefaultAsync();


        if (room == null) throw new RoomNotFoundException(idRoom);

        room.State = state;

        await EntityCollection.ReplaceOneAsync(room => room.Id == new ObjectId(idRoom), room);

        return assembler.Convert(room);
    }

    public async Task<Room> CreateRoom(string idVideo, string filename, string location)
    {
        var room = new RoomEntity
        {
            FileName = filename,
            IdVideo = idVideo,
            Location = location
        };
        await EntityCollection.InsertOneAsync(room);


        return assembler.Convert(room);
    }


    public async Task DeleteRoom(string idRoom)
    {
        await EntityCollection.DeleteOneAsync(room => room.Id == new ObjectId(idRoom));
    }

    public async Task<List<Room>> GetRooms()
    {
        var rooms = await EntityCollection.Find(x => true).ToListAsync();
        return assembler.Convert(rooms);
    }

    public async Task<Room> GetRoom(string idRoom)
    {
        var room = await EntityCollection
            .Find(room => room.Id == new ObjectId(idRoom))
            .FirstOrDefaultAsync();

        if (room == null) throw new RoomNotFoundException(idRoom);

        return assembler.Convert(room);
    }
}