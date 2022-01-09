using System.Security.Cryptography;
using System.Text;
using Adapters.Authentication;
using Core.Interfaces.Services;
using Core.Utils;

namespace Core.Services;

internal class AuthenticationService : IAuthenticationService
{
    private static readonly string fileServeUsername = "FILESERVE_USERNAME";
    private static readonly string fileServePassword = "FILESERVE_PASSWORD";
    private readonly IAuthenticationClient authenticationApi;
    private readonly IUsersClient usersApi;


    private string? lastToken;


    public AuthenticationService(IAuthenticationClient authenticationApi, IUsersClient usersApi)
    {
        this.authenticationApi = authenticationApi;
        this.usersApi = usersApi;
    }

    public async Task<bool> IsLogged(string token)
    {
        return await authenticationApi.ValidToken2Async(token);
    }

    public async Task<string> Login()
    {
        if (lastToken != null && await IsLogged(lastToken)) return lastToken;


        var username = Env.Get<string>(fileServeUsername);
        var password = Env.Get<string>(fileServePassword);
        if (username == null || password == null)
            throw new Exception($"{fileServeUsername} or {fileServePassword} are empty");
        var ownHash = CreateMD5(username + password);
        var saltResponse = await authenticationApi.LoginInitAsync(new PostLoginInitRequest("", username));
        var hash = CreateMD5(ownHash + saltResponse.Salt);
        var hashResponse = await authenticationApi.LoginAsync(new PostLoginRequest(hash, username));
        lastToken = hashResponse.Token;
        return lastToken;
    }


    public async Task<string> GetUsername(string token)
    {
        return await usersApi.GetUserInfoAsync(Kind.Username, token);
    }

    public static string CreateMD5(string input)
    {
        // Use input string to calculate MD5 hash
        using var md5 = MD5.Create();
        var inputBytes = Encoding.ASCII.GetBytes(input);
        var hashBytes = md5.ComputeHash(inputBytes);

        // Convert the byte array to hexadecimal string
        var sb = new StringBuilder();
        foreach (var b in hashBytes) sb.Append(b.ToString("X2"));

        return sb.ToString().ToLower();
    }
}