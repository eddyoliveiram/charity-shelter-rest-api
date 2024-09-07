const pool = require('../config/db');

const createSeekerProfile = async (req, res) => {
    const { name, email, password, phone, group_size, need_type, seeker_description } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userResult = await client.query(
            'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, password, phone',
            [name, email, password, phone]
        );

        const userId = userResult.rows[0].id;

        const seekerResult = await client.query(
            'INSERT INTO seekers (user_id, group_size, need_type, seeker_description) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, group_size, need_type, seeker_description]
        );

        await client.query('COMMIT');
        res.status(201).json(seekerResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).send(`Error creating seeker profile: ${err.message}`);
    } finally {
        client.release();
    }
};

const updateSeekerProfile = async (req, res) => {
    const { user_id, group_size, need_type, seeker_description } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const result = await client.query(
            'UPDATE seekers SET group_size = $1, need_type = $2, seeker_description = $3 WHERE user_id = $4 RETURNING *',
            [group_size, need_type, seeker_description, user_id]
        );

        await client.query('COMMIT');
        res.status(200).json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).send(`Error updating seeker profile: ${err.message}`);
    } finally {
        client.release();
    }
};

const createRequest = async (req, res) => {
    const { seeker_id, provider_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO requests (seeker_id, provider_id) VALUES ($1, $2) RETURNING *',
            [seeker_id, provider_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(`Error updating request: ${err.message}`);
    }
};

const cancelRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM requests WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).send('Request not found');
        }
        res.json({ message: 'Request cancelled successfully' });
    } catch (err) {
        res.status(500).send(`Error cancelling request: ${err.message}`);
    }
};

module.exports = {
    createSeekerProfile,
    updateSeekerProfile,
    createRequest,
    cancelRequest
};
