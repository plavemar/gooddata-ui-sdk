// (C) 2020 GoodData Corporation
import React, { useState } from "react";
import Button from "@gooddata/goodstrap/lib/Button/Button";
import BubbleHoverTrigger from "@gooddata/goodstrap/lib/Bubble/BubbleHoverTrigger";
import Bubble from "@gooddata/goodstrap/lib/Bubble/Bubble";
import { ObjRefInScope, areObjRefsEqual } from "@gooddata/sdk-model";
import cx from "classnames";
import { IAttributeDropdownItem, ICustomGranularitySelection } from "../types";
import { AttributeDropdownBody } from "./AttributeDropdownBody";
import { IntlShape, WrappedComponentProps, injectIntl, FormattedMessage } from "react-intl";

const getItemTitle = (selectedItem: IAttributeDropdownItem, intl: IntlShape): string =>
    selectedItem ? selectedItem.title : intl.formatMessage({ id: "rankingFilter.allRecords" });

const getItemIcon = (selectedItem: IAttributeDropdownItem): string => {
    if (selectedItem) {
        return selectedItem.type === "DATE" ? "icon-date" : "icon-attribute";
    } else {
        return null;
    }
};

interface IAttributeDropdownComponentProps {
    items: IAttributeDropdownItem[];
    selectedItemRef: ObjRefInScope;
    onSelect: (ref?: ObjRefInScope) => void;
    onDropDownItemMouseOver?: (ref: ObjRefInScope) => void;
    onDropDownItemMouseOut?: () => void;
    customGranularitySelection?: ICustomGranularitySelection;
}

type AttributeDropdownProps = IAttributeDropdownComponentProps & WrappedComponentProps;

const AttributeDropdownComponent: React.FC<AttributeDropdownProps> = ({
    items,
    selectedItemRef,
    onSelect,
    onDropDownItemMouseOver,
    onDropDownItemMouseOut,
    customGranularitySelection,
    intl,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const isDisabled = items.length === 1;

    const onButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const onItemSelect = (ref: ObjRefInScope) => {
        onSelect(ref);
        setIsOpen(false);
        onDropDownItemMouseOut && onDropDownItemMouseOut();
    };

    const buttonClassNames = cx(
        "gd-button-secondary",
        "gd-button-small",
        "button-dropdown",
        "icon-right",
        {
            "icon-navigateup": isOpen,
            "icon-navigatedown": !isOpen,
        },
        "gd-rf-attribute-dropdown-button",
        "s-rf-attribute-dropdown-button",
    );

    const selectedAttributeItem = items.find((item) => areObjRefsEqual(item.ref, selectedItemRef));
    const itemTitle = getItemTitle(selectedAttributeItem, intl);

    return isDisabled ? (
        <BubbleHoverTrigger showDelay={0} hideDelay={0}>
            <Button className={buttonClassNames} value={itemTitle} disabled={true} />
            <Bubble
                className={`bubble-primary gd-rf-tooltip-bubble s-rf-attribute-no-options-bubble`}
                alignPoints={[{ align: "cr cl" }, { align: "cl cr" }]}
            >
                <FormattedMessage id="rankingFilter.attributeDropdown.oneAttributeTooltip" />
            </Bubble>
        </BubbleHoverTrigger>
    ) : (
        <>
            <Button
                className={buttonClassNames}
                value={itemTitle}
                onClick={onButtonClick}
                iconLeft={getItemIcon(selectedAttributeItem)}
            />
            {isOpen && (
                <AttributeDropdownBody
                    items={items}
                    selectedItemRef={selectedItemRef}
                    onSelect={onItemSelect}
                    onClose={() => setIsOpen(false)}
                    onDropDownItemMouseOver={onDropDownItemMouseOver}
                    onDropDownItemMouseOut={onDropDownItemMouseOut}
                    customGranularitySelection={customGranularitySelection}
                />
            )}
        </>
    );
};

export const AttributeDropdown = injectIntl(AttributeDropdownComponent);
