using Core.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Db.Entities;

public class RoomEntity
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; set; }

    public string IdVideo { get; set; }
    public string Location { get; set; }
    public string FileName { get; set; }

    public RoomState State { get; set; }
}