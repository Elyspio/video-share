using Core.Enums;

namespace Core.Models;

public class Room
{
    /// <summary>
    ///     Room's name (id)
    /// </summary>
    public string Name { get; set; }

    public string FileName { get; set; }
    public string IdVideo { get; set; }
    public string Location { get; set; }
    public VideoState State { get; set; }
}