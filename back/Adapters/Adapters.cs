using Adapters.Authentication;
using Adapters.FileServe;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Adapters;

public static class Adapters
{
    /// <summary>
    ///     Add all HttpClients for project adapters
    /// </summary>
    /// <param name="services"></param>
    /// <param name="configuration"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    public static IServiceCollection AddAdapters(this IServiceCollection services, IConfiguration configuration)
    {
        if (services == null) throw new ArgumentNullException(nameof(services));

        if (configuration == null) throw new ArgumentNullException(nameof(configuration));


        // Inject Adapters
        var authenticationServerUrl = Environment.GetEnvironmentVariable("AUTHENTICATION_SERVER_URI");

        services.AddHttpClient<IAuthenticationClient, AuthenticationClient>(client =>
        {
            client.BaseAddress =
                new Uri(authenticationServerUrl ??
                        $"{configuration["AuthenticationServer:Scheme"]}://{configuration["AuthenticationServer:Host"]}:{configuration["AuthenticationServer:Port"]}");
        });

        services.AddHttpClient<IUsersClient, UsersClient>(client =>
        {
            client.BaseAddress =
                new Uri(authenticationServerUrl ??
                        $"{configuration["AuthenticationServer:Scheme"]}://{configuration["AuthenticationServer:Host"]}:{configuration["AuthenticationServer:Port"]}");
        });


        var fileServeUrl = Environment.GetEnvironmentVariable("FILESERVE_SERVER_URI");

        services.AddHttpClient<IUserFilesClient, UserFilesClient>(client =>
        {
            client.Timeout = TimeSpan.FromHours(1);
            client.BaseAddress = new Uri(fileServeUrl ??
                                         $"{configuration["FileServeServer:Scheme"]}://{configuration["FileServeServer:Host"]}:{configuration["FileServeServer:Port"]}");
        });
        return services;
    }
}