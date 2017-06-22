namespace System
{
    public static class DayOfWeekExtensions
    {
        public static DayOfWeek Next(this DayOfWeek dayOfWeek)
        {
            if (dayOfWeek == DayOfWeek.Saturday)
                return DayOfWeek.Sunday;

            return dayOfWeek + 1;
        }

        public static DayOfWeek Previous(this DayOfWeek dayOfWeek)
        {
            if (dayOfWeek == DayOfWeek.Sunday)
                return DayOfWeek.Saturday;

            return dayOfWeek - 1;
        }
    }
}
