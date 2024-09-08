const pool = require('../config/db');

const getProviderRequests = async (req, res) => {
    const { provider_id } = req.params;
    try {
        const result = await pool.query(`
            SELECT r.*, s.group_size, s.need_type, s.seeker_description, u.name AS seeker_name, u.email AS seeker_email, u.phone AS seeker_phone
            FROM requests r
            JOIN seekers s ON r.seeker_id = s.user_id
            JOIN users u ON s.user_id = u.id
            WHERE r.provider_id = $1
        `, [provider_id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving provider requests:', err);
        res.status(500).send('Error retrieving provider requests');
    }
};

module.exports = {
    getProviderRequests
};
