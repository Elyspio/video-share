using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Db.Entities;

public class VideoEntity
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; set; }

    public string IdFile { get; set; }
    public bool Converted { get; set; }
}