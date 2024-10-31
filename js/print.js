function printDocument() {
    saveDocumentData();

    const contentContainer = document.getElementById("preview-container");
    const contentHtml = contentContainer.innerHTML;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
        <html>
            <head>
                <title>Печать документа</title>
                <link rel="stylesheet" href="./styles/index.css">
                <link rel="stylesheet" href="./styles/diary.css">
                <style>
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                            background: white !important;
                        }
                        .page-break {
                            page-break-before: always;
                        }
                        .container {
                            width: 100%;
                            overflow: visible !important;
                            height: auto !important;
                            max-height: none !important;
                            page-break-inside: avoid;
                        }
                        .line-container {
                            margin-bottom: 10px;
                        }
                        .content-container {
                            width: 100%;
                            overflow: visible !important;
                            height: auto !important;
                            max-height: none !important;
                            page-break-before: always;
                        }
                        @page {
                            size: A4;
                            margin: 20mm;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="content-container">
                    ${contentHtml}
                </div>
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.print();
    printWindow.onafterprint = function () {
        printWindow.close();
    };
}

document
    .querySelector(".print-button")
    .addEventListener("click", printDocument);
