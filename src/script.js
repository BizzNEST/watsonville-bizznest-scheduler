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
