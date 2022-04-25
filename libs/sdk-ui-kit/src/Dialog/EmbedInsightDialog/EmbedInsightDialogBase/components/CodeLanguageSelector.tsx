// (C) 2022 GoodData Corporation
import React, { ChangeEvent, useCallback } from "react";
import { CodeLanguageType } from "../EmbedInsightDialogBase";

/**
 * @internal
 */
export interface ICodeLanguageSelectorProps {
    selectedLanguage: CodeLanguageType;
    onLanguageChanged: (language: CodeLanguageType) => void;
}

/**
 * @internal
 */
export const CodeLanguageSelector: React.VFC<ICodeLanguageSelectorProps> = (props) => {
    const { selectedLanguage, onLanguageChanged } = props;

    const onCheck = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value as CodeLanguageType;
            onLanguageChanged(value);
        },
        [onLanguageChanged],
    );

    return (
        <div className="embed-insight-dialog-lang-selector">
            <strong className="bottom-space">Code as </strong>
            <label className="input-radio-label bottom-space s-language-ts">
                <input
                    type="radio"
                    className="input-radio"
                    value={"ts"}
                    checked={selectedLanguage === "ts"}
                    onChange={onCheck}
                />
                <span className="input-label-text">TypeScript</span>
            </label>
            <label className="input-radio-label bottom-space s-language-js">
                <input
                    type="radio"
                    className="input-radio"
                    value={"js"}
                    checked={selectedLanguage === "js"}
                    onChange={onCheck}
                />
                <span className="input-label-text">JavaScript</span>
            </label>
        </div>
    );
};
