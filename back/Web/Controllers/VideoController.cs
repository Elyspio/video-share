using System.ComponentModel.DataAnnotations;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Web.Models;

namespace Web.Controllers;

[ApiController]
[Route("videos", Name = "Video")]
public class VideoController : ControllerBase
{
    private readonly IVideoService videoService;

    public VideoController(IVideoService videoService)
    {
        this.videoService = videoService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<VideoModel>), 200)]
    public async Task<IActionResult> GetVideos()
    {
        var files = await videoService.GetVideos();
        return Ok(files);
    }

    [HttpPost]
    [ProducesResponseType(typeof(VideoModel), 201)]
    [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
    public async Task<IActionResult> AddVideo([Required] [FromForm] string filename,
        [Required] [FromForm] string container, [Required] IFormFile file)
    {
        var stream = file.OpenReadStream();
        var data = await videoService.AddVideo(container, filename, file.ContentType, stream);
        await stream.DisposeAsync();
        return Created($"/files/public/{data.Id}", data);
    }

    [HttpDelete("{idVideo}")]
    [ProducesResponseType(typeof(void), 204)]
    public async Task<IActionResult> DeleteVideo(string idVideo)
    {
        await videoService.DeleteVideo(idVideo);
        return NoContent();
    }
}