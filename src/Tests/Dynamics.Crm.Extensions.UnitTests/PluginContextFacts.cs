using Dynamics.Crm.Core;
using Dynamics.Crm.Data;
using Dynamics.Crm.Interfaces;
using Dynamics.Crm.Plugins;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using Moq;
using System;

namespace Dynamics.Crm.Extensions.UnitTests
{
    public static class PluginContextFacts
    {
        static IServiceProvider CreateServiceProvider(
            Object target = null,
            String messageName = null,
            Entity preImage = null,
            Entity postImage = null,
            ExecutionMode stepMode = ExecutionMode.Synchronous,
            PipelineStage stage = PipelineStage.PostOperation)
        {
            var serviceProvider = new Mock<IServiceProvider>();
            var executionContext = CreatePluginExecutionContext(target, messageName, preImage, postImage, stepMode, stage);
            var serviceFactory = new Mock<IOrganizationServiceFactory>();
            var service = new Mock<IOrganizationService>();
            var tracingService = new Mock<ITracingService>();

            serviceFactory
                .Setup(o => o.CreateOrganizationService(executionContext.UserId))
                .Returns(service.Object);
            serviceProvider
                .Setup(o => o.GetService(typeof(IPluginExecutionContext)))
                .Returns(executionContext);
            serviceProvider
                .Setup(o => o.GetService(typeof(IOrganizationServiceFactory)))
                .Returns(serviceFactory.Object);
            serviceProvider
                .Setup(o => o.GetService(typeof(ITracingService)))
                .Returns(tracingService.Object);
            
            return serviceProvider.Object;
        }

        static IExecutionContext CreatePluginExecutionContext(
            Object target = null,
            String messageName = null,
            Entity preImage = null,
            Entity postImage = null,
            ExecutionMode stepMode = ExecutionMode.Synchronous,
            PipelineStage stage = PipelineStage.PostOperation)
        {
            var userId = Guid.NewGuid();
            var executionContext = new Mock<IPluginExecutionContext>();
            var input = new ParameterCollection();

            if (target != null)
                input.Add("Target", target);

            executionContext
                .Setup(o => o.UserId)
                .Returns(userId);
            executionContext
                .Setup(o => o.InputParameters)
                .Returns(input);
            executionContext
                .Setup(o => o.MessageName)
                .Returns(messageName);

            var preImages = new EntityImageCollection();
            var postImages = new EntityImageCollection();

            if (preImage != null)
                preImages.Add(EntityImageType.PreImage.ToString(), preImage);

            if (postImage != null)
                postImages.Add(EntityImageType.PostImage.ToString(), postImage);

            executionContext
                .Setup(o => o.PreEntityImages)
                .Returns(preImages);

            executionContext
                .Setup(o => o.PostEntityImages)
                .Returns(postImages);

            executionContext
                .Setup(o => o.Mode)
                .Returns((Int32)stepMode);

            executionContext
                .Setup(o => o.Stage)
                .Returns((Int32)stage);

            var primaryEntityName = target is Entity ? ((Entity)(target)).LogicalName :
                target is EntityReference ? ((EntityReference)(target)).LogicalName :
                null;

            executionContext
                .Setup(o => o.PrimaryEntityName)
                .Returns(primaryEntityName);

            return executionContext.Object;
        }

        [TestClass]
        public class Constructor
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullServiceProvider()
            {
                new PluginContext(null);
            }

            [TestMethod]
            public void InitializesNewInstanceForValidServiceProvider()
            {
                var serviceProvider = CreateServiceProvider();

                var context = new PluginContext(serviceProvider);

                Assert.IsNotNull(context);
                Assert.IsNotNull(context.ExecutionContext);
                Assert.IsNotNull(context.OrganizationService);
                Assert.IsNotNull(context.OrganizationServiceFactory);
                Assert.IsNotNull(context.ServiceProvider);
                Assert.IsNotNull(context.TracingService);
            }
        }

        [TestClass]
        public class GetOrganizationServiceContextMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.GetOrganizationServiceContext();
            }

            [TestMethod]
            public void ReturnsNotNullServiceContext()
            {
                var serviceProvider = CreateServiceProvider();

                var context = new PluginContext(serviceProvider);

                var serviceContext = context.GetOrganizationServiceContext();

                Assert.IsNotNull(serviceContext);
            }
        }

        [TestClass]
        public class GetTargetEntityMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.GetTargetEntity();
            }

            [TestMethod]
            public void ReturnsTargetEntity()
            {
                var entity = new Entity(Schema.AccountEntity.TypeName, Guid.NewGuid());
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(entity);
                context = new PluginContext(serviceProvider);

                var targetEntity = context.GetTargetEntity();

                Assert.AreSame(entity, targetEntity);
            }

            [TestMethod]
            public void ReturnsNullForTargetEntityReference()
            {
                var entityReference = new EntityReference(Schema.AccountEntity.TypeName, Guid.NewGuid());
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(entityReference);
                context = new PluginContext(serviceProvider);

                var targetEntity = context.GetTargetEntity();

                Assert.IsNull(targetEntity);
            }
        }

        [TestClass]
        public class GetTargetEntityReferenceMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.GetTargetEntity();
            }

            [TestMethod]
            public void ReturnsNullForTargetEntity()
            {
                var entity = new Entity(Schema.AccountEntity.TypeName, Guid.NewGuid());
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(entity);
                context = new PluginContext(serviceProvider);

                var targetEntityReference = context.GetTargetEntityReference();

                Assert.IsNull(targetEntityReference);
            }

            [TestMethod]
            public void ReturnsTargetEntityReference()
            {
                var entityReference = new EntityReference(Schema.AccountEntity.TypeName, Guid.NewGuid());
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(entityReference);
                context = new PluginContext(serviceProvider);

                var targetEntityReference = context.GetTargetEntityReference();

                Assert.AreSame(targetEntityReference, entityReference);
            }
        }

        [TestClass]
        public class GetTargetEntityTypeMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.GetTargetEntityType();
            }

            [TestMethod]
            public void ReturnsTargetTypeEntity()
            {
                var entity = new Entity(Schema.AccountEntity.TypeName, Guid.NewGuid());
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(entity);
                context = new PluginContext(serviceProvider);

                var type = context.GetTargetEntityType();

                Assert.AreEqual(TargetType.Entity, type);
            }

            [TestMethod]
            public void ReturnsTargetTypeEntityReference()
            {
                var entityReference = new EntityReference(Schema.AccountEntity.TypeName, Guid.NewGuid());
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(entityReference);
                context = new PluginContext(serviceProvider);

                var type = context.GetTargetEntityType();

                Assert.AreEqual(TargetType.EntityReference, type);
            }

            [TestMethod]
            public void ReturnsTargetTypeUndefined()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(new Object());
                context = new PluginContext(serviceProvider);

                var type = context.GetTargetEntityType();

                Assert.AreEqual(TargetType.Unknown, type);
            }
        }

        [TestClass]
        public class GetEntityImageMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.GetEntityImage(EntityImageType.PostImage);
            }

            [TestMethod]            
            public void ThrowsErrorForMissingImage()
            {
                this.ExpectedException<InvalidPluginExecutionException>(() =>
                {
                    var serviceProvider = CreateServiceProvider();
                    var context = new PluginContext(serviceProvider);

                    context.GetEntityImage(EntityImageType.PreImage, throwIfNull: true);
                });

                this.ExpectedException<InvalidPluginExecutionException>(() =>
                {
                    var serviceProvider = CreateServiceProvider();
                    var context = new PluginContext(serviceProvider);

                    context.GetEntityImage(EntityImageType.PostImage, throwIfNull: true);
                });
            }

            [TestMethod]            
            public void ReturnsPreImage()
            {
                var image = new Entity(Schema.AccountEntity.TypeName, Guid.NewGuid());                
                var serviceProvider = CreateServiceProvider(preImage: image);
                var context = new PluginContext(serviceProvider);

                Assert.AreSame(image, context.GetEntityImage(EntityImageType.PreImage));
                Assert.IsNull(context.GetEntityImage(EntityImageType.PostImage));                
            }
            
            [TestMethod]
            public void ReturnsPostImage()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);
                var image = new Entity(Schema.AccountEntity.TypeName, Guid.NewGuid());

                serviceProvider = CreateServiceProvider(postImage: image);
                context = new PluginContext(serviceProvider);

                Assert.AreSame(image, context.GetEntityImage(EntityImageType.PostImage));
                Assert.IsNull(context.GetEntityImage(EntityImageType.PreImage));

                serviceProvider = CreateServiceProvider();
                context = new PluginContext(serviceProvider);

                Assert.IsNull(context.GetEntityImage(EntityImageType.PostImage));
            }

            [TestMethod]
            public void ReturnsNullForMissingImage()
            {
                var serviceProvider = CreateServiceProvider();
                var context = new PluginContext(serviceProvider);

                Assert.IsNull(context.GetEntityImage(EntityImageType.PreImage));
                Assert.IsNull(context.GetEntityImage(EntityImageType.PostImage));
            }
        }

        [TestClass]
        public class IsCreateMessageMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.IsCreateMessage();
            }

            [TestMethod]
            public void ReturnsTrueWhenCreating()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(messageName: "create");
                context = new PluginContext(serviceProvider);

                Assert.IsTrue(context.IsCreateMessage());

                serviceProvider = CreateServiceProvider(messageName: "Create");
                context = new PluginContext(serviceProvider);

                Assert.IsTrue(context.IsCreateMessage());
            }

            [TestMethod]
            public void ReturnsFalseWhenNotCreating()
            {
                var serviceProvider = CreateServiceProvider(messageName: "somemessage");
                var context = new PluginContext(serviceProvider);

                var create = context.IsCreateMessage();

                Assert.IsFalse(create);
            }
        }

        [TestClass]
        public class IsDeleteMessageMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.IsDeleteMessage();
            }

            [TestMethod]
            public void ReturnsTrueWhenDeleting()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(messageName: "delete");
                context = new PluginContext(serviceProvider);

                Assert.IsTrue(context.IsDeleteMessage());

                serviceProvider = CreateServiceProvider(messageName: "Delete");
                context = new PluginContext(serviceProvider);

                Assert.IsTrue(context.IsDeleteMessage());
            }

            [TestMethod]
            public void ReturnsFalseWhenNotDeleting()
            {
                var serviceProvider = CreateServiceProvider(messageName: "somemessage");
                var context = new PluginContext(serviceProvider);

                var create = context.IsCreateMessage();

                Assert.IsFalse(create);
            }
        }

        [TestClass]
        public class IsUpdateMessageMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.IsUpdateMessage();
            }

            [TestMethod]
            public void ReturnsTrueWhenUpdating()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(messageName: "update");
                context = new PluginContext(serviceProvider);

                Assert.IsTrue(context.IsUpdateMessage());

                serviceProvider = CreateServiceProvider(messageName: "Update");
                context = new PluginContext(serviceProvider);

                Assert.IsTrue(context.IsUpdateMessage());
            }

            [TestMethod]
            public void ReturnsFalseWhenNotDeleting()
            {
                var serviceProvider = CreateServiceProvider(messageName: "somemessage");
                var context = new PluginContext(serviceProvider);

                Assert.IsFalse(context.IsUpdateMessage());
            }
        }

        [TestClass]
        public class EnsureSupportedExecutionModeMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.EnsureSupportedExecutionMode(ExecutionMode.Synchronous);
            }

            [TestMethod]
            public void ThrowsErrorForInvalidStepMode()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                this.ExpectedException<InvalidPluginExecutionException>(() =>
                {
                    serviceProvider = CreateServiceProvider(stepMode: ExecutionMode.Asynchronous);
                    context = new PluginContext(serviceProvider);

                    context.EnsureSupportedExecutionMode(ExecutionMode.Synchronous);
                });

                this.ExpectedException<InvalidPluginExecutionException>(() =>
                {
                    serviceProvider = CreateServiceProvider(stepMode: ExecutionMode.Asynchronous);
                    context = new PluginContext(serviceProvider);

                    context.EnsureSupportedExecutionMode(ExecutionMode.Synchronous);
                });          
            }

            [TestMethod]
            public void DoesNotThrowErrorForValidStepMode()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(stepMode: ExecutionMode.Asynchronous);
                context = new PluginContext(serviceProvider);

                context.EnsureSupportedExecutionMode(ExecutionMode.Asynchronous);

                serviceProvider = CreateServiceProvider(stepMode: ExecutionMode.Synchronous);
                context = new PluginContext(serviceProvider);

                context.EnsureSupportedExecutionMode(ExecutionMode.Synchronous);
            }
        }

        [TestClass]
        public class EnsureSupportedMessageMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.EnsureSupportedMessage("somemessage");
            }

            [TestMethod]
            [ExpectedException(typeof(InvalidPluginExecutionException))]
            public void ThrowsErrorForInvalidMesssage()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(messageName: "create");
                context = new PluginContext(serviceProvider);

                context.EnsureSupportedMessage("othermessage");                
            }

            [TestMethod]            
            public void DoesNotThrowErrorForValidMesssage()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(messageName: "create");
                context = new PluginContext(serviceProvider);

                context.EnsureSupportedMessage("create");
                context.EnsureSupportedMessage("Create");
            }
        }

        [TestClass]
        public class EnsureSupportedPipelineStageMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.EnsureSupportedPipelineStage(PipelineStage.PostOperation);
            }

            [TestMethod]
            public void ThrowsErrorForInvalidStage()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                this.ExpectedException<InvalidPluginExecutionException>(() =>
                {
                    serviceProvider = CreateServiceProvider(stage: PipelineStage.PostOperation);
                    context = new PluginContext(serviceProvider);

                    context.EnsureSupportedPipelineStage(PipelineStage.PreOperation);
                });

                this.ExpectedException<InvalidPluginExecutionException>(() =>
                {
                    serviceProvider = CreateServiceProvider(stage: PipelineStage.PreOperation);
                    context = new PluginContext(serviceProvider);

                    context.EnsureSupportedPipelineStage(PipelineStage.PostOperation);
                });
            }

            [TestMethod]
            public void DoesNotThrowErrorForValidStage()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(stage: PipelineStage.PostOperation);
                context = new PluginContext(serviceProvider);

                context.EnsureSupportedPipelineStage(PipelineStage.PostOperation);

                serviceProvider = CreateServiceProvider(stage: PipelineStage.PreOperation);
                context = new PluginContext(serviceProvider);

                context.EnsureSupportedPipelineStage(PipelineStage.PreOperation);
            }
        }

        [TestClass]
        public class EnsureTargetLogicalNameMethod
        {
            [TestMethod]
            [ExpectedException(typeof(ArgumentNullException))]
            public void ThrowsErrorForNullContext()
            {
                var context = default(IPluginContext);

                context.EnsureTargetLogicalName("somemessage");
            }

            [TestMethod]
            [ExpectedException(typeof(InvalidPluginExecutionException))]
            public void ThrowsErrorForInvalidMesssage()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(target: new Entity(Schema.AccountEntity.TypeName));
                context = new PluginContext(serviceProvider);

                context.EnsureTargetLogicalName(Schema.ContactEntity.TypeName);
            }

            [TestMethod]
            public void DoesNotThrowErrorForValidMesssage()
            {
                var serviceProvider = default(IServiceProvider);
                var context = default(IPluginContext);

                serviceProvider = CreateServiceProvider(target: new Entity(Schema.AccountEntity.TypeName));
                context = new PluginContext(serviceProvider);

                context.EnsureTargetLogicalName(Schema.AccountEntity.TypeName);                
            }
        }
    }
}
