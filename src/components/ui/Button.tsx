import { ReactElement, ReactNode } from "react";

interface ButtonInterface {
    title: string;
    size: "lg" | "sm" | "md";
    startIcon?: ReactElement;
    endIcon?: ReactNode;
    variant: "primary" | "secondary";
    onClick?: () => void;
}

const sizeStyles = {
    lg: "px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-xl rounded-xl",
    md: "px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg",
    sm: "px-2 py-1 text-xs sm:text-sm rounded-md",
};

const variantStyles = {
    primary:
        "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800",
    secondary:
        "bg-purple-100 text-purple-600 hover:bg-purple-200 active:bg-purple-300",
};

export function Button(props: ButtonInterface) {
    return (
        <button
            className={
                sizeStyles[props.size] +
                " " +
                variantStyles[props.variant] +
                " transition-colors duration-200 font-medium whitespace-nowrap"
            }
            onClick={props.onClick}
        >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
                {props.startIcon}
                <span className="hidden sm:inline">{props.title}</span>
                <span className="sm:hidden">{props.title.split(" ")[0]}</span>
                {props.endIcon}
            </div>
        </button>
    );
}
