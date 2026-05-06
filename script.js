const sections = ["Safety","Drilling","Marine","Mechanic","Electrician","ET"];
let currentTable = null;

// INIT
function init() {
    let container = document.getElementById("report");

    document.getElementById("date").innerText =
        new Date().toLocaleDateString();

    // SECTIONS
    sections.forEach(name => {
        let title = document.createElement("div");
        title.className = "section-title";
        title.innerText = name;

        let table = document.createElement("table");
        table.onclick = () => currentTable = table;

        table.innerHTML = `
            <tr>
                <th style="width:50px">No.</th>
                <th>Activity / Work Done</th>
            </tr>
        `;

        for (let i = 1; i <= 5; i++) {
            table.innerHTML += `
                <tr>
                    <td class="no" style="text-align:center">${i}</td>
                    <td contenteditable="true"></td>
                </tr>
            `;
        }

        let block = document.createElement("div");
            block.className = "section-block";

            block.appendChild(title);
            block.appendChild(table);

            container.appendChild(block);
    });
}

// AUTO NUMBER
function renumber(table) {
    let rows = table.querySelectorAll("tr");

    for (let i = 1; i < rows.length; i++) {
        rows[i].querySelector(".no").innerText = i;
    }
}

// ADD ROW
function addRow() {
    if (!currentTable) return alert("Chọn bảng trước");

    let row = currentTable.insertRow();
    row.innerHTML = `
        <td class="no" style="text-align:center"></td>
        <td contenteditable="true"></td>
    `;

    renumber(currentTable);
}

function deleteRow() {
    if (!currentTable) {
        alert("Chọn bảng trước");
        return;
    }

    let rowCount = currentTable.rows.length;

    // chỉ còn header + 1 dòng thì không xóa nữa
    if (rowCount <= 2) {
        alert("Không còn dòng để xóa");
        return;
    }

    // xóa dòng cuối
    currentTable.deleteRow(rowCount - 1);

    // đánh số lại
    renumber(currentTable);
}

// CLEAR
function clearTable() {
    if (!currentTable) return alert("Chọn bảng trước");

    let rows = currentTable.querySelectorAll("tr");

    for (let i = 1; i < rows.length; i++) {
        rows[i].cells[1].innerText = "";
    }
}

// EXPORT PDF
function exportPDF() {

    // clone nội dung
    const content = document.getElementById("report").cloneNode(true);

    // tạo iframe sạch (tách khỏi CSS hiện tại)
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    doc.open();
    doc.write(`
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                    font-family: Arial;
                }

                .page {
                    width: 794px;
                    margin: 0 auto;
                    padding: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                td, th {
                    border: 1px solid black;
                    padding: 5px;
                }

                .section-title {
                    background: #cfe2f3;
                    font-weight: bold;
                    padding: 4px;
                }
            </style>
        </head>
        <body>
            ${content.outerHTML}
        </body>
        </html>
    `);
    doc.close();

    setTimeout(() => {
        html2pdf()
            .set({
                margin: 0,
                filename: "report.pdf",
                html2canvas: {
                    scale: 3
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4"
                }
            })
            .from(doc.body)
            .save()
            .then(() => document.body.removeChild(iframe));
    }, 300);
}
// START
init();
