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

  function displayInterns() {
    loadInterns().then((map) => {
      internsMap = map;
      const rowTop = document.createElement("tr");
      const topWords1 = document.createElement("th");
      topWords1.textContent = `Name`;
      rowTop.appendChild(topWords1);

      const topWords2 = document.createElement("th");
      topWords2.textContent = `Location`;
      rowTop.appendChild(topWords2);

      const topWords3 = document.createElement("th");
      topWords3.textContent = `Department`;
      rowTop.appendChild(topWords3);
      displayTable.appendChild(rowTop);

      internsMap.forEach((intern, name) => {
        console.log(`Name: ${name}, Details:`, intern);
        displayInternBefore(intern);
      });
    });
  }
  function displayInternBefore(intern) {
    const row = document.createElement("tr");

    const nameIntern = document.createElement("td");
    nameIntern.textContent = `${intern.name}`;
    row.appendChild(nameIntern);

    const locationIntern = document.createElement("td");
    locationIntern.textContent = `${intern.location}`;
    row.appendChild(locationIntern);

    const departmentIntern = document.createElement("td");
    departmentIntern.textContent = `${intern.department}`;
    row.appendChild(departmentIntern);

    displayTable.appendChild(row);
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
    //simply displays the pairs of interns
    const displayElement = document.getElementById("pairs-display");
    displayElement.innerHTML = ""; // Clear previous results

    pairs.forEach((pair) => {
      const pairElement = document.createElement("div");
      pairElement.textContent = pair.map((intern) => intern.name).join(" & ");
      displayElement.appendChild(pairElement);
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
    updateCityTokens(); // Update active cities before pairing
    loadInterns().then(() => {
      const pairs = pairInterns();
      console.log("Intern Pairings:", pairs);
      displayPairs(pairs);
    });
  });
});
