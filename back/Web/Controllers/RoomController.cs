using System.ComponentModel.DataAnnotations;
using Core.Enums;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Web.Models;

namespace Web.Controllers;

[ApiController]
[Route("rooms", Name = "Room")]
public class RoomController : ControllerBase
{
    private readonly IRoomService RoomService;

    public RoomController(IRoomService RoomService)
    {
        this.RoomService = RoomService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<RoomModel>), 200)]
    public async Task<IActionResult> GetRooms()
    {
        var files = await RoomService.GetRooms();
        return Ok(files);
    }
    [HttpGet("{idRoom}")]
    [ProducesResponseType(typeof(RoomModel), 200)]
    public async Task<IActionResult> GetRoom(string idRoom)
    {
        var file = await RoomService.GetRoom(idRoom);
        return Ok(file);
    }


    [HttpPost]
    [ProducesResponseType(typeof(RoomModel), 201)]
    [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
    public async Task<IActionResult> CreateRoom([Required] [FromBody] string idVideo)
    {
        var data = await RoomService.CreateRoom(idVideo);
        return Created($"/rooms/{data.Name}", data);
    }


    [HttpDelete("{idRoom}")]
    [ProducesResponseType(typeof(void), 204)]
    public async Task<IActionResult> DeleteRoom([Required] string idRoom)
    {
        await RoomService.DeleteRoom(idRoom);
        return NoContent();
    }
}