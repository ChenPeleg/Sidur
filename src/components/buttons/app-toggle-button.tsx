import * as React from "react";
import { Link } from "react-router";

interface AppToggleButtonProps {
    value: string;
    to?: string;
    selected?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    className?: string;
}

export const AppToggleButton: React.FC<AppToggleButtonProps> = ({
    value,
    to,
    selected = false,
    onClick,
    children,
    className = "",
}) => {
    const defaultedClasses = className || "px-4 py-2 text-white  border-0 ";
    const normalClasses = "bg-white/10 hover:bg-white/20";
    const selectedClasses = "bg-white/30 hover:bg-white/40";

    const combinedClasses = `transition-colors duration-200 cursor-pointer ${defaultedClasses} ${selected ? selectedClasses : normalClasses} ${className}`;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick(event);
        }
    };

    if (to) {
        return (
            <Link
                to={to}
                className={combinedClasses}
                data-value={value}
                onClick={(e) =>
                    handleClick(
                        e as unknown as React.MouseEvent<HTMLButtonElement>
                    )
                }
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className={combinedClasses}
            data-value={value}
            onClick={handleClick}
        >
            {children}
        </button>
    );
};
