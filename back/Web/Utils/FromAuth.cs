using Core.Interfaces.Utils;

namespace Web.Utils;

public class AuthUtility
{
    public const string UsernameField = "auth_username";

    public const string TokenField = "auth_token";

    public static string GetUsername(HttpRequest request)
    {
        return request.Headers[UsernameField].First();
    }

    public static string GetToken(HttpRequest request)
    {
        return request.Headers[TokenField].First();
    }

    public static void FillContext(IAuthContext context, HttpRequest request)
    {
        context.Token = GetToken(request);
        context.Username = GetUsername(request);
    }
}