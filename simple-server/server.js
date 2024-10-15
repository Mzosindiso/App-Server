const path = require('path');
const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs').promises;

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data.json');

// Read data from the JSON file
async function readDataFromFile() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('Unable to read data from file');
  }
}

// Write data to the JSON file
async function writeDataToFile(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing file:', error);
    throw new Error('Unable to write data to file');
  }
}

// GET: Retrieve data
app.get('/api/data', async (request, response) => {
  try {
    const data = await readDataFromFile();
    response.json(data);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// POST: Add new data
app.post('/api/data', async (request, response) => {
  try {
    const newData = request.body;
    const data = await readDataFromFile();
    data.push(newData);
    await writeDataToFile(data);
    response.status(201).json(newData);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// PUT: Update data
app.put('/api/data/:id', async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const updatedData = request.body;
    const data = await readDataFromFile();
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedData };
      await writeDataToFile(data);
      response.json(data[index]);
    } else {
      response.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// DELETE: Remove data 
app.delete('/api/data/:id', async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const data = await readDataFromFile();
    const filteredData = data.filter(item => item.id !== id);
    if (data.length !== filteredData.length) {
      await writeDataToFile(filteredData);
      response.status(204).send();
    } else {
      response.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// For Netlify serverless functions
module.exports.handler = serverless(app);