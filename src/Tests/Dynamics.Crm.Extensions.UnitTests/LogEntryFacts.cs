using Dynamics.Crm.Data;
using Dynamics.Crm.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class LogEntryFacts
    {
        [TestClass]
        public class Constructor
        {
            [TestMethod]
            public void DoesNotThrowForNullArguments()
            {
                var entry = new LogEntry(name: null, message: null, source: null, description: null);

                Assert.IsNotNull(entry);
                Assert.IsNull(entry.Name);
                Assert.IsNull(entry.Message);
                Assert.IsNull(entry.Source);
                Assert.IsNull(entry.Description);
                Assert.IsNull(entry.User);
                Assert.AreEqual(Guid.Empty, entry.Id);
                Assert.AreEqual(Schema.LogEntryEntity.TypeName(Schema.DefaultPrefix), entry.TypeName);
            }

            [TestMethod]
            public void InitializesObject()
            {
                var entry = new LogEntry(
                    name: "name",
                    message: "message",
                    source: "source",
                    description: "description",
                    type: LogEntryType.Info);

                Assert.IsNotNull(entry);
                Assert.IsNull(entry.User);
                Assert.AreEqual("name", entry.Name);
                Assert.AreEqual("message", entry.Message);
                Assert.AreEqual("source", entry.Source);
                Assert.AreEqual("description", entry.Description);
                Assert.AreEqual(LogEntryType.Info, entry.Type);                
                Assert.AreEqual(Guid.Empty, entry.Id);
                Assert.AreEqual(Schema.LogEntryEntity.TypeName(Schema.DefaultPrefix), entry.TypeName);
            }

            [TestMethod]
            public void InitializesObjectWithLongStringArguments()
            {
                var name = new String('a', Schema.LogEntryEntity.NameFieldLength + 5);
                var message = new String('b', Schema.LogEntryEntity.MessageFieldLength + 10);
                var source = new String('c', Schema.LogEntryEntity.SourceFieldLength + 5);
                var description = new String('d', Schema.LogEntryEntity.DescriptionFieldLength + 20);

                var entry = new LogEntry(
                    name: name,
                    message: message,
                    source: source,
                    description: description,
                    type: LogEntryType.Trace);

                Assert.IsNotNull(entry);
                Assert.IsNull(entry.User);
                Assert.AreEqual(new String('a', Schema.LogEntryEntity.NameFieldLength), entry.Name);
                Assert.AreEqual(new String('b', Schema.LogEntryEntity.MessageFieldLength), entry.Message);
                Assert.AreEqual(new String('c', Schema.LogEntryEntity.SourceFieldLength), entry.Source);
                Assert.AreEqual(new String('d', Schema.LogEntryEntity.DescriptionFieldLength), entry.Description);
                Assert.AreEqual(LogEntryType.Trace, entry.Type);
                Assert.AreEqual(Guid.Empty, entry.Id);
                Assert.AreEqual(Schema.LogEntryEntity.TypeName(Schema.DefaultPrefix), entry.TypeName);
            }
        }
    }
}
