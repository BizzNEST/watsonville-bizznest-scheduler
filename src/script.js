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

// Call the function
loadInterns().then(() => {
  // Now internsMap is defined, and you can safely access it here
  const watsonvilleInterns = [];
  internsMap.forEach((intern) => {
    if (intern.location === "Watsonville") {
      watsonvilleInterns.push(intern);
    }
  });
  console.log(watsonvilleInterns);
});

function pairInterns() {
  // check if empty
  if (!internsMap || internsMap.size === 0) {
    console.error("Interns map is empty or not loaded.");
    return [];
  }

  // Convert Map values to an array
  const internsArray = Array.from(internsMap.values());

  // Shuffle the array 
  for (let i = internsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [internsArray[i], internsArray[j]] = [internsArray[j], internsArray[i]];
  }

  const pairs = [];
  let i = 0;

  // Create pairs of 2
  while (i < internsArray.length) {
    if (i + 1 < internsArray.length) {
      // Form a group of 2 if there are enough interns left
      pairs.push([internsArray[i], internsArray[i + 1]]);
      i += 2;
    } else {
      // If there's only 1 intern left
      break;
    }
  }

  // If there's an odd intern--> add them to the last group of 2
  if (i < internsArray.length) {
    // Remove the last group
    const lastGroup = pairs.pop();
    // Add the leftover intern
    lastGroup.push(internsArray[i]);
    // Push the modified group back
    pairs.push(lastGroup);
  }

  return pairs;
}

// Load interns and view pairings
loadInterns().then(() => {
  const pairs = pairInterns();
  console.log("Intern Pairings:", pairs);
});

