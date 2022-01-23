using Core.Enums;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Web.Filters;
using Web.Models;

namespace Web.Controllers;

[ApiController]
[Route("rooms", Name = "Room")]
[RequireAuth]

public class RoomController : ControllerBase
{
    private readonly IRoomService roomService;

    public RoomController(IRoomService RoomService)
    {
        this.roomService = RoomService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<RoomModel>), 200)]
    public async Task<IActionResult> GetRooms()
    {
        var files = await roomService.GetRooms();
        return Ok(files);
    }

    [HttpGet("{idRoom}")]
    [ProducesResponseType(typeof(RoomModel), 200)]
    public async Task<IActionResult> GetRoom(string idRoom)
    {
        var file = await roomService.GetRoom(idRoom);
        return Ok(file);
    }


    [HttpPost]
    [ProducesResponseType(typeof(RoomModel), 201)]
    [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
    public async Task<IActionResult> CreateRoom([Required][FromBody] string idVideo)
    {
        var data = await roomService.CreateRoom(idVideo);
        return Created($"/rooms/{data.Name}", data);
    }

    [HttpPut("{idRoom}/state/{state}")]
    [ProducesResponseType(typeof(void), 204)]
    public async Task<IActionResult> UpdateRoomState([Required] string idRoom, [Required] RoomState state)
    {
        await roomService.UpdateState(idRoom, state);
        return NoContent();
    }




    [HttpPut("{idRoom}/time")]
    [ProducesResponseType(typeof(void), 204)]
    public async Task<IActionResult> SeekTime([Required] string idRoom, [FromBody] double time)
    {
        await roomService.SeekTime(idRoom, time);
        return NoContent();
    }


    [HttpDelete("{idRoom}")]
    [ProducesResponseType(typeof(void), 204)]
    public async Task<IActionResult> DeleteRoom([Required] string idRoom)
    {
        await roomService.DeleteRoom(idRoom);
        return NoContent();
    }
}