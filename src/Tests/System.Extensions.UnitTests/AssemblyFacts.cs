using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Reflection;
using System.Threading.Tasks;

namespace System.Extensions.UnitTests
{
    public class AssemblyFacts
    {
        [TestClass]
        public class GetResourceReaderMethod
        {
            [TestMethod]
            public async Task ShouldOpenEmbeddedResource()
            {
                var reader = this.GetResourceReader("System.Extensions.UnitTests.Resources.SampleFile.txt");

                Assert.IsNotNull(reader);

                var text = await reader.ReadToEndAsync();

                Assert.IsNotNull(text);
                Assert.AreEqual("This is a sample text file used for unit testing", text);
            }
        }
    }
}
