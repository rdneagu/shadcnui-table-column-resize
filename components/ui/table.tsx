"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";

const getCommonPinningStyles = (
    column: Column<unknown, unknown>
): React.CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
        isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn =
        isPinned === "right" && column.getIsFirstColumn("right");

    return {
        borderRight: isLastLeftPinnedColumn ? "4px solid gray" : undefined,
        borderLeft: isFirstRightPinnedColumn ? "4px solid gray" : undefined,
        left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
        right:
            isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? "sticky" : "relative",
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
    };
};

function Table({ className, ...props }: React.ComponentProps<"table">) {
    return (
        <div
            data-slot="table-container"
            className="relative w-full overflow-x-auto"
        >
            <div
                data-slot="table"
                className={cn(
                    "flex flex-col w-full caption-bottom text-sm",
                    className
                )}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
    return (
        <div
            data-slot="table-header"
            className={cn("flex flex-col [&_tr]:border-b", className)}
            {...props}
        />
    );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
    return (
        <div
            data-slot="table-body"
            className={cn(
                "flex flex-col [&_tr:last-child]:border-0",
                className
            )}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
    return (
        <div
            data-slot="table-footer"
            className={cn(
                "flex flex-col bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
                className
            )}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
    return (
        <div
            data-slot="table-row"
            className={cn(
                "flex hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
                className
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
    return (
        <div
            data-slot="table-head"
            className={cn(
                "flex text-foreground px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
    return (
        <div
            data-slot="table-cell"
            className={cn(
                "flex p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className
            )}
            {...props}
        />
    );
}

function TableCaption({
    className,
    ...props
}: React.ComponentProps<"caption">) {
    return (
        <caption
            data-slot="table-caption"
            className={cn("text-muted-foreground mt-4 text-sm", className)}
            {...props}
        />
    );
}

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    getCommonPinningStyles,
};
