const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data.json');

async function readDataFromFile() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading from file:", error);
        throw new Error("Could not read items.");
    }
}

async function writeDataToFile(data) {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing to file:", error);
        throw new Error("Could not save items.");
    }
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const newData = JSON.parse(event.body);
        const data = await readDataFromFile();
        newData.id = data.length ? data[data.length - 1].id + 1 : 1;
        data.push(newData);
        await writeDataToFile(data);
        return {
            statusCode: 201,
            body: JSON.stringify(newData)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};