import { loadParameter, saveParameter } from './utils.js';

window.onload = async function() {
    await initializeButton();
    
    document.getElementById('toggleButton').addEventListener('click', async function() { 
        const button = this;

        // Предотвращение множественных щелчков при загрузке
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

async function initializeButton() {
    const button = document.getElementById('toggleButton');
    const switchValue = await loadParameter();
    if (switchValue) {
        button.textContent = "on";
    } else {
        button.textContent = "off";
    }
}
