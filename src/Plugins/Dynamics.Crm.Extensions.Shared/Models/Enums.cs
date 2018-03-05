namespace Dynamics.Crm.Models
{
    public enum ActivityStateCode
    {
        Open = 0,
        Completed = 1,
        Canceled = 2,
        Schedule = 3
    }

    public enum ActivityStatusCode
    {
        Open = 1,
        Completed = 2,
        Canceled = 3,
        Schedule = 4
    }

    public enum EmailStateCode
    {
        Open = 0,
        Completed = 1,
        Canceled = 2
    }

    public enum EmailStatusCode
    {
        Draft = 1,
        Failed = 8,
        Completed = 2,
        Sent = 3,
        Received = 4,
        PendingSend = 5,
        Sending = 7,
        Canceled = 5
    }

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

    public enum TaskStateCode
    {
        Open = 0,
        Completed = 1,
        Canceled = 2
    }

    public enum TaskStatusCode
    {
        NotStarted = 2,
        InProgress = 3,
        WaitingSomeoneElse = 4,
        Deferred = 7,
        Completed = 5,
        Canceled = 6
    }

    public enum TeamType
    {
        Owner = 0, Access = 1
    }
}
