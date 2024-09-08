const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const createSeekerProfile = async (req, res) => {
    const { name, email, password, phone, group_size, need_type, seeker_description } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Hash da senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insere o novo usuário na tabela `users`
        const userResult = await client.query(
            'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, hashedPassword, phone, 'seeker']
        );

        const user = userResult.rows[0]; // Extrai as informações do usuário

        // Insere o `seeker` na tabela `seekers`
        const seekerResult = await client.query(
            'INSERT INTO seekers (user_id, group_size, need_type, seeker_description) VALUES ($1, $2, $3, $4) RETURNING *',
            [user.id, group_size, need_type, seeker_description]
        );

        // Gera o token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        await client.query('COMMIT');

        // Retorna o token e as informações do usuário e `seeker`
        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            seeker: seekerResult.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).send(`Error creating seeker profile: ${err.message}`);
    } finally {
        client.release();
    }
};



const updateSeekerProfile = async (req, res) => {
    const { user_id, name, email, phone, group_size, need_type, seeker_description } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Atualiza os dados na tabela `users`
        await client.query(
            'UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4',
            [name, email, phone, user_id]
        );

        // Atualiza os dados na tabela `seekers`
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
