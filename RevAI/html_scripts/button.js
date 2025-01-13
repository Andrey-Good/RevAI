(async function () {
    // Загружаем параметр для проверки активации расширения
    const switch_parameter = await loadParameter();

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
            background-color: #ffffff;
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
        .the_cross:hover {
            opacity: 0%;
        }
        .the_cross:active {
            opacity: 0%;
        }
        /* Блок для краткого пересказа */
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

    if (switch_parameter) {
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
            const pasre = await fetchReviews(url_adress);
            console.log("pasre:", pasre);
            
            const json_for_send = {
                'language': "russian",
                'length_of_text': "200",
                'reviews' : pasre,
                'slug': getSlug(url_adress)
            }

            try {
                const response = await sendDataToServer(json_for_send);
                const jsonText = response.message;
                console.log("Ответ от сервера jsonText:", jsonText);
                const dubbleText = JSON.parse(jsonText);

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
 *  Изменение размеров кнопки в зависимости от размера окна
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
        return result.switch ?? true;
    } catch (error) {
        console.error("Ошибка получения switch:", error);
        return true;
    }
}

async function fetchReviews(url_adress) {
    const MAX_CHAR_COUNT = 3000;
    const domen = url_adress.split('/')[2];
    
    if (domen == 'www.ozon.ru') {
        return await parseOzon(url_adress, MAX_CHAR_COUNT);
    } else if (domen == 'market.yandex.ru') {
        return await parseYandex_market(url_adress, MAX_CHAR_COUNT);
    }
}

async function parseYandex_market(url_adress, MAX_CHAR_COUNT = 3000) {
    // Принцип работы:
    // На Yandex market первые 10 отзывов загружаются вместе с html. А остальные подружаются POST запросами. Так что организуем работу парсинга в соответствии с этим.

    const slugs = getSlug(url_adress);
    let reviews = [];
    let totalCharCount = 0;

    // Берем элементы с отзовами с загруженной страницы
    const firstUseURL = `https://market.yandex.ru/${slugs}/reviews`
    const selector = `script[type="application/ld+json"]`
    const scriptElements = parseSelector(firstUseURL, selector)

    // Добавляем отзывы в массив из элементов
    scriptElements.forEach(scriptElement => {
        try {
          const jsonData = JSON.parse(scriptElement.textContent);
          reviewBody = jsonData.reviewBody.trim()
          totalCharCount += reviewBody.length;
          reviews.push(reviewBody);
        } catch (error) {
          console.error("Ошибка при парсинге JSON:", error);
        }
      });

    
}

async function parseOzon(url_adress, MAX_CHAR_COUNT = 3000) {
    //Принцип работы:
    // Ozon нередко меняет имя класса, что вынуждает идти на ухищрения. Тут берустя классы которые заканчиваются на _30 (среди которых преимущественно и содержатся отзывы) и после фильтруются, чтобы отсались преимущественно отзывы.
    // Подобный подход не так эффективен и надежен, ведь если имя класса смениться координально все сломается. Кроме того подобное не гарантирует что изымутся исключительно отзывы. Возможны посторонние элементы. Но альтернатив я не придумал.

    //const selector = 'pv9_30 w6p_30';
    const CLASS_NAME_END = "_30";
    const selector = `[class$="_30"]`
    const slug = getSlug(url_adress);
    let page = 1;
    let reviews = [];
    let totalCharCount = 0;

    //Перебираем все страницы с отзывами о товаре и добавляем найденные в массив.
    while (true) {
        try {
            const url = `https://www.ozon.ru/product/${slug}/reviews?page=${page}&page_key=CL7wxNgGEgwI8MiMugYQyM2qxQEYBQ&sort=published_at_desc`;
            const all_elements = await parseSelector(url, selector);
            if (all_elements === null) break;
            
            // Фильтруем элементы с отзывами и перерабатываем в текст
            //console.log("all_elements:", all_elements);
            const elements = Array.from(all_elements).filter(element => {
                const classString = element.className;
                console.log("element:", element, "classString:", classString);
                //console.log("classString:", classString);
                if (typeof classString === 'string') {
                    const classParts = classString.split(' ');
                    return classParts.length === 2 &&
                            classParts[0].endsWith(CLASS_NAME_END) &&
                            classParts[1].endsWith(CLASS_NAME_END) && 
                            element.innerText.trim().length > 10 &&
                            element.innerText[2] != "\n" &&
                            !element.innerText.includes("Вам помог этот") &&
                            !element.innerText.includes("В начало");            //Фильтруем посторонние элементы
                } else {
                    return false;
                }
            });
            console.log("elements:", elements);
            if (elements.length === 0) break; // Прекращаем, если отзывов на странице нет

            // Добавляем отзывы в массив
            for (const element of elements) {
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
            console.error('Ошибка при парсинге:', error);
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


async function getProductReviewTexts(productSlug, page) {
    const url = 'https://market.yandex.ru/api/render-lazy?w=%40card%2FReviewsLayout';
  
    // *** Необходимо подбирать актуальный cookie ***
    const cookie = '';
  
    const headers = {
      ':authority': 'market.yandex.ru',
      ':method': 'POST',
      ':path': '/api/render-lazy?w=%40card%2FReviewsLayout',
      ':scheme': 'https',
      'accept': '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'content-type': 'application/json',
      'cookie': cookie,
      'origin': 'https://market.yandex.ru',
      'priority': 'u=1, i',
      'referer': `https://market.yandex.ru/product--${productSlug}/reviews`,
      'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      // sk - скорее всего постоянный, но если будут проблемы, стоит проверить актуальность
      'sk': 's4ab4ae8a1a5346b6785ea5686f3d3ee5',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      // x-market-app-version - может меняться со временем
      'x-market-app-version': '2024.12.22.0.t2775028156',
      'x-market-core-service': 'default',
      // x-market-first-req-id - генерируется при загрузке страницы, нужно получать актуальный
      'x-market-first-req-id': '',
      // x-market-front-glue - вероятно тоже меняется
      'x-market-front-glue': '',
      'x-market-page-id': 'market:product-reviews',
    };
  
    const requestBody = {
      "widgets": [{
        "lazyId": "cardReviewsLayout46", // Возможно, это значение динамическое
        "widgetName": "@card/ReviewsLayout",
        "options": {
          "resolverParams": {},
          "widgetName": "@card/ReviewsLayout",
          "id": "ReviewsLayoutRenderer",
          "slotOptions": { "dynamic": true },
          "className": "",
          "needToProvideData": false,
          "wrapperProps": {},
          "layoutOptions": {
            "entityWrapperProps": { "paddings": { "top": "5", "bottom": "5" } },
            "loaderWrapperProps": { "paddings": { "top": "5", "bottom": "5" } }
          },
          "ignoreRemixGrid": false,
          "forceCountInRow": false,
          "isChefRemixExp": false,
          "extraProps": {
            "params": {
              "customConfigName": "all_product_reviews_web_next_page",
              "reviewPage": page.toString()
            }
          },
          "widgetSource": "default"
        },
        "slotOptions": { "dynamic": true }
      }],
      // cspNonce - может быть динамическим
      "cspNonce": "",
      "path": `/product--${productSlug}/reviews`,
      "widgetsSource": "default",
      "experimental": {}
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        return null;
      }
  
      const data = await response.json();
      const reviewTexts = data.payload.markup.widgets[0].props.reviews.map(review => review.text);
      return reviewTexts;
  
    } catch (error) {
      console.error("Could not fetch product reviews:", error);
      return [];
    }
  }


  /**
 * Принимает url и серектор и возвращает все спарсиные элементы
 */
async function parseSelector(url, selector) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        };
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Находим элементы с отзывами
        return doc.querySelectorAll(selector);
    } catch (error) {
        console.error('Ошибка при парсинге:', error);
    }
}

function getSlug(url_adress) {
    const domen = url_adress.split('/')[2];

    if (domen == 'www.ozon.ru') {
        return url_adress.split('/')[4];
    } else if (domen == 'market.yandex.ru') {
        return  url_adress.split('/')[3] + '/' + url_adress.split('/')[4];  
    }
}