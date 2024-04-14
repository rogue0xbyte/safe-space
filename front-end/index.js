import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;



const findIPsWithPortsOpen = (lines, port1, port2) => {
  const ips = [];
  let currentIP = '';
  for (const line of lines) {
    if (line.includes(`${port1}/tcp`) && line.includes(`${port2}/tcp`)) {
      currentIP = line.match(/\d+\.\d+\.\d+\.\d+/)[0];
      ips.push(currentIP);
    }
  }
  return ips;
};

const getBaseURL = async () => {
  var baseURL;
  try {
    const data = await fs.readFile('output.txt', 'utf16le');
    // Parse the output to find the IP address with only ports 22 and 8000 open
      const content = data.toString().split('\n');
      const lines = [];
      let newLine = '';

      for (const line of content) {
        if (line === '\r') {
          lines.push(newLine);
          newLine = '';
        } else {
          newLine += line.replace('\r', '');
        }
      }

      console.log('Lines:', lines);
      let targetIP = findIPsWithPortsOpen(lines, 22, 8000)[0];

      if (targetIP) {
          // Set the target IP as the baseURL for initializing the ExpressJS script
          const baseURL = targetIP;
          console.log(`BaseURL set to: ${baseURL}`);
  return baseURL;

          // Now you can use this baseURL variable in your ExpressJS script to fetch data from the server.
      } else {
          console.log('No IP address found with only ports 22 and 8000 open.');
  return 'localhost';
      }
  } catch (err) {
    console.error("NMap Output not found!", err);
    console.log("Defaulted baseURL to localhost.");
    baseURL = 'localhost';
  return baseURL;
  }
}

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function fetchDataFromServer(endpoint) {
  const baseURL = await getBaseURL();
  console.log(await getBaseURL());
  const url = `http://${baseURL}:8000/${endpoint}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(`Data received from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
}
 
// This function assumes the fetchDataFromServer() is already defined and working correctly.
app.get('/', async (req, res) => {
  var sessionsFromServer = await fetchDataFromServer('sessions'); // Fetch sessions data from the server

  if (!Array.isArray(sessionsFromServer)) {
    console.error('Failed to fetch sessions or no sessions available');
    sessionsFromServer = []; // Default to an empty array if fetch failed
  }

  let totalWrenchTime = 0;
  let maxCO = 0, minCO = Number.MAX_VALUE;
  let maxLEL = 0, minLEL = Number.MAX_VALUE;
  let maxH2S = 0, minH2S = Number.MAX_VALUE;

  const totalArray = [];

  sessionsFromServer.forEach(session => {
    const timeIn = new Date(`1970-01-01T${session.TIME_IN}Z`);
    const timeOut = new Date(`1970-01-01T${session.TIME_OUT}Z`);
    const wrenchTimeMinutes = (timeOut - timeIn) / 1000 / 60; // Calculate wrench time in minutes
    totalWrenchTime += wrenchTimeMinutes;

    maxCO = Math.max(maxCO, session.CO);
    minCO = Math.min(minCO, session.CO);
    maxLEL = Math.max(maxLEL, session.LEL);
    minLEL = Math.min(minLEL, session.LEL);
    maxH2S = Math.max(maxH2S, session.H2S);
    minH2S = Math.min(minH2S, session.H2S);

    totalArray.push(session);

  });

  const numberOfSessions = sessionsFromServer.length;
  const averageWrenchTime = numberOfSessions > 0 ? totalWrenchTime / numberOfSessions : 0;

  // Send the computed values to the dashboard template
  res.render('dashboard', {
    numberOfSessions,
    sessions: totalArray,
    averageWrenchTime: averageWrenchTime.toFixed(2),
    maxCO: maxCO.toFixed(2),
    minCO: minCO.toFixed(2),
    maxLEL: maxLEL.toFixed(4),
    minLEL: minLEL.toFixed(4),
    maxH2S: maxH2S.toFixed(2),
    minH2S: minH2S.toFixed(2)
  });
});



app.get('/sessions', async (req, res) => {
  const sessionsFromServer = await fetchDataFromServer('sessions'); // Fetch sessions data from the server

  if (!sessionsFromServer) {
    // Handle the error appropriately - maybe render a page with an error message
    return res.json({ error: 'Failed to fetch session data.' });
  }
  
  // Initialize variables to store statistics
  let totalWrenchTime = 0;
  let maxCO = 0, minCO = Number.MAX_VALUE;
  let maxLEL = 0, minLEL = Number.MAX_VALUE;
  let maxH2S = 0, minH2S = Number.MAX_VALUE;

  const totalArray = [];

  sessionsFromServer.forEach(session => {
    const timeIn = new Date(`1970-01-01T${session.TIME_IN}Z`);
    const timeOut = new Date(`1970-01-01T${session.TIME_OUT}Z`);
    const wrenchTimeMinutes = (timeOut - timeIn) / 1000 / 60; // Calculate wrench time in minutes
    totalWrenchTime += wrenchTimeMinutes;

    maxCO = Math.max(maxCO, session.CO);
    minCO = Math.min(minCO, session.CO);
    maxLEL = Math.max(maxLEL, session.LEL);
    minLEL = Math.min(minLEL, session.LEL);
    maxH2S = Math.max(maxH2S, session.H2S);
    minH2S = Math.min(minH2S, session.H2S);

    totalArray.push(session);

  });

  // Calculate the average wrench time
  const avgWrenchTime = sessionsFromServer.length > 0 ? totalWrenchTime / sessionsFromServer.length : 0;

  // Prepare data for the dashboard, including the sessions list and the calculated statistics
  const sessionData = {
    numberOfSessions: sessionsFromServer.length,
    totalWrenchTime: totalWrenchTime.toFixed(2),
    averageWrenchTime: avgWrenchTime.toFixed(2),
    maxCO: maxCO.toFixed(2),
    minCO: minCO.toFixed(2),
    maxLEL: maxLEL.toFixed(4),
    minLEL: minLEL.toFixed(4),
    maxH2S: maxH2S.toFixed(2),
    minH2S: minH2S.toFixed(2),
    sessions: sessionsFromServer // The sessions list for the dropdown
  };

  // Render the 'dashboard' template and pass the entire 'dashboardData' object
  res.render('sessions', { sessionData });
});




app.get('/liveData', async (req, res) => {
  const dataFromServer = await fetchDataFromServer('live_data'); // Fetch data from the server

  // Log the data or lack thereof for debugging
  console.log('Data to be sent to the EJS template:', dataFromServer);

  // Define a default userData structure in case the fetch fails
  let userData = {
    name: 'Sensor Data',
    status: 'N/A',
    H2S_Level: 'N/A',
    CO_Level: 'N/A',
    LEL_Level: 'N/A',
    warnings: ['Data not available']
  };

  if (dataFromServer) { // If data was successfully fetched
    // Translate the data from your FastAPI format to the userData format
    userData = {
      name: 'Monitoring Station 1', // Example name
      status: 'Operational', // Example status
      H2S_Level: dataFromServer.H2S,
      CO_Level: dataFromServer.CO,
      LEL_Level: dataFromServer.LEL,
      warnings: [] // Initialize warnings array
    };

    // Check for dangerous levels and set warnings
    let alertIssued = false;
    if (userData.CO_Level > 400) {
      userData.warnings.push('CO level is too high: Immediate action required, evacuate immediately!');
      alertIssued = true;
    }
    if (userData.H2S_Level > 500) {
      userData.warnings.push('H2S level is too high: Immediate action required, evacuate immediately!');
      alertIssued = true;
    }
    if (userData.LEL_Level > 10) {
      userData.warnings.push('LEL level is too high: Immediate action required, evacuate immediately!');
      alertIssued = true;
    }
}

  // Render the template with the userData
  res.render('liveData', { userData });
});

app.get('/history', async (req, res) => {
  
  const sessionId = req.query.session_id;
  
  // Now use the fetchDataFromServer function with the session ID
  const sessionData = await fetchDataFromServer(`session_by_id/1`);

  if (sessionData) {
    // If data is successfully fetched, render the history page with the session data
    res.json(sessionData)
  } else {
    // If there was an error fetching the data, send a user-friendly error message
    res.status(500).render('error', { message: "Error fetching session history." });
  }
});




app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});