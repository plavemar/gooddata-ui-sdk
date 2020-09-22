// (C) 2020 GoodData Corporation
import React from "react";
import { mount } from "enzyme";
import noop from "lodash/noop";
import { withIntl } from "@gooddata/sdk-ui";
import { RankingFilterDropdownFragment } from "./fragments/RankingFilterDropdown";
import {
    IRankingFilterDropdownProps,
    RankingFilterDropdown,
    prepareRankingFilterState,
} from "../RankingFilterDropdown";

import * as Mock from "./mocks";

const renderComponent = (props?: Partial<IRankingFilterDropdownProps>) => {
    const defaultProps: IRankingFilterDropdownProps = {
        measureItems: Mock.measureItems,
        attributeItems: Mock.attributeItems,
        filter: Mock.defaultFilter,
        onApply: noop,
        onCancel: noop,
    };
    const Wrapped = withIntl(RankingFilterDropdown);
    return new RankingFilterDropdownFragment(mount(<Wrapped {...defaultProps} {...props} />));
};

describe("RankingFilterDropdown", () => {
    describe("prepareRankingFilterState", () => {
        it("should return object without attributes when attributes not provided", () => {
            const result = prepareRankingFilterState(Mock.defaultFilter);

            expect(result).toEqual({
                rankingFilter: {
                    measure: Mock.measure1Ref,
                    operator: "TOP",
                    value: 10,
                },
            });
        });

        it("should return object with first attribute when attributes provided", () => {
            const result = prepareRankingFilterState(Mock.filterWithRichSetting);

            expect(result).toEqual({
                rankingFilter: {
                    measure: Mock.measure3Ref,
                    attributes: [Mock.attribute1Ref],
                    operator: "BOTTOM",
                    value: 100,
                },
            });
        });
    });

    describe("Filter", () => {
        it("should set correct OperatorDropdown value", () => {
            const component = renderComponent({ filter: Mock.filterWithRichSetting });

            expect(component.getOperator()).toEqual("Bottom");
        });

        it("should set correct ValueDropdown value", () => {
            const component = renderComponent({ filter: Mock.filterWithRichSetting });

            expect(component.getValue()).toEqual("100");
        });

        it("should set MeasureDropdown to first measure", () => {
            const component = renderComponent({ filter: Mock.filterWithRichSetting });

            expect(component.getMeasure()).toEqual("Measure 3");
        });

        it("should set AttributeDropdown to first attribute", () => {
            const component = renderComponent({ filter: Mock.filterWithRichSetting });

            expect(component.getAttribute()).toEqual("Attribute 1");
        });

        it("should set AttributeDropdown to 'All' when no attributes provided", () => {
            const component = renderComponent({ filter: Mock.defaultFilter });

            expect(component.getAttribute()).toEqual("All");
        });
    });

    describe("Buttons", () => {
        it("should toggle apply button disabled class when operator changed", () => {
            const component = renderComponent();

            expect(component.isApplyButtonDisabled()).toEqual(true);
            component.openOperatorDropdown().setOperator("BOTTOM");
            expect(component.isApplyButtonDisabled()).toEqual(false);
        });

        it("should toggle apply button disabled class when value changed", () => {
            const component = renderComponent();

            expect(component.isApplyButtonDisabled()).toEqual(true);
            component.setValue("100");
            expect(component.isApplyButtonDisabled()).toEqual(false);
        });

        it("should toggle apply button disabled class when measure changed", () => {
            const component = renderComponent();

            expect(component.isApplyButtonDisabled()).toEqual(true);
            component.openMeasureDropdown().setMeasureItem("Measure 2");
            expect(component.isApplyButtonDisabled()).toEqual(false);
        });

        it("should toggle apply button disabled class when attribute changed", () => {
            const component = renderComponent();

            expect(component.isApplyButtonDisabled()).toEqual(true);
            component.openAttributeDropdown().setAttributeItem("Attribute 2");
            expect(component.isApplyButtonDisabled()).toEqual(false);
        });

        it("should call onApply with attributes when Apply button clicked", () => {
            const onApply = jest.fn();
            const component = renderComponent({ onApply });

            component.openOperatorDropdown().setOperator("BOTTOM");
            component.setValue("100");
            component.openMeasureDropdown().setMeasureItem("Measure 3");
            component.openAttributeDropdown().setAttributeItem("Attribute 2");
            component.clickApply();

            expect(onApply).toHaveBeenCalledWith({
                rankingFilter: {
                    measure: Mock.measure3Ref,
                    attributes: [Mock.attribute2Ref],
                    operator: "BOTTOM",
                    value: 100,
                },
            });
        });

        it("should call onApply without attributes when Apply button clicked", () => {
            const onApply = jest.fn();
            const component = renderComponent({ onApply });

            component.openOperatorDropdown().setOperator("BOTTOM");
            component.setValue("100");
            component.openMeasureDropdown().setMeasureItem("Measure 3");
            component.openAttributeDropdown().setAttributeToAllRecords();
            component.clickApply();

            expect(onApply).toHaveBeenCalledWith({
                rankingFilter: {
                    measure: Mock.measure3Ref,
                    operator: "BOTTOM",
                    value: 100,
                },
            });
        });

        it("should call onCancel when Cancel button clicked", () => {
            const onCancel = jest.fn();
            const component = renderComponent({ onCancel });

            component.clickCancel();

            expect(onCancel).toHaveBeenCalled();
        });
    });

    describe("AttributeDropdown", () => {
        it("should call onDropDownItemMouseOver on item mouseOver", () => {
            const onDropDownItemMouseOver = jest.fn();
            const component = renderComponent({ onDropDownItemMouseOver });

            component.openAttributeDropdown().getAttributeItem("Attribute 1").simulate("mouseOver");

            expect(onDropDownItemMouseOver).toHaveBeenCalled();
            expect(onDropDownItemMouseOver).toHaveBeenCalledWith({ uri: "attribute1" });
        });

        it("should call onDropDownItemMouseOut on item mouseOut", () => {
            const onDropDownItemMouseOut = jest.fn();
            const component = renderComponent({ onDropDownItemMouseOut });

            component.openAttributeDropdown().getAttributeItem("Attribute 1").simulate("mouseOut");

            expect(onDropDownItemMouseOut).toHaveBeenCalled();
        });

        it("should call onDropDownItemMouseOut on dropdown close", () => {
            const onDropDownItemMouseOut = jest.fn();
            const component = renderComponent({ onDropDownItemMouseOut });

            component.openAttributeDropdown().setAttributeItem("Attribute 2");

            expect(onDropDownItemMouseOut).toHaveBeenCalled();
        });

        it("should not have disabled items when customGranuralitySelection is not provided", () => {
            const component = renderComponent();

            component.openAttributeDropdown();

            expect(component.getAttributeDropdownBody().find("button.disabled")).toHaveLength(0);
        });

        it("should not have disabled items when customGranularitySelection 'enable' property is true", () => {
            const customGranularitySelection = { enable: true, warningMessage: "warning" };
            const component = renderComponent({ customGranularitySelection });

            component.openAttributeDropdown();

            expect(component.getAttributeDropdownBody().find("button.disabled")).toHaveLength(0);
        });

        it("should have disabled items when customGranularitySelection 'enable' property is false", () => {
            const customGranularitySelection = { enable: false, warningMessage: "warning" };
            const component = renderComponent({ customGranularitySelection });

            component.openAttributeDropdown();

            expect(component.getAttributeDropdownBody().find("button.disabled")).toHaveLength(5);
        });
    });

    describe("MeasureDropdown", () => {
        it("should call onDropDownItemMouseOver on item mouseOver", () => {
            const onDropDownItemMouseOver = jest.fn();
            const component = renderComponent({ onDropDownItemMouseOver });

            component.openMeasureDropdown().getMeasureItem("Measure 1").simulate("mouseOver");

            expect(onDropDownItemMouseOver).toHaveBeenCalled();
            expect(onDropDownItemMouseOver).toHaveBeenCalledWith({ localIdentifier: "measure1" });
        });

        it("should call onDropDownItemMouseOut on item mouseOut", () => {
            const onDropDownItemMouseOut = jest.fn();
            const component = renderComponent({ onDropDownItemMouseOut });

            component.openMeasureDropdown().getMeasureItem("Measure 1").simulate("mouseOut");

            expect(onDropDownItemMouseOut).toHaveBeenCalled();
        });

        it("should call onDropDownItemMouseOut on dropdown close", () => {
            const onDropDownItemMouseOut = jest.fn();
            const component = renderComponent({ onDropDownItemMouseOut });

            component.openMeasureDropdown().setMeasureItem("Measure 2");

            expect(onDropDownItemMouseOut).toHaveBeenCalled();
        });
    });

    describe("ValueDropdown", () => {
        it("should render 8 default items when input value is empty", () => {
            const component = renderComponent();

            component.changeInputValue("");

            expect(component.getValueDropdown().find(".s-rf-value-dropdown-item").hostNodes()).toHaveLength(
                8,
            );
        });

        it("should render list item with input value as text", () => {
            const component = renderComponent();

            component.changeInputValue("100");

            expect(component.getValueDropdown().text()).toEqual("100");
        });

        it("should render error message when input value lower than 1", () => {
            const component = renderComponent();

            component.changeInputValue("-100");

            expect(component.getValueDropdown().text()).toEqual("Input value should be a positive number.");
        });

        it("should render error message when input value larger than 999999", () => {
            const component = renderComponent();

            component.changeInputValue("1000000");

            expect(component.getValueDropdown().text()).toEqual("Input value too large.");
        });

        it("should render error message when input value is string without numbers", () => {
            const component = renderComponent();

            component.changeInputValue("test");

            expect(component.getValueDropdown().text()).toEqual("No match found.");
        });
    });

    describe("AttributeDropdown button", () => {
        it("should be disabled when only one attribute item provided", () => {
            const component = renderComponent({ attributeItems: [Mock.attributeItems[0]] });

            expect(component.isAttributeButtonDisabled()).toEqual(true);
        });
    });
});
