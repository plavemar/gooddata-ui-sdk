// (C) 2007-2020 GoodData Corporation
import React, { useState } from "react";
import { ErrorComponent, OnError, OnLoadingChanged } from "@gooddata/sdk-ui";
import { AttributeFilterButton } from "@gooddata/sdk-ui-filters";
import { BarChart } from "@gooddata/sdk-ui-charts";
import {
    attributeDisplayFormRef,
    IAttributeFilter,
    idRef,
    newPositiveAttributeFilter,
} from "@gooddata/sdk-model";
import { Ldm, LdmExt } from "../../ldm";

export const AttributeParentChildFilterButtonExample: React.FC = () => {
    const [filter, setFilter] = useState<IAttributeFilter>();
    const [parentFilter, setParentFilter] = useState<IAttributeFilter>();
    const [error, setError] = useState<any>();

    const onError: OnError = (...params) => {
        setError(params);
        // eslint-disable-next-line no-console
        console.info("AttributeFilterExample onLoadingChanged", ...params);
    };

    const onLoadingChanged: OnLoadingChanged = (...params) => {
        // eslint-disable-next-line no-console
        console.info("AttributeFilterExample onLoadingChanged", ...params);
    };

    return (
        <div className="s-attribute-filter">
            <div style={{ display: "flex" }}>
                <AttributeFilterButton
                    filter={newPositiveAttributeFilter(attributeDisplayFormRef(Ldm.LocationState), {
                        uris: [],
                    })}
                    onApply={setParentFilter}
                />
                <AttributeFilterButton
                    filter={newPositiveAttributeFilter(attributeDisplayFormRef(Ldm.LocationCity), {
                        uris: [],
                    })}
                    parentFilters={parentFilter ? [parentFilter] : []}
                    parentFilterOverAttribute={idRef(LdmExt.locationIdAttributeIdentifier)}
                    onApply={setFilter}
                />
            </div>
            <div style={{ height: 300 }} className="s-line-chart">
                {error ? (
                    <ErrorComponent message={error} />
                ) : (
                    <BarChart
                        measures={[LdmExt.TotalSales2]}
                        viewBy={Ldm.LocationCity}
                        filters={[filter, parentFilter]}
                        onLoadingChanged={onLoadingChanged}
                        onError={onError}
                    />
                )}
            </div>
        </div>
    );
};