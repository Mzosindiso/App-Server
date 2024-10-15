const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs').promises;
const path = require('path');

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
        console.error("Error reading from file:", error);
        throw new Error("Could not read items.");
    }
}

// Write data to the JSON file
async function writeDataToFile(data) {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing to file:", error);
        throw new Error("Could not save items.");
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
    const newData = request.body;
    try {
        const data = await readDataFromFile();
        newData.id = data.length ? data[data.length - 1].id + 1 : 1;
        data.push(newData);
        await writeDataToFile(data);
        response.status(201).json(newData);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// PUT: Update data
app.put('/api/data/:id', async (request, response) => {
    const dataId = parseInt(request.params.id);
    const updatedItem = request.body;
    try {
        const data = await readDataFromFile();
        const index = data.findIndex(item => item.id === dataId);

        if (index !== -1) {
            data[index] = { ...data[index], ...updatedItem };
            await writeDataToFile(data);
            response.json(data[index]);
        } else {
            response.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// DELETE: Remove data 
app.delete('/api/data/:id', async (request, response) => {
    const dataId = parseInt(request.params.id);
    try {
        let data = await readDataFromFile();
        const initialLength = data.length;
        data = data.filter(item => item.id !== dataId);

        if (initialLength === data.length) {
            return response.status(404).json({ message: 'Data not found' });
        }
        await writeDataToFile(data);
        response.status(200).json({ message: `You have successfully deleted user: ${dataId}` });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


module.exports.handler = serverless(app);