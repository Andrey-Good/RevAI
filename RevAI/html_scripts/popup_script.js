// Сообщение в консоли, указывающее, что скрипт подключен успешно
console.log("Скрипт успешно подключён!");

// Асинхронная функция для инициализации кнопки
async function initializeButton() {
    // Получаем элемент кнопки по его ID
    const button = document.getElementById('toggleButton');

    // Загружаем текущее значение параметра "switch" из хранилища
    const switchValue = await loadParameter();

    // Устанавливаем текст кнопки в зависимости от значения параметра
    if (switchValue) {
        button.textContent = "on";
    } else {
        button.textContent = "off";
    }
}

// Асинхронная функция для загрузки параметра "switch" из хранилища
async function loadParameter() {
    try {
        // Получаем значение параметра из синхронного хранилища Chrome
        const result = await chrome.storage.sync.get("switch");

        // Логируем загруженное значение в консоль
        console.log("Загружен switch:", result.switch);

        // Возвращаем значение параметра или true по умолчанию
        return result.switch ?? true;
    } catch (error) {
        // Логируем ошибку в случае сбоя
        console.error("Ошибка получения switch:", error);

        // Возвращаем true в случае ошибки
        return true;
    }
}

// Асинхронная функция для сохранения параметра "switch" в хранилище
async function saveParameter(value) {
    try {
        // Сохраняем значение параметра в синхронное хранилище Chrome
        await chrome.storage.sync.set({ switch: value });

        // Логируем сохранённое значение
        console.log("Сохранен switch:", value);
    } catch (error) {
        // Логируем ошибку в случае сбоя
        console.error("Ошибка сохранения switch:", error);
    }
}

// Обработчик события загрузки страницы
window.onload = async function () {
    // Инициализируем состояние кнопки
    await initializeButton();

    // Назначаем обработчик события клика на кнопку
    document.getElementById('toggleButton').addEventListener('click', async function () {
        const button = this;

        // Проверяем, есть ли класс "loading", чтобы предотвратить повторные клики
        if (button.classList.contains('loading')) {
            return;
        }

        // Инвертируем текущее значение параметра "switch"
        const selected_switch = !(await loadParameter());

        // Сохраняем новое значение параметра
        await saveParameter(selected_switch);

        // Добавляем класс "loading", чтобы показать, что идёт обработка
        button.classList.add('loading');

        // Устанавливаем таймер на 3 секунды
        setTimeout(function () {
            // Удаляем класс "loading" после завершения обработки
            button.classList.remove('loading');

            // Изменяем текст кнопки в зависимости от нового значения параметра
            if (selected_switch) {
                button.textContent = "on";
            } else {
                button.textContent = "off";
            }
        }, 3000);
    });
};