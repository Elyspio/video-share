﻿using System.ComponentModel;

namespace Core.Utils;

public class Env
{
    public static T? Get<T>(string variableName, T? fallback = default)
    {
        var env = Environment.GetEnvironmentVariable(variableName);
        if (env == null) return fallback;
        var converter = TypeDescriptor.GetConverter(typeof(T));
        return (T) converter.ConvertFromString(env)!;
    }
}