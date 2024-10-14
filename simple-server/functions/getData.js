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

exports.handler = async function(event, context) {
    try {
        const data = await readDataFromFile();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};