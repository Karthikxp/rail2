"use client"

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SearchData {
  sourceCity: string;
  sourceStation: string;
  destinationCity: string;
  destinationStation: string;
  date: string;
  vandeBharat: string;
  chosenClass: string;
  timestamp: string;
}

const SearchPage: NextPage = () => {
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  useEffect(() => {
    // Retrieve search data from localStorage
    try {
      const savedData = localStorage.getItem('trainSearchData');
      if (savedData) {
        setSearchData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Failed to retrieve search data:', error);
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Train Search Results</h1>
          <Link 
            href="/" 
            className="bg-red hover:bg-red/90 px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Search
          </Link>
        </div>

        {searchData ? (
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Search Parameters:</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Source City:</span>
                  <span className="text-gray-300">{searchData.sourceCity || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Source Station:</span>
                  <span className="text-gray-300">{searchData.sourceStation || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Destination City:</span>
                  <span className="text-gray-300">{searchData.destinationCity || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Destination Station:</span>
                  <span className="text-gray-300">{searchData.destinationStation || 'Not specified'}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Travel Date:</span>
                  <span className="text-gray-300">{searchData.date || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Vande Bharat:</span>
                  <span className="text-gray-300">{searchData.vandeBharat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Train Class:</span>
                  <span className="text-gray-300">
                    {searchData.chosenClass === 'all' ? 'All Classes' : searchData.chosenClass}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Search Time:</span>
                  <span className="text-gray-300">
                    {new Date(searchData.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded border-l-4 border-green-500">
              <h3 className="font-semibold text-green-400 mb-2">Data Successfully Saved!</h3>
              <p className="text-sm text-gray-300">
                All search parameters have been saved to localStorage and can be accessed by your application.
              </p>
            </div>

            <div className="mt-4 p-3 bg-gray-800 rounded">
              <details>
                <summary className="cursor-pointer font-medium">View Raw JSON Data</summary>
                <pre className="mt-2 text-xs text-gray-400 overflow-x-auto">
                  {JSON.stringify(searchData, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <p className="text-gray-400">No search data found. Please go back and perform a search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 