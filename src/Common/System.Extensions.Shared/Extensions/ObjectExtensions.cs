﻿namespace System
{
    public static class ObjectExtensions
    {
        public static Boolean HasValue(this Object value)
        {
            return value != null;
        }

        public static Boolean IsNumeric(this Object value)
        {
            return value is sbyte
                || value is byte
                || value is short
                || value is ushort
                || value is int
                || value is uint
                || value is long
                || value is ulong
                || value is float
                || value is double
                || value is decimal;
        }
    }
}