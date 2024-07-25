document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired"); // Добавлен log
    createSidebar();
});

function createSidebar() {
    const sidebarElement = document.getElementById('sidebar');
    console.log(sidebarElement); // Добавлен log
    if (!sidebarElement) {
        console.error('Sidebar element not found');
        return;
    }

    const templates = [
        { text: "Отчет по производственной практике", template: "report" },
        { text: "Дневник практики", template: "diary" },
    ];

    templates.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'sidebar-item';
        listItem.textContent = item.text;
        listItem.onclick = () => loadTemplate(item.template);
        sidebarElement.appendChild(listItem);
    });
}
