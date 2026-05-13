using System;
using System.Collections.Generic;
using System.Linq;
using Typedown.Core.Utilities;

namespace Typedown.Core.Enums
{
    public enum AppTheme
    {
        [Locale("UseSystemSetting")]
        Default = 0,

        [Locale("View.AppTheme.Light")]
        Light = 1,

        [Locale("View.AppTheme.Dark")]
        Dark = 2,

        [Locale("View.AppTheme.Sepia")]
        Sepia = 3,

        [Locale("View.AppTheme.Forest")]
        Forest = 4,

        [Locale("View.AppTheme.Ocean")]
        Ocean = 5,

        [Locale("View.AppTheme.Midnight")]
        Midnight = 6,
    }

    public static partial class Enumerable
    {
        public static IReadOnlyList<AppTheme> AppThemes { get; } = Enum.GetValues(typeof(AppTheme)).Cast<AppTheme>().ToList();
    }
}
