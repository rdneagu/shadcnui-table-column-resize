"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { createUser, User } from "@/lib/data";
import {
    Column,
    createColumnHelper,
    getSortedRowModel,
    SortingState,
} from "@tanstack/react-table";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { DefaultCell } from "@/components/default-cell";
import DefaultHeader from "@/components/default-header";
import HeaderButton from "@/components/header-button";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { defaultRangeExtractor, useVirtualizer } from "@tanstack/react-virtual";
import { MoreVertical } from "lucide-react";
import { CSSProperties, useCallback, useMemo, useRef, useState } from "react";
import { Range } from "@tanstack/virtual-core";

const columnHelper = createColumnHelper<User>();

const columns = [
    columnHelper.display({
        id: "action",
        header: ({ table }) => (
            <div className="h-full flex items-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="h-full flex items-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
    }),
    columnHelper.accessor("firstName", {
        header: (info) => <HeaderButton info={info} name="First Name" />,
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("lastName", {
        header: (info) => <HeaderButton info={info} name="Last Name" />,
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
        header: (info) => <HeaderButton info={info} name="Email" />,
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("age", {
        header: (info) => <HeaderButton info={info} name="Age" />,
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("comments", {
        header: (info) => <HeaderButton info={info} name="Comments" />,
        cell: (info) => info.getValue(),
    }),
    columnHelper.display({
        id: "more",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className=""
                        onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                        <DropdownMenuLabel className="">
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="">Copy</DropdownMenuItem>
                        <DropdownMenuItem>Paste</DropdownMenuItem>
                        <DropdownMenuItem>Cut</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableSorting: false,
        enableHiding: false,
        size: 50,
    }),
];

export default function Home() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-start p-10 gap-4 h-screen">
            <ModeToggle />
            <DataTable />
        </div>
    );
}

function DataTable() {
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const outerContainerRef = useRef<HTMLDivElement>(null);
    const [rowData] = useState(() => [...createUser(100)]);

    const table = useReactTable<User>({
        data: rowData,
        columns,
        columnResizeMode: "onChange",
        columnResizeDirection: "ltr",
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        enableColumnResizing: true,
        state: {
            rowSelection,
            sorting,
            columnPinning: {
                left: ["action", "firstName"],
                right: ["more"],
            },
        },
    });

    // Setup virtualization for rows
    const { rows } = table.getRowModel();
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 35, // estimate row height
        overscan: 10,
        rangeExtractor: useCallback((range: Range) => {
            const next = new Set([0, ...defaultRangeExtractor(range)]);
            return [...next].sort((a, b) => a - b);
        }, []),
    });
    const virtualRows = rowVirtualizer.getVirtualItems();

    return (
        <div className="h-full flex flex-col border border-border rounded-sm w-full overflow-auto">
            <div
                ref={tableContainerRef}
                style={{
                    height: `100%`,
                    width: "100%",
                    overflow: "auto",
                }}
            >
                <TableBody
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: "100%",
                        position: "relative",
                    }}
                >
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="flex w-full sticky z-10 bg-red-400 top-0 left-0 h-[35px]"
                        >
                            {headerGroup.headers.map((header) => (
                                <DefaultHeader
                                    key={header.column.id}
                                    header={header}
                                />
                            ))}
                        </TableRow>
                    ))}
                    {virtualRows.map((virtualItem) => {
                        const row = rows[virtualItem.index];
                        return (
                            <TableRow
                                key={virtualItem.key}
                                className="flex w-full items-center"
                                style={{
                                    position: "absolute",
                                    transform: `translateY(${
                                        virtualItem.start + 35
                                    }px)`,
                                    top: 0,
                                    left: 0,
                                    height: `${virtualItem.size}px`,
                                }}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <DefaultCell key={cell.id} cell={cell} />
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </div>
        </div>
    );

    // // Shared table props to ensure consistent rendering
    // const tableProps = {
    //     style: {
    //         width: `${totalTableWidth}px`,
    //         tableLayout: "fixed" as const,
    //     },
    // };

    // return (
    //     <>
    //         <div
    //             className="flex flex-col border border-border rounded-sm"
    //             style={{
    //                 maxWidth: "100%",
    //                 overflow: "auto",
    //             }}
    //             ref={outerContainerRef}
    //         >
    //             <div
    //                 style={{
    //                     width: Math.max(totalTableWidth + 10, 100) + "px",
    //                 }}
    //             >
    //                 {/* Header Table */}
    //                 <div className="overflow-hidden">
    //                     <Table {...tableProps}>
    //                         <TableHeader>
    //                             {table.getHeaderGroups().map((headerGroup) => (
    //                                 <TableRow
    //                                     key={headerGroup.id}
    //                                     className="flex w-full"
    //                                 >
    //                                     {headerGroup.headers.map((header) => (
    //                                         <DefaultHeader
    //                                             key={header.column.id}
    //                                             header={header}
    //                                         />
    //                                     ))}
    //                                 </TableRow>
    //                             ))}
    //                         </TableHeader>
    //                     </Table>
    //                 </div>

    //                 {/* Body Table - only vertical scrolling */}
    //                 <div
    //                     ref={tableContainerRef}
    //                     style={{
    //                         width: Math.max(totalTableWidth + 10, 100) + "px",
    //                         height: `400px`,
    //                         overflowY: "auto",
    //                         overflowX: "hidden", // Prevent horizontal scrolling in the body
    //                     }}
    //                     onWheel={(e) => {
    //                         // If this is a horizontal scroll attempt, let the parent handle it
    //                         if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    //                             e.stopPropagation();
    //                             if (outerContainerRef.current) {
    //                                 outerContainerRef.current.scrollLeft +=
    //                                     e.deltaX;
    //                             }
    //                         }
    //                     }}
    //                 >
    //                     <Table {...tableProps}>
    //                         <TableBody
    //                             style={{
    //                                 height: `${rowVirtualizer.getTotalSize()}px`,
    //                                 width: "100%",
    //                                 position: "relative",
    //                             }}
    //                         >
    //                             {virtualRows.map((virtualItem) => {
    //                                 const row = rows[virtualItem.index];
    //                                 return (
    //                                     <TableRow
    //                                         key={virtualItem.key}
    //                                         className="flex w-full items-center"
    //                                         style={{
    //                                             ...(virtualItem.index === 0
    //                                                 ? {
    //                                                       position: "sticky",
    //                                                       zIndex: 1,
    //                                                       backgroundColor:
    //                                                           "red",
    //                                                   }
    //                                                 : {
    //                                                       position: "absolute",
    //                                                       transform: `translateY(${virtualItem.start}px)`,
    //                                                   }),
    //                                             top: 0,
    //                                             left: 0,
    //                                             height: `${virtualItem.size}px`,
    //                                         }}
    //                                         data-state={
    //                                             row.getIsSelected() &&
    //                                             "selected"
    //                                         }
    //                                     >
    //                                         {row
    //                                             .getVisibleCells()
    //                                             .map((cell) => (
    //                                                 <DefaultCell
    //                                                     key={cell.id}
    //                                                     cell={cell}
    //                                                 />
    //                                             ))}
    //                                     </TableRow>
    //                                 );
    //                             })}
    //                         </TableBody>
    //                     </Table>
    //                 </div>
    //             </div>
    //         </div>
    //         <div className="flex-1 text-sm text-muted-foregroundd">
    //             {table.getSelectedRowModel().rows.length} of{" "}
    //             {table.getFilteredRowModel().rows.length} rows slected
    //         </div>
    //     </>
    // );
}
