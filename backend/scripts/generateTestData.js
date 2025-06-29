require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Train = require('../models/Train');
const Station = require('../models/Station');

// Import database connection
require('../config/database')();

const specificTestTrains = [
  // Train A - Chennai to Mangalore via Bangalore, Mysuru
  {
    name: "Chennai Mangalore Express",
    number: "EXAM001",
    type: "Express",
    schedule: [
      {
        stationName: "Chennai Central",
        departureTime: "09:00",
        arrivalTime: "09:00",
        distanceFromPrevious: 0,
        cumulativeDistance: 0,
        stopNumber: 1
      },
      {
        stationName: "Vellore Cantonment", 
        departureTime: "11:00",
        arrivalTime: "11:00",
        distanceFromPrevious: 170,
        cumulativeDistance: 170,
        stopNumber: 2
      },
      {
        stationName: "Bangalore City",
        departureTime: "15:30",
        arrivalTime: "15:30", 
        distanceFromPrevious: 200,
        cumulativeDistance: 370,
        stopNumber: 3
      },
      {
        stationName: "Mysuru Junction",
        departureTime: "17:30",
        arrivalTime: "17:30",
        distanceFromPrevious: 120, 
        cumulativeDistance: 490,
        stopNumber: 4
      },
      {
        stationName: "Mangalore Central",
        departureTime: "21:45",
        arrivalTime: "21:45",
        distanceFromPrevious: 300,
        cumulativeDistance: 790,
        stopNumber: 5
      }
    ]
  },
  // Train B - Bangalore to Mangalore
  {
    name: "Bangalore Mangalore Express",
    number: "EXAM002", 
    type: "Express",
    schedule: [
      {
        stationName: "Bangalore City",
        departureTime: "09:00",
        arrivalTime: "09:00",
        distanceFromPrevious: 0,
        cumulativeDistance: 0,
        stopNumber: 1
      },
      {
        stationName: "Shimoga Town",
        departureTime: "12:00", 
        arrivalTime: "12:00",
        distanceFromPrevious: 180,
        cumulativeDistance: 180,
        stopNumber: 2
      },
      {
        stationName: "Mangalore Central",
        departureTime: "17:30",
        arrivalTime: "17:30",
        distanceFromPrevious: 250,
        cumulativeDistance: 430,
        stopNumber: 3
      }
    ]
  },
  // Train C - Bangalore to Mangalore (different timing)
  {
    name: "Bangalore Evening Express", 
    number: "EXAM003",
    type: "Express",
    schedule: [
      {
        stationName: "Bangalore City",
        departureTime: "16:00",
        arrivalTime: "16:00",
        distanceFromPrevious: 0,
        cumulativeDistance: 0,
        stopNumber: 1
      },
      {
        stationName: "Shimoga Town",
        departureTime: "19:00",
        arrivalTime: "19:00", 
        distanceFromPrevious: 180,
        cumulativeDistance: 180,
        stopNumber: 2
      },
      {
        stationName: "Mangalore Central",
        departureTime: "23:45",
        arrivalTime: "23:45",
        distanceFromPrevious: 250,
        cumulativeDistance: 430,
        stopNumber: 3
      }
    ]
  }
];

// South Indian stations for realistic data
const stationData = [
  { name: 'Bangalore City', code: 'SBC', city: 'Bangalore', state: 'Karnataka' },
  { name: 'Chennai Central', code: 'MAS', city: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Mangalore Central', code: 'MAJN', city: 'Mangalore', state: 'Karnataka' },
  { name: 'Mysuru Junction', code: 'MYS', city: 'Mysuru', state: 'Karnataka' },
  { name: 'Vellore Cantonment', code: 'VLR', city: 'Vellore', state: 'Tamil Nadu' },
  { name: 'Shimoga Town', code: 'SMET', city: 'Shimoga', state: 'Karnataka' },
  { name: 'Coimbatore Junction', code: 'CBE', city: 'Coimbatore', state: 'Tamil Nadu' },
  { name: 'Salem Junction', code: 'SA', city: 'Salem', state: 'Tamil Nadu' },
  { name: 'Madurai Junction', code: 'MDU', city: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Trichy Junction', code: 'TPJ', city: 'Trichy', state: 'Tamil Nadu' },
  { name: 'Erode Junction', code: 'ED', city: 'Erode', state: 'Tamil Nadu' },
  { name: 'Tirunelveli Junction', code: 'TEN', city: 'Tirunelveli', state: 'Tamil Nadu' },
  { name: 'Hubli Junction', code: 'UBL', city: 'Hubli', state: 'Karnataka' },
  { name: 'Belgaum', code: 'BGM', city: 'Belgaum', state: 'Karnataka' },
  { name: 'Hassan Junction', code: 'HAS', city: 'Hassan', state: 'Karnataka' },
  { name: 'Tumkur', code: 'TK', city: 'Tumkur', state: 'Karnataka' },
  { name: 'Kolar Gold Fields', code: 'KGF', city: 'Kolar', state: 'Karnataka' },
  { name: 'Hosur', code: 'HSRA', city: 'Hosur', state: 'Tamil Nadu' },
  { name: 'Krishnagiri', code: 'KRP', city: 'Krishnagiri', state: 'Tamil Nadu' },
  { name: 'Tiruvannamalai', code: 'TNM', city: 'Tiruvannamalai', state: 'Tamil Nadu' },
  { name: 'Villupuram Junction', code: 'VM', city: 'Villupuram', state: 'Tamil Nadu' },
  { name: 'Cuddalore Port', code: 'CUPJ', city: 'Cuddalore', state: 'Tamil Nadu' },
  { name: 'Chidambaram', code: 'CDM', city: 'Chidambaram', state: 'Tamil Nadu' },
  { name: 'Mayiladuthurai Junction', code: 'MV', city: 'Mayiladuthurai', state: 'Tamil Nadu' },
  { name: 'Thanjavur Junction', code: 'TJ', city: 'Thanjavur', state: 'Tamil Nadu' },
  { name: 'Kumbakonam', code: 'KMU', city: 'Kumbakonam', state: 'Tamil Nadu' },
  { name: 'Nagapattinam Junction', code: 'NCJ', city: 'Nagapattinam', state: 'Tamil Nadu' },
  { name: 'Karur Junction', code: 'KRR', city: 'Karur', state: 'Tamil Nadu' },
  { name: 'Dindigul Junction', code: 'DG', city: 'Dindigul', state: 'Tamil Nadu' },
  { name: 'Dharwad', code: 'DWR', city: 'Dharwad', state: 'Karnataka' }
];

const trainTypes = ['Express', 'Superfast', 'Passenger', 'Rajdhani', 'Shatabdi'];
const trainNames = [
  'Express', 'Mail', 'Passenger', 'Superfast', 'Special', 'Intercity'
];

// Generate random time in HH:MM format
function generateRandomTime() {
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

// Generate random route with 2-8 stations
function generateRandomRoute(stations) {
  const routeLength = Math.floor(Math.random() * 7) + 2; // 2-8 stations
  const shuffled = [...stations].sort(() => 0.5 - Math.random());
  const selectedStations = shuffled.slice(0, routeLength);
  
  let cumulativeDistance = 0;
  
  return selectedStations.map((station, index) => {
    const distanceFromPrevious = index === 0 ? 0 : Math.floor(Math.random() * 300) + 50; // 50-350 km
    cumulativeDistance += distanceFromPrevious;
    
    const departureTime = generateRandomTime();
    const arrivalTime = index === 0 ? departureTime : generateRandomTime();
    
    return {
      stationName: station.name,
      departureTime,
      arrivalTime,
      distanceFromPrevious,
      cumulativeDistance,
      stopNumber: index + 1
    };
  });
}

async function clearExistingData() {
  try {
    await Train.deleteMany({});
    await Station.deleteMany({});
    console.log('✅ Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
}

async function createStations() {
  try {
    const stations = await Station.insertMany(stationData);
    console.log(`✅ Created ${stations.length} stations`);
    
    // Create a map for easy lookup
    const stationMap = {};
    stations.forEach(station => {
      stationMap[station.name] = station._id;
    });
    
    return { stations, stationMap };
  } catch (error) {
    console.error('❌ Error creating stations:', error);
    throw error;
  }
}

async function createSpecificTestTrains(stationMap) {
  try {
    const trains = [];
    
    for (const trainData of specificTestTrains) {
      const schedule = trainData.schedule.map(stop => ({
        station: stationMap[stop.stationName],
        stationName: stop.stationName,
        departureTime: stop.departureTime,
        arrivalTime: stop.arrivalTime,
        distanceFromPrevious: stop.distanceFromPrevious,
        cumulativeDistance: stop.cumulativeDistance,
        stopNumber: stop.stopNumber
      }));

      const train = new Train({
        name: trainData.name,
        number: trainData.number,
        type: trainData.type,
        schedule: schedule,
        isActive: true
      });

      trains.push(train);
    }
    
    const savedTrains = await Train.insertMany(trains);
    console.log(`✅ Created ${savedTrains.length} specific test trains`);
    return savedTrains;
  } catch (error) {
    console.error('❌ Error creating specific test trains:', error);
    throw error;
  }
}

async function createAdditionalTrains(stations, stationMap, count = 50) {
  try {
    const trains = [];
    
    for (let i = 0; i < count; i++) {
      const trainNumber = (10000 + Math.floor(Math.random() * 90000)).toString();
      const trainType = trainTypes[Math.floor(Math.random() * trainTypes.length)];
      const baseName = trainNames[Math.floor(Math.random() * trainNames.length)];
      const randomNum = Math.floor(Math.random() * 1000);
      const trainName = `${stations[Math.floor(Math.random() * stations.length)].city} ${baseName} ${randomNum}`;
      
      const route = generateRandomRoute(stations);
      
      // Skip routes that would conflict with test scenarios
      const routeStations = route.map(stop => stop.stationName);
      const hasChennaiAndMangalore = routeStations.includes('Chennai Central') && routeStations.includes('Mangalore Central');
      const hasBangaloreAndChennai = routeStations.includes('Bangalore City') && routeStations.includes('Chennai Central');
      
      if (hasChennaiAndMangalore || hasBangaloreAndChennai) {
        continue; // Skip this train to avoid conflicts with test scenarios
      }
      
      const schedule = route.map(stop => ({
        station: stationMap[stop.stationName],
        stationName: stop.stationName,
        departureTime: stop.departureTime,
        arrivalTime: stop.arrivalTime,
        distanceFromPrevious: stop.distanceFromPrevious,
        cumulativeDistance: stop.cumulativeDistance,
        stopNumber: stop.stopNumber
      }));

      const train = new Train({
        name: trainName,
        number: trainNumber,
        type: trainType,
        schedule: schedule,
        isActive: true
      });

      trains.push(train);
    }
    
    const savedTrains = await Train.insertMany(trains);
    console.log(`✅ Created ${savedTrains.length} additional trains`);
    return savedTrains;
  } catch (error) {
    console.error('❌ Error creating additional trains:', error);
    throw error;
  }
}

async function generateTestData() {
  try {
    console.log('🚀 Starting test data generation...');
    
    // Clear existing data
    await clearExistingData();
    
    // Create stations
    const { stations, stationMap } = await createStations();
    
    // Create specific test trains first
    await createSpecificTestTrains(stationMap);
    
    // Create additional trains (avoiding conflicts)
    await createAdditionalTrains(stations, stationMap, 50);
    
    console.log('✅ Test data generation completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Stations: ${stations.length}`);
    
    const totalTrains = await Train.countDocuments();
    console.log(`   - Total Trains: ${totalTrains}`);
    
    console.log('\n🧪 Test Scenarios:');
    console.log('   - Bangalore to Mangalore: Should show Train B and Train C (direct)');
    console.log('   - Chennai to Mangalore: Should show connecting route via Bangalore');
    console.log('   - Bangalore to Chennai: Should show "No trains available"');
    
  } catch (error) {
    console.error('❌ Error generating test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
generateTestData(); 