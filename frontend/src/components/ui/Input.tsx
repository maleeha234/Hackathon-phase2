"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      leftElement,
      rightElement,
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftElement}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-11 w-full rounded-md border bg-white px-3 py-2 text-sm",
              "transition-colors duration-150 ease-out",
              "placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              error
                ? "border-danger-500 bg-danger-50 focus:ring-danger-500"
                : "border-gray-300 hover:border-gray-400",
              disabled && "bg-gray-50 cursor-not-allowed opacity-50",
              leftElement && "pl-10",
              rightElement && "pr-10",
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-danger-500"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
