document.addEventListener("DOMContentLoaded", () => {
  // initialize global hashmap and tokens
  let internsMap;
  let activeCities = [];
  const uniqueCheckbox = document.getElementById("unique"); // checks if uniquness triggered

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

  function updateActiveCities() {
    //handles city tokens
    activeCities = []; // Clear the previous list

    document.querySelectorAll(".location-button.active").forEach((button) => {
      activeCities.push(button.value); // Add active button values to the list
    });

    console.log("Active Cities:", activeCities); // Log the active cities
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

    console.log("uniqueCheckbox value:", uniqueCheckboxValue); // Check the boolean value

    if (uniqueCheckboxValue) {
      // if unique is checked, calls complex algoritihm
      // Check if it's checked
      console.log("Calling uniqueInterns...");
      return uniqueInterns();
    }

    const internsArray = Array.from(internsMap.values()); // store the selected interns within array

    // shuffle the array around to ensure randomization pairs
    for (let i = internsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [internsArray[i], internsArray[j]] = [internsArray[j], internsArray[i]];
    }

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

  function uniqueInterns() {
    console.log("success");
    const cityInternsMap = new Map(); //hashmap to hold interns structure

    if (activeCities.length > 0) {
      // if activecities, we will only use the cities specified
      internsMap.forEach((intern) => {
        if (activeCities.includes(intern.location)) {
          // Check if the `intern.location` exists in the `activeCities` array.
          // Only proceed with the current intern if their `location` matches one of the active cities.
          if (!cityInternsMap.has(intern.location)) {
            //check if city exists in map if not add city and empty array to the city
            cityInternsMap.set(intern.location, []);
          }
          cityInternsMap.get(intern.location).push(intern); //add the current intern to their respective city
        }
      });
    } else {
      internsMap.forEach((intern) => {
        if (!cityInternsMap.has(intern.location)) {
          //same logic as previous code snippet except we are not checking for the active cities
          cityInternsMap.set(intern.location, []);
        }
        cityInternsMap.get(intern.location).push(intern);
      });
    }

    const pairs = [];
    const cities = Array.from(cityInternsMap.keys());

    // chat gpt randomizing methods
    // Pair interns from different cities
    while (cities.length > 1) {
      const firstCityIndex = Math.floor(Math.random() * cities.length); //random index to retrieve city
      const firstCity = cities[firstCityIndex]; //grabs random city
      const firstInterns = cityInternsMap.get(firstCity); //accesses interns from that chosen city

      let secondCityIndex = Math.floor(Math.random() * cities.length); //same logic as before
      while (secondCityIndex === firstCityIndex) {
        secondCityIndex = Math.floor(Math.random() * cities.length);
      }
      const secondCity = cities[secondCityIndex];
      const secondInterns = cityInternsMap.get(secondCity);

      // Randomly select one intern from each city
      const firstIntern =
        firstInterns[Math.floor(Math.random() * firstInterns.length)]; //random intern selected from list
      const secondIntern =
        secondInterns[Math.floor(Math.random() * secondInterns.length)]; // random intern selected fron list

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

    return pairs; // returns pairs
  }

  //interacting with HTML page and displaying the randomization + results of pairs

  uniqueCheckbox.addEventListener("click", () => {
    console.log("Unique Checkbox Status:", uniqueCheckbox.checked);
  });

  document.querySelectorAll(".location-button").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active"); // Toggle the active class
      updateActiveCities();
    });
  });

  document.getElementById("generate-pairs").addEventListener("click", () => {
    updateActiveCities(); // Update active cities before pairing
    loadInterns().then(() => {
      const pairs = pairInterns();
      console.log("Intern Pairings:", pairs);
      displayPairs(pairs);
    });
  });
});
