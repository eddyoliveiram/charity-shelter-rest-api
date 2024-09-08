const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [name, email, hashedPassword]
        );
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verifique se o email e a senha foram enviados
        if (!email || !password) {
            console.log('Email ou senha não foram fornecidos');
            return res.status(400).send('Email and password are required');
        }

        console.log(`Tentativa de login para o email: ${email}`);

        // Procura o usuário no banco de dados
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            console.log('Usuário não encontrado');
            return res.status(404).send('User not found');
        }

        const user = result.rows[0];

        // Verifica se a senha fornecida corresponde à senha armazenada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            console.log('Senha válida, gerando token...');

            // Gera o token JWT
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            console.log('Token gerado com sucesso:', token);

            return res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            console.log('Senha inválida');
            return res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Erro ao tentar fazer login:', err);
        return res.status(500).send('Error logging in');
    }
};




module.exports = { register, login };
