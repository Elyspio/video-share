namespace Core.Interfaces.Utils
{
    public interface IAuthContext
    {
        public string Username { get; set; }
        public string Token { get; set; }
    }
}
