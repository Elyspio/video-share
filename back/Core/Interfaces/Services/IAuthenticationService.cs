namespace Core.Interfaces.Services;

public interface IAuthenticationService
{
    /// <summary>
    ///     Check if the token passed as parameter is valid
    /// </summary>
    /// <param name="token">Identification token</param>
    /// <returns>Whether the token is valid or not</returns>
    Task<bool> IsLogged(string token);

    /// <summary>
    ///     Login to the authentication Server with Video-share's username / password
    /// </summary>
    /// <returns>Identification token</returns>
    Task<string> Login();

    /// <summary>
    ///     Get username associated to this token
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    Task<string> GetUsername(string token);
}