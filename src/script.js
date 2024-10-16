import { pairInterns } from "./complexity.js";
import {
  elementArrCreator,
  appendChildren,
  displayFilters,
  filterTable,
  filterTableBySearch,
  searchPairs,
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
    displayTable.className = "table table-hover";

    displayTable.innerHTML = "";

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const rowTop = document.createElement("tr");

    const filters = ["", "Name", "Location", "Department"];
    const topWords = elementArrCreator(filters, "th");
    appendChildren(rowTop, topWords);

    thead.appendChild(rowTop);
    displayTable.appendChild(thead);
    displayTable.appendChild(tbody);

    loadInterns()
      .then((map) => {
        internsMap = map;
        internsMap.forEach((intern, name) => {
          displayInternRows(intern, tbody);
        });
      })
      .catch((error) => {
        console.error("Error loading:", error);
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

  function displayInternRows(intern, tbody) {
    const row = document.createElement("tr");

    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("intern-checkbox");

    if (checkedInterns.includes(intern.name)) {
      checkbox.checked = true;
    }

    // Update the temporary checkedInterns array when checkbox is clicked
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        if (!checkedInterns.includes(intern.name)) {
          checkedInterns.push(intern.name); // Add intern to checkedInterns
        }
      } else {
        const index = checkedInterns.indexOf(intern.name);
        if (index > -1) {
          checkedInterns.splice(index, 1); // Remove intern from checkedInterns
        }
      }
      console.log("Checked Interns:", checkedInterns);
    });

    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    const internFilters = [
      `${intern.name}`,
      `${intern.location}`,
      `${intern.department}`,
    ];
    const internsArray = elementArrCreator(internFilters, "td");
    appendChildren(row, internsArray);

    tbody.appendChild(row);
  }

  function loadInterns() {
    // Load interns into the hashmap along with their details
    internsMap = new Map(); // Clear the previous map
    return fetch("interns.json")
      .then((response) => response.json())
      .then((data) => {
        data.intern.forEach((intern) => {
          internsMap.set(intern.name, intern);
        });
        console.log("Loaded Interns:", internsMap); // Log the map after loading
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
      const internName = document.createElement("td");
      group.forEach((intern, i) => {
        if (i > 0) internName.appendChild(document.createElement("br")); // Add line break after each intern
        internName.contentEditable = true;
        internName.appendChild(document.createTextNode(intern.name));
      });
      row.appendChild(internName);

      const internLocation = document.createElement("td");
      group.forEach((intern, i) => {
        if (i > 0) internLocation.appendChild(document.createElement("br")); // Add line break after each location
        internLocation.contentEditable = true;
        internLocation.appendChild(document.createTextNode(intern.location));
      });
      row.appendChild(internLocation);

      const internDepartment = document.createElement("td");
      group.forEach((intern, i) => {
        if (i > 0) internDepartment.appendChild(document.createElement("br")); // Add line break after each department
        internDepartment.contentEditable = true;
        internDepartment.appendChild(
          document.createTextNode(intern.department),
        );
      });
      row.appendChild(internDepartment);

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
  excludeButton.textContent = "Remove Selected";
  excludeButton.id = "remove-btn";
  excludeButton.addEventListener("click", excludeSelectedInterns);
  document.getElementById("selection-btns").appendChild(excludeButton);

  document
    .getElementById("search-bar") // Targeting the input field directly
    .addEventListener("input", function () {
      const searchValue = this.value.toLowerCase();
      filterTableBySearch(searchValue);
    });
  document.getElementById("select-all").addEventListener("click", () => {
    const checkboxes = displayTable.querySelectorAll("input.intern-checkbox");

    checkboxes.forEach((checkbox) => {
      const internRow = checkbox.closest("tr");
      const isVisible = internRow.style.display !== "none";

      if (isVisible) {
        checkbox.checked = true;
        const internName =
          internRow.querySelector("td:nth-child(2)").textContent;
        if (!checkedInterns.includes(internName)) {
          checkedInterns.push(internName);
        }
      }
    });

    console.log("Checked Interns Interns after Select All:", checkedInterns);
  });

  document
    .getElementById("deselect-all-button")
    .addEventListener("click", () => {
      const checkboxes = displayTable.querySelectorAll("input.intern-checkbox");

      checkboxes.forEach((checkbox) => {
        const internRow = checkbox.closest("tr");
        // Check if the row is visible
        const isVisible = internRow.style.display !== "none";

        if (isVisible) {
          checkbox.checked = false;

          const internName =
            internRow.querySelector("td:nth-child(2)").textContent;
          checkedInterns = checkedInterns.filter((name) => name !== internName);
        }
      });

      console.log("Checked Interns after Deselect All:", checkedInterns);
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

  document
    .getElementById("reset-button")
    .addEventListener("click", function () {
      internsMap.clear();
      selectedInterns = [];
      checkedInterns = [];

      const tbody = document.querySelector("#interns-display tbody");
      const logAcc = document.getElementById("accuracy-display");
      const logDiv = document.getElementById("logOutput");
      logAcc.innerHTML = "";
      logDiv.innerHTML = "";
      tbody.innerHTML = "";
      loadInterns()
        .then(() => {
          document.getElementById("interns-display").style.display = "table";
          document.getElementById("pairing-intern-display").style.display =
            "none";

          displayInterns();
        })
        .catch((error) => {
          console.error("Error reloading interns in reset:", error);
        });
    });

  document
    .querySelector(".reset-all-buttons")
    .addEventListener("click", function () {
      let locationButtons = document.querySelectorAll(".location-button");
      locationButtons.forEach((button) => {
        button.classList.remove("active");
      });

      let departmentButtons = document.querySelectorAll(".department-button");
      departmentButtons.forEach((button) => {
        button.classList.remove("active");
      });

      let checkboxes = document.querySelectorAll(
        '.unique-boxes input[type="checkbox"]',
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });

      const searchBar = document.getElementById("search-bar");
      if (searchBar) {
        searchBar.value = "";
      }

      filterTableBySearch("");
      searchPairs("");

      const locationDropdown = document.getElementById("locations");
      const departmentDropdown = document.getElementById("department");

      if (locationDropdown) {
        locationDropdown.value = "";
      }

      if (departmentDropdown) {
        departmentDropdown.value = "";
      }
    });

  document.getElementById("generate-pairs").addEventListener("click", () => {
    document.getElementById("interns-display").style.display = "none";
    document.getElementById("pairing-intern-display").style.display = "table";

    // Reset pairing table before generating new pairs
    const pairingTableBody = document
      .getElementById("pairing-intern-display")
      .querySelector("tbody");
    pairingTableBody.innerHTML = ""; // Clear any old pairs

    const logAcc = document.getElementById("accuracy-display");
    const logDiv = document.getElementById("logOutput");
    logAcc.innerHTML = "";
    logDiv.innerHTML = "";

    updateCityTokens();
    console.log(internsMap);

    loadInterns().then(() => {
      const pairs = pairInterns(
        uniqueCheckbox,
        uniqueDepartment,
        cityTokens,
        departmentTokens,
        selectedInterns,
        internsMap,
      );

      if (pairs) {
        console.log("Intern Pairings:", pairs);
        displayPairs(pairs);
      } else {
        console.log("Pairing skipped due to error");
      }
    });
  });
});
