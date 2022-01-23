using Core.Enums;
using Core.Interfaces.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Web.Hubs;

public class RoomHub : Hub, IRoomHub
{
    private readonly IHubContext<RoomHub> context;

    public RoomHub(IHubContext<RoomHub> context)
    {
        this.context = context;
    }

    public async Task UpdateVideoState(string idRoom, RoomState state)
    {
        await context.Clients.All.SendAsync("update-room-state", idRoom, state);
    }

    public async Task SeekTime(string idRoom, double time)
    {
        var synchro = DateTime.Now.AddSeconds(10);
        await context.Clients.All.SendAsync("seek-time", idRoom, time, synchro);
    }
}