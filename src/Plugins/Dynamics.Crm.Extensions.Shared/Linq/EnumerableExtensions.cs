namespace System.Collections.Generic
{
    public static class EnumerableExtensions
    {
        public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            ValidationHelper.EnsureNotNull(source, nameof(source));
            ValidationHelper.EnsureNotNull(action, nameof(action));

            foreach (var item in source)
            {
                action(item);
            }
        }

        public static void AddRange<T>(this ICollection<T> source, IEnumerable<T> collection)
        {
            ValidationHelper.EnsureNotNull(source, nameof(source));
            ValidationHelper.EnsureNotNull(collection, nameof(collection));

            collection.ForEach(o => source.Add(o));
        }

        public static String Concatenate<T>(this IEnumerable<T> source, String separator)
        {
            ValidationHelper.EnsureNotNull(source, nameof(source));

            return String.Join(separator, source);
        }
    }
}
