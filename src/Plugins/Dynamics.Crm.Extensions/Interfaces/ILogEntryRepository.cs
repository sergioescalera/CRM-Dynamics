using Dynamics.Crm.Models;
using System;

namespace Dynamics.Crm.Interfaces
{
    public interface ILogEntryRepository : IRepository
    {
        Guid Create(LogEntry logEntry, Boolean useCurrentTransaction = false);
    }
}
