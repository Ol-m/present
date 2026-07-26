const express = require('express');
const mongoose = require('mongoose');
const ChatAnalytics = require('./ChatAnalytics');

const app = express();
const PORT = 3000;

app.use(express.json());

// Вставьте здесь ваш настоящй пароль вместо ВАШ_ПАРОЛЬ
const MONGO_URI = 'mongodb://olegkozak8888_db_user:ВАШ_ПАРОЛЬ@cluster0-shard-00-00.1apux0v.mongodb.net:27017,cluster0-shard-00-01.1apux0v.mongodb.net:27017,cluster0-shard-00-02.1apux0v.mongodb.net:27017/chat_stats?ssl=true&replicaSet=atlas-1393at-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Успешно подключено к MongoDB Atlas!'))
    .catch((err) => console.error('❌ Ошибка подключения к MongoDB:', err));

// --- API ROUTES ---

// 1. Принять новые данные статистики от Python-скрипта
app.post('/api/stats', async (req, res) => {
    try {
        const newStats = new ChatAnalytics(req.body);
        const savedStats = await newStats.save();
        console.log(`[API] Сохранена статистика для чата: ${savedStats.chatName}`);
        res.status(201).json({ message: 'Статистика успешно сохранена', data: savedStats });
    } catch (error) {
        console.error('[API Error] Ошибка сохранения:', error.message);
        res.status(400).json({ error: 'Неверный формат данных', details: error.message });
    }
});

// 2. Отдать всю аналитику на фронтенд
app.get('/api/stats', async (req, res) => {
    try {
        const allStats = await ChatAnalytics.find().sort({ createdAt: -1 });
        res.status(200).json(allStats);
    } catch (error) {
        console.error('[API Error] Ошибка получения данных:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при получении статистики' });
    }
});

app.get('/', (req, res) => {
    res.send('Backend API для Chat Stats работает!');
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});