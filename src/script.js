import { pairInterns } from "./complexity.js";

import {
  displayInternRows,
  elementArrCreator,
  appendChildren,
  displayFilters,
  filterTableBySearch,
} from "./filter.js";

document.addEventListener("DOMContentLoaded", () => {
  // initialize global hashmap and tokens
  let internsMap;
  let cityTokens = [];
  let departmentTokens = [];
  let selectedInterns = [];
  let checkedInterns = [];

  const uniqueCheckbox = document.getElementById("unique"); // checks if uniquness triggered
  const uniqueDepartment = document.getElementById("unique-department"); // checks if uniquness triggered
  const pairingTable = document.getElementById("pairing-intern-display");
  const displayTable = document.getElementById("interns-display");

  displayTable.className = "table table-hover";
  pairingTable.className = "table table-hover";

  function displayInterns() {
    // Ensure the table has the Bootstrap classes applied
    displayTable.className = "table table-hover";

    // Create the thead and tbody elements if they don't exist yet
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Create the header row
    const rowTop = document.createElement("tr");


    const filters = ['', 'Name', 'Location', 'Department']; //Create array for the filters
    const topWords = elementArrCreator(filters, "th"); //make an array of topWords making a textContent for each
    appendChildren(rowTop, topWords); // append topWords to rowTop.


    // Append header row to thead
    thead.appendChild(rowTop);
    displayTable.appendChild(thead); // Append thead to the table
    displayTable.appendChild(tbody); // Append tbody to the table

    loadInterns().then((map) => {
      internsMap = map;
      internsMap.forEach((intern, name) => {
        console.log(`Name: ${name}, Details:`, intern);
        displayInternRows(intern, tbody, checkedInterns); // Pass tbody to the function
      });
    });
  }

  function excludeSelectedInterns() {
    // Add checked interns to selectedInterns
    selectedInterns.push(...checkedInterns);

    // Clear checkedInterns array after adding to selectedInterns
    checkedInterns = [];

    // Now filter the interns table based on selectedInterns
    const filteredInterns = Array.from(internsMap.entries()).filter(
      ([name]) => !selectedInterns.includes(name),
    );

    const tbody = document.querySelector("#interns-display tbody");
    tbody.innerHTML = "";

    filteredInterns.forEach(([, intern]) => {
      displayInternRows(intern, tbody);
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

  /////////////////////////interacting with HTML page and displaying the randomization + results of pairs

  displayInterns();
  displayFilters();

  const excludeButton = document.createElement("button");
  excludeButton.textContent = "Remove selected intern";
  excludeButton.addEventListener("click", excludeSelectedInterns);
  document.getElementById("filter-options").appendChild(excludeButton);

  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const searchValue =
        this.querySelector('input[type="text"]').value.toLowerCase();
      filterTableBySearch(searchValue);
    });
    document.getElementById("select-all").addEventListener("click", () => {
      const checkboxes = displayTable.querySelectorAll("input.intern-checkbox");
  
      checkboxes.forEach((checkbox) => {
          const internRow = checkbox.closest("tr");
          const isVisible = internRow.style.display !== "none";
  
          if (isVisible) {
              checkbox.checked = true;
              const internName = internRow.querySelector("td:nth-child(2)").textContent;
              if (!selectedInterns.includes(internName)) {
                  selectedInterns.push(internName);
              }
          }
      });
  
      console.log("Selected Interns after Select All:", selectedInterns);
  });
  
  document.getElementById("deselect-all-button").addEventListener("click", () => {
    const checkboxes = displayTable.querySelectorAll("input.intern-checkbox");

    checkboxes.forEach((checkbox) => {
        const internRow = checkbox.closest("tr");
         // Check if the row is visible
        const isVisible = internRow.style.display !== "none";

        if (isVisible) {
            checkbox.checked = false;

            const internName = internRow.querySelector("td:nth-child(2)").textContent;
            selectedInterns = selectedInterns.filter(name => name !== internName);
        }
    });

    console.log("Selected Interns after Deselect All:", selectedInterns);
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
      const pairs = pairInterns(
        uniqueCheckbox,
        uniqueDepartment,
        cityTokens,
        departmentTokens,
        selectedInterns,
        internsMap,
      );
      console.log("Intern Pairings:", pairs);
      displayPairs(pairs); // Display pairs in the table
    });
  });
});
