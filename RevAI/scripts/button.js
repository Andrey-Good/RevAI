(async function () {
  const a = await loadParameter();


  html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>expansion</title>
    <style>
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
        .mask {
            width: 60px;
            height: 60px;
            right: 20px;
            bottom: 20px;
            border-radius: 14.65px;
        }
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
        .main {
            width: 250px;
            height: 400px;
            background-color: #ffffff;
            background-color: rgb(230, 255, 247);
            box-shadow: -10px 10px 10px -4px rgba(34, 60, 80, 0.2);
            border-radius: 10px;
            position: fixed;
            right: 100px;
            bottom: 20px;
        }
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
        .the_cross:hover {
            opacity: 0%;
        }
        .the_cross:active {
            opacity: 0%;
        }
        .main_0 {
            width: 210px;
            height: 100px;
            background-color: #ffffff;
            border: 1.5px solid transparent;
            border-radius: 10px;
            border-image: linear-gradient(45deg, #006363, #63f8f8);
            border-image-slice: 1;
            margin-top: 25px;
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
        /* для Chrome/Edge/Safari ползунок*/
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
        .main_1 {
            width: 210px;
            height: 237px;
            background-color: #ffffff;
            border: 1.5px solid transparent;
            border-radius: 10px;
            border-image: linear-gradient(45deg, #006363, #63f8f8);
            border-image-slice: 1;
            margin-left: auto;
            margin-right: auto;
            margin-top: 25px;
            font-family: sans-serif;
            text-align: left;
            text-indent: 10px;
            font-size: 14px;
            white-space: normal;
            overflow-wrap: break-word;
            padding: 0px 10px;
            overflow-y: auto;
        } 
    </style>
  </head>
  <body>
    <button class="buttom_right" id="button351221">
        <img src="${chrome.runtime.getURL('images/logo.png')}" alt="Логотип" class="logo" style="width: 60px; height: 60px; position: relative;">
        <div class="mask" style="position: fixed"></div>
    </button>
    <div class="main">
        <button class="the_cross" type="button">
            <img src="${chrome.runtime.getURL('images/the_cross.png')}" class="cross" style="position: relative; width: 8px; height: 8px; margin-bottom: 10px">
        </button>
        <div class="short_background" style="position: absolute; width: 160px; height: 20px; background: linear-gradient(45deg, #006363, #63f8f8); margin-left: 8.9px; margin-top: 4.8px; ">
            <div class="short" style="position: absolute; width: 250px; height: 20px; font-family: sans-serif; font-weight: 600; font-size: 16px; line-height: 25px; margin-left: 7px; color: white; top: -2px">Краткий пересказ</div>
        </div>
        <div class="main_0" id="summary1351"></div>
        <div class="long_background" style="position: absolute; width: 190px; height: 20px; background: linear-gradient(45deg, #006363, #63f8f8); margin-left: 8.9px; margin-top: 4.8px; ">
            <div class="long" style="position: absolute; width: 250px; height: 20px; font-family: sans-serif; font-weight: 600; font-size: 16px; line-height: 25px; margin-left: 10px; margin-left: 7px; color: white; top: -2px">Подробный пересказ</div>
        </div>
        <div class="main_1" id="summary2351"></div>
    </div>
</body>
</html>
`;

if (a) {
    try {
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

    button.addEventListener("click", async () => {
        const url_adress =  window.location.href;
        const parts = url_adress.split('/');
        const slug = parts[parts.length - 2];
        const pasre = await fetchReviews(slug);
        console.log("pasre:", pasre);
        
        json_for_send = {
            'language': "russian",
            'length_of_text': "200",
            'reviews' : pasre,
            'slug': slug
        }

        try {
            const response = await sendDataToServer(json_for_send);
            const jsonText = response.message;
            console.log("Ответ от сервера jsonText:", jsonText);
            const dubbleText = JSON.parse(jsonText);
            //dubbleText = 1;

            if (dubbleText) {
                summary1.textContent = dubbleText.short_message || "Ошибка выполнения";
                summary2.textContent = dubbleText.message || "Ошибка выполнения";
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
 *  Функция для изменения размеров кнопки в зависимости от размера окна
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

async function loadParameter() {
    try {
        const result = await chrome.storage.sync.get("switch");
        console.log("Загружен switch:", result.switch);
        return result.switch ?? true;
    } catch (error) {
        console.error("Ошибка получения switch:", error);
        return true;
    }
}

async function fetchReviews(productName) {
    const MAX_CHAR_COUNT = 3000;
    const BASE_URL = `https://www.ozon.ru/product/${productName}/reviews/`;
    //const CLASS_NAME = 'pv9_30 w6p_30';
    const CLASS_NAME_END = '_30'
    let page = 1;
    let reviews = [];
    let totalCharCount = 0;

    //Перебираем все страницы с отзывами о товаре
    while (true) {
        try {
            const url = `${BASE_URL}?page=${page}&page_key=CL7wxNgGEgwI8MiMugYQyM2qxQEYBQ&sort=published_at_desc`;
            const response = await fetch(url);
            if (!response.ok) break;
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Находим элементы с отзывами
            //const elements = doc.querySelectorAll(`.${CLASS_NAME.replace(/ /g, '.')}`);
            const all_elements = doc.querySelectorAll(`[class$="${CLASS_NAME_END}"]`);
            //console.log("all_elements:", all_elements);
            const elements = Array.from(all_elements).filter(element => {
                const classString = element.className;
                //console.log("classString:", classString);
                if (typeof classString === 'string') {
                    const classParts = classString.split(' ');
                    return classParts.length === 2 &&
                            classParts[0].endsWith(CLASS_NAME_END) &&
                            classParts[1].endsWith(CLASS_NAME_END) && 
                            element.innerText.trim().length > 10 &&
                            element.innerText[2] != "\n" &&
                            !element.innerText.includes("Вам помог этот") &&
                            !element.innerText.includes("В начало");
                } else {
                    return false;
                }
            });
            console.log("elements:", elements);
            if (elements.length === 0) break; // Прекращаем, если отзывов на странице нет

            // Добавляем отзывы в массив
            for (let element of elements) {
                const review = element.textContent.trim();
                if (review) {
                    reviews.push(review);
                    totalCharCount += review.length;

                    if (totalCharCount > MAX_CHAR_COUNT) break;
                }
            }

            if (totalCharCount > MAX_CHAR_COUNT) break;

            page++;
        } catch (error) {
            console.error('Ошибка при загрузке отзывов:', error);
            break;
        }
    }

    return reviews;
}

async function sendDataToServer(data) {
    try {
        //POST-запрос на сервер по указанному URL
        const response = await fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Заголовок, указывающий формат отправляемых данных
            },
            body: JSON.stringify(data)  
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Ответ от сервера:', result);
            return result;
        }
        console.error('Ошибка при отправке данных на сервер:', response.statusText);
        return { message: 'Ошибка при отправке данных на сервер' };
    } 
    catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error);
    }
}

