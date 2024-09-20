document.addEventListener("DOMContentLoaded", () => {
  const randomButton = document.getElementById("displayPairs");
  const displayinternNames = document.getElementById("internNames");

  randomButton.addEventListener("click", function() {
    const internValues = pairInterns(); 
    displayInternNames(internValues);
  });
  function displayInternNames(internPairs) {
    displayinternNames.innerHTML = ""; // Clear previous names
    internPairs.forEach(pair => {
      const nameParagraph = document.createElement("p");
      nameParagraph.innerHTML = `${pair[0].name} & ${pair[1] ? pair[1].name : "No match"}`;
      displayinternNames.appendChild(nameParagraph);
    });
  }
  

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

  loadInterns().then(() => {
    const watsonvilleInterns = [];
    internsMap.forEach((intern) => {
      if (intern.location === "Watsonville") {
        watsonvilleInterns.push(intern);
      }
    });
    console.log(watsonvilleInterns);
  });

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

  loadInterns().then(() => {
    const pairs = pairInterns();
    console.log("Intern Pairings:", pairs);
  });
});
