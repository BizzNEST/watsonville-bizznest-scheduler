import {
  unique_location,
  shuffleArray,
  unique_department,
  findUniquePairs,
} from "./complexity.js";

document.addEventListener("DOMContentLoaded", () => {
  // initialize global hashmap and tokens

  const displayTable = document.getElementById("interns-display");
  let internsMap;
  let cityTokens = [];
  let departmentTokens = [];
  const uniqueCheckbox = document.getElementById("unique"); // checks if uniquness triggered
  const uniqueDepartment = document.getElementById("unique-department"); // checks if uniquness triggered
  displayTable.className = "table table-hover";
  const pairingTable = document.getElementById("pairing-intern-display");
  pairingTable.className = "table table-hover";

  function filterTableBySearch(searchValue) {
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

  function filterTable() {
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
  function displayInterns() {
    // Ensure the table has the Bootstrap classes applied
    displayTable.className = "table table-hover";

    // Create the thead and tbody elements if they don't exist yet
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Create the header row
    const rowTop = document.createElement("tr");

    /** ALTERNATE APPROACH**/
    const filters = ["Select to Exclude", "Name", "Location", "Department"]; //Create array for the filters.
    const topWords = elementArrCreator(filters, "th"); //Then, make an array of topWords, setting the textContent for each.
    appendChildren(rowTop, topWords); //Finally, append topWords to rowTop.
    //** **/

    // Append header row to thead
    thead.appendChild(rowTop);
    displayTable.appendChild(thead); // Append thead to the table
    displayTable.appendChild(tbody); // Append tbody to the table

    loadInterns().then((map) => {
      internsMap = map;
      internsMap.forEach((intern, name) => {
        console.log(`Name: ${name}, Details:`, intern);
        displayInternRows(intern, tbody); // Pass tbody to the function
      });
    });
  }

  /** ALT APPROACH - HELPER FUNCTIONS **/
  //Element Array Helper Fuction.
  function elementArrCreator(filters, st) {
    let elementArray = [];
    for (let i = 0; i < filters.length; i++) {
      //Loop through all filters.
      elementArray.push(document.createElement(st)); //Make entry with chosen createElement.
      elementArray[i].textContent = filters[i]; //Set entry textContent to current filter.
    }
    return elementArray;
  }

  //appendChildren Helper Fuction.
  function appendChildren(row, children) {
    for (let entry of children) {
      //For every child...
      row.appendChild(entry); //Append it to the row.
    }
  }
  /** ALT APPROACH - HELPER FUNCTIONS END **/

  const selectedInterns = [];

  function displayInternRows(intern, tbody) {
    const row = document.createElement("tr");

    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("intern-checkbox");
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedInterns.push(intern.name); // Add intern name to the selected list
      } else {
        selectedInterns = selectedInterns.filter(
          (name) => name !== intern.name,
        ); // Remove from the list
      }
    });
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    /** ALT APPROACH **/
    const internFilters = [
      `${intern.name}`,
      `${intern.location}`,
      `${intern.department}`,
    ];
    const internsArray = elementArrCreator(internFilters, "td");
    appendChildren(row, internsArray);
    /** **/

    tbody.appendChild(row); // Append the row to the tbody
  }

  function excludeSelectedInterns() {
    const filteredInterns = Array.from(internsMap.entries()).filter(
      ([name]) => !selectedInterns.includes(name),
    );

    const tbody = document.querySelector("#interns-display tbody");
    tbody.innerHTML = "";

    filteredInterns.forEach(([, intern]) => {
      displayInternRows(intern, tbody);
    });
  }

  // Add this button to the DOM
  const excludeButton = document.createElement("button");
  excludeButton.textContent = "Remove selected intern";
  excludeButton.addEventListener("click", excludeSelectedInterns);
  document.getElementById("filter-options").appendChild(excludeButton);

  function displayFilters() {
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
    locationLabel.textContent = "Choose a location:";

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
    departmentLabel.textContent = "Choose a department:";

    // Append everything to the dropdowns container
    const dropdownsContainer = document.getElementById("dropdowns-container");
    dropdownsContainer.appendChild(locationLabel);
    dropdownsContainer.appendChild(locationSelect);
    dropdownsContainer.appendChild(departmentLabel);
    dropdownsContainer.appendChild(departmentSelect);
  }

  // SELECT ALL CHECKBOXES
  function selectAllCheckboxes() {
    // Get all checkboxes in the table
    const checkboxes = displayTable.querySelectorAll('input[type="checkbox"]');
    // Iterate through each checkbox and set it to checked
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
  }

  function loadInterns() {
    //simply loads interns into the hashmap along with their details
    return fetch("interns.json")
      .then((response) => response.json())
      .then((data) => {
        internsMap = new Map();
        data.intern.forEach((intern) => {
          internsMap.set(intern.name, intern);
        });
        return internsMap; // Return the map
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }

  function displayPairs(pairs) {
    const pairingTableBody = document
      .getElementById("pairing-intern-display")
      .querySelector("tbody");
    pairingTableBody.innerHTML = ""; // Clear existing rows

    pairs.forEach((group, index) => {
      const row = document.createElement("tr");

      // Create cell for the group
      const groupCell = document.createElement("td");
      groupCell.textContent = `Group ${index + 1}`;
      row.appendChild(groupCell);

      // Create cells for the interns in the group
      group.forEach((intern) => {
        const internCell = document.createElement("td");
        internCell.textContent =
          intern.name + ", " + intern.location + ", " + intern.department; // Access intern name
        row.appendChild(internCell);
      });

      // Check if it's the first group and adjust accordingly
      if (index === 0 && group.length > 0) {
        // Add a placeholder for the third column if it's the first group
        while (row.children.length < 3) {
          const placeholderCell = document.createElement("td");
          row.appendChild(placeholderCell);
        }
      }

      pairingTableBody.appendChild(row);
    });
  }

  //token handling

  function updateCityTokens() {
    //handles city tokens
    cityTokens = []; // Clear the previous list
    document.querySelectorAll(".location-button.active").forEach((button) => {
      cityTokens.push(button.value); // Add active button values to the list
    });
    console.log("Active Cities:", cityTokens); // Log the active cities
  }

  function updateDepartmentTokens() {
    //handles city tokens
    departmentTokens = []; // Clear the previous list
    document.querySelectorAll(".department-button.active").forEach((button) => {
      departmentTokens.push(button.value); // Add active button values to the list
    });
    console.log("Active Departments:", departmentTokens); // Log the active cities
  }

  //Randomizing Algorithim

  function pairInterns() {
    console.log("pairInterns function called");
    if (!internsMap || internsMap.size === 0) {
      // ensures interns are loaded
      console.error("Interns map is empty or not loaded.");
      return [];
    }

    if (selectedInterns.length > 0) {
      selectedInterns.forEach((intern) => {
        if (internsMap.has(intern)) {
          internsMap.delete(intern);
        }
      });
    }

    if (!internsMap || internsMap.size === 0) {
      // ensures interns are loaded
      console.error("Interns map is empty or not loaded.");
      return [];
    }

    // Get the checkbox element
    const uniqueCheckboxValue = uniqueCheckbox.checked; // Access the checked property
    const uniqueDepartmentValue = uniqueDepartment.checked; // Access the checked property

    console.log("uniqueCheckbox value:", uniqueCheckboxValue); // Check the boolean value
    console.log("uniqueDepartment value:", uniqueDepartmentValue);

    if (uniqueCheckboxValue == true && uniqueDepartmentValue == true) {
      // if unique is checked, calls complex algoritihm
      console.log("Calling uniqueInterns...");
      return findUniquePairs(cityTokens, departmentTokens, internsMap);
    }

    if (uniqueCheckboxValue == true && uniqueDepartmentValue == false) {
      // if unique is checked, calls complex algoritihm
      console.log("Calling uniqueInterns...");
      return unique_location(cityTokens, internsMap);
    }

    if (uniqueCheckboxValue == false && uniqueDepartmentValue == true) {
      // if unique is checked, calls complex algoritihm
      console.log("Calling uniqueInterns...");
      return unique_department(departmentTokens, internsMap);
    }

    let internsArray;

    if (cityTokens.length != 0 || departmentTokens.length != 0) {
      //checks if there are tokens
      // filter interns whose city is within the cityTokens array or department is within the departmentTokens array
      internsArray = Array.from(internsMap.values()).filter((intern) => {
        const cityMatch =
          cityTokens.length === 0 || cityTokens.includes(intern.location); //checks if tokens are empty or if the intern's location is included in tokens
        const departmentMatch =
          departmentTokens.length === 0 ||
          departmentTokens.includes(intern.department); //same logic as below, they are just booleans that allow interns to filter
        return cityMatch && departmentMatch;
      });
    } else {
      // If no cityTokens or departmentTokens are provided, just create the array from internsMap values
      internsArray = Array.from(internsMap.values());
    }
    // store the selected interns within array

    // shuffle the array around to ensure randomization pairs
    shuffleArray(internsArray);

    const pairs = []; //results
    let i = 0; //index

    while (i < internsArray.length) {
      if (i + 1 < internsArray.length) {
        pairs.push([internsArray[i], internsArray[i + 1]]);
        i += 2;
      } else {
        break;
      }
    } //creates pairs until it runs out of pairs of two

    if (i < internsArray.length) {
      const lastGroup = pairs.pop();
      lastGroup.push(internsArray[i]);
      pairs.push(lastGroup);
    } //adds pair to last group if there are any leftovers

    return pairs;
  }

  /////////////////////////interacting with HTML page and displaying the randomization + results of pairs

  displayInterns();
  displayFilters();

  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const searchValue =
        this.querySelector('input[type="text"]').value.toLowerCase();
      filterTableBySearch(searchValue);
    });

  document.getElementById("select-all").addEventListener("click", () => {
    document.querySelectorAll("input.intern-checkbox").forEach((checkbox) => {
      checkbox.checked = true;
      const internName = checkbox
        .closest("tr")
        .querySelector("td:nth-child(2)").textContent;
      if (!selectedInterns.includes(internName)) {
        selectedInterns.push(internName);
      }
    });
    console.log("Excluded Interns after Select All:", selectedInterns);
  });

  uniqueCheckbox.addEventListener("click", () => {
    console.log("Unique Checkbox Status:", uniqueCheckbox.checked);
  });

  uniqueDepartment.addEventListener("click", () => {
    console.log("Unique Department Status:", uniqueDepartment.checked);
  });

  document.querySelectorAll(".location-button").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active"); // Toggle the active class
      updateCityTokens();
    });
  });

  document.querySelectorAll(".department-button").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active"); // Toggle the active class
      updateDepartmentTokens();
    });
  });

  document.getElementById("generate-pairs").addEventListener("click", () => {
    document.getElementById("interns-display").style.display = "none";
    document.getElementById("pairing-intern-display").style.display = "table"; // Ensure table is visible
    updateCityTokens(); // Update active cities before pairing
    loadInterns().then(() => {
      const pairs = pairInterns();
      console.log("Intern Pairings:", pairs);
      displayPairs(pairs); // Display pairs in the table
    });
  });
});
