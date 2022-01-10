namespace Core.Interfaces.Hubs;

public interface IConversionHub
{
    public Task UpdateConversionProgression(string idVideo, double percentageDone);
}