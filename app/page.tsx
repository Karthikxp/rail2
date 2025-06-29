'use client';

import type { NextPage } from 'next';
import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditsDrawer } from '@/components/ui/credits-drawer';
import { DatePicker } from '@/components/ui/date-picker';
import { TrainToggle } from '@/components/ui/train-toggle';
import { FilterSelector } from '@/components/ui/filter-selector';
import { WordRotate } from "@/components/magicui/word-rotate";
import { TextAnimate } from "@/components/magicui/text-animate";


const Desktop2: NextPage = () => {
  const router = useRouter();
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [isStationDropdownOpen, setIsStationDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [highlightedStationIndex, setHighlightedStationIndex] = useState(-1);
  
  // Destination states
  const [isDestDropdownOpen, setIsDestDropdownOpen] = useState(false);
  const [isDestStationDropdownOpen, setIsDestStationDropdownOpen] = useState(false);
  const [selectedDestCity, setSelectedDestCity] = useState('');
  const [destText, setDestText] = useState('');
  const [isDestTyping, setIsDestTyping] = useState(false);
  const [filteredDestOptions, setFilteredDestOptions] = useState<string[]>([]);
  const [highlightedDestIndex, setHighlightedDestIndex] = useState(-1);
  const [highlightedDestStationIndex, setHighlightedDestStationIndex] = useState(-1);
  
  // Animation states for empty field alerts
  const [isSourceAnimating, setIsSourceAnimating] = useState(false);
  const [isDestAnimating, setIsDestAnimating] = useState(false);
  const [isDateAnimating, setIsDateAnimating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // New states for tracking component values
  const [isVandeBharatEnabled, setIsVandeBharatEnabled] = useState(false);
  const [isAllClassMode, setIsAllClassMode] = useState(true);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const cities = [
    { name: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Bangalore', state: 'Karnataka' },
    { name: 'Tirunelveli', state: 'Tamil Nadu' },
    { name: 'Mumbai', state: 'Maharashtra' },
    { name: 'Delhi', state: 'Delhi' },
    { name: 'Kolkata', state: 'West Bengal' },
    { name: 'Hyderabad', state: 'Telangana' },
    { name: 'Pune', state: 'Maharashtra' }
  ];

  const stations = {
    'Chennai': ['MGR Central', 'Chennai Beach', 'Chennai Egmore', 'Tambaram'],
    'Bangalore': ['Bangalore City', 'Cantonment', 'Yesvantpur', 'Whitefield'],
    'Tirunelveli': ['Tirunelveli Junction', 'Tirunelveli Town'],
    'Mumbai': ['Mumbai Central', 'CST', 'Dadar', 'Andheri'],
    'Delhi': ['New Delhi', 'Old Delhi', 'Nizamuddin', 'Sarai Rohilla'],
    'Kolkata': ['Howrah Junction', 'Sealdah', 'Kolkata Station'],
    'Hyderabad': ['Secunderabad', 'Hyderabad Deccan', 'Kacheguda'],
    'Pune': ['Pune Junction', 'Shivajinagar', 'Hadapsar']
  };

  // Create comprehensive list of all places for auto-suggestions
  const allPlaces = [
    ...cities.map(city => `${city.name}, ${city.state}`),
    ...Object.entries(stations).flatMap(([city, stationList]) => {
      const cityData = cities.find(c => c.name === city);
      return stationList.map(station => `${station}, ${city}, ${cityData?.state}`);
    })
  ];

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsStationDropdownOpen(true);
    // Keep city dropdown open for smoother experience
    // setIsSourceDropdownOpen(false);
    setIsTyping(false);
    setHighlightedIndex(-1);
  };

  const handleStationSelect = (station: string, city: string, state: string) => {
    setSourceText(`${station}, ${city}, ${state}`);
    setIsStationDropdownOpen(false);
    setIsSourceDropdownOpen(false); // Close city dropdown too when station is selected
    setSelectedCity('');
    setIsTyping(false);
    setFilteredOptions([]);
    setHighlightedIndex(-1);
    setHighlightedStationIndex(-1);
  };

  const handleSourceVectorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Clear typing state and filtered options
    setIsTyping(false);
    setFilteredOptions([]);
    // Toggle dropdown regardless of previous state
    setIsSourceDropdownOpen(!isSourceDropdownOpen);
    setIsStationDropdownOpen(false);
    setHighlightedIndex(-1);
    setHighlightedStationIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSourceText(value);
    setIsTyping(true);
    setIsSourceDropdownOpen(false);
    setIsStationDropdownOpen(false);
    setHighlightedIndex(-1);
    setHighlightedStationIndex(-1);
    
    if (value.length > 0) {
      const filtered = allPlaces.filter(place => 
        place.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSourceText(suggestion);
    setFilteredOptions([]);
    setIsTyping(false);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsTyping(true);
    setHighlightedIndex(-1);
    setHighlightedStationIndex(-1);
    if (sourceText.length > 0) {
      const filtered = allPlaces.filter(place => 
        place.toLowerCase().includes(sourceText.toLowerCase())
      ).slice(0, 8);
      setFilteredOptions(filtered);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentOptions = isTyping && filteredOptions.length > 0 
      ? filteredOptions 
      : isStationDropdownOpen && selectedCity
        ? stations[selectedCity as keyof typeof stations] || []
        : isSourceDropdownOpen 
          ? cities.map(city => `${city.name}, ${city.state}`)
          : [];

    if (currentOptions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < currentOptions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : currentOptions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < currentOptions.length) {
          if (isTyping && filteredOptions.length > 0) {
            handleSuggestionSelect(filteredOptions[highlightedIndex]);
          } else if (isStationDropdownOpen && selectedCity) {
            // Prioritize station selection when both dropdowns are open
            const selectedStation = currentOptions[highlightedIndex];
            const city = cities.find(c => c.name === selectedCity);
            if (city) {
              handleStationSelect(selectedStation, city.name, city.state);
            }
          } else if (isSourceDropdownOpen) {
            const selectedCityData = cities[highlightedIndex];
            handleCitySelect(selectedCityData.name);
            // Reset highlight to first station
            setHighlightedIndex(0);
          }
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setIsSourceDropdownOpen(false);
        setIsStationDropdownOpen(false);
        setFilteredOptions([]);
        setHighlightedIndex(-1);
        setIsTyping(false);
        break;
    }
  };

  // Destination handlers
  const handleDestCitySelect = (city: string) => {
    setSelectedDestCity(city);
    setIsDestStationDropdownOpen(true);
    // Keep city dropdown open for smoother experience
    // setIsDestDropdownOpen(false);
    setIsDestTyping(false);
    setHighlightedDestIndex(-1);
  };

  const handleDestStationSelect = (station: string, city: string, state: string) => {
    setDestText(`${station}, ${city}, ${state}`);
    setIsDestStationDropdownOpen(false);
    setIsDestDropdownOpen(false); // Close city dropdown too when station is selected
    setSelectedDestCity('');
    setIsDestTyping(false);
    setFilteredDestOptions([]);
    setHighlightedDestIndex(-1);
  };

  const handleDestVectorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Clear typing state and filtered options
    setIsDestTyping(false);
    setFilteredDestOptions([]);
    // Toggle dropdown regardless of previous state
    setIsDestDropdownOpen(!isDestDropdownOpen);
    setIsDestStationDropdownOpen(false);
    setHighlightedDestIndex(-1);
  };

  const handleDestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestText(value);
    setIsDestTyping(true);
    setIsDestDropdownOpen(false);
    setIsDestStationDropdownOpen(false);
    setHighlightedDestIndex(-1);
    
    if (value.length > 0) {
      const filtered = allPlaces.filter(place => 
        place.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setFilteredDestOptions(filtered);
    } else {
      setFilteredDestOptions([]);
    }
  };

  const handleDestSuggestionSelect = (suggestion: string) => {
    setDestText(suggestion);
    setFilteredDestOptions([]);
    setIsDestTyping(false);
    setHighlightedDestIndex(-1);
  };

  const handleDestInputFocus = () => {
    setIsDestTyping(true);
    setHighlightedDestIndex(-1);
    if (destText.length > 0) {
      const filtered = allPlaces.filter(place => 
        place.toLowerCase().includes(destText.toLowerCase())
      ).slice(0, 8);
      setFilteredDestOptions(filtered);
    }
  };

  const handleDestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentOptions = isDestTyping && filteredDestOptions.length > 0 
      ? filteredDestOptions 
      : isDestStationDropdownOpen && selectedDestCity
        ? stations[selectedDestCity as keyof typeof stations] || []
        : isDestDropdownOpen 
          ? cities.map(city => `${city.name}, ${city.state}`)
          : [];

    if (currentOptions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedDestIndex(prev => 
          prev < currentOptions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedDestIndex(prev => 
          prev > 0 ? prev - 1 : currentOptions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedDestIndex >= 0 && highlightedDestIndex < currentOptions.length) {
          if (isDestTyping && filteredDestOptions.length > 0) {
            handleDestSuggestionSelect(filteredDestOptions[highlightedDestIndex]);
          } else if (isDestStationDropdownOpen && selectedDestCity) {
            // Prioritize station selection when both dropdowns are open
            const selectedStation = currentOptions[highlightedDestIndex];
            const city = cities.find(c => c.name === selectedDestCity);
            if (city) {
              handleDestStationSelect(selectedStation, city.name, city.state);
            }
          } else if (isDestDropdownOpen) {
            const selectedCityData = cities[highlightedDestIndex];
            handleDestCitySelect(selectedCityData.name);
            // Reset highlight to first station
            setHighlightedDestIndex(0);
          }
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setIsDestDropdownOpen(false);
        setIsDestStationDropdownOpen(false);
        setFilteredDestOptions([]);
        setHighlightedDestIndex(-1);
        setIsDestTyping(false);
        break;
    }
  };

  const handleBackgroundClick = () => {
    setIsSourceDropdownOpen(false);
    setIsStationDropdownOpen(false);
    setSelectedCity('');
    setFilteredOptions([]);
    setIsTyping(false);
    setHighlightedIndex(-1);
    
    // Destination cleanup
    setIsDestDropdownOpen(false);
    setIsDestStationDropdownOpen(false);
    setSelectedDestCity('');
    setFilteredDestOptions([]);
    setIsDestTyping(false);
    setHighlightedDestIndex(-1);
  };

  // Helper function to parse city and station from text
  const parseLocationText = (text: string) => {
    if (!text) return { city: '', station: '' };
    
    const parts = text.split(', ');
    if (parts.length >= 3) {
      // Format: "Station, City, State"
      return {
        station: parts[0].trim(),
        city: parts[1].trim()
      };
    } else if (parts.length === 2) {
      // Format: "City, State" (no station selected)
      return {
        station: '',
        city: parts[0].trim()
      };
    }
    
    return { city: text.trim(), station: '' };
  };

  // Callback handlers for child components
  const handleTrainToggleChange = (isEnabled: boolean) => {
    setIsVandeBharatEnabled(isEnabled);
  };

  const handleFilterChange = (isAllMode: boolean, classes: string[]) => {
    setIsAllClassMode(isAllMode);
    setSelectedClasses(classes);
  };

  return (
    <div 
      className="w-full relative bg-black h-[969px] overflow-hidden text-left text-[12.09px] text-white font-inter"
      onClick={handleBackgroundClick}
    >

      
      {/* Background Strip Images */}
      <Image className="absolute top-[-51px] left-[10px] w-[456.6px] h-[1071px] object-cover" width={456.6} height={1071} sizes="100vw" alt="" src="/strip1.png" />
      <Image className="absolute top-[-51px] left-[630px] w-[456.6px] h-[1071px] object-cover" width={456.6} height={1071} sizes="100vw" alt="" src="/strip3.png" />
      <Image className="absolute top-[-51px] left-[960px] w-[456.6px] h-[1071px] object-cover" width={456.6} height={1071} sizes="100vw" alt="" src="/strip4.png" />
      <Image className="absolute top-[-51px] left-[330px] w-[456.6px] h-[1071px] object-cover" width={456.6} height={1071} sizes="100vw" alt="" src="/strip2.png" />
      
      {/* Gradient Overlay */}
      <div className="absolute top-[0px] left-[0px] [background:linear-gradient(180deg,_rgba(0,_0,_0,_0),_#000_95.59%)] w-[1439px] h-[969px]" />

      {/* Logo */}
      <div className="absolute top-[16px] left-[45px]">
        <Image className="w-full relative max-w-full overflow-hidden h-[60px]" width={89} height={60} sizes="100vw" alt="" src="/logosv.png" />
      </div>

      <div className="absolute top-[159px] left-[163px] text-[20.55px] font-extralight inline-block w-[140px] h-6">
        <TextAnimate animation="blurInUp" by="character" once duration={0.6}>
          Hi Traveller
        </TextAnimate>
      </div>
      <div className="absolute top-[212px] left-[162px] text-[39.5px] tracking-[0.03em] font-minimalust">
        <TextAnimate animation="blurInUp" by="character" once duration={0.6}>
          Go Somewhere?
        </TextAnimate>
      </div>
      
      {/* Source Input */}
      <div 
        className="absolute top-[302px] left-[163px] w-[345px] h-14 text-[16.07px] text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`absolute top-[0px] left-[0px] rounded-[21px] bg-gray-300 w-[345px] h-14 transition-all duration-1000 ${
          isSourceAnimating 
            ? 'ring-2 ring-red ring-opacity-100 shadow-lg shadow-red/50' 
            : 'ring-0 ring-opacity-0'
        }`} />
        <div className="absolute top-[8px] left-[295px] rounded-[50%] bg-white w-[41px] h-[41px]" />
        <Image 
          className="absolute top-[16px] left-[304px] w-6 h-6 overflow-hidden cursor-pointer" 
          width={24} 
          height={24} 
          sizes="100vw" 
          alt="" 
          src="/sourcevector.png"
          onClick={handleSourceVectorClick}
        />
        <input
          type="text"
          value={sourceText}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Source: Chennai, Tamil Nadu"
          className="absolute top-[8px] left-[6px] w-[280px] h-[40px] bg-transparent border-none outline-none text-white font-light text-[16.07px] placeholder-white"
          style={{ opacity: 0.32 }}
        />
      </div>

      {/* Auto-suggestion Dropdown */}
      {isTyping && filteredOptions.length > 0 && (
        <div 
          className="absolute top-[370px] left-[163px] z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-[345px] max-h-[300px] overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-top-2"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="py-2 text-sm text-black">
            {filteredOptions.map((option, index) => (
              <li key={index}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSuggestionSelect(option);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`block w-full px-4 py-2 text-left transition-colors ${
                    highlightedIndex === index 
                      ? 'bg-red text-white' 
                      : 'hover:bg-red hover:text-white'
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source City Dropdown */}
      {isSourceDropdownOpen && !isTyping && (
        <div 
          className="absolute top-[370px] left-[163px] z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-[345px] transform transition-all duration-300 ease-out animate-in slide-in-from-top-2"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="py-2 text-sm text-black">
            {cities.map((city, index) => (
              <li key={index}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCitySelect(city.name);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`flex items-center justify-between w-full px-4 py-2 text-left transition-colors ${
                    highlightedIndex === index 
                      ? 'bg-red text-white' 
                      : 'hover:bg-red hover:text-white'
                  }`}
                >
                  {city.name}, {city.state}
                  <svg className="w-2.5 h-2.5 ms-3 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Station Dropdown */}
      {isStationDropdownOpen && selectedCity && !isTyping && (
        <div 
          className="absolute top-[370px] left-[520px] z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-[250px] transform transition-all duration-300 ease-out animate-in slide-in-from-top-2"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="py-2 text-sm text-black">
            {stations[selectedCity as keyof typeof stations]?.map((station, index) => (
              <li key={index}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const city = cities.find(c => c.name === selectedCity);
                    if (city) {
                      handleStationSelect(station, city.name, city.state);
                    }
                  }}
                  onMouseEnter={() => setHighlightedStationIndex(index)}
                  className={`block w-full px-4 py-2 text-left transition-colors ${
                    highlightedStationIndex === index 
                      ? 'bg-red text-white' 
                      : 'hover:bg-red hover:text-white'
                  }`}
                >
                  {station}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Destination Input */}
      <div 
        className="absolute top-[470px] left-[163px] w-[345px] h-14 text-[16.07px] text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`absolute top-[0px] left-[0px] rounded-[21px] bg-gray-300 w-[345px] h-14 transition-all duration-1000 ${
          isDestAnimating 
            ? 'ring-2 ring-red ring-opacity-100 shadow-lg shadow-red/50' 
            : 'ring-0 ring-opacity-0'
        }`} />
        <div className="absolute top-[8px] left-[295px] rounded-[50%] bg-white w-[41px] h-[41px]" />
        <Image 
          className="absolute top-[16px] left-[304px] w-6 h-6 overflow-hidden cursor-pointer" 
          width={24} 
          height={24} 
          sizes="100vw" 
          alt="" 
          src="/sourcevector.png"
          onClick={handleDestVectorClick}
        />
        <input
          type="text"
          value={destText}
          onChange={handleDestInputChange}
          onFocus={handleDestInputFocus}
          onKeyDown={handleDestKeyDown}
          placeholder="Destination"
          className="absolute top-[8px] left-[6px] w-[280px] h-[40px] bg-transparent border-none outline-none text-white font-light text-[16.07px] placeholder-white"
          style={{ opacity: 0.32 }}
        />
      </div>

      {/* Destination Auto-suggestion Dropdown */}
      {isDestTyping && filteredDestOptions.length > 0 && (
        <div 
          className="absolute top-[538px] left-[163px] z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-[345px] max-h-[300px] overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-top-2"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="py-2 text-sm text-black">
            {filteredDestOptions.map((option, index) => (
              <li key={index}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDestSuggestionSelect(option);
                  }}
                  onMouseEnter={() => setHighlightedDestIndex(index)}
                  className={`block w-full px-4 py-2 text-left transition-colors ${
                    highlightedDestIndex === index 
                      ? 'bg-red text-white' 
                      : 'hover:bg-red hover:text-white'
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Destination City Dropdown */}
      {isDestDropdownOpen && !isDestTyping && (
        <div 
          className="absolute top-[538px] left-[163px] z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-[345px] transform transition-all duration-300 ease-out animate-in slide-in-from-top-2"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="py-2 text-sm text-black">
            {cities.map((city, index) => (
              <li key={index}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDestCitySelect(city.name);
                  }}
                  onMouseEnter={() => setHighlightedDestIndex(index)}
                  className={`flex items-center justify-between w-full px-4 py-2 text-left transition-colors ${
                    highlightedDestIndex === index 
                      ? 'bg-red text-white' 
                      : 'hover:bg-red hover:text-white'
                  }`}
                >
                  {city.name}, {city.state}
                  <svg className="w-2.5 h-2.5 ms-3 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Destination Station Dropdown */}
      {isDestStationDropdownOpen && selectedDestCity && !isDestTyping && (
        <div 
          className="absolute top-[538px] left-[520px] z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-[250px] transform transition-all duration-300 ease-out animate-in slide-in-from-top-2"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="py-2 text-sm text-black">
            {stations[selectedDestCity as keyof typeof stations]?.map((station, index) => (
              <li key={index}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const city = cities.find(c => c.name === selectedDestCity);
                    if (city) {
                      handleDestStationSelect(station, city.name, city.state);
                    }
                  }}
                  onMouseEnter={() => setHighlightedDestStationIndex(index)}
                  className={`block w-full px-4 py-2 text-left transition-colors ${
                    highlightedDestStationIndex === index 
                      ? 'bg-red text-white' 
                      : 'hover:bg-red hover:text-white'
                  }`}
                >
                  {station}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Pick a Date Red Button */}
      <div className="absolute top-[396px] left-[163px]">
        <DatePicker onDateChange={setSelectedDate}>
          {(date, formattedDate) => (
            <div className={`rounded-[21px] bg-red w-[121px] h-[39px] flex items-center justify-center cursor-pointer transition-all duration-1000 ${
              isDateAnimating 
                ? 'ring-2 ring-white ring-opacity-100 shadow-lg shadow-white/50' 
                : 'ring-0 ring-opacity-0'
            }`}>
              <span className="text-white font-bold text-[14px]">
                {date ? formattedDate : 'Pick a date'}
              </span>
            </div>
          )}
        </DatePicker>
      </div>

      {/* Train Type Toggle */}
      <div className="absolute top-[620px] left-[163px]">
        <TrainToggle onToggleChange={handleTrainToggleChange} />
      </div>

      {/* Search For Train Button */}
      <div className="absolute top-[720px] left-[163px]">
        <button 
          onClick={() => {
            // Check for empty fields and trigger animations
            let hasEmptyFields = false;
            
            if (!sourceText.trim()) {
              setIsSourceAnimating(true);
              setTimeout(() => setIsSourceAnimating(false), 1000);
              hasEmptyFields = true;
            }
            
            if (!destText.trim()) {
              setIsDestAnimating(true);
              setTimeout(() => setIsDestAnimating(false), 1000);
              hasEmptyFields = true;
            }
            
            // Check if date is selected
            if (!selectedDate) {
              setIsDateAnimating(true);
              setTimeout(() => setIsDateAnimating(false), 1000);
              hasEmptyFields = true;
            }
            
            // Only navigate if no empty fields
            if (!hasEmptyFields) {
              // Parse source and destination data
              const sourceLocation = parseLocationText(sourceText);
              const destLocation = parseLocationText(destText);
              
              // Prepare search data
              const searchData = {
                sourceCity: sourceLocation.city,
                sourceStation: sourceLocation.station,
                destinationCity: destLocation.city,
                destinationStation: destLocation.station,
                date: selectedDate?.toISOString().split('T')[0], // Format as YYYY-MM-DD
                vandeBharat: isVandeBharatEnabled ? 'yes' : 'no',
                chosenClass: isAllClassMode ? 'all' : selectedClasses.join(','),
                timestamp: new Date().toISOString()
              };
              
              // Save to localStorage
              try {
                localStorage.setItem('trainSearchData', JSON.stringify(searchData));
                console.log('Search data saved:', searchData);
              } catch (error) {
                console.error('Failed to save search data:', error);
              }
              
              router.push('/search');
            }
          }}
          className="rounded-[21px] bg-red w-[150px] h-[39px] flex items-center justify-center cursor-pointer hover:bg-red/90 transition-colors"
        >
          <span className="text-white font-bold text-[14px]">
            Search For Train
          </span>
        </button>
      </div>
      
      {/* Filter Selector with Toggle and Dropdown */}
      <div className="absolute top-[564px] left-[163px]">
        <FilterSelector onFilterChange={handleFilterChange} />
      </div>
      
      {/* Top Right Icons */}
      <div className="absolute top-[55px] left-[1317px] rounded-[50%] bg-gray-300 w-16 h-16" />
      <Image className="absolute top-[75px] left-[1337px] w-6 h-6 overflow-hidden" width={24} height={24} sizes="100vw" alt="" src="/profile bar.svg" />
      
      <div className="absolute top-[55px] left-[1216px] rounded-[50%] bg-gray-300 w-16 h-16" />
      <Image className="absolute top-[75px] left-[1236px] w-6 h-6 overflow-hidden" width={24} height={24} sizes="100vw" alt="" src="/help bar.svg" />
      
      <CreditsDrawer>
        <div className="absolute top-[55px] left-[1094px] rounded-[50%] bg-gray-300 w-16 h-16 cursor-pointer" />
      </CreditsDrawer>
      
      <div className="absolute top-[55px] left-[973px] rounded-[50%] bg-gray-300 w-16 h-16" />
      <CreditsDrawer>
        <div className="absolute top-[79px] left-[1117px] font-extralight cursor-pointer">US</div>
      </CreditsDrawer>
      <Image className="absolute top-[67px] left-[985px] w-10 h-10 overflow-hidden" width={40} height={40} sizes="100vw" alt="" src="/menu bar.svg" />

      {/* WordRotate Component */}
      <div className="absolute top-[372px] left-[974px] text-[75.78px] font-cf-christmas-stitch">
        <WordRotate words={["RELIABLE", "TRUSTED", "LIVE"]} />
      </div>
    </div>
  );
};

export default Desktop2; 