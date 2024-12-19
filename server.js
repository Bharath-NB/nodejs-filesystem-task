const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 3000; 

const directoryPath = path.join(__dirname, 'files');

if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath);
  console.log('Created "files" directory.');
}


function getISTTimestamp() {
  const date = new Date();

  const utcOffset = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const istOffset = 5.5 * 60 * 60 * 1000; 
  const istDate = new Date(utcOffset + istOffset);

  const day = String(istDate.getUTCDate()).padStart(2, '0');
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0'); 
  const year = istDate.getUTCFullYear();

  let hours = istDate.getUTCHours();
  const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(istDate.getUTCSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${day}/${month}/${year}, ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
}


app.get('/create-file', (req, res) => {
  const timestamp = getISTTimestamp();
  const filePath = path.join(directoryPath, 'timestamp.txt');

  fs.writeFile(filePath, timestamp, (err) => {
    if (err) {
      console.error('Error creating file:', err);
      return res.status(500).send('Error creating file.');
    }
    res.status(200).send(`File created with timestamp: ${timestamp}`);
  });
});


app.get('/append-timestamp', (req, res) => {
  const timestamp = getISTTimestamp();
  const filePath = path.join(directoryPath, 'timestamp.txt');

  fs.appendFile(filePath, `\n${timestamp}`, (err) => {
    if (err) {
      console.error('Error appending to file:', err);
      return res.status(500).send('Error appending to file.');
    }
    res.status(200).send(`Timestamp appended: ${timestamp}`);
  });
});


app.use('/files', express.static(directoryPath));

app.get('/', (req, res) => {
  res.send('Welcome to the Node.js File System API! Please Use "/append-timestamp" next to url');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
