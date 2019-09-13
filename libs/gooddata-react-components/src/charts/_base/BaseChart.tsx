// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import { ErrorStates } from "../../index";
import { generateErrorMap, IErrorMap } from "../../base/helpers/errorHandlers";
import { withEntireDataView } from "../NewLoadingHOC";
import { ILoadingInjectedProps, defaultCommonVisProps, IBaseChartProps } from "../chartProps";
import { IErrorProps } from "../../base/simple/ErrorComponent";
import { ILoadingProps } from "../../base/simple/LoadingComponent";
import noop = require("lodash/noop");

import { Visualization } from "../../highcharts/Visualization";

import { IntlWrapper } from "../../base/translations/IntlWrapper";
import {
    IntlTranslationsProvider,
    ITranslationsComponentProps,
} from "../../base/translations/TranslationsProvider";
import { fixEmptyHeaderItems2 } from "./utils/fixEmptyHeaderItems";
import { getValidColorPalette2 } from "../../highcharts/utils/color";

type Props = IBaseChartProps & ILoadingInjectedProps;

class StatelessBaseChart extends React.Component<Props, {}> {
    public static defaultProps: Partial<Props> = {
        ...defaultCommonVisProps,
        onDataTooLarge: noop,
        onLegendReady: noop,
        config: {},
        visualizationComponent: Visualization,
    };

    private errorMap: IErrorMap;

    constructor(props: Props) {
        super(props);

        this.errorMap = generateErrorMap(props.intl);
    }

    public render(): JSX.Element {
        const { dataView, error, isLoading } = this.props;

        const ErrorComponent = this.props.ErrorComponent as React.ComponentType<IErrorProps>;
        const LoadingComponent = this.props.LoadingComponent as React.ComponentType<ILoadingProps>;

        if (error) {
            const errorProps = this.errorMap[
                this.errorMap.hasOwnProperty(error) ? error : ErrorStates.UNKNOWN_ERROR
            ];
            return ErrorComponent ? <ErrorComponent code={error} {...errorProps} /> : null;
        }

        // when in pageble mode (getPage present) never show loading (its handled by the component)
        if (isLoading || !dataView) {
            return LoadingComponent ? <LoadingComponent /> : null;
        }

        return this.renderVisualization();
    }

    public renderVisualization(): JSX.Element {
        const { afterRender, height, locale, config, type, dataView, onDataTooLarge, pushData } = this.props;
        const colorPalette = getValidColorPalette2(config);
        const fullConfig = { ...config, type, colorPalette };

        return (
            <IntlWrapper locale={locale}>
                <IntlTranslationsProvider>
                    {(translationProps: ITranslationsComponentProps) => {
                        // TODO: SDK8: this is evil; mutating the items of readonly array; need to find a conceptual way to do this
                        fixEmptyHeaderItems2(dataView, translationProps.emptyHeaderString);

                        return (
                            <this.props.visualizationComponent
                                locale={locale}
                                dataView={dataView}
                                height={height}
                                config={fullConfig}
                                numericSymbols={translationProps.numericSymbols}
                                drillableItems={this.props.drillableItems}
                                afterRender={afterRender}
                                onDataTooLarge={onDataTooLarge}
                                onNegativeValues={this.props.onNegativeValues}
                                onFiredDrillEvent={this.props.onFiredDrillEvent}
                                onLegendReady={this.props.onLegendReady}
                                pushData={pushData}
                            />
                        );
                    }}
                </IntlTranslationsProvider>
            </IntlWrapper>
        );
    }
}

export const BaseChart = withEntireDataView(StatelessBaseChart);
