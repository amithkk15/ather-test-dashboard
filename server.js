require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();
app.use(cors());
app.use(express.json());

const SHEET_ID = process.env.SHEET_ID;

// Route to fetch sheet data
app.get('/data', async (req, res) => {
    try {
        const doc = new GoogleSpreadsheet(SHEET_ID);
        await doc.useServiceAccountAuth({
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // first sheet
        const rows = await sheet.getRows();
        const data = rows.map(row => row._rawData);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error reading sheet');
    }
});

const PORT = process.env.PORT || 3000; // ✅ use Render's port, fallback to 3000 locally
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

