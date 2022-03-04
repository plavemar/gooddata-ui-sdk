// (C) 2022 GoodData Corporation
import * as Navigation from "../../tools/navigation";
import { Table } from "../../tools/table";

const nonEmptyValue = /\$?[0-9,.]+/;

describe("Pivot Table Aggregations menu", () => {
    beforeEach(() => {
        cy.login();
        Navigation.visit("visualizations/pivot-table/pivot-table-aggregations-menu");
    });

    const clickAggregationMenu = (element: Cypress.Chainable<JQuery<HTMLElement>>) => {
        element
            .trigger("mouseover")
            .wait(100)
            .find(".gd-menuOpenedByClick-togglerWrapped")
            .click({ force: true })
            .wait(300);

        cy.get(".s-menu-aggregation-inner").first().click();

        cy.wait(1000);
    };

    it("should show menu toggler button when mouse hovers over the cell", () => {
        const table = new Table(".s-pivot-table-aggregations-menu");
        table.waitLoaded();

        // get first menu
        table
            .getMeasureCellHeader(0)
            .first()
            .trigger("mouseover")
            .find(".s-table-header-menu")
            .should("exist")
            .should("have.class", "gd-pivot-table-header-menu--show");

        cy.wait(100);

        // get second menu
        table
            .getMeasureGroupCell(0)
            .eq(1)
            .trigger("mouseover")
            .find(".s-table-header-menu")
            .should("exist")
            .should("have.class", "gd-pivot-table-header-menu--show");

        cy.wait(100);

        //check is first menu is hidden
        table
            .getMeasureCellHeader(0)
            .first()
            .find(".s-table-header-menu")
            .should("exist")
            .should("have.class", "gd-pivot-table-header-menu--hide");
    });

    it("hovering over menu does not show sorting icon", () => {
        const table = new Table(".s-pivot-table-aggregations-menu");
        table.waitLoaded();

        table
            .getMeasureCellHeader(0)
            .first()
            .trigger("mouseover")
            .find(".s-table-header-menu")
            .should("exist")
            .should("have.class", "gd-pivot-table-header-menu--show");

        table.getMeasureCellHeader(0).find(".s-sort-direction-arrow").should("not.exist");
    });

    it("should add totals for one measure and then turn it off", () => {
        const table = new Table(".s-pivot-table-aggregations-menu");
        table.waitLoaded();

        const element = table.getMeasureCellHeader(0).eq(2);
        clickAggregationMenu(element);

        table.waitRowLoaded();

        table.getPivotTableFooterCell(0, 0).contains("Sum");

        table.getPivotTableFooterCell(0, 2).then(function ($elem) {
            cy.wrap($elem.text()).should("match", nonEmptyValue);
        });

        table.getPivotTableFooterCell(0, 3).then(function ($elem) {
            cy.wrap($elem.text()).should("not.match", nonEmptyValue);
        });

        table.waitRowLoaded();

        table.getPivotTableFooterCell(1, 0).should("not.exist");
    });

    it("should add totals for all measures and then turn them off", () => {
        const table = new Table(".s-pivot-table-aggregations-menu");
        table.waitLoaded();

        const element = table.getMeasureGroupCell(0).eq(0);
        clickAggregationMenu(element);

        table.waitRowLoaded();

        table.getPivotTableFooterCell(0, 0).contains("Sum");

        table.getPivotTableFooterCell(0, 2).then(function ($elem) {
            cy.wrap($elem.text()).should("match", nonEmptyValue);
        });

        table.getPivotTableFooterCell(0, 3).then(function ($elem) {
            cy.wrap($elem.text()).should("match", nonEmptyValue);
        });

        const element2 = table.getMeasureGroupCell(0).eq(0);
        clickAggregationMenu(element2);

        table.waitRowLoaded();

        table.getPivotTableFooterCell(0, 0).should("not.exist");
    });

    it("should add totals for group and then turn them all off with individual measures", () => {
        const table = new Table(".s-pivot-table-aggregations-menu");
        table.waitLoaded();

        const element = table.getMeasureGroupCell(0).eq(0);
        clickAggregationMenu(element);

        table.waitRowLoaded();

        table.getPivotTableFooterCell(0, 0).contains("Sum");

        table.getPivotTableFooterCell(0, 2).then(function ($elem) {
            cy.wrap($elem.text()).should("match", nonEmptyValue);
        });

        table.getPivotTableFooterCell(0, 3).then(function ($elem) {
            cy.wrap($elem.text()).should("match", nonEmptyValue);
        });

        const element1 = table.getMeasureCellHeader(0).eq(3);
        clickAggregationMenu(element1);

        table.waitRowLoaded();

        const element2 = table.getMeasureCellHeader(1).eq(3);
        clickAggregationMenu(element2);

        table.waitRowLoaded();

        table.getPivotTableFooterCell(0, 0).should("not.exist");
    });
});
