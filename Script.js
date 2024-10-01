const initialChemicals = [
    { id: 1, chemicalName: "Ethanol", vendor: "Vendor A", density: "789 kg/m³", viscosity: "1.2 mPa·s", packaging: "Bottle", packSize: 500, unit: "mL", quantity: 100 },
    { id: 2, chemicalName: "Acetone", vendor: "Vendor B", density: "784 kg/m³", viscosity: "0.3 mPa·s", packaging: "Can", packSize: 1000, unit: "mL", quantity: 200 },
    { id: 3, chemicalName: "Methanol", vendor: "Vendor C", density: "792 kg/m³", viscosity: "0.6 mPa·s", packaging: "Drum", packSize: 2000, unit: "L", quantity: 50 },
    { id: 4, chemicalName: "Isopropanol", vendor: "Vendor D", density: "786 kg/m³", viscosity: "2.3 mPa·s", packaging: "Bottle", packSize: 100, unit: "mL", quantity: 500 },
    { id: 5, chemicalName: "Toluene", vendor: "Vendor E", density: "867 kg/m³", viscosity: "0.6 mPa·s", packaging: "Can", packSize: 500, unit: "mL", quantity: 120 },
];


let chemicals = [...initialChemicals];
let selectedRowIndex = null;
let editIndex = null;
let sortDirection = {}; 
let clickTimeout = null;  // Variable to track single click timeout

// Function to render the table
function renderTable() {
    const tbody = document.querySelector("#chemicalsTable tbody");
    tbody.innerHTML = ''; // Clear existing rows

    chemicals.forEach((chemical, index) => {
        const row = document.createElement('tr');
        row.className = index === selectedRowIndex ? 'selected-row' : '';
        row.innerHTML = `
            <td>${chemical.id}</td>
            <td>${chemical.chemicalName}</td>
            <td>${chemical.vendor}</td>
            <td>${chemical.density}</td>
            <td>${chemical.viscosity}</td>
            <td>${chemical.packaging}</td>
            <td>${chemical.packSize}</td>
            <td>${chemical.unit}</td>
            <td>${chemical.quantity}</td>
        `;

        // Event listener for single click to select the row
        row.addEventListener('click', () => {
            if (clickTimeout) clearTimeout(clickTimeout);  // Clear previous clickTimeout if set
            clickTimeout = setTimeout(() => {
                selectedRowIndex = index;  // Select row
                renderTable();  // Re-render to highlight selected row
            }, 20);  // Delay of 20ms before deciding it's a single click
        });

        // Event listener for double click to open modal editor
        row.addEventListener('dblclick', () => {
            if (clickTimeout) clearTimeout(clickTimeout);  // Cancel single click action if double click detected
            openEditModal(index);  // Open modal for editing
        });

        tbody.appendChild(row);
    });
}


// Function to sort the table
function sortTable(key) {
    const thElements = document.querySelectorAll("th");

    // Toggle sort direction (ascending/descending)
    sortDirection[key] = !sortDirection[key];
    const direction = sortDirection[key] ? 1 : -1;

    // Clear sorting indicators on other headers
    thElements.forEach(th => th.classList.remove("sort-asc", "sort-desc"));

    // Apply sorting indicator on the clicked column header
    const th = [...thElements].find(th => th.textContent.toLowerCase().includes(key));
    th.classList.add(sortDirection[key] ? "sort-asc" : "sort-desc");

    // Sort the array based on the key
    chemicals.sort((a, b) => {
        if (a[key] < b[key]) return -1 * direction;
        if (a[key] > b[key]) return 1 * direction;
        return 0;
    });

    renderTable(); // Re-render the table after sorting
}

// Add a new row to the table
function addRow() {
    const newId = chemicals.length + 1;
    chemicals.push({
        id: newId,
        chemicalName: "New Chemical",
        vendor: "New Vendor",
        density: "N/A",
        viscosity: "N/A",
        packaging: "N/A",
        packSize: 0,
        unit: "N/A",
        quantity: 0
    });
    renderTable();
}

// Select a row
function selectRow(index) {
    selectedRowIndex = index;
    renderTable();
}

// Move the selected row up
function moveRowUp() {
    if (selectedRowIndex !== null && selectedRowIndex > 0) {
        [chemicals[selectedRowIndex], chemicals[selectedRowIndex - 1]] = [chemicals[selectedRowIndex - 1], chemicals[selectedRowIndex]];
        selectedRowIndex--;
        renderTable();
    }
}

// Move the selected row down
function moveRowDown() {
    if (selectedRowIndex !== null && selectedRowIndex < chemicals.length - 1) {
        [chemicals[selectedRowIndex], chemicals[selectedRowIndex + 1]] = [chemicals[selectedRowIndex + 1], chemicals[selectedRowIndex]];
        selectedRowIndex++;
        renderTable();
    }
}

// Delete the selected row
function deleteRow() {
    if (selectedRowIndex !== null) {
        chemicals.splice(selectedRowIndex, 1);
        selectedRowIndex = null;
        renderTable();
    }
}

// Refresh the table to its initial state
function refreshTable() {
    chemicals = [...initialChemicals];
    selectedRowIndex = null;
    renderTable();
}

// Save the current state of the data
function saveData() {
    const savedData = JSON.stringify(chemicals);
    console.log("Saved Data:", savedData);
    alert("Data has been saved to the console (open the console to view).");
}


// Open edit modal and prefill form with selected row data
function openEditModal(index) {
    if (clickTimeout) clearTimeout(clickTimeout);  // Prevents conflict with single-click
    
    editIndex = index;
    const chemical = chemicals[index];

    // Prefill modal form with selected row's data
    document.getElementById('chemicalName').value = chemical.chemicalName;
    document.getElementById('vendor').value = chemical.vendor;
    document.getElementById('density').value = chemical.density;
    document.getElementById('viscosity').value = chemical.viscosity;
    document.getElementById('packaging').value = chemical.packaging;
    document.getElementById('packSize').value = chemical.packSize;
    document.getElementById('unit').value = chemical.unit;
    document.getElementById('quantity').value = chemical.quantity;

    // Display the modal
    document.getElementById('editModal').style.display = 'block';
}

// Save edited data from the modal
function saveEdit() {
    // Retrieve the currently edited row's chemical object
    const chemical = chemicals[editIndex];

    // Update chemical object with new values from the modal form
    chemical.chemicalName = document.getElementById('chemicalName').value;
    chemical.vendor = document.getElementById('vendor').value;
    chemical.density = document.getElementById('density').value;
    chemical.viscosity = document.getElementById('viscosity').value;
    chemical.packaging = document.getElementById('packaging').value;
    chemical.packSize = document.getElementById('packSize').value;
    chemical.unit = document.getElementById('unit').value;
    chemical.quantity = document.getElementById('quantity').value;

    // Re-render the table to reflect the updated data
    renderTable();

    // Close the modal after saving
    closeModal();
}


// Close modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Initial rendering of the table
renderTable();
