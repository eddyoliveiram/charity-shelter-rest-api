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
            ORDER BY 
                CASE 
                    WHEN r.status = 'Aguardando' THEN 1
                    WHEN r.status = 'Aceito' THEN 2
                    WHEN r.status = 'Negado' THEN 3
                    ELSE 4
                END
        `, [provider_id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving provider requests:', err);
        res.status(500).send('Error retrieving provider requests');
    }
};

const updateRequestStatus = async (req, res) => {
    const { request_id } = req.params; // O ID da solicitação
    const { status } = req.body; // O novo status

    try {
        // Verifica se o status fornecido é válido
        const validStatuses = ['Aguardando', 'Aceito', 'Negado'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send('Status inválido. Use "Aguardando", "Aceito" ou "Negado".');
        }

        // Atualiza o status da solicitação no banco de dados
        const result = await pool.query(
            'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
            [status, request_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Request não encontrada.');
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar o status da solicitação:', err);
        res.status(500).send('Erro ao atualizar o status da solicitação.');
    }
};

module.exports = {
    updateRequestStatus,
    getProviderRequests
};

