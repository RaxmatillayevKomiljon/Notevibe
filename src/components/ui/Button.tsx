import * as React from "react"
import { cn } from "../../lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 active:scale-95";

        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30",
            secondary: "bg-white text-slate-900 hover:bg-slate-100 shadow-sm border border-slate-200",
            outline: "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900",
            ghost: "hover:bg-slate-100 hover:text-slate-900",
            danger: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20",
        };

        const sizes = {
            sm: "h-9 rounded-lg px-3",
            md: "h-11 px-8 py-2",
            lg: "h-14 rounded-2xl px-10 text-base",
            icon: "h-10 w-10",
        };

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
