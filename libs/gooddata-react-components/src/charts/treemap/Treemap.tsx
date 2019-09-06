// (C) 2007-2018 GoodData Corporation
import { IPreparedExecution } from "@gooddata/sdk-backend-spi";
import { AttributeOrMeasure, IAttribute, IBucket, IFilter } from "@gooddata/sdk-model";
import * as React from "react";
import { MEASURES, SEGMENT, VIEW } from "../../constants/bucketNames";
import { Subtract } from "../../typings/subtract";
import { treemapDimensions } from "../_commons/dimensions";
import { IChartProps, ICommonChartProps } from "../chartProps";
import { CoreTreemap } from "./CoreTreemap";
import omit = require("lodash/omit");

/*
 * TODO: SDK8: verify this chart - the dimensions and sorting may be hosed.
 *
 * The dimension construction that was (and is) used puts all attributes into either first or second dimension.
 * This sounds weird - why the two buckets then? on top of that, the logic that constructs sorts does so only
 * if both dimensions contain some attributes (which cannot happen). Not going to deal with this now.. transferring
 * status quo as-is.
 */

export interface ITreemapBucketProps {
    measures: AttributeOrMeasure[];
    viewBy?: IAttribute;
    segmentBy?: IAttribute;
    filters?: IFilter[];
}

export interface ITreemapProps extends ICommonChartProps, ITreemapBucketProps {
    projectId: string;
}

type ITreemapNonBucketProps = Subtract<ITreemapProps, ITreemapBucketProps>;

/**
 * [Treemap](http://sdk.gooddata.com/gdc-ui-sdk-doc/docs/treemap_component.html)
 * is a component with bucket props measures, viewBy, filters
 */
export function Treemap(props: ITreemapProps): JSX.Element {
    return <CoreTreemap {...toCoreTreemapProps(props)} />;
}

export function toCoreTreemapProps(props: ITreemapProps): IChartProps {
    const buckets: IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: props.measures || [],
        },
        {
            localIdentifier: VIEW,
            items: props.viewBy ? [props.viewBy] : [],
        },
        {
            localIdentifier: SEGMENT,
            items: props.segmentBy ? [props.segmentBy] : [],
        },
    ];

    const newProps: ITreemapNonBucketProps = omit<ITreemapProps, keyof ITreemapBucketProps>(props, [
        "measures",
        "viewBy",
        "segmentBy",
        "filters",
    ]);

    return {
        ...newProps,
        execution: createExecution(buckets, props),
    };
}

export function createExecution(buckets: IBucket[], props: ITreemapProps): IPreparedExecution {
    const { backend, workspace } = props;

    return backend
        .withTelemetry("Treemap", props)
        .workspace(workspace)
        .execution()
        .forBuckets(buckets, props.filters)
        .withDimensions(treemapDimensions);
}

/*

function getDefaultTreemapSort(afm: AFM.IAfm, resultSpec: AFM.IResultSpec): AFM.SortItem[] {
    const viewByAttributeIdentifier: string = get(resultSpec, "dimensions[0].itemIdentifiers[0]");
    const stackByAttributeIdentifier: string = get(resultSpec, "dimensions[0].itemIdentifiers[1]");

    if (viewByAttributeIdentifier && stackByAttributeIdentifier) {
        return [...getAttributeSortItems(viewByAttributeIdentifier, ASC, false), ...getAllMeasuresSorts(afm)];
    }

    return [];
}
*/
