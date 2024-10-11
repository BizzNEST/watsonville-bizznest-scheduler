export function displayFilters() {
  // Create Location Dropdown
  const locations = [
    { value: "", text: "Select..." },
    { value: "Salinas", text: "Salinas" },
    { value: "Watsonville", text: "Watsonville" },
    { value: "Gilroy", text: "Gilroy" },
    { value: "Stockton", text: "Stockton" },
    { value: "Modesto", text: "Modesto" },
  ];

  const locationSelect = document.createElement("select");
  locationSelect.id = "locations";
  locationSelect.addEventListener("change", filterTable);

  locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location.value;
    option.textContent = location.text;
    locationSelect.appendChild(option);
  });

  const locationLabel = document.createElement("label");
  locationLabel.htmlFor = "locations";
  locationLabel.textContent = "LOC";

  // Create Department Dropdown
  const departments = [
    { value: "", text: "Select..." },
    { value: "Development", text: "Development" },
    { value: "Video", text: "Video" },
    { value: "Design", text: "Design" },
    { value: "IT", text: "IT" },
    { value: "Marketing", text: "Marketing" },
  ];

  const departmentSelect = document.createElement("select");
  departmentSelect.id = "department";
  departmentSelect.addEventListener("change", filterTable);

  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department.value;
    option.textContent = department.text;
    departmentSelect.appendChild(option);
  });

  const departmentLabel = document.createElement("label");
  departmentLabel.htmlFor = "department";
  departmentLabel.textContent = "DEPT";

  // Append everything to the dropdowns container
  const dropdownsContainer = document.getElementById("dropdowns-container");
  dropdownsContainer.appendChild(locationLabel);
  dropdownsContainer.appendChild(locationSelect);
  dropdownsContainer.appendChild(departmentLabel);
  dropdownsContainer.appendChild(departmentSelect);
}

export function filterTableBySearch(searchValue) {
  const displayTable = document.getElementById("interns-display");
  const rows = displayTable.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    const nameCell = cells[1].textContent.toLowerCase();
    const locationCell = cells[2].textContent.toLowerCase();
    const departmentCell = cells[3].textContent.toLowerCase();

    rows[i].style.display =
      nameCell.includes(searchValue) ||
      locationCell.includes(searchValue) ||
      departmentCell.includes(searchValue)
        ? ""
        : "none";
  }
}

export function searchPairs(searchValue) {
  const displayTable = document.getElementById("pairing-intern-display");
  const rows = displayTable.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    const nameCell = cells[1].textContent.toLowerCase();
    const locationCell = cells[2].textContent.toLowerCase();
    const departmentCell = cells[3].textContent.toLowerCase();

    rows[i].style.display =
      nameCell.includes(searchValue) ||
      locationCell.includes(searchValue) ||
      departmentCell.includes(searchValue)
        ? ""
        : "none";
  }
}

export function filterTable() {
  const locationDropdown = document.getElementById("locations");
  const selectedLocation = locationDropdown.value.trim();

  const departmentDropdown = document.getElementById("department");
  const selectedDepartment = departmentDropdown.value.trim();

  const displayTable = document.getElementById("interns-display");
  const rows = displayTable.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    const locationCell = cells[2].textContent.trim();
    const departmentCell = cells[3].textContent.trim();

    // Show the row if it matches both filters or if no filters are selected
    rows[i].style.display =
      (locationCell === selectedLocation || selectedLocation === "") &&
      (departmentCell === selectedDepartment || selectedDepartment === "")
        ? ""
        : "none";
  }
}

//Element Array Helper Fuction.
export function elementArrCreator(filters, st) {
  let elementArray = [];
  for (let i = 0; i < filters.length; i++) {
    //Loop through all filters.
    elementArray.push(document.createElement(st)); //Make entry with chosen createElement.
    elementArray[i].textContent = filters[i]; //Set entry textContent to current filter.
  }
  return elementArray;
}

//appendChildren Helper Fuction.
export function appendChildren(row, children) {
  for (let entry of children) {
    //For every child...
    row.appendChild(entry); //Append it to the row.
  }
}
