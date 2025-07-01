import { useRef, useState } from "react";
import { ButtonCell, LabelCell, NumberInputCell, TextCell } from "./cell";

export const Row = (props) => {
    const { rowPath, data, handleTableState } = props;
    const rowValue = data.value;

    const originalValue = useRef(rowValue);
    const variance = useRef(0);
    const [inputValue, setInputValue] = useState(undefined);

    if (originalValue.current !== rowValue) {
        if (originalValue.current === 0) {
            variance.current = 100;
        } else {
            variance.current =
                ((rowValue - originalValue.current) / originalValue.current) *
                100;
        }
    }

    const handleAbsoluteValueUpdate = () => {
        if (Number.isFinite(inputValue)) {
            handleTableState(rowPath, inputValue, "absolute");
        }
        setInputValue(undefined);
    };

    const handlePercentageValueUpdate = () => {
        if (Number.isFinite(inputValue)) {
            handleTableState(rowPath, inputValue, "percentage");
        }
        setInputValue(undefined);
    };

    const rowUI = (
        <>
            <LabelCell rowPath={rowPath}>{data.label}</LabelCell>
            <TextCell>{rowValue}</TextCell>
            <NumberInputCell value={inputValue} onChange={setInputValue} />
            <ButtonCell onClick={handlePercentageValueUpdate}>
                Allocation %
            </ButtonCell>
            <ButtonCell onClick={handleAbsoluteValueUpdate}>
                Allocation Val
            </ButtonCell>
            <TextCell>{variance.current}</TextCell>
        </>
    );

    const childrenUI =
        data.children &&
        data.children.map((childData, index) => {
            return (
                <Row
                    key={childData.id}
                    rowPath={rowPath + "," + index}
                    data={childData}
                    handleTableState={handleTableState}
                />
            );
        });

    return (
        <>
            {rowUI}
            {childrenUI}
        </>
    );
};

export const HeaderRow = () => {
    return (
        <>
            <TextCell>Label</TextCell>
            <TextCell>Value</TextCell>
            <TextCell>Input</TextCell>
            <TextCell>Allocation %</TextCell>
            <TextCell>Allocation Val</TextCell>
            <TextCell>Variance %</TextCell>
        </>
    );
};

export const GrandTotalRow = (props) => {
    return (
        <>
            <TextCell>Grand Total</TextCell>
            <TextCell>{props.total}</TextCell>
            <TextCell></TextCell>
            <TextCell></TextCell>
            <TextCell></TextCell>
            <TextCell></TextCell>
        </>
    );
};
