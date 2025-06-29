"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useRef, useEffect } from "react"

const trainClasses = [
  { id: '2ac', label: '2AC', name: 'Second AC' },
  { id: '3ac', label: '3AC', name: 'Third AC' },
  { id: 'sl', label: 'SL', name: 'Sleeper' },
  { id: 'gn', label: 'GN', name: 'General' },
  { id: 'fc', label: '1AC', name: 'First AC' },
  { id: 'cc', label: 'CC', name: 'Chair Car' }
];

interface FilterSelectorProps {
  onFilterChange?: (isAllMode: boolean, selectedClasses: string[]) => void;
  showToggle?: boolean;
}

export function FilterSelector({ onFilterChange, showToggle = true }: FilterSelectorProps) {
  const [isAllModeState, setIsAllModeState] = useState(true);
  const isAllMode = showToggle ? isAllModeState : false;
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Notify parent when filter state changes
  useEffect(() => {
    onFilterChange?.(isAllMode, selectedClasses);
  }, [isAllMode, selectedClasses, onFilterChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleToggleChange = (checked: boolean) => {
    if (showToggle) {
      setIsAllModeState(checked)
      if (checked) {
        setIsDropdownOpen(false)
        setSelectedClasses([])
      }
    }
  }

  const handleClassToggle = (classId: string) => {
    setSelectedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    )
  }

  const handleDropdownToggle = () => {
    if (!isAllMode) {
      setIsDropdownOpen(!isDropdownOpen)
    } else {
      // Trigger animation when all mode is on
      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
      }, 1000) // Animation duration: 1 second
    }
  }

  const getDisplayText = () => {
    if (isAllMode) return 'All'
    if (selectedClasses.length === 0) return 'Selected'
    if (selectedClasses.length === 1) {
      const selected = trainClasses.find(tc => tc.id === selectedClasses[0])
      return selected?.label || 'Selected'
    }
    return `${selectedClasses.length} Selected`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button with Toggle */}
      <div className="flex items-center space-x-3">
        <div className="relative w-[121px] h-[39px]">
          <div 
            onClick={handleDropdownToggle}
            className={`absolute top-[0px] left-[0px] rounded-[27px] bg-gray-300 w-[121px] h-[39px] transition-all duration-1000 cursor-pointer ${
              isAnimating 
                ? 'ring-2 ring-red ring-opacity-100 shadow-lg shadow-red/50' 
                : 'ring-0 ring-opacity-0'
            }`} 
          />
          <div className="absolute top-[4px] left-[3px] rounded-[50%] bg-[#3A3A3A] w-8 h-8 pointer-events-none" />
          
          <div className="absolute top-[12px] left-[44px] font-extralight text-white text-[12px] pointer-events-none">
            {getDisplayText()}
          </div>
          
          {!isAllMode && (
            <svg 
              onClick={handleDropdownToggle}
              className="absolute top-[14px] left-[108px] w-[8px] h-[12px] text-white transition-transform cursor-pointer"
              style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 10 6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
            </svg>
          )}
          
          <div className="absolute top-[15.5px] left-[16.5px] w-[4.5px] h-[8.5px]">
            <svg width="4.5" height="8.5" viewBox="0 0 5 9" fill="none">
              <path d="M1 1L4 4.5L1 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Toggle Switch */}
        {showToggle && (
          <div className="flex items-center space-x-2">
            <Switch 
              id="filter-mode" 
              checked={isAllModeState}
              onCheckedChange={handleToggleChange}
              className="data-[state=checked]:bg-red data-[state=unchecked]:bg-gray-300 h-6 w-11 scale-75"
            />
            <Label 
              htmlFor="filter-mode" 
              className="w-[60px] relative text-xs font-extralight font-inter text-white text-left inline-block cursor-pointer"
            >
              {isAllModeState ? 'All' : 'Custom'}
            </Label>
          </div>
        )}
      </div>

      {/* Dropdown Checkbox Menu */}
      {isDropdownOpen && !isAllMode && (
        <div className="absolute top-[45px] left-[0px] z-50 w-48 bg-black border border-gray-600 divide-y divide-gray-600 rounded-lg shadow-lg">
          <ul className="p-3 space-y-3 text-sm text-gray-200">
            {trainClasses.map((trainClass) => (
              <li key={trainClass.id}>
                <div className="flex items-center">
                  <input 
                    id={`checkbox-${trainClass.id}`}
                    type="checkbox" 
                    checked={selectedClasses.includes(trainClass.id)}
                    onChange={() => handleClassToggle(trainClass.id)}
                    className="w-4 h-4 bg-gray-600 border-gray-500 rounded focus:ring-2 focus:ring-red accent-red" 
                    style={{ accentColor: '#FC0B20' }}
                  />
                  <label 
                    htmlFor={`checkbox-${trainClass.id}`}
                    className="ms-2 text-sm font-medium text-white/30 cursor-pointer"
                  >
                    {trainClass.label} - {trainClass.name}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 