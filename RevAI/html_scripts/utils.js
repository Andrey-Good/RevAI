/**
 * Загружает параметр "switch" из Chrome Storage
 */
export async function loadParameter() {
    try {
        const result = await chrome.storage.sync.get("switch");
        console.log("Загружен switch:", result.switch);
        return result.switch ?? true;
    } catch (error) {
        console.error("Ошибка получения switch:", error);
        return true;
    }
}

export async function saveParameter(value) {
    try {
        await chrome.storage.sync.set({ switch: value });
        console.log("Сохранен switch:", value);
    } catch (error) {
        console.error("Ошибка сохранения switch:", error);
    }
    }