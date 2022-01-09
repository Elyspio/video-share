using Core.Interfaces.Assemblers;
using Core.Models;
using Db.Entities;
using MongoDB.Bson;

namespace Db.Assemblers;

public class VideoAssembler : BaseAssembler<Video, VideoEntity>
{
    public override VideoEntity Convert(Video obj)
    {
        return new VideoEntity
        {
            Converted = obj.Converted,
            Id = new ObjectId(obj.Id),
            IdFile = obj.IdFile
        };
    }

    public override Video Convert(VideoEntity obj)
    {
        return new Video
        {
            Converted = obj.Converted,
            Id = obj.Id.ToString(),
            IdFile = obj.IdFile
        };
    }
}