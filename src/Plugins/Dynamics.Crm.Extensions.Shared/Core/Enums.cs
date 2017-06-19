using System;
using System.Collections.Generic;
using System.Text;

namespace Dynamics.Crm.Core
{
    public enum EntityImageType
    {
        PreImage = 0,
        PostImage = 1
    }

    public enum ExecutionMode
    {        
        Synchronous = 0,        
        Asynchronous = 1
    }

    public enum PipelineStage
    {        
        PreValidation = 10,        
        PreOperation = 20,        
        MainOperation = 30,        
        PostOperation = 40
    }

    public enum TargetType
    {
        Unknown = 0,
        Entity = 1,
        EntityReference = 2
    }    
}
