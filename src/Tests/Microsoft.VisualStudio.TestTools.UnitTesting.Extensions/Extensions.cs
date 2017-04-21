using System;

namespace Microsoft.VisualStudio.TestTools.UnitTesting
{
    public static class Extensions
    {
        static readonly Func<String, String> noExceptionMessage = (methodName) =>
            $"Test method {methodName} did not throw an exception. An exception was expected on the test method.";

        static readonly Func<String, Type, Type, String, String> invalidExceptionTypeMessage = (methodName, expectedType, actualType, exceptionMessage) =>
            $"Test method {methodName} threw exception {actualType.FullName}, but exception {expectedType.FullName} was expected. Exception message: {exceptionMessage}";

        static readonly Func<String, String, String, String> invalidExceptionMessageMessage = (methodName, expectedMessage, actualMessage) =>
            $"Test method {methodName} threw exception with message '{actualMessage}', but message '{expectedMessage}' was expected.";

        public static void ExpectedException<TException>(
            this Object test,
            Action action,
            Boolean allowDerivedTypes = false,
            String expectedMessage = null)
            where TException : Exception
        {
            try
            {
                action();                
            }
            catch (TException ex)
            {
                var actualType = ex.GetType();
                var expectedType = typeof(TException);

                Assert.IsTrue(
                    allowDerivedTypes || actualType.Equals(expectedType),
                    invalidExceptionTypeMessage(
                        action.Method.Name,
                        expectedType,
                        actualType,
                        ex.Message));

                Assert.IsTrue(String.IsNullOrEmpty(expectedMessage) || String.Equals(ex.Message, expectedMessage),
                    invalidExceptionMessageMessage(
                        action.Method.Name,
                        expectedMessage,
                        ex.Message));

                return;
            }
            catch (Exception ex)
            {
                Assert.Fail(
                    invalidExceptionTypeMessage(
                        action.Method.Name,
                        typeof(TException),
                        ex.GetType(),
                        ex.Message));

                return;
            }

            Assert.Fail(noExceptionMessage(action.Method.Name));
        }
    }
}
