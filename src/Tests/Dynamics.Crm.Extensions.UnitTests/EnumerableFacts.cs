using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public class EnumerableFacts
    {
        [TestClass]
        public class PagedMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullCollection()
            {
                var items = default(IEnumerable<int>);

                var paged = items.Paged(10).ToList();
            }

            [TestMethod]
            [ExpectedException(typeof(ArgumentOutOfRangeException))]
            public void ThrowsErrorForZeroPageSize()
            {
                var items = new int[] { 1, 2, 3 };

                var paged = items.Paged(0).ToList();
            }

            [TestMethod]
            [ExpectedException(typeof(ArgumentOutOfRangeException))]
            public void ThrowsErrorForNegativePageSize()
            {
                var items = new int[] { 1, 2, 3 };

                var paged = items.Paged(-1).ToList();
            }

            [TestMethod]
            public void ReturnsNoPagesForEmptyCollection()
            {
                var items = new int[] { };

                var paged = items.Paged(1).ToList();

                Assert.AreEqual(0, paged.Count);

                var paged2 = items.Paged(2).ToList();

                Assert.AreEqual(0, paged2.Count);
            }

            [TestMethod]
            public void ReturnsPagesForOddSizeCollection()
            {
                var items = new int[] { 1, 2, 3, 4, 5 };

                var paged2 = items.Paged(2).ToList();

                Assert.AreEqual(3, paged2.Count);
                CollectionAssert.AreEqual(paged2[0].ToList(), new int[] { 1, 2 });
                CollectionAssert.AreEqual(paged2[1].ToList(), new int[] { 3, 4 });
                CollectionAssert.AreEqual(paged2[2].ToList(), new int[] { 5 });

                var paged3 = items.Paged(3).ToList();

                Assert.AreEqual(2, paged3.Count);
                CollectionAssert.AreEqual(paged3[0].ToList(), new int[] { 1, 2, 3 });
                CollectionAssert.AreEqual(paged3[1].ToList(), new int[] { 4, 5 });                
            }

            [TestMethod]
            public void ReturnsPagesForEvenSizeCollection()
            {
                var items = new int[] { 1, 2, 3, 4 };

                var paged2 = items.Paged(2).ToList();

                Assert.AreEqual(2, paged2.Count);
                CollectionAssert.AreEqual(paged2[0].ToList(), new int[] { 1, 2 });
                CollectionAssert.AreEqual(paged2[1].ToList(), new int[] { 3, 4 });

                var paged3 = items.Paged(3).ToList();

                Assert.AreEqual(2, paged3.Count);
                CollectionAssert.AreEqual(paged3[0].ToList(), new int[] { 1, 2, 3 });
                CollectionAssert.AreEqual(paged3[1].ToList(), new int[] { 4 });
            }
        }
    }
}
