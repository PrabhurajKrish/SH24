const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Normalize postcodes: remove spaces, make uppercase
function normalize(postcode) {
  return postcode.toUpperCase().replace(/\s+/g, '');
}

// Read and normalize each line of a file
function readLinesFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    let final = content
      .split(/\r?\n/)
      .map(line => normalize(line))  // Normalize each line -- iterate for loop 
      .filter(line => line.length > 0); // converting to an Array 
    return final
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return [];
  }
}

// Always reload the latest data (to reflect recent uploads)
function loadManuallyAllowed() {
  const filePath = path.join(__dirname, '../uploads/manually_allowed.csv');
  return readLinesFromFile(filePath);
}

function loadAllowedLsoaPrefixes() {
  const filePath = path.join(__dirname, '../uploads/allowed_lsoa_prefixes.csv');
  return readLinesFromFile(filePath);
}

// Main function to check postcode
async function isPostcodeServable(postcode) {
  const normalized = normalize(postcode);
  const manuallyAllowed = loadManuallyAllowed();
  const allowedLsoaPrefixes = loadAllowedLsoaPrefixes();

  if (manuallyAllowed.includes(normalized)) {
    return { allowed: true, reason: 'Manually allowed postcode' };
  }

  try {
    const response = await axios.get(`https://api.postcodes.io/postcodes/${normalized}`);
    const lsoa = response.data.result?.lsoa;

    let prefix = lsoa.startsWith(prefix)

    if (lsoa && allowedLsoaPrefixes.some(prefix => lsoa.startsWith(prefix))) {
      return { allowed: true, reason: `Postcode is in allowed LSOA: ${lsoa}` };
    }

    return { allowed: false, reason: `LSOA '${lsoa}' not allowed` };
  } catch (err) {
    return { allowed: false, reason: 'Postcode not found in API or API error' };
  }
}

module.exports = { isPostcodeServable };
