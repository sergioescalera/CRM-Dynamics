using System.Collections.Generic;

namespace System.Linq
{
    public static class EnumerableExtensions
    {
        public static Boolean Empty<T>(
            this IEnumerable<T> items)
        {
            ValidationHelper.EnsureNotNull(items, nameof(items));

            return !items.Any();
        }

        public static IEnumerable<IEnumerable<T>> Paged<T>(
            this IEnumerable<T> items,
            Int32 pageSize)
        {
            ValidationHelper.EnsureNotNull(items, nameof(items));
            ValidationHelper.EnsureInRange(pageSize, min: 1, paramName: nameof(pageSize));

            var array = items.ToArray();

            var pages = array.Length / pageSize + (array.Length % pageSize == 0 ? 0 : 1);

            for (int i = 0; i < pages; i++)
            {
                yield return GetPage(array, i * pageSize, pageSize).ToArray();
            }
        }

        private static IEnumerable<T> GetPage<T>(
            T[] array,
            Int32 index,
            Int32 pageSize)
        {
            var length = Math.Min(index + pageSize, array.Length);

            for (int i = index; i < length; i++)
            {
                yield return array[i];
            }
        }
    }
}
