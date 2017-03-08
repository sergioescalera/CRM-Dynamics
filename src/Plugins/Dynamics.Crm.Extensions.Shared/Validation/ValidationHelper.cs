namespace System
{
    public static class ValidationHelper
    {
        public static void EnsureNotNull(this Object obj, Object value, String paramName = null)
        {
            EnsureNotNull(value, paramName);
        }

        public static void EnsureNotNull(Object value, String paramName = null)
        {
            if (value == null)
                throw new ArgumentNullException(paramName ?? nameof(value));
        }

        public static void EnsureNotNullOrWhiteSpace(this Object obj, String str)
        {
            EnsureNotNullOrWhiteSpace(str);
        }

        public static void EnsureNotNullOrWhiteSpace(String str)
        {
            if (String.IsNullOrWhiteSpace(str))
                throw new ArgumentException();
        }

        public static void EnsureNotNullOrEmpty(this Object obj, String str)
        {
            EnsureNotNullOrEmpty(str);
        }

        public static void EnsureNotNullOrEmpty(String str)
        {
            if (String.IsNullOrEmpty(str))
                throw new ArgumentException();
        }

        public static void EnsureInRange(this Object obj, Int32 value, Int32? min = null, Int32? max = null, String paramName = null)
        {
            EnsureInRange(value, min, max, paramName);
        }

        public static void EnsureInRange(Int32 value, Int32? min = null, Int32? max = null, String paramName = null)
        {
            if (min != null && value < min)
                throw new ArgumentOutOfRangeException(paramName ?? nameof(value));

            if (max != null && value > max)
                throw new ArgumentOutOfRangeException(paramName ?? nameof(value));
        }
    }
}
