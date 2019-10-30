using System.Collections.Generic;
using System.Linq;

namespace System
{
    public static class DateTimeExtensions
    {
        public static Int32 BusinessDaysUntil(
            this DateTime firstDate,
            DateTime lastDate,
            params DateTime[] holidays)
        {
            var firstDay = firstDate.Date;
            var lastDay = lastDate.Date;

            if (firstDay > lastDay)
                throw new ArgumentException($"Invalid last day {lastDay}");

            var span = lastDay - firstDay;
            int businessDays = span.Days + 1;
            int fullWeekCount = businessDays / 7;

            if (businessDays > fullWeekCount * 7)
            {
                int firstDayOfWeek = firstDay.DayOfWeek == DayOfWeek.Sunday ? 7 : (int)firstDay.DayOfWeek;
                int lastDayOfWeek = lastDay.DayOfWeek == DayOfWeek.Sunday ? 7 : (int)lastDay.DayOfWeek;

                if (lastDayOfWeek < firstDayOfWeek)
                    lastDayOfWeek += 7;
                if (firstDayOfWeek <= 6)
                {
                    if (lastDayOfWeek >= 7)
                        businessDays -= 2;
                    else if (lastDayOfWeek >= 6)
                        businessDays -= 1;
                }
                else if (firstDayOfWeek <= 7 && lastDayOfWeek >= 7)
                    businessDays -= 1;
            }

            businessDays -= fullWeekCount + fullWeekCount;

            foreach (var holiday in holidays)
            {
                var bh = holiday.Date;

                if (firstDay <= bh && bh <= lastDay)
                    --businessDays;
            }

            return businessDays;
        }

        public static Boolean IsBusinessDay(this DateTime date)
        {
            return date.IsBusinessDay(date.GetHolidays().ToArray());
        }

        public static Boolean IsBusinessDay(
            this DateTime date,
            params DateTime[] holidays)
        {
            if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                return false;

            if (holidays.Contains(date))
                return false;

            return true;
        }

        public static DateTime GetPreviousBusinessDay(this DateTime date)
        {
            var holidays = date.GetHolidays().ToArray();

            var result = date.AddDays(-1);

            while (!result.IsBusinessDay(holidays))
            {
                result = result.AddDays(-1);

                if (date.Year != result.Year)
                    holidays = result.GetHolidays().ToArray();
            }

            return result;
        }

        public static IEnumerable<DateTime> GetHolidays(this Int32 year)
        {
            ValidationHelper.EnsureInRange(year, min: 0, paramName: nameof(year));
            
            var newYear = AdjustHolidayForWeekend(new DateTime(year, 1, 1).Date);

            yield return newYear;

            var memorialDay = Enumerable.Range(1, 31)
                .Select(d => new DateTime(year, 5, d))
                .Where(d => d.DayOfWeek == DayOfWeek.Monday)
                .Last();

            yield return memorialDay;

            var independenceDay = AdjustHolidayForWeekend(new DateTime(year, 7, 4).Date);

            yield return independenceDay;

            var laborDay = Enumerable.Range(1, 30)
                .Select(d => new DateTime(year, 9, d))
                .Where(d => d.DayOfWeek == DayOfWeek.Monday)
                .First();

            yield return laborDay;

            var thanksgivingDay = Enumerable.Range(1, 30)
                .Select(d => new DateTime(year, 11, d))
                .Where(d => d.DayOfWeek == DayOfWeek.Thursday)
                .ElementAt(3);

            yield return thanksgivingDay;

            var christmasDay = AdjustHolidayForWeekend(new DateTime(year, 12, 25).Date);

            yield return christmasDay;
        }

        public static IEnumerable<DateTime> GetHolidays(this DateTime date)
        {
            return date.Year.GetHolidays();
        }

        private static DateTime AdjustHolidayForWeekend(DateTime holiday)
        {
            if (holiday.DayOfWeek == DayOfWeek.Saturday)
            {
                return holiday.AddDays(-1);
            }
            else if (holiday.DayOfWeek == DayOfWeek.Sunday)
            {
                return holiday.AddDays(1);
            }
            else
            {
                return holiday;
            }
        }

        public static DateTime FirstDayOfMonth(this DateTime date)
        {
            return date.Date.AddDays(-1 * date.Day + 1);
        }
    }
}
