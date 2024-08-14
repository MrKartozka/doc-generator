function toggleSidebar() {
    const sidebarElement = document.getElementById('sidebar');
    if (sidebarElement.classList.contains('collapsed')) {
        sidebarElement.classList.remove('collapsed');
    } else {
        sidebarElement.classList.add('collapsed');
    }
}

function loadPreview() {
    const content = localStorage.getItem('content') || 'report';
    const previewWindow = window.open('preview.html', '_blank');

    if (!previewWindow) {
        console.error('Не удалось открыть окно для предпросмотра');
        return;
    }

    previewWindow.onload = function () {
        previewWindow.localStorage.setItem('documentData', JSON.stringify(documentData));
        previewWindow.localStorage.setItem('content', content);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    createSidebar();
});

function createSidebar() {
    const sidebarElement = document.getElementById('sidebar');
    if (!sidebarElement) {
        console.error('Sidebar element not found');
        return;
    }

    const templates = [
        { text: "Отчет по производственной практике", template: "report" },
        { text: "Дневник практики", template: "diary" },
        { text: "Предпросмотр", template: "preview" },
    ];

    // Здесь можно добавить код для создания элементов бокового меню, если он не был добавлен ранее.
}
