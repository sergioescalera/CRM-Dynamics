﻿using System;

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

        public static class ContactEntity
        {
            public const String TypeName = "contact";
                         
            public const String IdFieldName = "contactid";
                         
            public const String FullNameFieldName = "fullname";
                         
            public const String ParentAccountFieldName = "parentcustomerid";

            public const String Address1Name = "address1_";

            public const String Address2Name = "address2_";
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

        public static class SiteEntity
        {
            public const String TypeName = "site";
                         
            public const String IdFieldName = "siteid";            
        }

        public static class SystemUserEntity
        {
            public const String TypeName = "systemuser";

            public const String IdFieldName = "systemuserid";
        }
    }
}