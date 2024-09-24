document.addEventListener("DOMContentLoaded", () => {
  const displayTable = document.getElementById("interns-display");
  let internsMap;
  displayInterns();
  
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
    const displayTable = document.getElementById("pairs-display");
   displayTable.innerHTML = ""; // Clear previous results

    pairs.forEach((pair) => {
      const pairElement = document.createElement("div");
      pairElement.textContent = pair.map((intern) => intern.name).join(" & ");
     displayTable.appendChild(pairElement);
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
