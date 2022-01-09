using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Web.Models;

public class VideoModel
{
    [Required] [NotNull] public string Id { get; set; }
    [Required] [NotNull] public string IdFile { get; set; }
    [Required] public bool Converted { get; set; }
}