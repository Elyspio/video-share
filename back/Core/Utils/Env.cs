using System.ComponentModel;

namespace Core.Utils;

public class Env
{
    public static T? Get<T>(string variableName, bool required = false)
    {
        var env = Environment.GetEnvironmentVariable(variableName);
        if (env != null)
        {
            var converter = TypeDescriptor.GetConverter(typeof(T));
            return (T)converter.ConvertFromString(env)!;
        }

        if (required) throw new Exception($"The environment variable {variableName} is null");

        return default;
    }
}