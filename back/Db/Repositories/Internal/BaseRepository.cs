using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace Db.Repositories.Internal;

internal abstract class BaseRepository<T>
{
    protected readonly string CollectionName;
    protected readonly MongoContext context;
    private readonly ILogger<BaseRepository<T>> logger;

    protected BaseRepository(IConfiguration configuration, ILogger<BaseRepository<T>> logger)
    {
        context = new MongoContext(configuration);
        CollectionName = typeof(T).Name;
        this.logger = logger;
        var pack = new ConventionPack
        {
            new EnumRepresentationConvention(BsonType.String)
        };

        ConventionRegistry.Register("EnumStringConvention", pack, t => true);
    }

    protected IMongoCollection<T> EntityCollection => context.MongoDatabase.GetCollection<T>(CollectionName);
}