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
    if (event.httpMethod !== 'DELETE') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const dataId = parseInt(event.path.split('/').pop());

    try {
        let data = await readDataFromFile();
        const initialLength = data.length;
        data = data.filter(item => item.id !== dataId);

        if (initialLength === data.length) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Data not found' })
            };
        }

        await writeDataToFile(data);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `You have successfully deleted user: ${dataId}` })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};