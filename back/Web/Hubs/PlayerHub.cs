using Core.Enums;
using Core.Interfaces.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Web.Hubs;

public class PlayerHub : Hub, IPlayerHub
{

    private readonly IHubContext<PlayerHub> context;

    public PlayerHub(IHubContext<PlayerHub> context)
    {
        this.context = context;
    }
    public async Task UpdateVideoState(string idVideo, VideoState state)
    {
        await context.Clients.All.SendAsync("update-video-state", idVideo, state);
    }
}