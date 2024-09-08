const express = require('express');
require('dotenv').config();
const cors = require('cors'); // Importar o middleware CORS
const app = express();
const authRoutes = require('./routes/authRoutes');
const providerRoutes = require('./routes/providerRoutes');
const seekerRoutes = require('./routes/seekerRoutes');
const requestRoutes = require('./routes/requestRoutes');
const pool = require('./config/db');

const allowedOrigins = [
    process.env.FRONTEND_URL_1,
    process.env.FRONTEND_URL_2,
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use('/auth', authRoutes);
app.use('/providers', providerRoutes);
app.use('/seekers', seekerRoutes);
app.use('/requests', requestRoutes);

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error testing database connection:', err);
        res.status(500).send('Error testing database connection');
    }
});

app.listen(process.env.PORT || 3333, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 3333}/`);
});
