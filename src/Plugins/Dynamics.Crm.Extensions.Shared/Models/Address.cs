using Dynamics.Crm.Interfaces;
using System;

namespace Dynamics.Crm.Models
{
    public class Address : IAddress
    {
        public String Line1 { get; set; }

        public String Line2 { get; set; }

        public String Line3 { get; set; }

        public String City { get; set; }

        public String State { get; set; }

        public String PostalCode { get; set; }

        public String Country { get; set; }

        public String Name { get; set; }

        public String Phone { get; set; }
    }
}
