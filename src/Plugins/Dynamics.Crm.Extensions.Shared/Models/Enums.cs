namespace Dynamics.Crm.Models
{
    public enum GlobalSettingType
    {
        String = 0,
        Int = 1,
        Decimal = 2,
        Boolean = 3,
        Reference = 4
    }

    public enum LogEntryType
    {
        Trace = 0,
        Warning = 1,
        Error = 2,
        Info = 3,
    }

    public enum OpportunityStateCode
    {
        Open = 0,
        Won = 1,
        Lost = 2
    }

    public enum OpportunityStatusCode
    {
        InProgress = 1,
        OnHold = 2,
        Won = 3,
        Canceled = 4,
        OutSold = 5
    }

    public enum StateCode
    {
        Active = 0, Inactive = 1
    }

    public enum StatusCode
    {
        Active = 1, Inactive = 2
    }

    public enum TeamType
    {
        Owner = 0, Access = 1
    }
}
