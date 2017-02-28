using System.Activities;

namespace Dynamics.Crm.Interfaces
{
    public interface ICodeActivityContext
    {
        TExtension GetExtension<TExtension>() where TExtension : class;

        CodeActivityContext InnerContext { get; }
    }
}
