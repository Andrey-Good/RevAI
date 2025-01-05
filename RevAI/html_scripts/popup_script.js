console.log("Скрипт успешно подключён!1223");
async function initializeButton() {
    const button = document.getElementById('toggleButton');
    const switchValue = await loadParameter();
    if (switchValue) {
        button.textContent = "on";
    } else {
        button.textContent = "off";
    }
}

// Асинхронная функция для загрузки параметров
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
    
// Асинхронная функция для сохранения параметров
async function saveParameter(value) {
try {
    await chrome.storage.sync.set({ switch: value });
    console.log("Сохранен switch:", value);
} catch (error) {
    console.error("Ошибка сохранения switch:", error);
}
}

window.onload = async function() {
    await initializeButton();
    
    document.getElementById('toggleButton').addEventListener('click', async function() { 
        const button = this;

        // Prevent multiple clicks while loading
        if (button.classList.contains('loading')) {
            return;
        }

        const selected_switch =  !(await loadParameter());
        
        await saveParameter(selected_switch)
        
        // Добавление класса загрузки
        button.classList.add('loading');

        // Установка таймера на 3 секунды
        setTimeout(function() {
            // Удаление класса загрузки
            button.classList.remove('loading');
            
            // Смена текста на противоположный
            if (selected_switch) {
                button.textContent = "on";
            } else {
                button.textContent = "off";
            };
        }, 3000);
        });
    }