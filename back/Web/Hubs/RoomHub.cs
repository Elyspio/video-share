using Core.Enums;
using Core.Interfaces.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Web.Hubs;

public class RoomHub : Hub, IPlayerHub
{

    private readonly IHubContext<RoomHub> context;

    public RoomHub(IHubContext<RoomHub> context)
    {
        this.context = context;
    }
    public async Task UpdateVideoState(string idVideo, RoomState state)
    {
        await context.Clients.All.SendAsync("update-video-state", idVideo, state);
    }
}