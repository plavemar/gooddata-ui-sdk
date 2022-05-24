// (C) 2007-2019 GoodData Corporation
import { AttributeFilter } from "@gooddata/sdk-ui-filters/dist/AttributeFilter@next/AttributeFilter";
import React from "react";
import { storiesOf } from "../../../_infra/storyRepository";
import { action } from "@storybook/addon-actions";
// import { LongPostInteractionTimeout } from "../../../_infra/backstopWrapper";
import { FilterStories } from "../../../_infra/storyGroups";

import "@gooddata/sdk-ui-filters/styles/css/attributeFilterNext.css";
import { ReferenceMd } from "@gooddata/reference-workspace";
import { newNegativeAttributeFilter, newPositiveAttributeFilter } from "@gooddata/sdk-model";
import { ReferenceWorkspaceId, StorybookBackend } from "../../../_infra/backend";
import { wrapWithTheme } from "../../themeWrapper";

const wrapperStyle = { width: 400, height: 600, padding: "1em 1em" };
const backend = StorybookBackend();

/*
 * TODO: fix these scenarios, use postInteractionWait selector (string) instead of fixed timeout. this
 *  will highly likely require changes in the attr filter though (tried existing styles, no luck - possibly
 *  because of the fixedDataTable / goodstrap => i believe divs are rendered with zero height first => still
 *  not visible)
 */

storiesOf(`${FilterStories}@next/AttributeFilter`)
    .add(
        "empty default selection",
        () => {
            return (
                <div style={wrapperStyle} className="screenshot-target">
                    <AttributeFilter
                        backend={backend}
                        workspace={ReferenceWorkspaceId}
                        filter={newPositiveAttributeFilter(ReferenceMd.Product.Name, [])}
                        onApply={action("on-apply")}
                    />
                </div>
            );
        },
        /* {
            screenshots: {
                closed: {},
                opened: { clickSelector: ".s-product", postInteractionWait: LongPostInteractionTimeout },
                "select-all": {
                    clickSelectors: [".s-product", ".s-select_all"],
                    postInteractionWait: LongPostInteractionTimeout,
                },
            },
        },*/
    )
    .add(
        "not fit into content",
        () => {
            return (
                <div style={wrapperStyle} className="screenshot-target">
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, 80px)",
                            height: 200,
                            width: 160,
                        }}
                    >
                        <AttributeFilter
                            backend={backend}
                            workspace={ReferenceWorkspaceId}
                            filter={newPositiveAttributeFilter(ReferenceMd.Product.Name, [])}
                            onApply={action("on-apply")}
                        />
                        <div style={{ padding: 4 }}>Second</div>
                    </div>
                </div>
            );
        },
        /* {
            screenshots: {
                closed: {},
                opened: { clickSelector: ".s-product", postInteractionWait: LongPostInteractionTimeout },
                "select-all": {
                    clickSelectors: [".s-product", ".s-select_all"],
                    postInteractionWait: LongPostInteractionTimeout,
                },
            },
        },*/
    )
    .add(
        "empty default selection - localized",
        () => {
            return (
                <div style={wrapperStyle} className="screenshot-target">
                    <AttributeFilter
                        backend={backend}
                        workspace={ReferenceWorkspaceId}
                        locale="de-DE"
                        filter={newPositiveAttributeFilter(ReferenceMd.Product.Name, [])}
                        onApply={action("on-apply")}
                    />
                </div>
            );
        },
        /*{
            screenshots: {
                closed: {},
                opened: { clickSelector: ".s-product", postInteractionWait: LongPostInteractionTimeout },
                "select-all": {
                    clickSelectors: [".s-product", ".s-alle_ausw_hlen"],
                    postInteractionWait: LongPostInteractionTimeout,
                },
            },
        },*/
    )
    .add(
        "pre-selected elements",
        () => {
            return (
                <div style={wrapperStyle} className="screenshot-target">
                    <AttributeFilter
                        backend={backend}
                        workspace={ReferenceWorkspaceId}
                        filter={newPositiveAttributeFilter(ReferenceMd.Product.Name, [
                            "WonderKid",
                            "Explorer",
                        ])}
                        onApply={action("on-apply")}
                    />
                </div>
            );
        },
        /* {
            screenshots: {
                opened: { clickSelector: ".s-product", postInteractionWait: LongPostInteractionTimeout },
                "select-all": {
                    clickSelectors: [".s-product", ".s-select_all"],
                    postInteractionWait: LongPostInteractionTimeout,
                },
                clear: {
                    clickSelectors: [".s-product", ".s-clear"],
                    postInteractionWait: LongPostInteractionTimeout,
                },
            },
        },*/
    )

    .add(
        "title with pre-selected elements - positive AttributeFilter",
        () => {
            return (
                <div style={wrapperStyle} className="screenshot-target">
                    <AttributeFilter
                        backend={backend}
                        workspace={ReferenceWorkspaceId}
                        filter={newPositiveAttributeFilter(ReferenceMd.Product.Name, [
                            "WonderKid",
                            "Explorer",
                            "TouchAll",
                        ])}
                        onApply={action("on-apply")}
                        titleWithSelection={true}
                    />
                </div>
            );
        },
        /*  {
            screenshots: {
                closed: {},
                opened: {
                    clickSelector: ".s-product__wonderkid__explorer__touch___3_",
                    postInteractionWait: LongPostInteractionTimeout,
                },
                "select-all": {
                    clickSelectors: [".s-product__wonderkid__explorer__touch___3_", ".s-select_all"],
                    postInteractionWait: LongPostInteractionTimeout,
                },
                clear: {
                    clickSelectors: [".s-product__wonderkid__explorer__touch___3_", ".s-clear"],
                    postInteractionWait: LongPostInteractionTimeout,
                },
            },
        },*/
    )
    .add(
        "title with pre-selected elements - negative AttributeFilter",
        () => {
            return (
                <div style={wrapperStyle} className="screenshot-target">
                    <AttributeFilter
                        backend={backend}
                        workspace={ReferenceWorkspaceId}
                        filter={newNegativeAttributeFilter(ReferenceMd.Product.Name, [
                            "WonderKid",
                            "Explorer",
                            "TouchAll",
                        ])}
                        onApply={action("on-apply")}
                        titleWithSelection={true}
                    />
                </div>
            );
        },
        /* {
            screenshots: {
                closed: {},
                opened: {
                    clickSelector: ".s-product__all_except_wonderkid__expl___3_",
                    postInteractionWait: LongPostInteractionTimeout,
                },
                "select-all": {
                    clickSelectors: [".s-product__all_except_wonderkid__expl___3_", ".s-select_all"],
                    postInteractionWait: LongPostInteractionTimeout,
                },
                clear: {
                    clickSelectors: [".s-product__all_except_wonderkid__expl___3_", ".s-clear"],
                    postInteractionWait: LongPostInteractionTimeout,
                },
            },
        },*/
    )
    .add(
        "themed",
        () => {
            return wrapWithTheme(
                <div style={wrapperStyle} className="screenshot-target">
                    <AttributeFilter
                        backend={backend}
                        workspace={ReferenceWorkspaceId}
                        filter={newPositiveAttributeFilter(ReferenceMd.Product.Name, [])}
                        onApply={action("on-apply")}
                    />
                </div>,
            );
        },
        /* {
            screenshots: {
                closed: {},
                opened: { clickSelector: ".s-product", postInteractionWait: LongPostInteractionTimeout },
                "select-all": {
                    clickSelectors: [".s-product", ".s-select_all"],
                    postInteractionWait: LongPostInteractionTimeout,
                },
            },
        },*/
    );