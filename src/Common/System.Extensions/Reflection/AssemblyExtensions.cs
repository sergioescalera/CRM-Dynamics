#if NET451

#endif
using System.IO;
using System.Text;

namespace System.Reflection
{
    public static class AssemblyExtensions
    {
        public static Stream GetResourceStream(this Object obj, String resourceName)
        {
            ValidationHelper.EnsureNotNull(obj, nameof(obj));
            ValidationHelper.EnsureNotNull(resourceName, nameof(resourceName));

            var type = obj.GetType();
            var assembly = type.Assembly;

            return assembly.GetManifestResourceStream(resourceName);
        }

        public static StreamReader GetResourceReader(this Object obj, String resourceName)
        {
            return GetResourceReader(obj, resourceName, Encoding.UTF8);
        }

        public static StreamReader GetResourceReader(
            this Object obj,
            String resourceName,
            Encoding encoding)
        {
            ValidationHelper.EnsureNotNull(obj, nameof(obj));
            ValidationHelper.EnsureNotNull(resourceName, nameof(resourceName));

            var type = obj.GetType();
            var assembly = type.Assembly;

            var stream = assembly.GetManifestResourceStream(resourceName);

            return new StreamReader(stream, encoding);
        }
    }
}
