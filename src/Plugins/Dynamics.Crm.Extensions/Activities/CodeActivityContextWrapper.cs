using Dynamics.Crm.Interfaces;
using System;
using System.Activities;

namespace Dynamics.Crm.Activities
{
    class CodeActivityContextWrapper : ICodeActivityContext
    {
        public CodeActivityContextWrapper(CodeActivityContext executionContext)
        {
            this.EnsureNotNull(executionContext);

            InnerContext = executionContext;
        }

        public CodeActivityContext InnerContext
        {
            get;
            private set;
        }

        public virtual TExtension GetExtension<TExtension>()
            where TExtension : class
        {
            return InnerContext.GetExtension<TExtension>();
        }
    }
}
