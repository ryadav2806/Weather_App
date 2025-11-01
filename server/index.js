
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: 'Missing city parameter' });
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'Server missing OPENWEATHER_API_KEY env variable' });

    try {
        const resp = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: { q: city, appid: API_KEY, units: 'metric' },
            timeout: 10000
        });
        const data = resp.data;
        const temp_c = data?.main?.temp ?? null;
        const description = Array.isArray(data.weather) && data.weather[0] ? data.weather[0].description : '';
        console.log(data)
        // store in MySQL
        const conn = await db.getConnection();
        try {
            await conn.execute(
                'INSERT INTO searches (city, temp_c, description, timestamp, raw_json) VALUES (?, ?, ?, NOW(), ?)',
                [city, temp_c, description, JSON.stringify(data)]
            );
            // keep only last 10
            await conn.execute(
                `DELETE FROM searches WHERE id NOT IN (SELECT id FROM (SELECT id FROM searches ORDER BY id DESC LIMIT 10) as t)`
            );
        } finally {
            conn.release();
        }

        res.json({ city, temp_c, description, raw: data });
    } catch (err) {
         console.error(err);
        if (err.response) {
            return res.status(err.response.status).json({ error: 'Weather API error', details: err.response.data });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/history', async (req, res) => {
    try {
        const conn = await db.getConnection();
        try {
            const [rows] = await conn.execute('SELECT id, city, temp_c, description, timestamp FROM searches ORDER BY id DESC LIMIT 10');
            res.json(rows);
        } finally {
            conn.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
