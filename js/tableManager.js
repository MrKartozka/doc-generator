function updateTableContent(practicePlans, documentData) {
    console.log("updateTableContent called");

    const selectedPracticeType = documentData["Тип практики"];
    const selectedPractice = documentData["Вид практики"];

    if (!practicePlans || !practicePlans.types) {
        console.error('practicePlans or practicePlans.types is undefined!');
        return;
    }

    const practicePlan = practicePlans.types.find(plan => plan.name === selectedPractice);
    if (!practicePlan) {
        console.error('Practice Plan not found!');
        return;
    }

    const practiceTypeData = practicePlan.types.find(type => type.type === selectedPracticeType);
    if (!practiceTypeData) {
        console.error('Practice Type Data not found!');
        return;
    }

    // Обновление таблицы с рабочим графиком
    const planTableBody = document.querySelector('.table:nth-of-type(1) tbody');
    if (!planTableBody) {
        console.error('Plan table body not found!');
        return;
    }

    planTableBody.innerHTML = ''; // Очищаем таблицу

    if (Array.isArray(practicePlan.plan)) {
        practicePlan.plan.forEach((stage) => {
            const row = document.createElement('tr');

            const dateCell = document.createElement('td');
            dateCell.textContent = ''; // Пустая ячейка для даты

            const stageCell = document.createElement('td');
            stageCell.textContent = stage.stage;

            const taskCell = document.createElement('td');
            taskCell.textContent = stage.tasks;

            const statusCell = document.createElement('td');
            statusCell.textContent = ''; // Пустая ячейка для отметки о выполнении

            row.appendChild(dateCell);
            row.appendChild(stageCell);
            row.appendChild(taskCell);
            row.appendChild(statusCell);

            planTableBody.appendChild(row);
        });
    } else {
        console.error('Plan data not found or is not an array!');
    }

    // Обновление таблицы с компетенциями
    const competenciesTableBody = document.querySelector('.table:nth-of-type(3) tbody');
    if (!competenciesTableBody) {
        console.error('Competencies table body not found!');
        return;
    }

    competenciesTableBody.innerHTML = ''; // Очищаем таблицу

    if (Array.isArray(practiceTypeData.competencies)) {
        practiceTypeData.competencies.forEach((competency) => {
            const row = document.createElement('tr');

            const dateCell = document.createElement('td');
            dateCell.textContent = ''; // Пустая ячейка для даты

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = competency.label;

            const studentSignatureCell = document.createElement('td');
            studentSignatureCell.textContent = ''; // Пустая ячейка для подписи студента

            const supervisorSignatureCell = document.createElement('td');
            supervisorSignatureCell.textContent = ''; // Пустая ячейка для подписи руководителя

            row.appendChild(dateCell);
            row.appendChild(descriptionCell);
            row.appendChild(studentSignatureCell);
            row.appendChild(supervisorSignatureCell);

            competenciesTableBody.appendChild(row);
        });
    } else {
        console.error('Competencies data not found or is not an array!');
    }

    console.log('Tables updated with content');
}
