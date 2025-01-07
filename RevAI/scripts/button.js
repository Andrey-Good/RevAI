(async function () {
    // Загружаем параметр из хранилища
    const a = await loadParameter();

    // HTML-шаблон, который будет вставлен на страницу
    const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>expansion</title>
    <style>
        /* Стили для кнопки в правом нижнем углу */
        .buttom_right {
            width: 60px;
            height: 60px;
            border: none;
            border-radius: 14.65px;
            padding: 0;
            box-shadow: -10px 10px 10px -4px rgba(34, 60, 80, 0.2);
            color: #ffffff;
            position: fixed;
            right: 20px;
            bottom: 20px;
        }
        /* Маска для кнопки */
        .mask {
            width: 60px;
            height: 60px;
            right: 20px;
            bottom: 20px;
            border-radius: 14.65px;
        }
        /* Стили при наведении и нажатии на кнопку */
        .buttom_right:hover {
            opacity: 90%;
        }
        .mask:active {
            box-shadow: -10px 10px 6px -6px rgba(34, 60, 80, 0.2) inset;
        }
        .buttom_right:active {
            -webkit-box-shadow: -10px 7px 12px -6px rgba(34, 60, 80, 0.2) inset;
            -moz-box-shadow: -10px 7px 12px -6px rgba(34, 60, 80, 0.2) inset;
            box-shadow: -10px 7px 12px -6px rgba(34, 60, 80, 0.2) inset;
        }
        /* Стили главного контейнера */
        .main {
            width: 250px;
            height: 400px;
            background-color: rgb(230, 255, 247);
            box-shadow: -10px 10px 10px -4px rgba(34, 60, 80, 0.2);
            border-radius: 10px;
            position: fixed;
            right: 100px;
            bottom: 20px;
        }
        /* Кнопка закрытия окна */
        .the_cross {
            width: 8px; 
            height: 8px;
            position: absolute;
            right: 6px;
            top: 6px;
            border: none;
            padding: 0px;
            background: none;
        }
        .the_cross:hover, .the_cross:active {
            opacity: 0%;
        }
        /* Блок для краткого пересказа */
        .main_0, .main_1 {
            width: 210px;
            border: 1.5px solid transparent;
            border-radius: 10px;
            border-image: linear-gradient(45deg, #006363, #63f8f8);
            border-image-slice: 1;
            margin-left: auto;
            margin-right: auto;
            font-family: sans-serif;
            text-align: left;
            text-indent: 10px;
            font-size: 14px;
            white-space: normal;
            overflow-wrap: break-word;
            padding: 0px 10px;
            overflow-y: auto;
        }
        .main_0 {
            height: 100px;
            margin-top: 25px;
        }
        .main_1 {
            height: 237px;
            margin-top: 25px;
        }
        /* Ползунок для прокрутки (Chrome/Edge/Safari) */
        *::-webkit-scrollbar {
            height: 6px;
            width: 6px;
        }
        *::-webkit-scrollbar-track {
            background: none;
        }
        *::-webkit-scrollbar-thumb {
            background-color: lightgray;
        }
    </style>
  </head>
  <body>
    <!-- Кнопка с логотипом -->
    <button class="buttom_right" id="button351221">
        <img src="${chrome.runtime.getURL('images/logo.png')}" alt="Логотип" class="logo" style="width: 60px; height: 60px; position: relative;">
        <div class="mask" style="position: fixed"></div>
    </button>
    <!-- Главное окно -->
    <div class="main">
        <!-- Кнопка закрытия -->
        <button class="the_cross" type="button">
            <img src="${chrome.runtime.getURL('images/the_cross.png')}" class="cross" style="position: relative; width: 8px; height: 8px;">
        </button>
        <!-- Заголовок и блок для краткого пересказа -->
        <div class="short_background" style="position: absolute; width: 160px; height: 20px; background: linear-gradient(45deg, #006363, #63f8f8); margin-left: 8.9px;">
            <div class="short" style="position: absolute; font-family: sans-serif; font-weight: 600; font-size: 16px; line-height: 25px; color: white;">Краткий пересказ</div>
        </div>
        <div class="main_0" id="summary1351"></div>
        <!-- Заголовок и блок для подробного пересказа -->
        <div class="long_background" style="position: absolute; width: 190px; height: 20px; background: linear-gradient(45deg, #006363, #63f8f8); margin-left: 8.9px;">
            <div class="long" style="position: absolute; font-family: sans-serif; font-weight: 600; font-size: 16px; line-height: 25px; color: white;">Подробный пересказ</div>
        </div>
        <div class="main_1" id="summary2351"></div>
    </div>
  </body>
</html>
`;

    if (a) {
        try {
            // Создаём контейнер для кнопки
            const buttonContainer = document.createElement('div');
            buttonContainer.innerHTML = html;
            buttonContainer.style.position = 'fixed';
            buttonContainer.style.bottom = '20px';
            buttonContainer.style.right = '20px';
            buttonContainer.style.zIndex = '9999';

            // Контролируем размеры кнопки
            adjustButtonSize(buttonContainer);
            window.addEventListener('resize', () => adjustButtonSize(buttonContainer));

            // Добавляем контейнер в тело документа
            document.body.appendChild(buttonContainer);
        } catch (err) {
            console.error('Ошибка загрузки кнопки:', err);
        }

        const button = document.getElementById("button351221");
        const summary1 = document.getElementById("summary1351");
        const summary2 = document.getElementById("summary2351");

        // Добавляем обработчик клика по кнопке
        button.addEventListener("click", async () => {
            const urlAddress = window.location.href;
            const parts = urlAddress.split('/');
            const slug = parts[parts.length - 2];
            const parse = await fetchReviews(slug);

            console.log("parse:", parse);

            const jsonForSend = {
                language: "russian",
                length_of_text: "200",
                reviews: parse,
                slug: slug
            };

            try {
                const response = await sendDataToServer(jsonForSend);
                const jsonText = response.message;
                console.log("Ответ от сервера jsonText:", jsonText);
                const parsedText = JSON.parse(jsonText);

                if (parsedText) {
                    summary1.textContent = parsedText.short_message || "Ошибка выполнения";
                    summary2.textContent = parsedText.message || "Ошибка выполнения";
                } else {
                    summary1.textContent = "Ошибка выполнения";
                    summary2.textContent = "Ошибка выполнения";
                    console.error("Пустой или некорректный ответ от сервера");
                }
            } catch (error) {
                summary1.textContent = "Ошибка выполнения";
                summary2.textContent = "Ошибка выполнения";
                console.error("Ошибка обработки клика:", error);
            }
        });
    }
})();

/**
 * Функция для изменения размеров кнопки в зависимости от размера окна
 */
function adjustButtonSize(buttonContainer) {
    const windowWidth = window.innerWidth;

    let buttonSize;
    if (windowWidth > 1200) {
        buttonSize = '128px';
    } else if (windowWidth > 800) {
        buttonSize = '64px';
    } else {
        buttonSize = '16px';
    }

    buttonContainer.style.fontSize = buttonSize; // Размер текста
    buttonContainer.style.width = buttonSize; // Ширина кнопки
    buttonContainer.style.height = buttonSize; // Высота кнопки
}

/**
 * Загружает параметр "switch" из Chrome Storage
 */
async function loadParameter() {
    try {
        const result = await chrome.storage.sync.get("switch");
        console.log("Загружен switch:", result.switch);
        return result.switch ?? true; // Возвращает значение или true по умолчанию
    } catch (error) {
        console.error("Ошибка получения switch:", error);
        return true;
    }
}

/**
 * Функция для получения отзывов с сайта
 */
async function fetchReviews(productName) {
    const MAX_CHAR_COUNT = 3000; // Максимальное количество символов
    const BASE_URL = `https://www.ozon.ru/product/${productName}/reviews/`; // URL отзывов
    const CLASS_NAME_END = '_30'; // Конец класса для поиска
    let page = 1; // Номер текущей страницы
    let reviews = []; // Массив для отзывов
    let totalCharCount = 0; // Общий подсчёт символов

    while (true) {
        try {
            const url = `${BASE_URL}?page=${page}&sort=published_at_desc`;
            const response = await fetch(url);
            if (!response.ok) break;

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Поиск всех элементов с отзывами
            const allElements = doc.querySelectorAll(`[class$="${CLASS_NAME_END}"]`);
            const elements = Array.from(allElements).filter(element => {
                const classString = element.className;
                if (typeof classString === 'string') {
                    const classParts = classString.split(' ');
                    return (
                        classParts.length === 2 &&
                        classParts[0].endsWith(CLASS_NAME_END) &&
                        classParts[1].endsWith(CLASS_NAME_END) &&
                        element.innerText.trim().length > 10 &&
                        element.innerText[2] !== "\n" &&
                        !element.innerText.includes("Вам помог этот") &&
                        !element.innerText.includes("В начало")
                    );
                } else {
                    return false;
                }
            });

            console.log("Найденные элементы:", elements);
            if (elements.length === 0) break;

            // Добавление отзывов в массив
            for (let element of elements) {
                const review = element.textContent.trim();
                if (review) {
                    reviews.push(review);
                    totalCharCount += review.length;

                    if (totalCharCount > MAX_CHAR_COUNT) break;
                }
            }

            if (totalCharCount > MAX_CHAR_COUNT) break;

            page++; // Переход к следующей странице
        } catch (error) {
            console.error('Ошибка при загрузке отзывов:', error);
            break;
        }
    }

    return reviews;
}

/**
 * Функция отправки данных на сервер
 */
async function sendDataToServer(data) {
    try {
        // POST-запрос на сервер
        const response = await fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Формат данных
            },
            body: JSON.stringify(data) // Тело запроса
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Ответ от сервера:', result);
            return result;
        } else {
            console.error('Ошибка при отправке данных на сервер:', response.statusText);
            return { message: 'Ошибка при отправке данных на сервер' };
        }
    } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error);
    }
}

