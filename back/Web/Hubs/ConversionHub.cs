using Core.Interfaces.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Web.Hubs;

public class ConversionHub : Hub, IConversionHub
{
    private readonly IHubContext<ConversionHub> context;

    public ConversionHub(IHubContext<ConversionHub> context)
    {
        this.context = context;
    }

    public async Task UpdateConversionProgression(string idVideo, double percentageDone)
    {
        await context.Clients.All.SendAsync("update-conversion-progression", idVideo, percentageDone);
    }
}