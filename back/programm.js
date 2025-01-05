const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');




const app = express();  
const PORT = 3000;

// Включаем middleware для автоматической обработки JSON в теле запроса, что позволяет получать данные из POST-запросов в JSON.
app.use(express.json());
// CORS для возможности отправки запросов с других доменов на этот сервер.
app.use(cors());

// Инициализация работы с SQLite базой данных.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'rev_database.sqlite'
});
testConnection();

// Модель данных для хранения информации о товарах и их отзывах.
const Commodity = sequelize.define(
    'Commodity',
    {
        slug: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        first_review: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        answer: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        last_used_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        freezeTableName: true,
    }
);

// Синхронизация модели с базой данных. `alter: false` означает, что если таблица уже существует, Sequelize не будет пытаться ее изменить.
sequelize.sync({ alter: false}).then(() => {
    console.log('Таблица "Commodity" существует.');
  })
  .catch((error) => {
    console.error('Ошибка при создании таблицы:', error);
  });




// Обработчик POST-запросов по корневому пути ('/').
app.post('/', async (req, res) => {
    // В json хранятся: language, length_of_text, reviews, slug
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    try {
        // Ищем запись о товаре в базе данных по его slug для экономии ресурсов нейросети и вследстии денег.
        const slug_data = await Commodity.findOne({ where: { slug: receivedData.slug } });
        let message;
        if (slug_data && slug_data.first_review == receivedData.reviews[0]) {
            message = slug_data.answer;
            await Commodity.update({ last_used_time: new Date() }, { where: { slug: receivedData.slug } });
        } else {
            const reviewPrompt = `Analyze all available customer reviews for the specified product, focusing on the following aspects: product quality, reliability, delivery speed and quality, and seller trustworthiness. Contextualize your analysis based on the product category to tailor insights accurately. Identify and highlight recurring issues or praise.
            Return two structured summaries:
            1. A **brief one-sentence summary** that concisely captures the overall user sentiment about the product.
            2. A **main summary** that thoroughly presents key insights in approximately ${receivedData.length_of_text} words, covering user opinions on quality, reliability, and seller .
            Save the two summaries in JSON with the keys short_message and message and provide them to ${receivedData.language}. Your entire response, should be processed by JSON.parse(). Your response must begin and end with {} characters.
            Reviews:
            
                    `;
            message = await getAICompletion(reviewPrompt + receivedData.reviews.join('\n'));
            // Кешируем ответ нейросети.
            await Commodity.upsert({
                slug: receivedData.slug,
                first_review: receivedData.reviews[0],
                answer: message,
                last_used_time: new Date(),
            });
        }
        // Отправляем клиенту ответ в формате JSON.
        res.json({
            message,
            timestamp: new Date().toISOString(),

        });
    } catch (error) {
        console.error('Ошибка в обработке запроса:', error);
        res.status(500).json({ error: 'Произошла ошибка при обработке запроса' });
    }
});

// Запускаем сервер и слушаем на указанном порту
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});




 

async function getAICompletion(reviews) {
    try {
        const apiKey = 'sk-7JpLdR715H3MMflt0922DdC3Ca8f43109148B73127610907';
        const baseUrl = 'https://api.rockapi.ru/openai/v1/chat/completions';
        
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: reviews}
                ]
            })
        });

        if (!response.ok) {
            console.error('Ошибка при обработке данных нейросетью:', response.statusText);
            return 'Ошибка при обработке данных нейросетью';
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 'Произошла ошибка при отправке данных нейросети.';
    }
}

async function testConnection() {
    try {
        // Cоединения с базой данных.
        await sequelize.authenticate();
        console.log('Соединение успешно установлено.');
    } catch (error) {
        console.error('Невозможно подключиться к базе данных:', error);
    }
  }

