using System;

namespace Dynamics.Crm.Interfaces
{
    public interface IEntity
    {
        Guid Id { get; }

        String TypeName { get; }
    }
}
