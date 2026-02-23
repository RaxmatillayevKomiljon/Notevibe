import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 shadow-sm transition-all hover:shadow-md",
                className
            )}
            {...props}
        />
    )
)
Card.displayName = "Card"

export { Card }
