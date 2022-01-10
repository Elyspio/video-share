using System.Diagnostics;
using System.Globalization;
using System.Text;
using Core.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Core.Services.FFmpeg;

public class FFprobeResult
{
    [JsonProperty("streams")] public List<Stream> Streams { get; set; }

    [JsonProperty("format")] public Format Format { get; set; }
}

public class Format
{
    [JsonProperty("filename")] public string Filename { get; set; }

    [JsonProperty("nb_streams")] public long NbStreams { get; set; }

    [JsonProperty("nb_programs")] public long NbPrograms { get; set; }

    [JsonProperty("format_name")] public string FormatName { get; set; }

    [JsonProperty("format_long_name")] public string FormatLongName { get; set; }

    [JsonProperty("start_time")] public string StartTime { get; set; }

    [JsonProperty("duration")] public string Duration { get; set; }

    [JsonProperty("size")] public string Size { get; set; }

    [JsonProperty("bit_rate")]
    [JsonConverter(typeof(ParseStringConverter))]
    public long BitRate { get; set; }

    [JsonProperty("probe_score")] public long ProbeScore { get; set; }

    [JsonProperty("tags")] public FormatTags Tags { get; set; }
}

public class FormatTags
{
    [JsonProperty("title")] public string Title { get; set; }

    [JsonProperty("encoder")] public string Encoder { get; set; }

    [JsonProperty("creation_time")] public DateTimeOffset CreationTime { get; set; }
}

public class Stream
{
    [JsonProperty("index")] public long Index { get; set; }

    [JsonProperty("codec_name")] public string CodecName { get; set; }

    [JsonProperty("codec_long_name")] public string CodecLongName { get; set; }

    [JsonProperty("profile", NullValueHandling = NullValueHandling.Ignore)]
    public string Profile { get; set; }

    [JsonProperty("codec_type")] public string CodecType { get; set; }

    [JsonProperty("codec_tag_string")] public string CodecTagString { get; set; }

    [JsonProperty("codec_tag")] public string CodecTag { get; set; }

    [JsonProperty("width", NullValueHandling = NullValueHandling.Ignore)]
    public long? Width { get; set; }

    [JsonProperty("height", NullValueHandling = NullValueHandling.Ignore)]
    public long? Height { get; set; }

    [JsonProperty("coded_width", NullValueHandling = NullValueHandling.Ignore)]
    public long? CodedWidth { get; set; }

    [JsonProperty("coded_height", NullValueHandling = NullValueHandling.Ignore)]
    public long? CodedHeight { get; set; }

    [JsonProperty("closed_captions", NullValueHandling = NullValueHandling.Ignore)]
    public long? ClosedCaptions { get; set; }

    [JsonProperty("has_b_frames", NullValueHandling = NullValueHandling.Ignore)]
    public long? HasBFrames { get; set; }

    [JsonProperty("sample_aspect_ratio", NullValueHandling = NullValueHandling.Ignore)]
    public string SampleAspectRatio { get; set; }

    [JsonProperty("display_aspect_ratio", NullValueHandling = NullValueHandling.Ignore)]
    public string DisplayAspectRatio { get; set; }

    [JsonProperty("pix_fmt", NullValueHandling = NullValueHandling.Ignore)]
    public string PixFmt { get; set; }

    [JsonProperty("level", NullValueHandling = NullValueHandling.Ignore)]
    public long? Level { get; set; }

    [JsonProperty("color_range", NullValueHandling = NullValueHandling.Ignore)]
    public string ColorRange { get; set; }

    [JsonProperty("chroma_location", NullValueHandling = NullValueHandling.Ignore)]
    public string ChromaLocation { get; set; }

    [JsonProperty("refs", NullValueHandling = NullValueHandling.Ignore)]
    public long? Refs { get; set; }

    [JsonProperty("r_frame_rate")] public string RFrameRate { get; set; }

    [JsonProperty("avg_frame_rate")] public string AvgFrameRate { get; set; }

    [JsonProperty("time_base")] public string TimeBase { get; set; }

    [JsonProperty("start_pts")] public long StartPts { get; set; }

    [JsonProperty("start_time")] public string StartTime { get; set; }

    [JsonProperty("disposition")] public Dictionary<string, long> Disposition { get; set; }

    [JsonProperty("tags")] public StreamTags Tags { get; set; }

    [JsonProperty("sample_fmt", NullValueHandling = NullValueHandling.Ignore)]
    public string SampleFmt { get; set; }

    [JsonProperty("sample_rate", NullValueHandling = NullValueHandling.Ignore)]
    [JsonConverter(typeof(ParseStringConverter))]
    public long? SampleRate { get; set; }

    [JsonProperty("channels", NullValueHandling = NullValueHandling.Ignore)]
    public long? Channels { get; set; }

    [JsonProperty("channel_layout", NullValueHandling = NullValueHandling.Ignore)]
    public string ChannelLayout { get; set; }

    [JsonProperty("bits_per_sample", NullValueHandling = NullValueHandling.Ignore)]
    public long? BitsPerSample { get; set; }

    [JsonProperty("duration_ts", NullValueHandling = NullValueHandling.Ignore)]
    public long? DurationTs { get; set; }

    [JsonProperty("duration", NullValueHandling = NullValueHandling.Ignore)]
    public string Duration { get; set; }

    [JsonProperty("color_space", NullValueHandling = NullValueHandling.Ignore)]
    public string ColorSpace { get; set; }

    [JsonProperty("bits_per_raw_sample", NullValueHandling = NullValueHandling.Ignore)]
    [JsonConverter(typeof(ParseStringConverter))]
    public long? BitsPerRawSample { get; set; }
}

public class StreamTags
{
    [JsonProperty("title", NullValueHandling = NullValueHandling.Ignore)]
    public string Title { get; set; }

    [JsonProperty("BPS-eng", NullValueHandling = NullValueHandling.Ignore)]
    [JsonConverter(typeof(ParseStringConverter))]
    public long? BpsEng { get; set; }

    [JsonProperty("DURATION-eng", NullValueHandling = NullValueHandling.Ignore)]
    public DateTimeOffset? DurationEng { get; set; }

    [JsonProperty("NUMBER_OF_FRAMES-eng", NullValueHandling = NullValueHandling.Ignore)]
    [JsonConverter(typeof(ParseStringConverter))]
    public long? NumberOfFramesEng { get; set; }

    [JsonProperty("NUMBER_OF_BYTES-eng", NullValueHandling = NullValueHandling.Ignore)]
    public string NumberOfBytesEng { get; set; }

    [JsonProperty("_STATISTICS_WRITING_APP-eng", NullValueHandling = NullValueHandling.Ignore)]
    public string StatisticsWritingAppEng { get; set; }

    [JsonProperty("_STATISTICS_WRITING_DATE_UTC-eng", NullValueHandling = NullValueHandling.Ignore)]
    public DateTimeOffset? StatisticsWritingDateUtcEng { get; set; }

    [JsonProperty("_STATISTICS_TAGS-eng", NullValueHandling = NullValueHandling.Ignore)]
    public string StatisticsTagsEng { get; set; }

    [JsonProperty("language", NullValueHandling = NullValueHandling.Ignore)]
    public string Language { get; set; }

    [JsonProperty("filename", NullValueHandling = NullValueHandling.Ignore)]
    public string Filename { get; set; }

    [JsonProperty("mimetype", NullValueHandling = NullValueHandling.Ignore)]
    public string Mimetype { get; set; }
}

public class FFprobe
{
    private static readonly string ffprobePath = Env.Get("FFPROBE_PATH", "ffprobe.exe");

    public static async Task<FFprobeResult> GetFileInfos(string path)
    {
        var proc = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = ffprobePath,
                Arguments = $" -v quiet -print_format json -show_format -show_streams '{path}'",
                UseShellExecute = false,
                RedirectStandardOutput = true,
                CreateNoWindow = true
            }
        };

        proc.Start();
        var sb = new StringBuilder();
        await Task.Run(() =>
        {
            while (!proc.StandardOutput.EndOfStream) sb.Append(proc.StandardOutput.ReadLine());
        });
        return JsonConvert.DeserializeObject<FFprobeResult>(sb.ToString(), Converter.Settings)!;
    }
}

internal static class Converter
{
    public static readonly JsonSerializerSettings Settings = new()
    {
        MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
        DateParseHandling = DateParseHandling.None,
        Converters =
        {
            new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
        }
    };
}

internal class ParseStringConverter : JsonConverter
{
    public static readonly ParseStringConverter Singleton = new();

    public override bool CanConvert(Type t)
    {
        return t == typeof(long) || t == typeof(long?);
    }

    public override object ReadJson(JsonReader reader, Type t, object? existingValue, JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.Null) return null;
        var value = serializer.Deserialize<string>(reader);
        long l;
        if (long.TryParse(value, out l)) return l;

        throw new Exception("Cannot unmarshal type long");
    }

    public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
    {
        if (untypedValue == null)
        {
            serializer.Serialize(writer, null);
            return;
        }

        var value = (long)untypedValue;
        serializer.Serialize(writer, value.ToString());
    }
}