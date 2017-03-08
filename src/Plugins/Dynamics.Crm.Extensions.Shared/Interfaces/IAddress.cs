using System;

namespace Dynamics.Crm.Interfaces
{
    public interface IAddress
    {
        String Name { get; }

        String Line1 { get; }

        String Line2 { get; }

        String Line3 { get; }

        String City { get; }

        String State { get; }

        String PostalCode { get; }

        String Country { get; }

        String Phone { get; }
    }
}
