using Microsoft.Xrm.Sdk;
using System;

namespace Dynamics.Crm.Interfaces
{
    public interface IRepository
    {
        void Create(Entity entity);

        void Delete(Guid entityId);

        void Delete(Entity entity);

        void Update(Entity entity);

        Entity GetEntityById(Guid id);
    }
}
