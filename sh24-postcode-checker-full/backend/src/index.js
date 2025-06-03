const express = require('express');
const cors = require('cors');
const { isPostcodeServable } = require('./postcodeService');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/check-postcode', async (req, res) => {
  const { postcode } = req.body;

  if (!postcode) return res.status(400).json({ allowed: false, reason: "Postcode is required" });

  try {
    const result = await isPostcodeServable(postcode);
    res.json(result);
  } catch (err) {
    res.status(500).json({ allowed: false, reason: "Server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
