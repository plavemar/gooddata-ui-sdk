// (C) 2020-2022 GoodData Corporation
import React from "react";
import { PivotTable } from "@gooddata/sdk-ui-pivot";
import { useBackendStrict, useWorkspaceStrict } from "@gooddata/sdk-ui";
import * as ReferenceMd from "../../../../md/full";

const measures = [ReferenceMd.Amount, ReferenceMd.Won];
const attributes = [ReferenceMd.Product.Name, ReferenceMd.Department];
const columns = [ReferenceMd.ForecastCategory, ReferenceMd.Region];

export const PivotTableAggregationsMenuScenario: React.FC = () => {
    const backend = useBackendStrict();
    const workspace = useWorkspaceStrict();

    return (
        /* size 2200 is because AG virtualized and it made some problems in cypress */
        <div
            style={{ width: 2200, height: 300, marginTop: 20, resize: "both", overflow: "scroll" }}
            className="s-pivot-table-aggregations-menu"
        >
            <PivotTable
                backend={backend}
                workspace={workspace}
                measures={measures}
                rows={attributes}
                columns={columns}
                config={{
                    menu: {
                        aggregations: true,
                        aggregationsSubMenu: true,
                    },
                }}
            />
        </div>
    );
};
