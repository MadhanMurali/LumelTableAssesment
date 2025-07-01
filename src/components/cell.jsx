import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

const CellStyled = styled.div`
    width: 100%;
    height: 100%;

    font-family: "PT Sans", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 30px;
    line-height: 1.13;

    padding: 5px;
    border: 1px solid black;

    input {
        width: 100%;
        height: 100%;
        border: none;
    }
`;
CellStyled.displayName = "CellStyled";

const Button = styled.button`
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 10px;
`;
Button.displayName = "Button";

export const NumberInputCell = (props) => {
    // NOTE: Internal state can be handled better or removed altogether with proper validation but due to time constraints I have went with this
    const propsValue = props.value;
    const [value, setValue] = useState(String(propsValue || ""));

    const inputRef = useRef(null);

    useEffect(() => {
        setValue(String(propsValue || ""));
    }, [propsValue]);

    const onChange = (event) => {
        const value = Number(event.target.value);
        if (Number.isFinite(value) && props.onChange) {
            props.onChange(value, event);
        }
        setValue(event.target.value);
    };

    const onBlur = (event) => {
        const value = Number(inputRef.current.value);
        if (Number.isFinite(value) && props.onChange) {
            setValue(String(value));
            props.onChange(value, event);
        } else {
            setValue(String(propsValue || ""));
        }
    };

    return (
        <CellStyled>
            <input
                ref={inputRef}
                className=""
                type="text"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            />
        </CellStyled>
    );
};

export const ButtonCell = (props) => {
    return (
        <CellStyled>
            <Button onClick={props.onClick}>{props.children || "aaa"}</Button>
        </CellStyled>
    );
};

export const TextCell = (props) => {
    return <CellStyled>{props.children}</CellStyled>;
};

export const VarienceCell = (props) => {
    return <TextCell>{props.children} %</TextCell>;
};

export const LabelCell = (props) => {
    const { rowPath } = props;

    const hyphens = useMemo(() => {
        const level = rowPath.split(",").length - 1;
        let hyphens = "";
        for (let i = 0; i < level; i += 1) {
            hyphens += "--";
        }
        return hyphens;
    }, [rowPath]);

    return (
        <TextCell>
            {hyphens} {props.children}
        </TextCell>
    );
};
