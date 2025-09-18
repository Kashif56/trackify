import * as React from "react"

/**
 * Utility function to combine class names
 */
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Button component with various styles and variants
 */
const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false, 
  ...props 
}, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-slate-900 text-slate-50 hover:bg-slate-900/90": variant === "default",
          "bg-primary text-white hover:bg-primary": variant === "primary",
          "bg-red-500 text-slate-50 hover:bg-red-500/90": variant === "destructive",
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900": variant === "outline",
          "bg-transparent hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
          "bg-transparent text-slate-900 underline-offset-4 hover:underline": variant === "link",
          "h-10 px-4 py-2": size === "default",
          "h-9 rounded-md px-3": size === "sm",
          "h-11 rounded-md px-8": size === "lg",
          "h-8 rounded-md px-2 text-xs": size === "xs",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Button.displayName = "Button"

export default Button
