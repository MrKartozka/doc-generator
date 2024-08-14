function updateDocument() {
    const documentData = JSON.parse(localStorage.getItem('documentData')) || {};
    const content = localStorage.getItem('content') || 'report';
    const contentContainer = document.getElementById('preview-container');

    fetch(content === 'diary' ? 'docs/diary.html' : 'docs/report.html')
        .then(response => response.text())
        .then(data => {

            data = data.replace('___ФАКУЛЬТЕТ___', documentData['ФАКУЛЬТЕТ'] || ' ');
            data = data.replace('___КАФЕДРА___', documentData['КАФЕДРА'] || ' ');
            data = data.replace('___ФИО___', documentData['ФИО'] || ' ');
            data = data.replace('___Группа___', documentData['Группа'] || ' ');
            data = data.replace('___Вид практики___', documentData['Вид практики'] || ' ');
            data = data.replace('___Тип практики___', documentData['Тип практики'] || ' ');
            data = data.replace('___ФИО___', documentData['ФИО'] || ' ');
            data = data.replace('___Предприятие___', documentData['Предприятие'] || ' ');
            data = data.replace('___Руководитель___', documentData['Руководитель'] || ' ');
            data = data.replace('___Оценка___', documentData['Оценка'] || ' ');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || ' ');
            data = data.replace('___ФИО___', documentData['ФИО'] || ' ');
            data = data.replace('___ФИО___', documentData['ФИО'] || '                                   ');
            data = data.replace('___Направление/Специальность___', documentData['Направление/Специальность'] || ' ');
            data = data.replace('___Направленность/Профиль___', documentData['Направленность/Профиль'] || ' ');
            data = data.replace('___Учебная группа___', documentData['Учебная группа'] || ' ');
            data = data.replace('___Кафедра___', documentData['Кафедра'] || ' ');
            data = data.replace('___Начало учебного года___', documentData['Начало учебного года'] || '__________');
            data = data.replace('___Конец учебного года___', documentData['Конец учебного года'] || '__________');
            data = data.replace('___Форма обучения___', documentData['Форма обучения'] || '_______________');
            data = data.replace('___Вид практики___', documentData['Вид практики'] || ' ');
            data = data.replace('___Тип практики___', documentData['Тип практики'] || ' ');
            data = data.replace('___Город___', documentData['Город'] || ' ');
            data = data.replace('___Наименование профильной организации___', documentData['Наименование профильной организации'] || ' ');
            data = data.replace('___День начала организации практической подготовки___', documentData['День начала организации практической подготовки'] || '____');
            data = data.replace('___Месяц начала организации практической подготовки___', documentData['Месяц начала организации практической подготовки'] || '________');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___День конца организации практической подготовки___', documentData['День конца организации практической подготовки'] || '____');
            data = data.replace('___Месяц конца организации практической подготовки___', documentData['Месяц конца организации практической подготовки'] || '________');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___Руководитель по практической подготовке от кафедры___', documentData['Руководитель по практической подготовке от кафедры'] || ' ');
            data = data.replace('___Номер телефона руководителя по практической подготовке от кафедры___', documentData['Номер телефона руководителя по практической подготовке от кафедры'] || ' ');
            data = data.replace('___Заведующий кафедрой___', documentData['Заведующий кафедрой'] || ' ');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___Руководитель по практической подготовке от профильной организации___', documentData['Руководитель по практической подготовке от профильной организации'] || ' ');
            data = data.replace('___Руководитель по практической подготовке от кафедры___', documentData['Руководитель по практической подготовке от кафедры'] || ' ');
            data = data.replace('___Руководитель по практической подготовке от кафедры___', documentData['Руководитель по практической подготовке от кафедры'] || '______________________________');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___Руководитель по практической подготовке от кафедры___', documentData['Руководитель по практической подготовке от кафедры'] || '______________________________');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___Руководитель по практической подготовке от кафедры___', documentData['Руководитель по практической подготовке от кафедры'] || '______________________________');
            data = data.replace('___Руководитель по практической подготовке от профильной организации___', documentData['Руководитель по практической подготовке от профильной организации'] || '______________________________');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___Руководитель по практической подготовке от кафедры___', documentData['Руководитель по практической подготовке от кафедры'] || '______________________________');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');
            data = data.replace('___Календарный год___', documentData['Календарный год'] || '______');

            contentContainer.innerHTML = data;
        })
        .catch(error => console.error('Ошибка при обновлении документа:', error));
}
window.updateDocument = updateDocument;