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
