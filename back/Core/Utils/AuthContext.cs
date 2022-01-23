namespace Core.Interfaces.Utils
{
    public class AuthContext : IAuthContext
    {

        public string Username { get; set; }
        public string Token { get; set; }
    }
}
