const inputFields = {
    report: [
        "ФАКУЛЬТЕТ",
        "КАФЕДРА",
        "ФИО",
        "Группа",
        "Календарный год",
        "Вид практики",
        "Тип практики",
        "Предприятие",
        "Руководитель",
        "Оценка",
    ],
    diary: [
        "ФИО",
        "Направление/Специальность",
        "Направленность/Профиль",
        "Учебная группа",
        "Форма обучения",
        "Вид практики",
        "Тип практики",
        "Начало учебного года",
        "Конец учебного года",
        "Календарный год",
        "Кафедра",
        "Город",
        "Наименование профильной организации",
        "День начала организации практической подготовки",
        "Месяц начала организации практической подготовки",
        "День конца организации практической подготовки",
        "Месяц конца организации практической подготовки",
        "Руководитель по практической подготовке от кафедры",
        "Номер телефона руководителя по практической подготовке от кафедры",
        "Заведующий кафедрой",
        "Руководитель по практической подготовке от профильной организации",
        "Индивидуальное задание",
        "Характеристика-отзыв",
        "Выводы и оценки кафедры",
    ],
};

let documentData = {
    "Форма обучения": "ОЧНОЙ",
    "Вид практики": "Учебная практика",
    "Тип практики": "Технологическая (проектно-технологическая) практика",
};

let practicePlans = {};

document.addEventListener("DOMContentLoaded", () => {
    loadPracticePlans();
});

function loadPracticePlans() {
    fetch("../practicePlans.json")
        .then((response) => response.json())
        .then((data) => {
            practicePlans = data;
            console.log("Загруженные данные practicePlans:", practicePlans);
            loadDiary();
        })
        .catch((error) =>
            console.error("Ошибка при загрузке practicePlans.json:", error)
        );
}

function loadDiary() {
    localStorage.setItem("content", "diary");
    loadContent(
        "docs/diary.html",
        "../styles/diary.css",
        "Дневник практики",
        "diary"
    );
}

function loadReport() {
    localStorage.setItem("content", "report");
    loadContent(
        "docs/report.html",
        "../styles/report.css",
        "Отчет по производственной практике",
        "report"
    );
}

function loadContent(htmlPath, cssPath, title, contentType) {
    const contentContainer = document.getElementById("preview-container");
    const headerTitle = document.getElementById("header-title");

    if (!contentContainer || !headerTitle) {
        console.error("Preview container или header title не найдены");
        return;
    }

    fetch(htmlPath)
        .then((response) => response.text())
        .then((html) => {
            contentContainer.innerHTML = html;
            headerTitle.textContent = title;
            applyStyles(cssPath);
            createForm(contentType);
        })
        .catch((error) =>
            console.error("Ошибка при загрузке контента:", error)
        );
}

function createForm(content) {
    const container = document.getElementById("input-container");
    if (!container) return;

    container.innerHTML = "";

    const fields = inputFields[content];
    if (!fields) return;

    fields.forEach((field) => {
        const inputGroup = document.createElement("div");
        inputGroup.className = "form-group";

        const label = document.createElement("label");
        label.textContent = field;

        let inputElement;

        if (
            ["Вид практики", "Тип практики", "Форма обучения"].includes(field)
        ) {
            inputElement = document.createElement("select");
            populateSelectOptions(inputElement, field);
        } else if (
            [
                "Индивидуальное задание",
                "Характеристика-отзыв",
                "Выводы и оценки кафедры",
            ].some((prefix) => field.startsWith(prefix))
        ) {
            inputElement = document.createElement("textarea");
        } else {
            inputElement = document.createElement("input");
        }

        inputElement.name = field;
        inputElement.className = "form-control";
        inputElement.value = documentData[field] || "";
        inputElement.oninput = handleInputChange;

        if (field === "Вид практики") {
            inputElement.onchange = handlePracticeTypeChange;
        }

        inputGroup.appendChild(label);
        inputGroup.appendChild(inputElement);
        container.appendChild(inputGroup);
    });

    // Добавляем кнопки для обновления каждой таблицы отдельно
    const updatePlanButton = document.createElement("button");
    updatePlanButton.textContent = "Обновить Рабочий График";
    updatePlanButton.className = "btn btn-primary mt-3";
    updatePlanButton.onclick = () =>
        updatePlanTable(practicePlans, documentData);
    container.appendChild(updatePlanButton);

    const updateCompetenciesButton = document.createElement("button");
    updateCompetenciesButton.textContent = "Обновить Компетенции";
    updateCompetenciesButton.className = "btn btn-primary mt-3";
    updateCompetenciesButton.onclick = () =>
        updateCompetenciesTable(practicePlans, documentData);
    container.appendChild(updateCompetenciesButton);

    updateDocument();
}

function populateSelectOptions(selectElement, field) {
    let options = [];

    if (field === "Вид практики") {
        options = practicePlans.types.map((plan) => plan.name);
    } else if (field === "Тип практики") {
        const selectedPractice = documentData["Вид практики"];
        if (selectedPractice) {
            const selectedPlan = practicePlans.types.find(
                (plan) => plan.name === selectedPractice
            );
            options = selectedPlan
                ? selectedPlan.types.map((type) => type.type)
                : [];
        }
    } else if (field === "Форма обучения") {
        options = ["ОЧНОЙ", "ЗАОЧНОЙ", "ОЧНО-ЗАОЧНОЙ"];
    }

    selectElement.innerHTML = "";
    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });

    selectElement.value = documentData[field] || options[0];
    console.log(`Пополнены опции для поля ${field}:`, options);
}

function handleInputChange(event) {
    documentData[event.target.name] = event.target.value.trim();
    saveDocumentData();
    updateDocument();
}

function handlePracticeTypeChange(event) {
    documentData[event.target.name] = event.target.value.trim();
    const practiceTypeSelect = document.querySelector(
        'select[name="Тип практики"]'
    );
    if (practiceTypeSelect) {
        populateSelectOptions(practiceTypeSelect, "Тип практики");
        const availableTypes = practiceTypeSelect.options;
        if (availableTypes.length > 0) {
            practiceTypeSelect.selectedIndex = 0;
            documentData["Тип практики"] = availableTypes[0].value;
        } else {
            documentData["Тип практики"] = "";
        }
    }

    saveDocumentData();
    updateDocument();
}

function applyStyles(cssPath) {
    let link = document.querySelector("link[data-template-css]");
    if (link) {
        link.href = cssPath;
    } else {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssPath;
        link.dataset.templateCss = true;
        document.head.appendChild(link);
    }
}

function saveDocumentData() {
    localStorage.setItem("documentData", JSON.stringify(documentData));
}

function updatePlanTable(practicePlans, documentData) {
    const selectedPracticeType = documentData["Тип практики"];
    const selectedPractice = documentData["Вид практики"];

    const practicePlan = practicePlans.types.find(
        (plan) => plan.name === selectedPractice
    );
    if (!practicePlan) return;

    const planTableBody = document.querySelector("#plan-table tbody");
    if (planTableBody) {
        planTableBody.innerHTML = "";

        if (Array.isArray(practicePlan.plan)) {
            practicePlan.plan.forEach((stage) => {
                const row = document.createElement("tr");

                const dateCell = document.createElement("td");
                dateCell.textContent = "";

                const stageCell = document.createElement("td");
                stageCell.textContent = stage.stage;

                const taskCell = document.createElement("td");
                taskCell.textContent = stage.tasks;

                const statusCell = document.createElement("td");
                statusCell.textContent = "";

                row.appendChild(dateCell);
                row.appendChild(stageCell);
                row.appendChild(taskCell);
                row.appendChild(statusCell);

                planTableBody.appendChild(row);
            });
        }
    }
}

function updateCompetenciesTable(practicePlans, documentData) {
    const selectedPracticeType = documentData["Тип практики"];
    const selectedPractice = documentData["Вид практики"];

    const practicePlan = practicePlans.types.find(
        (plan) => plan.name === selectedPractice
    );
    if (!practicePlan) return;

    const practiceTypeData = practicePlan.types.find(
        (type) => type.type === selectedPracticeType
    );
    if (!practiceTypeData) return;

    const competenciesTableBody = document.querySelector(
        ".table:nth-of-type(3) tbody"
    );
    if (competenciesTableBody) {
        competenciesTableBody.innerHTML = "";

        if (Array.isArray(practiceTypeData.competencies)) {
            practiceTypeData.competencies.forEach((competency) => {
                const row = document.createElement("tr");

                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = competency.label;

                const ratingCell = document.createElement("td");
                ratingCell.textContent = "";

                row.appendChild(descriptionCell);
                row.appendChild(ratingCell);

                competenciesTableBody.appendChild(row);
            });
        }
    }
}
