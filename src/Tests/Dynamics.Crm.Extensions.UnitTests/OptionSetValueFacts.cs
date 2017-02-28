using Dynamics.Crm.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class OptionSetValueFacts
    {
        [TestClass]
        public class ToEnumMethod
        {
            [TestMethod]
            public void ReturnsNullForNullOptionSetValue()
            {
                var value = default(OptionSetValue);

                Assert.IsNull(value.ToEnum<StateCode>());
            }

            [TestMethod]
            public void ReturnsEnumValueForValidOptionSetValue()
            {
                var value = default(OptionSetValue);

                value = new OptionSetValue((Int32)StateCode.Active);

                Assert.AreEqual(StateCode.Active, value.ToEnum<StateCode>());

                value = new OptionSetValue((Int32)StateCode.Inactive);

                Assert.AreEqual(StateCode.Inactive, value.ToEnum<StateCode>());
            }
        }
    }
}
