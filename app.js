let fileContents = "LEDES1998B[]INVOICE_DATE|INVOICE_NUMBER|CLIENT_ID|LAW_FIRM_MATTER_ID|INVOICE_TOTAL|BILLING_START_DATE|BILLING_END_DATE|INVOICE_DESCRIPTION|LINE_ITEM_NUMBER|EXP/FEE/INV_ADJ_TYPE|LINE_ITEM_NUMBER_OF_UNITS|LINE_ITEM_ADJUSTMENT_AMOUNT|LINE_ITEM_TOTAL|LINE_ITEM_DATE|LINE_ITEM_TASK_CODE|LINE_ITEM_EXPENSE_CODE|LINE_ITEM_ACTIVITY_CODE|TIMEKEEPER_ID|LINE_ITEM_DESCRIPTION|LAW_FIRM_ID|LINE_ITEM_UNIT_COST|TIMEKEEPER_NAME|TIMEKEEPER_CLASSIFICATION|CLIENT_MATTER_ID[]";
let lineItemNumber = 0;
let invoiceTotal = 0;

function setDefaults() {
    const today = new Date();
    document.getElementById("INVOICE_DATE").value = today.toISOString().split('T')[0];
    getPreviousMonthDates(today);
}

function validateInput() {
    let isValid = true;
    let errorMessages = [];

    // Validate Invoice Number (required, alphanumeric)
    const invoiceNumber = document.getElementById("INVOICE_NUMBER").value;
    if (!invoiceNumber || !/^[a-zA-Z0-9]+$/.test(invoiceNumber)) {
        isValid = false;
        errorMessages.push("Invoice Number is required and must be alphanumeric.");
    }

    // Validate Invoice Date (required, valid date)
    const invoiceDate = document.getElementById("INVOICE_DATE").value;
    if (!invoiceDate || isNaN(Date.parse(invoiceDate))) {
        isValid = false;
        errorMessages.push("Invoice Date is required and must be a valid date.");
    }

    // Validate Client ID (required)
    const clientId = document.getElementById("CLIENT_ID").value;
    if (!clientId) {
        isValid = false;
        errorMessages.push("Client ID is required.");
    }

    // Validate Law Firm Matter ID (required)
    const lawFirmMatterId = document.getElementById("LAW_FIRM_MATTER_ID").value;
    if (!lawFirmMatterId) {
        isValid = false;
        errorMessages.push("Law Firm Matter ID is required.");
    }

    // Validate Invoice Total (required, numeric)
    const invoiceTotal = document.getElementById("INVOICE_TOTAL").value;
    if (!invoiceTotal || isNaN(parseFloat(invoiceTotal))) {
        isValid = false;
        errorMessages.push("Invoice Total is required and must be a number.");
    }

    // Add more validations for other fields as needed

    // Display error messages if any
    if (!isValid) {
        alert("Please correct the following errors:\n" + errorMessages.join("\n"));
    }

    return isValid;
}

// Modify the invoiceSubmit function to include validation
function invoiceSubmit() {
    if (validateInput()) {
        // Existing code for invoice submission
        const blob = new Blob([fileContents], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'ledes_98b_output.txt';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("Your file has been saved. Thanks for using the Bananafoot LEDES conversion program. Now go and re-think your life choices.");
    }
}

function updateLineItemTotal() {
    const units = parseFloat(document.getElementById("LINE_ITEM_NUMBER_OF_UNITS").value) || 0;
    const cost = parseFloat(document.getElementById("LINE_ITEM_UNIT_COST").value) || 0;
    const adjustmentAmount = parseFloat(document.getElementById("LINE_ITEM_ADJUSTMENT_AMOUNT").value) || 0;
    const total = (units * cost) + adjustmentAmount;
    return total.toFixed(2);
}

function lineItemSubmit() {
    if (validateInput()) {
        const lineItemTotal = updateLineItemTotal();
        lineItemNumber++;
        invoiceTotal += parseFloat(lineItemTotal);

        const delimiter = "|";
        const file_delimiter = "[]";
        let printLine = [
            formatDateYYYYMMDD(document.getElementById("INVOICE_DATE").value),
            document.getElementById("INVOICE_NUMBER").value,
            document.getElementById("CLIENT_ID").value,
            document.getElementById("LAW_FIRM_MATTER_ID").value,
            document.getElementById("INVOICE_TOTAL").value,
            formatDateYYYYMMDD(document.getElementById("BILLING_START_DATE").value),
            formatDateYYYYMMDD(document.getElementById("BILLING_END_DATE").value),
            document.getElementById("INVOICE_DESCRIPTION").value,
            lineItemNumber,
            document.getElementById("EXP_FEE_INV_ADJ_TYPE").value,
            document.getElementById("LINE_ITEM_NUMBER_OF_UNITS").value,
            document.getElementById("LINE_ITEM_ADJUSTMENT_AMOUNT").value,
            lineItemTotal,
            formatDateYYYYMMDD(document.getElementById("LINE_ITEM_DATE").value),
            document.getElementById("LINE_ITEM_TASK_CODE").value,
            document.getElementById("LINE_ITEM_EXPENSE_CODE").value,
            document.getElementById("LINE_ITEM_ACTIVITY_CODE").value,
            document.getElementById("TIMEKEEPER_ID").value,
            document.getElementById("LINE_ITEM_DESCRIPTION").value,
            document.getElementById("LAW_FIRM_ID").value,
            document.getElementById("LINE_ITEM_UNIT_COST").value,
            document.getElementById("TIMEKEEPER_NAME").value,
            document.getElementById("TIMEKEEPER_CLASSIFICATION").value,
            document.getElementById("CLIENT_MATTER_ID").value
        ].join(delimiter);

        fileContents += printLine + file_delimiter + "\n";
        document.getElementById("INVOICE_TOTAL_CALC").textContent = invoiceTotal.toFixed(2);
        document.getElementById("LINE_ITEM_NUMBER").textContent = lineItemNumber;

        // Reset line item fields
        document.getElementById("LINE_ITEM_DATE").value = "";
        //These fields should persist for useability, for most users, -- uncomment if you don't prefer that
        //document.getElementById("TIMEKEEPER_ID").value = "";
        //document.getElementById("LINE_ITEM_DESCRIPTION").value = "";
        document.getElementById("LINE_ITEM_NUMBER_OF_UNITS").value = "";
        document.getElementById("LINE_ITEM_UNIT_COST").value = "";
        document.getElementById("LINE_ITEM_ADJUSTMENT_AMOUNT").value = "0";
    }
}

function invoiceSubmit() {
    const blob = new Blob([fileContents], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ledes_98b_output.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert("Your file has been saved. Thanks for using the Bananafoot LEDES conversion program. Now go and re-think your life choices.");
}

function getPreviousMonthDates(date) {
    const firstDayOfGivenMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfPreviousMonth = new Date(firstDayOfGivenMonth);
    lastDayOfPreviousMonth.setDate(lastDayOfPreviousMonth.getDate() - 1);
    document.getElementById("BILLING_END_DATE").value = lastDayOfPreviousMonth.toISOString().split('T')[0];

    const firstDayOfPreviousMonth = new Date(lastDayOfPreviousMonth.getFullYear(), lastDayOfPreviousMonth.getMonth(), 1);
    document.getElementById("BILLING_START_DATE").value = firstDayOfPreviousMonth.toISOString().split('T')[0];
}

function formatDateYYYYMMDD(dateString) {
    return dateString.replace(/-/g, '');
}

function generatePreview() {
    // Generate the LEDES content
    let previewContent = "LEDES1998B[]\n";
    previewContent += "INVOICE_DATE|INVOICE_NUMBER|CLIENT_ID|LAW_FIRM_MATTER_ID|INVOICE_TOTAL|BILLING_START_DATE|BILLING_END_DATE|INVOICE_DESCRIPTION|LINE_ITEM_NUMBER|EXP/FEE/INV_ADJ_TYPE|LINE_ITEM_NUMBER_OF_UNITS|LINE_ITEM_ADJUSTMENT_AMOUNT|LINE_ITEM_TOTAL|LINE_ITEM_DATE|LINE_ITEM_TASK_CODE|LINE_ITEM_EXPENSE_CODE|LINE_ITEM_ACTIVITY_CODE|TIMEKEEPER_ID|LINE_ITEM_DESCRIPTION|LAW_FIRM_ID|LINE_ITEM_UNIT_COST|TIMEKEEPER_NAME|TIMEKEEPER_CLASSIFICATION|CLIENT_MATTER_ID[]\n";

    // Add invoice header
    const invoiceFields = [
        "INVOICE_DATE", "INVOICE_NUMBER", "CLIENT_ID", "LAW_FIRM_MATTER_ID",
        "INVOICE_TOTAL", "BILLING_START_DATE", "BILLING_END_DATE", "INVOICE_DESCRIPTION"
    ];
    previewContent += invoiceFields.map(field => document.getElementById(field).value).join("|") + "|";

    // Add line items
    const lineItems = fileContents.split("[]").slice(1, -1);
    previewContent += lineItems.join("[]") + "[]\n";

    // Display the preview
    const previewWindow = window.open("", "LEDES Preview", "width=800,height=600");
    previewWindow.document.write(`
        <html>
            <head>
                <title>LEDES Preview</title>
                <style>
                    body { font-family: monospace; white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <h2>LEDES File Preview</h2>
                <pre>${previewContent}</pre>
                <button onclick="window.close()">Close Preview</button>
            </body>
        </html>
    `);
}

// Add a preview button to the HTML
function addPreviewButton() {
    const previewButton = document.createElement('button');
    previewButton.textContent = 'Preview LEDES File';
    previewButton.onclick = generatePreview;
    document.querySelector('form').appendChild(previewButton);
}

// Call this function when the page loads
window.onload = function() {
    setDefaults();
    addPreviewButton();
};
