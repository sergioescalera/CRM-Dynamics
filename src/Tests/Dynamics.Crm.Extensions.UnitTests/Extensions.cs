using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    static class Extensions
    {
        public static void ExpectedException<TException>(this Object test, Action action)
            where TException : Exception
        {
            try
            {
                action();
                Assert.Fail();
            }
            catch (TException)
            {                
            }
            catch (Exception)
            {
                Assert.Fail();
            }
        }
    }
}
