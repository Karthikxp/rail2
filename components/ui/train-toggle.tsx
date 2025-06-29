"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"

interface TrainToggleProps {
  onToggleChange?: (isEnabled: boolean) => void;
}

export function TrainToggle({ onToggleChange }: TrainToggleProps) {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    onToggleChange?.(isEnabled);
  }, [isEnabled, onToggleChange]);

  return (
    <div className="flex items-center space-x-3">
      <Switch 
        id="train-type" 
        checked={isEnabled}
        onCheckedChange={setIsEnabled}
        className="data-[state=checked]:bg-red data-[state=unchecked]:bg-gray-300 h-6 w-11"
      />
      <Label 
        htmlFor="train-type" 
        className="w-[185px] relative text-xs font-extralight font-inter text-white text-left inline-block cursor-pointer"
      >
        Vandhe Bharath and Local Trains
      </Label>
    </div>
  )
} 