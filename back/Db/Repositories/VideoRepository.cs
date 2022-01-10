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

internal class VideoRepository : BaseRepository<VideoEntity>, IVideoRepository
{
    private readonly VideoAssembler assembler;
    private readonly ILogger<VideoRepository> logger;

    public VideoRepository(IConfiguration configuration, ILogger<VideoRepository> logger) : base(configuration, logger)
    {
        this.logger = logger;
        assembler = new VideoAssembler();
    }


    public async Task<Video> CreateVideo(string idFile)
    {
        var video = new VideoEntity
        {
            IdFile = idFile,
            IdConvertedFile = null
        };
        await EntityCollection.InsertOneAsync(video);
        return assembler.Convert(video);
    }

    public async Task DeleteVideo(string idVideo)
    {
        await EntityCollection.FindOneAndDeleteAsync(video => video.Id == new ObjectId(idVideo));
    }


    public async Task<Video> GetVideo(string idVideo)
    {
        var video = await EntityCollection.Find(v => v.Id == new ObjectId(idVideo)).FirstOrDefaultAsync();
        if (video == null) throw new VideoNotFoundException(idVideo);
        return assembler.Convert(video);
    }

    public async Task<List<Video>> GetVideos()
    {
        var videos = await EntityCollection.Find(_ => true).ToListAsync();
        return assembler.Convert(videos);
    }

    public async Task<Video> LinkVideo(string idVideo, string idCreated)
    {
        var video = await EntityCollection.Find(v => v.Id == new ObjectId(idVideo)).FirstOrDefaultAsync();
        if (video == null) throw new VideoNotFoundException(idVideo);
        video.IdConvertedFile = idCreated;
        await EntityCollection.ReplaceOneAsync(v => v.Id == new ObjectId(idVideo), video);
        return assembler.Convert(video);
    }
}