document.addEventListener("DOMContentLoaded", () => {
  let internsMap;
  let activeCities = [];
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

  function pairInterns() {
    if (!internsMap || internsMap.size === 0) {
      console.error("Interns map is empty or not loaded.");
      return [];
    }

    // Filter interns based on activeCities
    const internsArray = Array.from(internsMap.values()).filter((intern) =>
      activeCities.includes(intern.location),
    );

    if (internsArray.length < 2) {
      console.error("Error, Not enough interns to create pairs");
      return [];
    }

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

  document.getElementById("generate-pairs").addEventListener("click", () => {
    updateActiveCities(); // Update active cities before pairing
    loadInterns().then(() => {
      const pairs = pairInterns();
      console.log("Intern Pairings:", pairs);
      displayPairs(pairs);
    });
  });
});
