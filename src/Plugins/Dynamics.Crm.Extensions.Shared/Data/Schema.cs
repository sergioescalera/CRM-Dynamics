using System;

namespace Dynamics.Crm.Data
{
    public static class Schema
    {
        public const String publisherPrefix = "sib_";

        public static class Common
        {
            public const String ConcurrencyTokenFieldName = Schema.publisherPrefix + "concurrencytoken";

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

            public const String FaxFieldName = "fax";

            public const String EmailFieldName = "emailaddress1";

            public const String WebsiteFieldName = "websiteurl";
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

            public const String PhoneFieldName = "telephone1";

            public const String MobilePhoneFieldName = "mobilephone";

            public const String FaxFieldName = "fax";
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

            public const String SubjectFieldName = "subject";

            public const String DescriptionFieldName = "description";

            public const String DirectionCodeFieldName = "directioncode";
        }

        public static class LogEntryEntity
        {
            public const String TypeName = publisherPrefix + "logentry";

            public static readonly String IdFieldName = $"{publisherPrefix}logentryid";

            public static readonly String NameFieldName = $"{publisherPrefix}name";

            public static readonly String MessageFieldName = $"{publisherPrefix}message";

            public static readonly String DescriptionFieldName = $"{publisherPrefix}description";

            public static readonly String SourceFieldName = $"{publisherPrefix}source";

            public static readonly String TypeFieldName = $"{publisherPrefix}type";

            public static readonly String UserFieldName = $"{publisherPrefix}user";

            public static readonly Int32 NameFieldLength = 300;

            public static readonly Int32 MessageFieldLength = 5000;

            public static readonly Int32 DescriptionFieldLength = 1048576;

            public static readonly Int32 SourceFieldLength = 500;
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
