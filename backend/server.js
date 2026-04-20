import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Загрузка переменных окружения из .env
dotenv.config();

const app = express();
// Инициализация Prisma
const prisma = new PrismaClient(); 

app.use(cors());
app.use(express.json());

// Базовые роуты для проверки "сервер жив"
app.get('/', (req, res) => {
  res
    .status(200)
    .type('text/plain; charset=utf-8')
    .send('AgentNest API is running. Try POST /api/auth/send-code');
});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Временное хранилище кодов (Email: Code)
const codes = new Map();

// Настройка почты
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Отправка кода подтверждения
app.post('/api/auth/send-code', async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  codes.set(email, code);

  try {
    await transporter.sendMail({
      from: '"AgentNest"',
      to: email,
      subject: "Код подтверждения",
      text: `Ваш код: ${code}`,
    });
    console.log(`Код ${code} отправлен на ${email}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка почты:', error);
    res.status(500).json({ error: 'Ошибка отправки почты' });
  }
});

// 2. Проверка кода и работа с БД
app.post('/api/auth/verify', async (req, res) => {
  const { email, code } = req.body;

  if (codes.get(email) !== code) {
    return res.status(400).json({ error: 'Неверный код' });
  }

  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }
    codes.delete(email);
    res.json({ success: true, isNewUser: !user.name });
  } catch (error) {
    console.error('Ошибка БД:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// 3. Обновление имени профиля
app.post('/api/auth/update-profile', async (req, res) => {
  const { email, name } = req.body;
  try {
    await prisma.user.update({
      where: { email },
      data: { name }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({ error: 'Ошибка БД' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер взлетел на http://localhost:${PORT}`);
});