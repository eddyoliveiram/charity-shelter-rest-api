const pool = require('../config/db');

const getSeekerRequests = async (req, res) => {
    const { seeker_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM requests WHERE seeker_id = $1',
            [seeker_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Error retrieving seeker requests');
    }
};
const getProviderRequests = async (req, res) => {
    const { provider_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM requests WHERE provider_id = $1',
            [provider_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Error retrieving provider requests');
    }
};

module.exports = {
    getSeekerRequests,
    getProviderRequests
};
