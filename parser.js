const fs = require("fs");

const parseCSV = (filePath) => {

  const input = fs.readFileSync(filePath, "utf-8");
  // Split input string into lines and remove any leading/trailing whitespace
  const lines = input.trim().split(/\r?\n/);

  // Extract headers from first line and remove any leading/trailing whitespace
  const headers = lines[0].split(",").map((header) => header.trim());
  headers[0] =  "id"
  headers[1] =  "id"

  // Initialize array to store objects
  const data = [];

  // Loop over remaining lines and create an object for each row
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");

    // Initialize object with headers as keys and row values as values
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j].trim();
    }

    // Add object to array
    data.push(obj);
  }

  return data;
}

module.exports = parseCSV