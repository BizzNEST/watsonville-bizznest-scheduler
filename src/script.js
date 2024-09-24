document.addEventListener("DOMContentLoaded", () => {
  let internsMap;

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

  function displayPairs(pairs) {
    const displayElement = document.getElementById("pairs-display");
    displayElement.innerHTML = ""; // Clear previous results

    pairs.forEach((pair) => {
      const pairElement = document.createElement("div");
      pairElement.textContent = pair.map((intern) => intern.name).join(" & ");
      displayElement.appendChild(pairElement);
    });
  }

  document.getElementById("generate-pairs").addEventListener("click", () => {
    loadInterns().then(() => {
      const pairs = pairInterns();
      console.log("Intern Pairings:", pairs);
      displayPairs(pairs);
    });
  });
});
