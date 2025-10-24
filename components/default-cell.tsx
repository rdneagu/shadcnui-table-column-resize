import { Cell, Column, flexRender } from "@tanstack/react-table";
import { getCommonPinningStyles, TableCell } from "./ui/table";

export function DefaultCell<TData>({ cell }: { cell: Cell<TData, unknown> }) {
    return (
        <TableCell
            key={cell.id}
            style={{
                width: cell.column.getSize(),
                flex: `0 0 ${cell.column.getSize()}px`,
                ...getCommonPinningStyles(
                    cell.column as Column<unknown, unknown>
                ),
            }}
        >
            <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full block">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </span>
        </TableCell>
    );
}
