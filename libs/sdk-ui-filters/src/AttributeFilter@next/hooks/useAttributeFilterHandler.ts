// (C) 2022 GoodData Corporation
import { useEffect, useRef, useState, useCallback } from "react";
import isEqual from "lodash/isEqual";
import { usePrevious } from "@gooddata/sdk-ui";
import { filterObjRef, IAttributeElement, IAttributeFilter } from "@gooddata/sdk-model";

import { IMultiSelectAttributeFilterHandler, newAttributeFilterHandler } from "../../AttributeFilterHandler";
import { IAnalyticalBackend } from "@gooddata/sdk-backend-spi";

/**
 * @alpha
 */
export interface IUseAttributeFilterHandlerProps {
    backend: IAnalyticalBackend;
    workspace: string;

    filter: IAttributeFilter;

    hiddenElements?: string[];
    staticElements?: IAttributeElement[];
}

/**
 * @alpha
 */
export const useAttributeFilterHandler = (props: IUseAttributeFilterHandlerProps) => {
    const {
        backend,
        workspace,

        filter,

        hiddenElements,
        staticElements,
    } = props;

    const [, setInvalidate] = useState(0);

    const invalidate = () => {
        setInvalidate((s) => s + 1);
    };

    const handlerRef = useRef<IMultiSelectAttributeFilterHandler>();

    const createNewHandler = useCallback(() => {
        handlerRef.current = newAttributeFilterHandler(backend, workspace, filter, {
            selectionMode: "multi",
            hiddenElements,
            staticElements,
        });
    }, [backend, workspace, filter, hiddenElements, staticElements]);

    if (!handlerRef.current) {
        createNewHandler();
    }

    const handler = handlerRef.current;

    const prevProps = usePrevious(props);

    useEffect(() => {
        const unsubscribe = handler.onUpdate(() => {
            invalidate();
        });

        if (
            backend !== prevProps.backend ||
            workspace !== prevProps.workspace ||
            !isEqual(filterObjRef(filter), filterObjRef(handler.getFilter())) ||
            !isEqual(staticElements, prevProps.staticElements) ||
            !isEqual(hiddenElements, prevProps.hiddenElements)
        ) {
            createNewHandler();
            invalidate();
        }

        return () => {
            unsubscribe();
        };
    }, [backend, workspace, filter, staticElements, hiddenElements, prevProps, handler, createNewHandler]);

    return handler;
};
