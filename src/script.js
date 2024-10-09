import { pairInterns } from "./complexity.js";
import {
  displayInternRows,
  elementArrCreator,
  appendChildren,
  displayFilters,
  filterTable,
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
    displayTable.className = "table table-hover";

    displayTable.innerHTML = "";
   
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
  
    const rowTop = document.createElement("tr");

    const filters = ['', 'Name', 'Location', 'Department'];
    const topWords = elementArrCreator(filters, "th");
    appendChildren(rowTop, topWords);
   
    thead.appendChild(rowTop);
    displayTable.appendChild(thead);
    displayTable.appendChild(tbody);
  
    loadInterns().then((map) => {
      internsMap = map;
      internsMap.forEach((intern, name) => {
        displayInternRows(intern, tbody, checkedInterns);
      });
    }).catch(error => {
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

  // function loadInterns() {
  //   //simply loads interns into the hashmap along with their details
  //   return fetch("interns.json")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       internsMap = new Map();
  //       data.intern.forEach((intern) => {
  //         internsMap.set(intern.name, intern);
  //       });
  //       return internsMap; // Return the map
  //     })
  //     .catch((error) => console.error("Error loading JSON:", error));
  // }

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
        internCell.contentEditable = true;
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
  excludeButton.textContent = "Remove Selected";
  excludeButton.addEventListener("click", excludeSelectedInterns);
  document.getElementById("selection-btns").appendChild(excludeButton);

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
        const internName =
          internRow.querySelector("td:nth-child(2)").textContent;
        if (!selectedInterns.includes(internName)) {
          selectedInterns.push(internName);
        }
      }
    });

    console.log("Selected Interns after Select All:", selectedInterns);
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
          selectedInterns = selectedInterns.filter(
            (name) => name !== internName,
          );
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


document.getElementById('reset-button').addEventListener('click', function() {
  internsMap.clear();
  selectedInterns = [];
  checkedInterns = [];
  
  const tbody = document.querySelector("#interns-display tbody");
  tbody.innerHTML = "";
  loadInterns().then(() => {
  document.getElementById('interns-display').style.display = 'table';
  document.getElementById('pairing-intern-display').style.display = 'none';

    displayInterns();
  }).catch(error => {
    console.error("Error reloading interns in reset:", error);
  });
  
});

document.querySelector('.reset-all-buttons').addEventListener('click', function() {
  internsMap.clear();
  selectedInterns = [];
  checkedInterns = [];
  
  let locationButtons = document.querySelectorAll('.location-button');
  locationButtons.forEach(button => {
    button.classList.remove('active');
  });

 
  let departmentButtons = document.querySelectorAll('.department-button');
  departmentButtons.forEach(button => {
    button.classList.remove('active');
  });

 
  let checkboxes = document.querySelectorAll('.unique-boxes input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  
  const searchBar = document.getElementById("search-bar");
  if (searchBar) {
    searchBar.value = ""; 
  }

  filterTableBySearch(""); 

  const locationDropdown = document.getElementById("locations");
  const departmentDropdown = document.getElementById("department");

  if (locationDropdown) {
    locationDropdown.value = ""; 
  }
  
  if (departmentDropdown) {
    departmentDropdown.value = "";
  }
  filterTable(); 
  const table_checkboxes = displayTable.querySelectorAll("input.intern-checkbox");

  table_checkboxes.forEach((checkbox) => {
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
  internsMap.clear();
  
  // Clear
  const tbody = document.querySelector("#interns-display tbody");
  tbody.innerHTML = "";

  loadInterns().then(() => {
  document.getElementById('interns-display').style.display = 'table';
  document.getElementById('pairing-intern-display').style.display = 'none';

    displayInterns();
  }).catch(error => {
    console.error("Error reloading interns in reset all:", error);
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
      if (pairs) {
        console.log("Intern Pairings:", pairs);
        const logDiv = document.getElementById("logOutput");
        // logDiv.innerHTML = "";
        displayPairs(pairs); // Only display pairs if no error occurred
      } else {
        console.log("Pairing skipped due to error");
      }
    });
  });
});

