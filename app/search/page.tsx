"use client"

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TextAnimate } from "@/components/magicui/text-animate";
import { DatePicker } from '@/components/ui/date-picker';
import { FilterSelector } from '@/components/ui/filter-selector';

interface SearchData {
  sourceCity: string;
  sourceStation: string;
  destinationCity: string;
  destinationStation: string;
  date: string;
  vandeBharat: string;
  chosenClass: string;
  timestamp: string;
  price: string;
  intermediateStops: string[];
  classes: string[];
}

interface TrainResult {
  trainName: string;
  trainNumber: string;
  trainType: string;
  departureTime: string;
  arrivalTime: string;
  sourceStation: string;
  destinationStation: string;
  duration: string;
  distance: string;
  price: string;
  intermediateStops: string[];
  classes: string[];
}

const SearchPage: NextPage = () => {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [trainResults, setTrainResults] = useState<TrainResult[]>([]);
  const [allTrains, setAllTrains] = useState<TrainResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'distance'>('price');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isAllClassMode, setIsAllClassMode] = useState(true);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  // Generate realistic train results based on search data
  const generateTrainResults = (data: SearchData): TrainResult[] => {
    const routes = [
      {
        trainName: "GURUVAYUR EXPRESS",
        trainNumber: "16127",
        trainType: "Express",
        departureTime: "08:30 AM",
        arrivalTime: "06:30 PM",
        duration: "10h 00m",
        distance: "737 km",
        price: "₹921.25",
        intermediateStops: ["Karur Junction", "Trichy Junction"],
        classes: ['2ac', '3ac', 'sl'],
      },
      {
        trainName: "SHATABDI EXPRESS",
        trainNumber: "12008",
        trainType: "Shatabdi", 
        departureTime: "06:15 AM",
        arrivalTime: "02:30 PM",
        duration: "8h 15m",
        distance: "563 km",
        price: "₹1,245.00",
        intermediateStops: ["Salem Junction", "Erode Junction"],
        classes: ['cc', 'fc'],
      },
      {
        trainName: "MAIL EXPRESS",
        trainNumber: "16340",
        trainType: "Mail",
        departureTime: "10:10 PM",
        arrivalTime: "12:45 PM",
        duration: "14h 35m",
        distance: "689 km", 
        price: "₹756.50",
        intermediateStops: ["Coimbatore Junction", "Palakkad Junction"],
        classes: ['sl', 'gn', '3ac'],
      }
    ];

    return routes.map(route => ({
      ...route,
      sourceStation: data.sourceStation || data.sourceCity,
      destinationStation: data.destinationStation || data.destinationCity
    }));
  };

  // Filter trains based on search query
  const filterTrains = (query: string) => {
    if (!query.trim()) {
      setTrainResults(allTrains);
      return;
    }

    const filtered = allTrains.filter(train => 
      train.trainName.toLowerCase().includes(query.toLowerCase()) ||
      train.trainNumber.toLowerCase().includes(query.toLowerCase())
    );
    setTrainResults(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setTrainResults(allTrains);
  };

  // Helper function to parse price string to number
  const parsePriceToNumber = (price: string): number => {
    return parseFloat(price.replace('₹', '').replace(',', ''));
  };

  // Helper function to parse time string to minutes
  const parseTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split('h ').map(part => parseInt(part));
    return hours * 60 + (minutes || 0);
  };

  // Helper function to parse distance string to number
  const parseDistanceToNumber = (distance: string): number => {
    return parseInt(distance.split(' ')[0]);
  };

  // Sort trains based on selected criteria
  const sortTrains = (trains: TrainResult[], criterion: 'price' | 'time' | 'distance') => {
    const sortedTrains = [...trains];
    switch (criterion) {
      case 'price':
        sortedTrains.sort((a, b) => parsePriceToNumber(a.price) - parsePriceToNumber(b.price));
        break;
      case 'time':
        sortedTrains.sort((a, b) => parseTimeToMinutes(a.duration) - parseTimeToMinutes(b.duration));
        break;
      case 'distance':
        sortedTrains.sort((a, b) => parseDistanceToNumber(a.distance) - parseDistanceToNumber(b.distance));
        break;
    }
    return sortedTrains;
  };

  // Handle sort selection
  const handleSortSelect = (criterion: 'price' | 'time' | 'distance') => {
    setSortBy(criterion);
    setIsSortDropdownOpen(false);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate && searchData) {
      setSelectedDate(newDate);

      // Format date to YYYY-MM-DD for consistency
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0');
      const day = String(newDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const updatedSearchData = { ...searchData, date: formattedDate };
      setSearchData(updatedSearchData);
      
      // Update localStorage so the change persists on refresh
      localStorage.setItem('trainSearchData', JSON.stringify(updatedSearchData));
      
      // In a real application, you would re-fetch train data here.
      // For this demo, we'll just log it.
      console.log("Date changed, new search data:", updatedSearchData);
    }
  };

  const handleFilterChange = (isAllMode: boolean, classes: string[]) => {
    setIsAllClassMode(isAllMode);
    setSelectedClasses(classes);
  };

  useEffect(() => {
    // Retrieve search data from localStorage
    try {
      const savedData = localStorage.getItem('trainSearchData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setSearchData(data);
        if (data.date) {
          // Fix for timezone issues: create date from parts
          const dateParts = data.date.split('-').map(Number);
          setSelectedDate(new Date(dateParts[0], dateParts[1] - 1, dateParts[2]));
        }

        const trains = generateTrainResults(data);
        // Sort trains initially by price
        const sortedTrains = sortTrains(trains, 'price');
        setAllTrains(sortedTrains);
        setTrainResults(sortedTrains);
      }
    } catch (error) {
      console.error('Failed to retrieve search data:', error);
    }
  }, []);

  useEffect(() => {
    let results = [...allTrains];

    // Apply class filter
    if (!isAllClassMode && selectedClasses.length > 0) {
      results = results.filter(train =>
        selectedClasses.some(cls => train.classes.includes(cls))
      );
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      results = results.filter(train =>
        train.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.trainNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    setTrainResults(sortTrains(results, sortBy));
  }, [searchQuery, isAllClassMode, selectedClasses, allTrains, sortBy]);

  return (
    <div className="w-full relative bg-black h-[969px] overflow-hidden text-left text-[8.76px] text-white font-inter">
      {/* Background using bgfortrain.png */}
      <Image 
        className="absolute inset-0 w-full h-full object-cover" 
        width={1439} 
        height={969} 
        sizes="100vw" 
        alt="Train background" 
        src="/bgfortrain.png" 
      />
      
      {/* Background overlays */}
      <div className="absolute top-[280px] left-[0px] w-[1439px] h-[557px] bg-white/5 rounded-2xl" />
      <div className="absolute top-[280px] left-[0px] w-[1439px] h-[557px] bg-black/80 rounded-2xl" />
      
      {/* Logo */}
      <div className="absolute top-[7px] left-[36px]">
        <Image className="relative" width={89} height={60} sizes="100vw" alt="" src="/logosv.png" />
      </div>
      
      {/* Back Button */}
      <div className="absolute top-[108px] left-[76px]">
        <Link href="/" className="flex items-center text-white hover:text-white/80 transition-colors">
          <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="absolute top-[40px] left-[1080px] rounded-[20.99px] bg-black/40 backdrop-blur-sm w-[200px] h-[39.1px] flex flex-row items-center justify-start py-[8.8px] px-[15px] box-border gap-[10px] text-[9.4px]">
        <svg className="w-[12.8px] h-[12.8px] text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search all"
          className="flex-1 bg-transparent border-none outline-none text-white tracking-[0.04em] font-light placeholder-white/50"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Profile Icon */}
      <div className="absolute top-[44.04px] left-[1324px] w-[30.3px] h-[30.3px] bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      
      {/* Main Content */}
      <div className="absolute top-[118px] left-[163px] text-[20.55px] font-extralight text-white inline-block w-[173px] h-6">
        <TextAnimate animation="blurInUp" by="character" once duration={0.6}>
          Got some options
        </TextAnimate>
      </div>
      <div className="absolute top-[171px] left-[162px] text-[39.5px] tracking-[0.03em] font-minimalust text-white">
        <TextAnimate animation="blurInUp" by="character" once duration={0.6}>
          Available Trains
        </TextAnimate>
      </div>
      
      {/* Search Results Counter */}
      {searchQuery && (
        <div className="absolute top-[220px] left-[163px]">
          <p className="text-sm font-light text-white/70">
            {trainResults.length} train{trainResults.length !== 1 ? 's' : ''} found for "{searchQuery}"
            {trainResults.length === 0 && (
              <span className="block mt-1 text-red-400">Try searching for: Guruvayur, Shatabdi, Mail</span>
            )}
          </p>
        </div>
      )}
      
      {/* Filter Controls */}
      <div className="absolute top-[173px] left-[858px]">
        <DatePicker onDateChange={handleDateChange}>
          {(date, formattedDate) => (
            <button className="rounded-[13.47px] bg-black/40 backdrop-blur-sm w-[104.4px] h-[39.1px] flex flex-row items-center justify-center py-[12.8px] px-[15.5px] box-border gap-[12.8px] text-white/60 hover:bg-black/60 transition-colors">
              <div className="relative font-medium text-[8.76px]">
                {date ? formattedDate : (selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Date')}
              </div>
              <svg className="w-[13.5px] h-[13.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          )}
        </DatePicker>
      </div>
      
      <div className="absolute top-[173px] left-[1008.22px]">
        <FilterSelector onFilterChange={handleFilterChange} showToggle={false} />
      </div>
      
      {/* Sort Dropdown Button */}
      <div className="absolute top-[173px] left-[1153.06px] z-50">
        <button
          id="sortDropdownButton"
          onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          className="rounded-[13.47px] bg-black/40 backdrop-blur-sm w-[90px] h-[35px] flex flex-row items-center justify-center py-[10px] px-[12px] box-border gap-[10px] text-white"
        >
          <div className="relative font-medium text-white/60 text-[8px]">Sort by</div>
          <svg className="w-[5px] h-[3px] text-white/60" fill="none" stroke="currentColor" viewBox="0 0 6 10">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isSortDropdownOpen && (
          <div
            id="sortDropdown"
            className="z-10 absolute top-[40px] right-0 bg-black divide-y divide-gray-100 rounded-lg shadow-sm w-36"
          >
            <ul className="py-1 text-xs text-white" aria-labelledby="sortDropdownButton">
              <li>
                <button
                  onClick={() => handleSortSelect('price')}
                  className={`block w-full px-3 py-1.5 text-left hover:bg-red-600 hover:text-white transition-colors ${sortBy === 'price' ? 'bg-red-600' : ''}`}
                >
                  Price
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSortSelect('time')}
                  className={`block w-full px-3 py-1.5 text-left hover:bg-red-600 hover:text-white transition-colors ${sortBy === 'time' ? 'bg-red-600' : ''}`}
                >
                  Time
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSortSelect('distance')}
                  className={`block w-full px-3 py-1.5 text-left hover:bg-red-600 hover:text-white transition-colors ${sortBy === 'distance' ? 'bg-red-600' : ''}`}
                >
                  Distance
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="absolute top-[173px] left-[1291.83px] w-[39.1px] h-[39.1px] bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
      
      {/* Train Results Container */}
      <div className="absolute top-[372px] left-[280px] w-[879.2px]">
        {trainResults.length > 0 ? (
          trainResults.map((train, index) => (
            <div key={index} className="w-full relative h-[208.6px] text-left text-[10.3px] text-white font-inter mb-[70px]">
              {/* Bottom Price Bar */}
              <div className="absolute top-[151.14px] left-[calc(50%_-_439.58px)] rounded-[20.05px] bg-gray-300 w-[879.2px] h-[57.4px]" />
              <div className="absolute top-[157px] left-[17px] w-[832.5px] h-[46.1px] text-[14.06px] text-black font-cf-christmas-stitch">
                <div className="absolute top-[0px] left-[0px] rounded-[24.5px] bg-white w-[832.5px] h-[46.1px]" />
                <div className="absolute top-[17px] left-[390px] inline-block w-[66px] h-[11px]">VIEW MORE</div>
                <div className="absolute top-[11px] left-[728px] text-[19.13px] font-extrabold font-inter text-center inline-block w-[78px] h-[24.1px]">
                  <p className="m-0">{train.price}</p>
                </div>
              </div>

              {/* Main Train Card */}
              <div className="absolute top-[0px] left-[0px] rounded-[20.05px] bg-gray-300 w-[879.2px] h-[151.9px] flex flex-row items-start justify-between py-[9.8px] px-1.5 box-border gap-0 text-[18.06px] font-cf-christmas-stitch">
                {/* Train Number Badge */}
                <div className="w-[109.8px] relative h-[35.4px]">
                  <div className="absolute top-[0px] left-[0px] rounded-[24.5px] bg-gray-200 w-[109.8px] h-[35.4px]" />
                  <div className="absolute top-[3.63px] left-[2.72px] rounded-[50%] bg-darkslategray w-[29px] h-[29px]" />
                  <div className="absolute top-[9.91px] left-[41.27px]">{train.trainNumber}</div>
                  <Image className="absolute top-[3.63px] left-[1.68px] w-[29px] h-[29px] object-cover" width={29} height={29} sizes="100vw" alt="" src="/trainforticket.png" />
                </div>
                
                {/* Status Badge */}
                <div className="w-[109.8px] relative h-[35.4px]">
                  <div className="absolute top-[0px] left-[0px] rounded-[24.5px] bg-gray-200 w-[109.8px] h-[35.4px]" />
                  <div className="absolute top-[3.63px] left-[2.72px] rounded-[50%] bg-darkslategray w-[29px] h-[29px]" />
                  <div className="absolute top-[9.91px] left-[41.27px]">8 STRT</div>
                  <Image className="absolute top-[3.63px] left-[2.72px] w-[29px] h-[29px]" width={29} height={29} sizes="100vw" alt="" src="/menu bar.svg" />
                </div>
              </div>

              {/* Route Information */}
              <div className="absolute top-[23px] left-[19px] w-[371px] h-[163px] text-gray-100">
                {/* Departure Time */}
                <div className="absolute top-[42px] left-[39px] font-extralight inline-block w-[49px] h-3">{train.departureTime}</div>
                
                {/* Intermediate Stops */}
                <div className="absolute top-[0px] left-[107px] inline-block w-[264px] h-3">
                  <p className="m-0">
                    <span className="font-extralight font-inter whitespace-pre-wrap">{`Intermediate Stops:  `}</span>
                    <span className="font-semibold">{train.intermediateStops.join(' | ')}</span>
                  </p>
                </div>
                
                {/* Distance Info */}
                <div className="absolute top-[151px] left-[11px] inline-block w-[145px] h-3">
                  <p className="m-0">
                    <span className="font-extralight font-inter">{`Distance:  `}</span>
                    <span className="font-extrabold font-inter">{train.distance}</span>
                    <span className="font-extralight"> @ ₹1.25/km </span>
                  </p>
                </div>
                
                {/* Source Station */}
                <div className="absolute top-[58.03px] left-[0px] text-[22.47px] tracking-[0.03em] font-thin text-white text-center inline-block w-[128.4px]">
                  {train.sourceStation === 'MGR Central' ? 'MGR' : train.sourceStation.slice(0, 3).toUpperCase()}
                </div>
                <div className="absolute top-[88.61px] left-[18.33px] text-[10.4px] tracking-[0.03em] font-extralight text-center inline-block w-[91.4px]">
                  {train.sourceStation === 'MGR Central' ? 'Central' : 'Station'}
                </div>
              </div>
              
              {/* Destination Info */}
              <div className="absolute top-[64.99px] left-[733.61px] w-[122px] h-[59.6px] text-center text-gray-100">
                <div className="absolute top-[0px] left-[1.87px] font-extralight text-left inline-block w-[120.1px] h-3">{train.arrivalTime}</div>
                <div className="absolute top-[16.04px] left-[0px] text-[22.47px] tracking-[0.03em] font-thin text-white inline-block w-[121px]">
                  {train.destinationStation.slice(0, 3).toUpperCase()}
                </div>
                <div className="absolute top-[46.62px] left-[28px] text-[10.4px] tracking-[0.03em] font-extralight inline-block w-[66.7px]">Town</div>
              </div>
              
              {/* Train Name and Route Line */}
              <div className="absolute top-[75.02px] left-[220.52px] w-[439.2px] h-[35.1px] flex flex-row items-center justify-center gap-[12.8px] text-center text-[14.9px]">
                <div className="w-[226.2px] relative h-[0.7px] bg-white opacity-50"></div>
                <div className="w-[101px] relative tracking-[0.03em] font-black inline-block h-[35.1px] shrink-0 text-white">
                  {train.trainName}
                </div>
                <div className="w-[226.2px] relative h-[0.5px] bg-white opacity-50"></div>
              </div>
            </div>
          ))
        ) : searchQuery ? (
          /* No Results Found */
          <div className="flex flex-col items-center justify-center h-96 text-white/60">
            <svg className="w-16 h-16 mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.1-5.5-2.7" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-white">No trains found</h3>
            <p className="text-center">Try searching for: Guruvayur, Shatabdi, or Mail</p>
            <button
              onClick={clearSearch}
              className="mt-4 px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage; 