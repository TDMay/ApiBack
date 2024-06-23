// app.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

// Middleware para permitir CORS
app.use(cors());
app.use(express.json());

// Rota para criar usuário
app.post('/usuarios', async (req, res) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                nickname: req.body.nickname,
                email: req.body.email,
                senha: req.body.senha
            }
        });

        console.log('Novo usuário criado:', newUser);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Rota para buscar usuários por email e senha
app.post('/usuarios/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                email,
                senha,
            },
        });

        if (user) {
            console.log('Usuário encontrado:', user);
            res.status(200).json(user);
        } else {
            console.log('Usuário não encontrado');
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor está rodando em http://localhost: ${PORT}`);
});