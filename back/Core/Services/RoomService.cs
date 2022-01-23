using Adapters.FileServe;
using Core.Enums;
using Core.Exceptions;
using Core.Interfaces.Hubs;
using Core.Interfaces.Repositories;
using Core.Interfaces.Services;
using Core.Models;

namespace Core.Services;

internal class RoomService : IRoomService
{
    private readonly IAuthenticationService authenticationService;
    private readonly IUserFilesClient filesClient;
    private readonly IRoomRepository roomRepository;
    private readonly IVideoRepository videoRepository;
    private readonly IRoomHub roomHub;

    public RoomService(IRoomRepository roomRepository, IVideoRepository videoRepository, IUserFilesClient filesClient,
        IAuthenticationService authenticationService, IRoomHub roomHub)
    {
        this.roomRepository = roomRepository;
        this.videoRepository = videoRepository;
        this.filesClient = filesClient;
        this.authenticationService = authenticationService;
        this.roomHub = roomHub;
    }

    public async Task<Room> CreateRoom(string idVideo)
    {
        var video = await videoRepository.GetVideo(idVideo);
        if (video.IdConvertedFile == null) throw new VideoNotConvertedException(idVideo);
        var token = await authenticationService.Login();
        var fileInfo = await filesClient.GetFile2Async(video.IdConvertedFile, token, token);
        var room =  await roomRepository.CreateRoom(video.IdConvertedFile, fileInfo.Filename, fileInfo.Location);
        await roomHub.UpdateVideoState(room.Name, RoomState.PAUSED);
        return room;
    }

    public async Task DeleteRoom(string idRoom)
    {
        await roomRepository.DeleteRoom(idRoom);
    }

    public  async Task SeekTime(string idRoom, double time)
    {
        await this.roomHub.SeekTime(idRoom, time);
    }

    public async Task<Room> GetRoom(string idRoom)
    {
        return await roomRepository.GetRoom(idRoom);
    }

    public async Task<List<Room>> GetRooms()
    {
        return await roomRepository.GetRooms();
    }

    public async Task UpdateState(string idRoom, RoomState state)
    {
        await roomRepository.UpdateRoomState(idRoom, state);
        await roomHub.UpdateVideoState(idRoom, state);
    }
}