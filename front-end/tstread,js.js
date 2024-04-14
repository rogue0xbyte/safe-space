import fs from 'node:fs/promises';

var baseURL;

try {
  const data = await fs.readFile('output.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}

// readFile('output.txt', 'utf8', (err, data) => {
//     console.log('Reading');
//     if (err) {
//         console.error(`Error reading output.txt: ${err}`);
//         return;
//     } else{
//       console.log(data);
//     }
    
//     console.log('File read successfully.');

//     // Parse the output to find the IP address with only ports 22 and 8000 open
//     const lines = data.split('\n');
//     console.log('Lines:', lines);
//     let targetIP = '';
//     lines.forEach(line => {
//         console.log('Line:', line);
//         if (line.includes('22/tcp') && line.includes('8000/tcp')) {
//             console.log('Found line with ports 22 and 8000:', line);
//             const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
//             const matches = line.match(ipRegex);
//             if (matches && matches.length > 0) {
//                 targetIP = matches[0];
//             }
//         }
//     });

//     if (targetIP) {
//         // Set the target IP as the baseURL for initializing the ExpressJS script
//         const baseURL = targetIP;
//         console.log(`BaseURL set to: ${baseURL}`);

//         // Now you can use this baseURL variable in your ExpressJS script to fetch data from the server.
//     } else {
//         console.log('No IP address found with only ports 22 and 8000 open.');
//     }
// });
