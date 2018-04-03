module Dynamics.Crm.Reports {

    "use strict";

    export function getUrl(
        reportName: string,
        reportId: string,
        entityId: string = null,
        entityCode: string = null,
        action: string = "run"): string {

        let url = Xrm.Utility.getGlobalContext().getClientUrl();

        let reportUrl = url + "/crmreports/viewer/viewer.aspx?action={action}&helpID={name}&id={{id}}"
            .replace("{action}", encodeURIComponent(action))
            .replace("{name}", encodeURIComponent(reportName))
            .replace("{id}", encodeURIComponent(reportId));

        if (entityId && entityCode) {

            reportUrl += "&context=records&records={{entityId}}&recordstype={entityCode}"
                .replace("{entityId}", entityId)
                .replace("{entityCode}", entityCode);
        }

        return reportUrl;
    }
}