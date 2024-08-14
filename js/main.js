const inputFields = {
    report: ["ФАКУЛЬТЕТ", "КАФЕДРА", "ФИО", "Группа", "Вид практики", "Тип практики", "Предприятие", "Руководитель", "Оценка"],
    diary: ["ФИО", "Направление/Специальность", "Направленность/Профиль", "Учебная группа", "Форма обучения", "Вид практики", "Тип практики", "Начало учебного года", "Конец учебного года", "Календарный год", "Кафедра", "Город", "Наименование профильной организации", "День начала организации практической подготовки", "Месяц начала организации практической подготовки", "День конца организации практической подготовки", "Месяц конца организации практической подготовки", "Руководитель по практической подготовке от кафедры", "Номер телефона руководителя по практической подготовке от кафедры", "Заведующий кафедрой", "Руководитель по практической подготовке от профильной организации", "Индивидуальное задание", "Характеристика-отзыв", "Выводы и оценки кафедры"]
};

let documentData = {
    "Форма обучения": "ОЧНОЙ",
    "Вид практики": "Учебная практика",
    "Тип практики": "Технологическая (проектно-технологическая) практика"
};
let practicePlans = {};

document.addEventListener('DOMContentLoaded', () => {
    loadPracticePlans();
});

function loadPracticePlans() {
    fetch('../practicePlans.json')
        .then(response => response.json())
        .then(data => {
            practicePlans = data;
            loadDiary(); // Загружаем дневник после загрузки practicePlans
        })
        .catch(error => console.error('Ошибка при загрузке practicePlans.json:', error));
}

function loadDiary() {
    localStorage.setItem('content', 'diary');
    loadContent('docs/diary.html', '../styles/diary.css', 'Дневник практики');
}

function loadContent(htmlPath, cssPath, title) {
    const contentContainer = document.getElementById('preview-container');
    const headerTitle = document.getElementById('header-title');

    if (!contentContainer || !headerTitle) {
        console.error('Preview container или header title не найдены');
        return;
    }

    fetch(htmlPath)
        .then(response => response.text())
        .then(html => {
            contentContainer.innerHTML = html;
            headerTitle.textContent = title;
            applyStyles(cssPath);
            createForm(title.toLowerCase().includes('дневник') ? 'diary' : 'report');

            // Убедитесь, что таблица загружена перед вызовом updateTableContent
            if (document.querySelector('.table tbody')) {
                updateTableContent(practicePlans, documentData); // Обновляем таблицу после загрузки контента
            } else {
                console.error('Table body not found after content load!');
            }
        })
        .catch(error => console.error('Ошибка при загрузке контента:', error));
}



function createForm(content) {
    const container = document.getElementById('input-container');
    if (!container) return;

    container.innerHTML = '';

    const fields = inputFields[content];
    if (!fields) return;

    fields.forEach(field => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field;

        let inputElement;

        if (field === "Вид практики" || field === "Тип практики" || field === "Форма обучения") {
            inputElement = document.createElement('select');
            populateSelectOptions(inputElement, field);
        } else if (field.startsWith("Индивидуальное задание") || field.startsWith("Характеристика-отзыв") || field.startsWith("Выводы и оценки кафедры")) {
            inputElement = document.createElement('textarea');
        } else {
            inputElement = document.createElement('input');
        }

        inputElement.name = field;
        inputElement.className = 'form-control';
        inputElement.value = documentData[field] || '';
        inputElement.oninput = handleInputChange;

        if (field === "Вид практики") {
            inputElement.onchange = handlePracticeTypeChange;
        }

        inputGroup.appendChild(label);
        inputGroup.appendChild(inputElement);
        container.appendChild(inputGroup);
    });

    updateDocument();  // Обновляем документ сразу после создания формы
}

function populateSelectOptions(selectElement, field) {
    let options = [];

    if (field === "Вид практики") {
        options = practicePlans.types.map(plan => plan.name);
    } else if (field === "Тип практики") {
        const selectedPractice = documentData["Вид практики"];
        if (selectedPractice) {
            const selectedPlan = practicePlans.types.find(plan => plan.name === selectedPractice);
            options = selectedPlan ? selectedPlan.types.map(type => type.type) : [];
        }
    } else if (field === "Форма обучения") {
        options = ["ОЧНОЙ", "ЗАОЧНОЙ", "ОЧНО-ЗАОЧНОЙ"];
    }

    selectElement.innerHTML = '';

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });

    selectElement.value = documentData[field] || options[0];
}

function handleInputChange(event) {
    documentData[event.target.name] = event.target.value.trim();
    saveDocumentData(); // Сохраняем данные в localStorage при каждом изменении
    updateDocument();  // Обновляем документ после изменения данных
}

function handlePracticeTypeChange(event) {
    documentData[event.target.name] = event.target.value.trim();
    const practiceTypeSelect = document.querySelector('select[name="Тип практики"]');
    if (practiceTypeSelect) {
        populateSelectOptions(practiceTypeSelect, "Тип практики");
        practiceTypeSelect.selectedIndex = 0;
        documentData["Тип практики"] = practiceTypeSelect.value;
    }
    saveDocumentData(); // Сохраняем данные в localStorage при каждом изменении
    updateDocument();
    updateTableContent(practicePlans, documentData); // Обновляем таблицы в зависимости от типа практики
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

function saveDocumentData() {
    localStorage.setItem('documentData', JSON.stringify(documentData));
}