function updateDocument() {
  const documentData = JSON.parse(localStorage.getItem("documentData")) || {};

  const fields = document.querySelectorAll("[data-doc-field]");

  fields.forEach((field) => {
    const docField = field.dataset.docField;
    field = field.querySelector(".text-field") ?? field;

    if (documentData.hasOwnProperty(docField)) {
      field.textContent = documentData[docField] || " ";
    }
  });
}
window.updateDocument = updateDocument;
