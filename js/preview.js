function checkCSSLoaded() {
  const testElement = document.createElement("div");
  testElement.className = "test-css";
  document.body.appendChild(testElement);

  const style = window.getComputedStyle(testElement);
  if (style.backgroundColor === "rgb(255, 0, 0)") {
    console.log("CSS успешно загружен");
  } else {
    console.log("CSS не загружен");
  }

  document.body.removeChild(testElement);
}

function loadCSS() {
  return new Promise((resolve, reject) => {
    const existingLink = document.querySelector(
      'link[href="../styles/preview.css"]'
    );
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../styles/preview.css";
      link.onload = () => resolve();
      link.onerror = () => reject(new Error("Ошибка загрузки CSS"));
      document.head.appendChild(link);
    } else {
      resolve();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const documentData = JSON.parse(localStorage.getItem("documentData")) || {};
  const content = localStorage.getItem("content") || "report";
  const contentContainer = document.getElementById("content");

  if (!contentContainer) {
    console.error("Content container not found");
    return;
  }

  // fetch(content === 'diary' ? '../docs/diary.html' : '../docs/report.html')
  fetch(`../docs/${content}.html`)
    .then((response) => response.text())
    .then((data) => {
      contentContainer.innerHTML = data;
      window.PagedPolyfill.preview().then(() => {
        console.log("Документ обновлен");
      });

      const fields = document.querySelectorAll("[data-doc-field]");

      fields.forEach((field) => {
        const docField = field.dataset.docField;
        field = field.querySelector(".text-field") ?? field;

        if (documentData.hasOwnProperty(docField)) {
          field.textContent = documentData[docField] || " ";
        }
      });

      updateTableContent();
    })
    .catch((error) => console.error("Ошибка при загрузке контента:", error));
});
