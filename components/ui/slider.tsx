"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
  value?: number[]
  onValueChange?: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  className?: string
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value = [0], onValueChange, max = 100, min = 0, step = 1, disabled, ...props }, ref) => {
    const percentage = ((value[0] - min) / (max - min)) * 100

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute h-full bg-primary"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          value={value[0]}
          onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
          max={max}
          min={min}
          step={step}
          disabled={disabled}
          className="absolute w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider } 