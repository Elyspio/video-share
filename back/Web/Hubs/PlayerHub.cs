using Core.Enums;
using Core.Interfaces.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Web.Hubs;

public class PlayerHub : Hub, IPlayerHub
{
    public async Task UpdateVideoState(string idVideo, VideoState state)
    {
        await Clients.All.SendAsync("update-video-state", idVideo, state);
    }
}