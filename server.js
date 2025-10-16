// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // for reading Google Sheets API
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve static files like CSS/JS

// Example: Reading Google Sheet dynamically
// You must set SHEET_ID in Render environment variables
const SHEET_ID = process.env.SHEET_ID;
const SHEET_RANGE = process.env.SHEET_RANGE || "Sheet1!A1:E100"; // adjust if needed
const SHEET_API_KEY = process.env.GOOGLE_API_KEY; // set in Render environment

async function getSheetData() {
  if (!SHEET_ID || !SHEET_API_KEY) return [];
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${SHEET_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.values || [];
  } catch (err) {
    console.error("Error fetching Google Sheet:", err);
    return [];
  }
}

// API route to return sheet data
app.get("/api/data", async (req, res) => {
  const sheetData = await getSheetData();
  res.json(sheetData);
});

// Serve homepage (public/index.html)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Listen on Render-assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
