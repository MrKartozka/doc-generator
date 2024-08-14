function checkCSSLoaded() {
    const testElement = document.createElement('div');
    testElement.className = 'test-css';
    document.body.appendChild(testElement);

    const style = window.getComputedStyle(testElement);
    if (style.backgroundColor === 'rgb(255, 0, 0)') {
        console.log('CSS успешно загружен');
    } else {
        console.log('CSS не загружен');
    }

    document.body.removeChild(testElement);
}

function loadCSS() {
    return new Promise((resolve, reject) => {
        const existingLink = document.querySelector('link[href="../styles/preview.css"]');
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../styles/preview.css';
            link.onload = () => resolve();
            link.onerror = () => reject(new Error('Ошибка загрузки CSS'));
            document.head.appendChild(link);
        } else {
            resolve();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const documentData = JSON.parse(localStorage.getItem('documentData')) || {};
    const content = localStorage.getItem('content') || 'report';
    const contentContainer = document.getElementById('content');

    if (!contentContainer) {
        console.error('Content container not found');
        return;
    }

    loadCSS().then(() => {
        console.log('CSS файл загружен');
        fetch(content === 'diary' ? '../docs/diary.html' : '../docs/report.html')
            .then(response => response.text())
            .then(data => {
                for (let key in documentData) {
                    const regex = new RegExp(`___${key}___`, 'g');
                    const value = documentData[key] || ''; // Если данных нет, подставляем пустую строку
                    data = data.replace(regex, value);
                }

                // Удаляем оставшиеся незаполненные аргументы
                data = data.replace(/___\w+___/g, '');

                contentContainer.innerHTML = data;
                window.PagedPolyfill.preview().then(() => {
                    checkCSSLoaded(); // Проверяем, загрузился ли CSS
                });
            })
            .catch(error => console.error('Ошибка при загрузке контента:', error));

    }).catch(error => console.error(error));
});
