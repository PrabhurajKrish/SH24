const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isPostcodeServable } = require('./postcodeService');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Multer config: store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route: overwrite manually_allowed.csv or allowed_lsoa_prefixes.csv
app.post('/api/upload-csv', upload.single('file'), (req, res) => {
  const type = req.body.type || req.query.type;

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  if (!['manually_allowed', 'allowed_lsoa_prefixes'].includes(type)) {
    return res.status(400).send('Invalid type. Use "manually_allowed" or "allowed_lsoa_prefixes".');
  }

  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
console.log("ggg");

  const filePath = path.join(uploadDir, `${type}.csv`);
console.log("ggg");

  fs.writeFile(filePath, req.file.buffer, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('Error saving file.');
    }
    res.status(200).send(`Successfully replaced ${type}.csv`);
  });
});

// Postcode checker
app.post('/check-postcode', async (req, res) => {
  const postcode = req.body.postcode;

  if (!postcode) {
    return res.status(400).json({ allowed: false, reason: "Postcode is required" });
  }

  try {
    const result = await isPostcodeServable(postcode);
    res.json(result);
  } catch (err) {
    res.status(500).json({ allowed: false, reason: "Server error" });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend with CSV overwrite based on filename');
});

// Only start server if run directly, not during tests
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;
