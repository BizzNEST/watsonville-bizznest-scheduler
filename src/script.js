document.addEventListener("DOMContentLoaded", () => {
  let internsMap;
  let activeCities = [];
  const uniqueCheckbox = document.getElementById("unique");

  uniqueCheckbox.addEventListener("click", () => {
    console.log("Unique Checkbox Status:", uniqueCheckbox.checked);
  });

  document.querySelectorAll(".location-button").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active"); // Toggle the active class
      updateActiveCities();
    });
  });

  function loadInterns() {
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
    const displayElement = document.getElementById("pairs-display");
    displayElement.innerHTML = ""; // Clear previous results

    pairs.forEach((pair) => {
      const pairElement = document.createElement("div");
      pairElement.textContent = pair.map((intern) => intern.name).join(" & ");
      displayElement.appendChild(pairElement);
    });
  }

  function updateActiveCities() {
    activeCities = []; // Clear the previous list

    document.querySelectorAll(".location-button.active").forEach((button) => {
      activeCities.push(button.value); // Add active button values to the list
    });

    console.log("Active Cities:", activeCities); // Log the active cities
  }

  function pairInterns() {
    console.log("pairInterns function called");
    if (!internsMap || internsMap.size === 0) {
      console.error("Interns map is empty or not loaded.");
      return [];
    }

    // Get the checkbox element
    const uniqueCheckboxElement = document.getElementById("unique");
    const uniqueCheckboxValue = uniqueCheckboxElement.checked; // Access the checked property

    console.log("uniqueCheckbox value:", uniqueCheckboxValue); // Check the boolean value
    if (uniqueCheckboxValue) {
      // Check if it's checked
      console.log("Calling uniqueInterns...");
      return uniqueInterns();
    }
    const internsArray = Array.from(internsMap.values());

    // Shuffle the array
    for (let i = internsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [internsArray[i], internsArray[j]] = [internsArray[j], internsArray[i]];
    }

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

  function uniqueInterns() {
    // Create a map to hold interns by city
    console.log("success");
    const cityInternsMap = new Map();

    if (activeCities.length > 0) {
      // Check if activeCities is not empty
      internsMap.forEach((intern) => {
        if (activeCities.includes(intern.location)) {
          if (!cityInternsMap.has(intern.location)) {
            cityInternsMap.set(intern.location, []);
          }
          cityInternsMap.get(intern.location).push(intern);
        }
      });
    } else {
      internsMap.forEach((intern) => {
        if (!cityInternsMap.has(intern.location)) {
          cityInternsMap.set(intern.location, []);
        }
        cityInternsMap.get(intern.location).push(intern);
      });
    }

    const pairs = [];
    const cities = Array.from(cityInternsMap.keys());

    // Pair interns from different cities
    while (cities.length > 1) {
      const firstCityIndex = Math.floor(Math.random() * cities.length);
      const firstCity = cities[firstCityIndex];
      const firstInterns = cityInternsMap.get(firstCity);

      let secondCityIndex = Math.floor(Math.random() * cities.length);
      while (secondCityIndex === firstCityIndex) {
        secondCityIndex = Math.floor(Math.random() * cities.length);
      }
      const secondCity = cities[secondCityIndex];
      const secondInterns = cityInternsMap.get(secondCity);

      // Randomly select one intern from each city
      const firstIntern =
        firstInterns[Math.floor(Math.random() * firstInterns.length)];
      const secondIntern =
        secondInterns[Math.floor(Math.random() * secondInterns.length)];

      pairs.push([firstIntern, secondIntern]);

      // Remove the interns from the city arrays after pairing to avoid re-pairing
      firstInterns.splice(firstInterns.indexOf(firstIntern), 1);
      secondInterns.splice(secondInterns.indexOf(secondIntern), 1);

      // Remove cities with no remaining interns
      if (firstInterns.length === 0) {
        cities.splice(firstCityIndex, 1);
      }
      if (secondInterns.length === 0) {
        cities.splice(secondCityIndex, 1);
      }
    }

    return pairs;
  }

  document.getElementById("generate-pairs").addEventListener("click", () => {
    updateActiveCities(); // Update active cities before pairing
    loadInterns().then(() => {
      const pairs = pairInterns();
      console.log("Intern Pairings:", pairs);
      displayPairs(pairs);
    });
  });
});
