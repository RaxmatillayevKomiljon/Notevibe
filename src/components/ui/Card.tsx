import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#111111] dark:border-white/5 text-slate-950 dark:text-slate-100 shadow-sm dark:shadow-none transition-all hover:shadow-md dark:shadow-none",
                className
            )}
            {...props}
        />
    )
)
Card.displayName = "Card"

export { Card }
