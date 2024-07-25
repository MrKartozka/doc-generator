const inputFields = {
    report: ["ФАКУЛЬТЕТ", "КАФЕДРА", "ФИО", "Группа", "Вид практики", "Тип практики", "Предприятие", "Руководитель", "Оценка"],
    diary: ["ФИО", "Направление/Специальность", "Направленность/Профиль", "Учебная группа", "Форма обучения", "Вид практики", "Тип практики", "Начало учебного года", "Конец учебного года", "Календарный год", "Кафедра", "Город", "Наименование профильной организации", "День начала организации практической подготовки", "Месяц начала организации практической подготовки", "День конца организации практической подготовки", "Месяц конца организации практической подготовки", "Руководитель по практической подготовке от кафедры", "Номер телефона руководителя по практической подготовке от кафедры", "Заведующий кафедрой", "Руководитель по практической подготовке от профильной организации", "Индивидуальное задание", "Характеристика-отзыв", "Выводы и оценки кафедры"]
};

let documentData = {};

document.addEventListener('DOMContentLoaded', () => {
    loadReport();
});

function loadReport() {
    loadContent('../docs/report.html', '../docs/styles/report.css', 'Отчет по производственной практике');
}

function loadDiary() {
    loadContent('../docs/diary.html', '../docs/styles/diary.css', 'Дневник практики');
}

function loadContent(htmlPath, cssPath, title) {
    const contentContainer = document.getElementById('content-container');
    const headerTitle = document.getElementById('header-title');

    // Проверка, что контейнеры существуют
    if (!contentContainer || !headerTitle) {
        console.error('Content container or header title not found');
        return;
    }

    console.log('Content container and header title found');

    // Загрузка HTML контента
    fetch(htmlPath)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.text();
        })
        .then(html => {
            contentContainer.innerHTML = html;
            headerTitle.textContent = title;
            createForm(title.toLowerCase().includes('дневник') ? 'diary' : 'report');
            applyStyles(cssPath);
        })
        .catch(error => console.error('Error loading content:', error));
}

function createForm(content) {
    const container = document.getElementById('input-container');
    if (!container) {
        console.error('Input container element not found');
        return;
    }

    container.innerHTML = '';

    inputFields[content].forEach(field => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field;

        const input = (field.startsWith("Индивидуальное задание") || field.startsWith("Характеристика-отзыв") || field.startsWith("Выводы и оценки кафедры")) ? 'textarea' : 'input';
        const inputElement = document.createElement(input);
        inputElement.name = field;
        inputElement.className = 'form-control';
        inputElement.value = documentData[field] || '';
        inputElement.oninput = handleInputChange;

        inputGroup.appendChild(label);
        inputGroup.appendChild(inputElement);
        container.appendChild(inputGroup);
    });
}

function handleInputChange(event) {
    documentData[event.target.name] = event.target.value;
    updateDocument();
}

function updateDocument() {
    const content = localStorage.getItem('content') || 'report';
    const contentContainer = document.getElementById('content-container');

    fetch(content === 'diary' ? '../docs/diary.html' : '../docs/report.html')
        .then(response => response.text())
        .then(data => {
            for (let key in documentData) {
                const regex = new RegExp(`___${key}___`, 'g');
                data = data.replace(regex, documentData[key]);
            }
            contentContainer.innerHTML = data;
        })
        .catch(error => console.error('Error updating document:', error));
}

function applyStyles(cssPath) {
    let link = document.querySelector('link[data-template-css]');
    if (link) {
        link.href = cssPath;
    } else {
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        link.dataset.templateCss = true;
        document.head.appendChild(link);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function printDocument() {
    window.print();
}
