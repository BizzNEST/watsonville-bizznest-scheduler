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
    const topWords0 = document.createElement("th");
    topWords0.textContent = `Select to Exclude`;
    rowTop.appendChild(topWords0);

    const topWords1 = document.createElement("th");
    topWords1.textContent = `Name`;
    rowTop.appendChild(topWords1);

    const topWords2 = document.createElement("th");
    topWords2.textContent = `Location`;
    rowTop.appendChild(topWords2);

    const topWords3 = document.createElement("th");
    topWords3.textContent = `Department`;
    rowTop.appendChild(topWords3);

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

  let selectedInterns = [];

  let excludedInterns = []; // Array to hold names of excluded interns


  function displayInternRows(intern, tbody) {
    const row = document.createElement("tr");

    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
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

    const nameIntern = document.createElement("td");
    nameIntern.textContent = `${intern.name}`;
    row.appendChild(nameIntern);

    const locationIntern = document.createElement("td");
    locationIntern.textContent = `${intern.location}`;
    row.appendChild(locationIntern);

    const departmentIntern = document.createElement("td");
    departmentIntern.textContent = `${intern.department}`;
    row.appendChild(departmentIntern);

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
  excludeButton.textContent = "Exclude Selected Interns";
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
      console.error("Interns map is empty or not loaded.");
      return [];
    }

    // Filter out excluded interns
    let internsArray = Array.from(internsMap.values()).filter(
      (intern) => !selectedInterns.includes(intern.name),
    );

    // Additional filtering based on selected locations and departments
    internsArray = internsArray.filter((intern) => {
      const cityMatch =
        cityTokens.length === 0 || cityTokens.includes(intern.location);
      const departmentMatch =
        departmentTokens.length === 0 ||
        departmentTokens.includes(intern.department);
      return cityMatch && departmentMatch;
    });

    // Shuffle and create pairs as before
    shuffleArray(internsArray);
    const pairs = [];
    let i = 0;

    while (i < internsArray.length) {
      if (i + 1 < internsArray.length) {
        pairs.push([internsArray[i], internsArray[i + 1]]);
        i += 2;
      } else {
        break;
      }
    }

    if (i < internsArray.length) {
      const lastGroup = pairs.pop();
      lastGroup.push(internsArray[i]);
      pairs.push(lastGroup);
    }

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
  // document.getElementById("reset").addEventListener("click", function () {
  //   // original table
  //   document.getElementById("interns-display").style.display = "table";
  //   document.getElementById("pairing-intern-display").style.display = "none";
  // });

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
