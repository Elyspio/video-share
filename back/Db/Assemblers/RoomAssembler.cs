using Core.Interfaces.Assemblers;
using Core.Models;
using Db.Entities;
using MongoDB.Bson;

namespace Db.Assemblers;

public class RoomAssembler : BaseAssembler<Room, RoomEntity>
{
    public override RoomEntity Convert(Room obj)
    {
        return new RoomEntity
        {
            FileName = obj.FileName,
            Id = new ObjectId(obj.Name),
            IdVideo = obj.IdVideo,
            Location = obj.Location,
            State = obj.State
        };
    }

    public override Room Convert(RoomEntity obj)
    {
        return new Room
        {
            FileName = obj.FileName,
            Name = obj.Id.ToString(),
            IdVideo = obj.IdVideo,
            Location = obj.Location
        };
    }
}