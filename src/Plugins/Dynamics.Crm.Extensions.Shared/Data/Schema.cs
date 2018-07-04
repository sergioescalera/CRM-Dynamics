using System;

namespace Dynamics.Crm.Data
{
    public static class Schema
    {
        public const String DefaultPrefix = "cc";

        public static class Common
        {
            public static readonly Func<String, String> ConcurrencyTokenFieldName = prefix => $"{prefix}_concurrencytoken";

            public static readonly Func<String, String> CustomNameFieldName = prefix => $"{prefix}_name";

            public const String CreatedByFieldName = "createdby";

            public const String CreatedOnFieldName = "createdon";

            public const String ModifiedByFieldName = "modifiedon";

            public const String ModifiedOnFieldName = "modifiedby";

            public const String NameFieldName = "name";

            public const String OwnerFieldName = "ownerid";

            public const String StateFieldName = "statecode";

            public const String StatusFieldName = "statuscode";

            public const String TransactionCurrencyFieldName = "transactioncurrencyid";
        }

        public static class AccountEntity
        {
            public const String TypeName = "account";

            public const String IdFieldName = "accountid";

            public const String Address1Name = "address1_";

            public const String Address2Name = "address2_";

            public const String ParentAccountFieldName = "parentaccountid";

            public const String PrimaryContactFieldName = "primarycontactid";

            public const String MainPhoneFieldName = "telephone1";

            public const String OtherPhoneFieldName = "telephone2";

            public const String DoNotPhoneFieldName = "donotphone";

            public const String FaxFieldName = "fax";

            public const String EmailFieldName = "emailaddress1";

            public const String DoNotEmailFieldName = "donotemail";

            public const String WebsiteFieldName = "websiteurl";
        }

        public class ActivityPartyEntity
        {
            public const String TypeName = "activityparty";

            public const String IdFieldName = "activitypartyid";

            public const String PartyFieldName = "partyid";

            public const String ActivityFieldName = "activityid";
        }

        public static class AddressStruct
        {
            public static readonly Func<String, String> CityFieldFormat = (s) => $"{s}city";

            public static readonly Func<String, String> CountryFieldFormat = (s) => $"{s}country";

            public static readonly Func<String, String> Line1FieldFormat = (s) => $"{s}line1";

            public static readonly Func<String, String> Line2FieldFormat = (s) => $"{s}line2";

            public static readonly Func<String, String> Line3FieldFormat = (s) => $"{s}line3";

            public static readonly Func<String, String> PostalCodeFieldFormat = (s) => $"{s}postalcode";

            public static readonly Func<String, String> StateFieldFormat = (s) => $"{s}stateorprovince";

            public static readonly Func<String, String> NameFieldFormat = (s) => $"{s}name";

            public static readonly Func<String, String> PhoneFieldFormat = (s) => $"{s}telephone";
        }

        public static class BusinessUnitEntity
        {
            public const String TypeName = "businessunit";

            public const String IdFieldName = "businessunitid";

            public const String ParentFieldName = "parentbusinessunitid";
        }

        public static class ContactEntity
        {
            public const String TypeName = "contact";

            public const String IdFieldName = "contactid";

            public const String FullNameFieldName = "fullname";

            public const String ParentCustomerFieldName = "parentcustomerid";

            public const String Address1Name = "address1_";

            public const String Address2Name = "address2_";

            public const String FirstNameField = "firstname";

            public const String LastNameField = "lastname";

            public const String EmailFieldName = "emailaddress1";

            public const String DoNotEmailFieldName = "donotemail";

            public const String PhoneFieldName = "telephone1";

            public const String OtherPhoneFieldName = "telephone2";

            public const String MobilePhoneFieldName = "mobilephone";

            public const String FaxFieldName = "fax";

            public const String DoNotPhoneFieldName = "donotphone";
        }

        public static class Currency
        {
            public const String TypeName = "transactioncurrency";

            public const String IdFieldName = "transactioncurrencyid";
        }

        public static class EmailEntity
        {
            public const String TypeName = "email";

            public const String IdFieldName = "activityid";

            public const String FromFieldName = "from";

            public const String ToFieldName = "to";

            public const String CcFieldName = "cc";

            public const String BccFieldName = "bcc";

            public const String RegardingObjectFieldName = "regardingobjectid";

            public const String SubjectFieldName = "subject";

            public const String DescriptionFieldName = "description";

            public const String DirectionCodeFieldName = "directioncode";
        }

        public static class EmailTemplateEntity
        {
            public const String TypeName = "template";

            public const String IdFieldName = "templateid";

            public const String BodyFieldName = "body";

            public const String DescriptionFieldName = "description";

            public const String SubjectFieldName = "subject";

            public const String TitleFieldName = "title";
        }

        public static class GlobalSettingEntity
        {
            public static readonly Func<String, String> TypeName = prefix => $"{prefix}_globalsetting";

            public static readonly Func<String, String> IdFieldName = prefix => $"{prefix}_globalsettingid";

            public static readonly Func<String, String> KeyFieldName = prefix => $"{prefix}_key";

            public static readonly Func<String, String> ValueFieldName = prefix => $"{prefix}_value";

            public static readonly Func<String, String> TypeFieldName = prefix => $"{prefix}_type";

            public static readonly Func<String, String> DescriptionFieldName = prefix => $"{prefix}_description";

            public static readonly Func<String, String> ReferenceTypeFieldName = prefix => $"{prefix}_valuetype";
        }

        public static class LeadEntity
        {
            public const String TypeName = "lead";

            public const String IdFieldName = "leadid";

            public const String MobilePhoneFieldName = "mobilephone";

            public const String PhoneFieldName = "telephone1";

            public const String OtherPhoneFieldName = "telephone2";

            public const String DoNotPhoneFieldName = "donotphone";

            public const String EmailFieldName = "emailaddress1";

            public const String DoNotEmailFieldName = "donotemail";
        }

        public static class LogEntryEntity
        {
            public static readonly Func<String, String> TypeName = prefix => $"{prefix}_logentry";

            public static readonly Func<String, String> IdFieldName = prefix => $"{prefix}_logentryid";
            
            public static readonly Func<String, String> MessageFieldName = prefix => $"{prefix}_message";

            public static readonly Func<String, String> DescriptionFieldName = prefix => $"{prefix}_description";

            public static readonly Func<String, String> SourceFieldName = prefix => $"{prefix}_source";

            public static readonly Func<String, String> TypeFieldName = prefix => $"{prefix}_type";

            public static readonly Func<String, String> UserFieldName = prefix => $"{prefix}_user";

            public static readonly Int32 NameFieldLength = 300;

            public static readonly Int32 MessageFieldLength = 5000;

            public static readonly Int32 DescriptionFieldLength = 1048576;

            public static readonly Int32 SourceFieldLength = 500;
        }

        public static class NoteEntity
        {
            public const String TypeName = "annotation";

            public const String IdFieldName = "annotationid";

            public const String SubjectFieldName = "subject";

            public const String FileNameFieldName = "filename";

            public const String MimeTypeFieldName = "mimetype";

            public const String DocumentBodyFieldName = "documentbody";

            public const String RegardingObjectFieldName = "objectid";

            public const String TextFieldName = "notetext";
        }

        public static class OpportunityEntity
        {
            public const String TypeName = "opportunity";

            public const String IdFieldName = "opportunityid";

            public const String ParentAccountFieldName = "parentaccountid";

            public const String ParentContactFieldName = "parentcontactid";
        }

        public static class OpportunityCloseMessage
        {
            public const String Name = "opportunityclose";

            public const String OpportunityFieldName = "opportunityid";

            public const String ActualEndFieldName = "actualend";

            public const String ActualRevenueFieldName = "actualrevenue";
        }

        public static class ProductEntity
        {
            public const String TypeName = "product";

            public const String IdFieldName = "productid";

            public const String NumberFieldName = "productnumber";

            public const String UnitGroupFieldName = "defaultuomscheduleid";

            public const String DefaultUnitFieldName = "defaultuomid";
        }

        public static class RoleEntity
        {
            public const String TypeName = "role";

            public const String IdFieldName = "roleid";
        }

        public static class SiteEntity
        {
            public const String TypeName = "site";

            public const String IdFieldName = "siteid";
        }

        public static class SPDocumentLocationEntity
        {
            public const String TypeName = "sharepointdocumentlocation";

            public const String IdFieldName = "sharepointdocumentlocationid";

            public const String AbsoluteUrlFieldName = "absoluteurl";

            public const String ParentSiteOrLocationFieldName = "parentsiteorlocation";

            public const String RegardingObjectFieldName = "regardingobjectid";

            public const String RelativeUrlFieldName = "relativeurl";
        }

        public static class SPDocumentSiteEntity
        {
            public const String TypeName = "sharepointsite";

            public const String IdFieldName = "sharepointsiteid";

            public const String AbsoluteUrlFieldName = "absoluteurl";

            public const String IsDefaultFieldName = "isdefault";

            public const String ParentSiteFieldName = "parentsite";

            public const String RelativeUrlFieldName = "relativeurl";
        }

        public static class SystemUserEntity
        {
            public const String TypeName = "systemuser";

            public const String IdFieldName = "systemuserid";

            public const String MobilePhoneFieldName = "mobilephone";

            public const String HomePhoneFieldName = "homephone";

            public const String EmailFieldName = "internalemailaddress";

            public const String ManagerFieldName = "parentsystemuserid";
        }

        public static class TaskEntity
        {
            public const String TypeName = "task";

            public const String IdFieldName = "activityid";

            public const String RegardingObjectFieldName = "regardingobjectid";

            public const String SubjectFieldName = "subject";

            public const String DescriptionFieldName = "description";

            public const String ActualStartFieldName = "actualstart";

            public const String ScheduledStartFieldName = "scheduledstart";

            public const String ActualEndFieldName = "actualend";

            public const String ScheduledEndFieldName = "scheduledend";
        }

        public static class TeamEntity
        {
            public const String TypeName = "team";

            public const String IdFieldName = "teamid";

            public const String AdministratorFieldName = "administratorid";

            public const String BusinessUnitFieldName = "businessunitid";

            public const String IsDefaultFieldName = "isdefault";

            public const String TypeFieldName = "teamtype";            
        }

        public static class UnitEntity
        {
            public const String TypeName = "uom";

            public const String IdFieldName = "uomid";

            public const String UnitGroupFieldName = "uomscheduleid";
        }

        public static class UnitGroupEntity
        {
            public const String TypeName = "uomschedule";

            public const String IdFieldName = "uomscheduleid";
        }
    }
}
