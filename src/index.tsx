import React, {
  HTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

/* @ts-ignore */
import classes from "./index.module.css";

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  viewportPadding?: number;
  width?: number;
}

export const ContextMenu = ({
  viewportPadding = 10,
  width = 250,
  ...props
}: ContextMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const points = useRef({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e: MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);

    points.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  useLayoutEffect(() => {
    if (!isOpen || !ref.current) return;

    const menuHeight = ref.current?.getBoundingClientRect().height ?? 0;

    const isBottomOverflow =
      points.current.y + menuHeight + viewportPadding > window.innerHeight;

    const isTopOverflow = points.current.y < viewportPadding;

    const isLeftOverflow = points.current.x < viewportPadding;

    const isRightOverflow =
      points.current.x + width + viewportPadding > window.innerWidth;

    ref.current.style.left =
      points.current.x -
      (isRightOverflow
        ? viewportPadding + width
        : isLeftOverflow
        ? -viewportPadding
        : 0) +
      "px";

    ref.current.style.top =
      points.current.y -
      (isBottomOverflow
        ? viewportPadding + menuHeight + 10
        : isTopOverflow
        ? -viewportPadding
        : 0) +
      "px";
  }, [isOpen]);

  const keyUpHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  const outsideClickHandler = useCallback((e: MouseEvent) => {
    if (
      (ref.current && e.target && !ref.current.contains(e.target as Node)) ||
      (e.target as HTMLElement).hasAttribute("data-contextmenuitem")
    )
      setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("contextmenu", handleOpen);
    window.addEventListener("keyup", keyUpHandler);
    window.addEventListener("click", outsideClickHandler);

    return () => {
      window.removeEventListener("contextmenu", handleOpen);
      window.removeEventListener("keyup", keyUpHandler);
      window.removeEventListener("click", outsideClickHandler);
    };
  }, []);

  return createPortal(
    isOpen ? (
      <div className={classes.portal}>
        <div
          style={{
            width: width + "px",
          }}
          className={classes.menu}
          ref={ref}
          {...props}
        >
          {}
        </div>
      </div>
    ) : null,
    document.body
  );
};

export interface ContextMenuItemProps
  extends HTMLAttributes<HTMLButtonElement> {}

export const ContextMenuItem = forwardRef<
  HTMLButtonElement,
  ContextMenuItemProps
>(function ContextMenuItem({ children, ...props }, ref) {
  return (
    <button
      data-contextmenuitem
      className={classes.contextMenuItem}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

export interface ContextMenuExpandableItemProps
  extends HTMLAttributes<HTMLDivElement> {
  label: string;
  viewportPadding?: number;
  menuWidth?: number;
}

export const ContextMenuExpandableItem = ({
  children,
  label,
  menuWidth = 200,
  viewportPadding = 10,
  ...props
}: ContextMenuExpandableItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const yPercentage = 10 + "%";
  const xPercentage = 100 + "%";

  const mouseEnterHandle = () => {
    setIsExpanded(true);
  };

  const mouseLeaveHandle = () => {
    setIsExpanded(false);
  };

  useLayoutEffect(() => {
    if (!isExpanded || !itemRef.current || !ref.current) return;

    const {
      width: menuWidth,
      left: menuLeft,
      height: menuHeight,
      top: menuTop,
    } = itemRef.current.getBoundingClientRect();

    const { width: expandableWidth, height: expandableHeight } =
      ref.current.getBoundingClientRect();

    const isLeft =
      menuWidth + menuLeft + expandableWidth + viewportPadding >=
      window.innerWidth;

    const isBottom =
      menuHeight + menuTop + expandableHeight + viewportPadding >=
      window.innerHeight;

    isLeft
      ? (ref.current.style.right = xPercentage)
      : (ref.current.style.left = xPercentage);

    isBottom
      ? (ref.current.style.bottom = yPercentage)
      : (ref.current.style.top = yPercentage);
  }, [isExpanded]);

  return (
    <div
      onMouseOver={mouseEnterHandle}
      onMouseLeave={mouseLeaveHandle}
      className={classes.contextMenuItem}
      ref={itemRef}
      {...props}
    >
      <div className={classes.expandableItem}>
        {label}
        <ArrowRightIcon style={{ fontSize: "20px", opacity: 0.6 }} />
      </div>
      {isExpanded ? (
        <div
          style={{ width: menuWidth + "px" }}
          className={`${classes.menu} ${classes.contextMenuExpandable}`}
          ref={ref}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

const ArrowRightIcon = forwardRef<SVGSVGElement, HTMLAttributes<SVGSVGElement>>(
  function ArrowRightIcon({ ...props }, ref) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        ref={ref}
        {...props}
      >
        <path
          fill="currentColor"
          d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375q0 .2-.063.375t-.212.325l-4.6 4.6q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l3.9-3.9Z"
        ></path>
      </svg>
    );
  }
);
