# App-Server

## Overview

This API provides a simple interface to manage a collection of data stored in a JSON file. It allows users to perform CRUD functions (Create, Read, Update, Delete) operations on the data.

## Features

- Retrieve all data items.
- Add new data items.
- Update existing data items.
- Delete data items by ID.
- Data is stored in the `data.json` file.

## Installation

To set up this API, follow these steps:

1. Clone the repository
2. Navigate into the project directory
3. Install the required dependencies

## Running the API

To run the API, execute the following commands in the project directory:

Firstly you need to install all necessary dependancies

```bash
npm install express
```

Secondly you need to install nodemon

```bash
npm install -g nodemon
```

Thirdly to run the API use this command:

```bash
npm run dev
```

The server will start and listen on `http://127.0.0.2:3000`.

## API Endpoints

### GET /data

Retrieves all data items from the JSON file.

**Response:**

- `200 OK`: Returns an array of data items.
- `500 Internal Server Error`: If there is an error reading the file.

### POST /data

Adds a new data item.

**Response:**

- `201 Created`: Returns the newly created data item.
- `500 Internal Server Error`: If there is an error saving the item.

### PUT /data/:id

Updates an existing data item by its ID.

**Response:**

- `200 OK`: Returns the updated data item.
- `404 Not Found`: If the data item with the specified ID does not exist.
- `500 Internal Server Error`: If there is an error saving the item.

### DELETE /data/:id

Deletes a data item by its ID.

**Response:**

- `301 Moved Permanently`: Returns a success message.
- `404 Not Found`: If the data item with the specified ID does not exist.
- `500 Internal Server Error`: If there is an error saving the item.

## Error Handling

The API provides basic error handling. If an error occurs during file reading or writing, a `500 Internal Server Error` response will be returned with a message.


