﻿using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Core.Enums;

namespace Web.Models;

public class RoomModel
{
    /// <summary>
    ///     Room's name (id)
    /// </summary>
    [Required]
    [NotNull]
    public string Name { get; set; }

    [Required] [NotNull] public string FileName { get; set; }
    [Required] [NotNull] public string IdVideo { get; set; }
    [Required] [NotNull] public string Location { get; set; }
    [Required] public VideoState State { get; set; }
}