function updateTableContent(practicePlans, documentData) {
    console.log("Вызов updateTableContent", { practicePlans, documentData });

    const selectedPracticeType = documentData["Тип практики"];
    const selectedPractice = documentData["Вид практики"];
    console.log("Выбранный тип практики:", selectedPracticeType);
    console.log("Выбранный вид практики:", selectedPractice);

    if (!practicePlans || !practicePlans.types) {
        console.error(
            "practicePlans не загружен или содержит пустое поле types."
        );
        return;
    }

    const practicePlan = practicePlans.types.find(
        (plan) => plan.name === selectedPractice
    );
    if (!practicePlan) {
        console.error(
            "Не найден план для выбранного вида практики:",
            selectedPractice
        );
        return;
    }

    const practiceTypeData = practicePlan.types.find(
        (type) => type.type === selectedPracticeType
    );
    if (!practiceTypeData) {
        console.error(
            "Не найдены данные для выбранного типа практики:",
            selectedPracticeType
        );
        return;
    }

    console.log(
        "Данные для выбранного вида и типа практики:",
        practiceTypeData
    );
    const planTableBody = document.querySelector(".table:nth-of-type(1) tbody");
    if (!planTableBody) {
        return;
    }

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

    const competenciesTableBody = document.querySelector(
        ".table:nth-of-type(3) tbody"
    );
    if (!competenciesTableBody) {
        return;
    }

    competenciesTableBody.innerHTML = "";

    if (Array.isArray(practiceTypeData.competencies)) {
        practiceTypeData.competencies.forEach((competency) => {
            const row = document.createElement("tr");

            const dateCell = document.createElement("td");
            dateCell.textContent = "";

            const descriptionCell = document.createElement("td");
            descriptionCell.textContent = competency.label;

            const studentSignatureCell = document.createElement("td");
            studentSignatureCell.textContent = "";

            const supervisorSignatureCell = document.createElement("td");
            supervisorSignatureCell.textContent = "";

            row.appendChild(dateCell);
            row.appendChild(descriptionCell);
            row.appendChild(studentSignatureCell);
            row.appendChild(supervisorSignatureCell);

            competenciesTableBody.appendChild(row);
        });
    }
}
