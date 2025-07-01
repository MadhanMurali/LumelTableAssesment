import { createGlobalStyle } from "styled-components";
import { Table } from "./components/table";
import { useState } from "react";
import { INITIAL_TABLE_DATA } from "./constants";
import { produce } from "immer";

const GlobalStyles = createGlobalStyle`
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    * {
        margin: 0;
        padding: 0;
    }

    body {
        -webkit-font-smoothing: antialiased;
    }

    input,
    button,
    textarea,
    select {
        font: inherit;
    }

    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        overflow-wrap: break-word;
    }

    .pt-sans-regular {
        font-family: "PT Sans", sans-serif;
        font-weight: 400;
        font-style: normal;
    }

    .pt-sans-bold {
        font-family: "PT Sans", sans-serif;
        font-weight: 700;
        font-style: normal;
    }

    .pt-sans-regular-italic {
        font-family: "PT Sans", sans-serif;
        font-weight: 400;
        font-style: italic;
    }

    .pt-sans-bold-italic {
        font-family: "PT Sans", sans-serif;
        font-weight: 700;
        font-style: italic;
    }
`;

const App = () => {
    const [tableState, setTableState] = useState(() =>
        structuredClone(INITIAL_TABLE_DATA),
    );

    const updateTableState = produce(
        (state, { value, updatePath = "", mode = "absolute" }) => {
            // mode: absolute, percentage
            // updatePath: e.g., "0,1,1"

            updatePath = updatePath.split(",");
            if (!updatePath.length) {
                return;
            }

            let visitedRows = [];
            let currentRow = state.rows;

            for (const index of updatePath) {
                if (currentRow === state.rows) {
                    currentRow = currentRow[Number(index)];
                } else {
                    currentRow = currentRow.children[Number(index)];
                }
                visitedRows.push(currentRow);
            }

            const targetRow = visitedRows.pop();
            let targetRowPrevValue = targetRow.value;
            if (mode === "absolute") {
                targetRow.value = value;
            } else {
                targetRow.value =
                    targetRowPrevValue + targetRowPrevValue * (value / 100);
            }

            const updateChildren = (row, rowPrevValue) => {
                if (!row.children) {
                    return;
                }

                for (const child of row.children) {
                    const prevChildValue = child.value;
                    const contributionRatio = child.value / rowPrevValue;
                    child.value = row.value * contributionRatio;

                    updateChildren(child, prevChildValue);
                }
            };
            updateChildren(targetRow, targetRowPrevValue);

            const changeInValue = targetRow.value - targetRowPrevValue;
            let parentRow = visitedRows.pop();
            while (parentRow) {
                parentRow.value = parentRow.value + changeInValue;
                parentRow = visitedRows.pop();
            }
        },
    );

    const handleTableState = (updatePath, value, mode = "absolute") => {
        setTableState(
            updateTableState(tableState, { updatePath, value, mode }),
        );
    };

    return (
        <>
            <GlobalStyles />
            <Table
                rows={tableState.rows}
                handleTableState={handleTableState}
            ></Table>
        </>
    );
};

export default App;
