using Core.Interfaces.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Web.Hubs;

public class ConversionHub : Hub, IConversionHub
{
    public async Task UpdateConversionProgression(string idVideo, double percentageDone)
    {
        await Clients.All.SendAsync("update-conversion-progression", idVideo, percentageDone);
    }
}