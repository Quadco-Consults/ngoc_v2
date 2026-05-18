import { format } from "date-fns";
import { useGetAllMaintenanceScheduleQuery } from "../../maintenance-schedule/services";
import { skipToken } from "@reduxjs/toolkit/query";

export default function useAssetInfo({
    type,
    id,
    lastUpdated,
    altLabel,
}: {
    type: string;
    id: string;
    lastUpdated: string;
    altLabel: string;
}) {
    const isValid = type === "FlowStation" || type === "Pipeline";

    const { data: maintenanceSchedules } = useGetAllMaintenanceScheduleQuery(
        isValid
            ? {
                  page: 1,
                  size: 2000000,
                  object_id: id,
              }
            : skipToken
    );

    const maintenanceSchedule =
        maintenanceSchedules?.data?.results?.[0]?.start_execution_date;

    return [
        {
            label: "Asset Type",
            value: `${type}${altLabel ? ` (${altLabel})` : ""}`,
        },

        ...(isValid
            ? [
                  {
                      label: "Scheduled Maintenance Date",
                      value: maintenanceSchedule
                          ? format(maintenanceSchedule, "dd MMMM, yyyy")
                          : "-",
                  },
              ]
            : []),

        {
            label: "Last Updated",
            value: lastUpdated && format(lastUpdated, "dd MMMM, yyyy"),
        },
    ];
}
