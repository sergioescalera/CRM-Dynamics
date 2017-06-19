using System;
using System.Collections.Generic;

namespace Dynamics.Crm.Linq
{
    public static class EnumerableExtensions
    {
        public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            ValidationHelper.EnsureNotNull(source);
            ValidationHelper.EnsureNotNull(action);

            foreach (var item in source)
            {
                action(item);
            }
        }

        public static void AddRange<T>(this ICollection<T> source, IEnumerable<T> collection)
        {
            ValidationHelper.EnsureNotNull(source);
            ValidationHelper.EnsureNotNull(collection);

            collection.ForEach(o => source.Add(o));
        }
    }
}
