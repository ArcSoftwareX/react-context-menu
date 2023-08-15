import React, { HTMLAttributes } from "react";
export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
    viewportPadding?: number;
    width?: number;
}
export declare const ContextMenu: ({ viewportPadding, width, ...props }: ContextMenuProps) => any;
export interface ContextMenuItemProps extends HTMLAttributes<HTMLButtonElement> {
}
export declare const ContextMenuItem: React.ForwardRefExoticComponent<ContextMenuItemProps & React.RefAttributes<HTMLButtonElement>>;
export interface ContextMenuExpandableItemProps extends HTMLAttributes<HTMLDivElement> {
    label: string;
    viewportPadding?: number;
    menuWidth?: number;
}
export declare const ContextMenuExpandableItem: ({ children, label, menuWidth, viewportPadding, ...props }: ContextMenuExpandableItemProps) => React.JSX.Element;
