const axios = require('axios');

const ALLOWED_LSOA_PREFIXES = ['Southwark', 'Lambeth'];
const MANUALLY_ALLOWED = ['SH24 1AA', 'SH24 1AB'];

function normalize(postcode) {
  return postcode.toUpperCase().replace(/\s+/g, '');
}

async function isPostcodeServable(postcode) {
  const normalized = normalize(postcode);
  if (MANUALLY_ALLOWED.includes(postcode.toUpperCase())) {
    return { allowed: true, reason: 'Manually allowed postcode' };
  }

  try {
    const response = await axios.get(`https://api.postcodes.io/postcodes/${normalized}`);
    const lsoa = response.data.result?.lsoa;

    if (lsoa && ALLOWED_LSOA_PREFIXES.some(prefix => lsoa.startsWith(prefix))) {
      return { allowed: true, reason: `Postcode is in allowed LSOA: ${lsoa}` };
    }

    return { allowed: false, reason: `LSOA '${lsoa}' not allowed` };
  } catch (err) {
    return { allowed: false, reason: 'Postcode not found in API or API error' };
  }
}

module.exports = { isPostcodeServable };
