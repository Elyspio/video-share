using Core.Enums;
using Core.Interfaces.Services;
using Core.Interfaces.Utils;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Web.Filters;
using Web.Models;
using Web.Utils;

namespace Web.Controllers;

[ApiController]
[Route("videos", Name = "Video")]
[RequireAuth]
public class VideoController : ControllerBase
{
    private readonly IConverterService converterService;
    private readonly IAuthContext authContext;
    private readonly IVideoService videoService;

    public VideoController(IVideoService videoService, IConverterService converterService, IAuthContext authenticationContext)
    {
        this.videoService = videoService;
        this.converterService = converterService;
        this.authContext = authenticationContext;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<VideoModel>), 200)]
    public async Task<IActionResult> GetVideos()
    {
        var files = await videoService.GetVideos();
        return Ok(files);
    }

    [HttpGet("{idVideo}")]
    [ProducesResponseType(typeof(VideoModel), 200)]
    public async Task<IActionResult> GetVideo(string idVideo)
    {
        AuthUtility.FillContext(authContext, Request);
        var file = await videoService.GetVideo(idVideo);
        return Ok(file);
    }


    [HttpPost]
    [ProducesResponseType(typeof(VideoModel), 201)]
    [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
    public async Task<IActionResult> AddVideo([Required][FromForm] string filename,
        [Required][FromForm] string container, [Required] IFormFile file)
    {
        var stream = file.OpenReadStream();
        var data = await videoService.AddVideo(container, filename, file.ContentType, stream);
        await stream.DisposeAsync();
        return Created($"/videos/{data.Id}", data);
    }


    [HttpPost("{idVideo}/convert")]
    [ProducesResponseType(typeof(VideoModel), 200)]
    public async Task<IActionResult> ConvertVideo(string idVideo)
    {
        await converterService.Convert(idVideo, VideoFormat.Streamable);
        return await GetVideo(idVideo);
    }

    [HttpDelete("{idVideo}")]
    [ProducesResponseType(typeof(void), 204)]
    public async Task<IActionResult> DeleteVideo(string idVideo)
    {
        await videoService.DeleteVideo(idVideo);
        return NoContent();
    }
}