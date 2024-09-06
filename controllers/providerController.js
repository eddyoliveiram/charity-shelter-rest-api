const pool = require('../config/db');

const getProviders = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM providers');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Error retrieving providers');
    }
};

module.exports = { getProviders };
