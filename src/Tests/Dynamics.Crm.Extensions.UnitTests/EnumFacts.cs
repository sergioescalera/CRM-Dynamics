using Dynamics.Crm.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class EnumFacts
    {
        [TestClass]
        public class ToOptionSetValueMethod
        {
            [TestMethod]
            public void ReturnsNullForNullEnumValue()
            {
                var @null = default(StateCode?);

                var @nullOptionSet = @null.ToOptionSetValue();

                Assert.IsNull(@nullOptionSet);
            }

            [TestMethod]
            public void ReturnsOptionSetValueForValidEnumValue()
            {
                var value = default(OptionSetValue);
                
                value = StateCode.Active.ToOptionSetValue();

                Assert.IsNotNull(value);
                Assert.AreEqual((Int32)StateCode.Active, value.Value);

                value = StateCode.Inactive.ToOptionSetValue();

                Assert.IsNotNull(value);
                Assert.AreEqual((Int32)StateCode.Inactive, value.Value);
            }
        }
    }
}
