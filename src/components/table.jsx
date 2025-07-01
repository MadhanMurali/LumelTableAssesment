import styled from "styled-components";
import { GrandTotalRow, HeaderRow, Row } from "./row";

const TableStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(6, minmax(100px, 1fr));
    grid-auto-rows: minmax(50px, auto);
`;
TableStyled.displayName = "TableStyled";

export const Table = (props) => {
    let total = 0;

    return (
        <TableStyled>
            <HeaderRow />
            {props.rows.map((row, index) => {
                total += row.value;
                return (
                    <Row
                        key={row.id}
                        rowPath={String(index)}
                        data={row}
                        handleTableState={props.handleTableState}
                    />
                );
            })}
            <GrandTotalRow total={total} />
        </TableStyled>
    );
};
