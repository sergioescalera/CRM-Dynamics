using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class StringFacts
    {
        [TestClass]
        public class LeftMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullString()
            {
                var str = default(String);

                str.Left(1);
            }

            [TestMethod]
            [ExpectedException(typeof(ArgumentOutOfRangeException))]
            public void ThrowsErrorForNegativeLength()
            {
                var str = String.Empty;

                str.Left(-1);
            }

            [TestMethod]            
            public void ReturnsSpecifiedNumberOfCharsFromLeftSide()
            {
                Assert.AreEqual("", "".Left(0));
                Assert.AreEqual("", "abc".Left(0));
                Assert.AreEqual("a", "abc".Left(1));
                Assert.AreEqual("ab", "abc".Left(2));
                Assert.AreEqual("abc", "abc".Left(3));
            }
        }

        [TestClass]
        public class RightMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullString()
            {
                var str = default(String);

                str.Right(1);
            }
            [TestMethod]
            [ExpectedException(typeof(ArgumentOutOfRangeException))]
            public void ThrowsErrorForNegativeLength()
            {
                var str = String.Empty;

                str.Right(-1);
            }

            [TestMethod]
            public void ReturnsSpecifiedNumberOfCharsFromRightSide()
            {
                Assert.AreEqual("", "".Right(0));
                Assert.AreEqual("", "abc".Right(0));
                Assert.AreEqual("c", "abc".Right(1));
                Assert.AreEqual("bc", "abc".Right(2));
                Assert.AreEqual("abc", "abc".Right(3));
            }
        }
    }
}
