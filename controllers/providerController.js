const pool = require('../config/db');

const createProviderProfile = async (req, res) => {
    const { name, email, password, phone, capacity, support_type, provider_description } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userResult = await client.query(
            'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, password, phone',
            [name, email, password, phone]
        );

        const userId = userResult.rows[0].id;

        const providerResult = await client.query(
            'INSERT INTO providers (user_id, capacity, support_type, provider_description) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, capacity, support_type, provider_description]
        );

        await client.query('COMMIT');
        res.status(201).json(providerResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).send(`Error creating provider profile: ${err.message}`);
    } finally {
        client.release();
    }
};

const updateProviderProfile = async (req, res) => {
    const { user_id, capacity, support_type, provider_description } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const result = await client.query(
            'UPDATE providers SET capacity = $1, support_type = $2, provider_description = $3 WHERE user_id = $4 RETURNING *',
            [capacity, support_type, provider_description, user_id]
        );

        await client.query('COMMIT');
        res.status(200).json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).send(`Error updating provider profile: ${err.message}`);
    } finally {
        client.release();
    }
};

const getAllProviders = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, u.name, u.email, u.phone
            FROM providers p
            JOIN users u ON p.user_id = u.id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Error retrieving providers');
    }
};


const getRandomProviders = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, u.name, u.email, u.phone
            FROM providers p
            JOIN users u ON p.user_id = u.id
            ORDER BY RANDOM()
            LIMIT 3
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Error retrieving random providers');
    }
};


const handleRequest = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Error handling request');
    }
};

module.exports = {
    createProviderProfile,
    updateProviderProfile,
    getAllProviders,
    getRandomProviders,
    handleRequest
};
