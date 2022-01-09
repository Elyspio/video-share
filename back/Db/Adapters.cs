using Core.Interfaces.Repositories;
using Db.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Db;

public static class Adapters
{
    /// <summary>
    ///     Add all repositories
    /// </summary>
    /// <param name="services"></param>
    /// <param name="configuration"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        if (services == null) throw new ArgumentNullException(nameof(services));

        services.AddSingleton<IVideoRepository, VideoRepository>();
        services.AddSingleton<IRoomRepository, RoomRepository>();

        return services;
    }
}