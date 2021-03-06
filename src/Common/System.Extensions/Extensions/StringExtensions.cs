﻿namespace System
{
    public static class StringExtensions
    {
        public static String Left(this String str, Int32 length)
        {
            ValidationHelper.EnsureNotNull(str, paramName: nameof(length));
            ValidationHelper.EnsureInRange(length, min: 0, paramName: nameof(length));

            if (str.Length <= length)
                return str;

            return str.Substring(0, length);
        }

        public static String Right(this String str, Int32 length)
        {
            ValidationHelper.EnsureNotNull(str, paramName: nameof(length));
            ValidationHelper.EnsureInRange(length, min: 0, paramName: nameof(length));

            if (str.Length <= length)
                return str;

            return str.Substring(str.Length - length, length);
        }

        public static Boolean IsNullOrEmpty(this String str)
        {
            return String.IsNullOrEmpty(str);
        }

        public static Boolean IsNullOrWhiteSpace(this String str)
        {
            return String.IsNullOrWhiteSpace(str);
        }

        public static String Arrange(this String str, params Object[] args)
        {
            return String.Format(str, args);
        }
    }
}
