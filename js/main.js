const inputFields = {
    report: ["ФАКУЛЬТЕТ", "КАФЕДРА", "ФИО", "Группа", "Вид практики", "Тип практики", "Предприятие", "Руководитель", "Оценка"],
    diary: ["ФИО", "Направление/Специальность", "Направленность/Профиль", "Учебная группа", "Форма обучения", "Вид практики", "Тип практики", "Начало учебного года", "Конец учебного года", "Календарный год", "Кафедра", "Город", "Наименование профильной организации", "День начала организации практической подготовки", "Месяц начала организации практической подготовки", "День конца организации практической подготовки", "Месяц конца организации практической подготовки", "Руководитель по практической подготовке от кафедры", "Номер телефона руководителя по практической подготовке от кафедры", "Заведующий кафедрой", "Руководитель по практической подготовке от профильной организации", "Индивидуальное задание", "Характеристика-отзыв", "Выводы и оценки кафедры"]
};

let documentData = {};

document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

function initialize() {
    const contentContainer = document.getElementById('preview-container');
    const headerTitle = document.getElementById('header-title');

    if (contentContainer && headerTitle) {
        loadReport();
    } else {
        console.error('Content container or header title not found on DOMContentLoaded');
    }
}

function loadReport() {
    localStorage.setItem('content', 'report');
    loadContent('docs/report.html', '../styles/report.css', 'Отчет по производственной практике');
}

function loadDiary() {
    localStorage.setItem('content', 'diary');
    loadContent('docs/diary.html', '../styles/diary.css', 'Дневник практики');
}

function loadPreview() {
    saveDocumentData();
    window.open('preview.html', '_blank');
}

function loadContent(htmlPath, cssPath, title) {
    const contentContainer = document.getElementById('preview-container');
    const headerTitle = document.getElementById('header-title');

    if (!contentContainer || !headerTitle) {
        console.error('Preview container or header title not found');
        return;
    }

    fetch(htmlPath)
        .then(response => response.ok ? response.text() : Promise.reject(response.statusText))
        .then(html => {
            contentContainer.innerHTML = html;
            headerTitle.textContent = title;
            applyStyles(cssPath);
            createForm(title.toLowerCase().includes('дневник') ? 'diary' : 'report');
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

    const fields = inputFields[content];
    if (!fields) {
        console.error(`No input fields found for content: ${content}`);
        return;
    }

    fields.forEach(field => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field;

        const inputElement = (field.startsWith("Индивидуальное задание") || field.startsWith("Характеристика-отзыв") || field.startsWith("Выводы и оценки кафедры")) ? document.createElement('textarea') : document.createElement('input');
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
    const contentContainer = document.getElementById('preview-container');

    fetch(content === 'diary' ? 'docs/diary.html' : 'docs/report.html')
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

function saveDocumentData() {
    localStorage.setItem('documentData', JSON.stringify(documentData));
}
