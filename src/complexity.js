// Function to shuffle an array
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

//case 1 only unique cities location

export function unique_location(cityTokens, internsMap) {
  const pairs = [];
  const interns = Array.from(internsMap.values());

  if (cityTokens.length < 2) {
    console.log("Please select at least two cities");
    return;
  }

  const filteredInterns = interns.filter((intern) =>
    cityTokens.includes(intern.location),
  );

  const shuffledInterns = shuffleArray(filteredInterns);
  const pairedInterns = new Set();

  // Pair the interns based on unique location
  for (let i = 0; i < shuffledInterns.length; i++) {
    if (pairedInterns.has(shuffledInterns[i].name)) continue; // Skip already paired interns

    for (let j = i + 1; j < shuffledInterns.length; j++) {
      // Check if both interns are from different locations
      if (
        shuffledInterns[j] && // Ensure that shuffledInterns[j] exists
        !pairedInterns.has(shuffledInterns[j].name) && // Skip if already paired
        shuffledInterns[i].location !== shuffledInterns[j].location
      ) {
        pairs.push([shuffledInterns[i], shuffledInterns[j]]);
        pairedInterns.add(shuffledInterns[i].name);
        pairedInterns.add(shuffledInterns[j].name);
        break; // Move to the next intern after pairing
      }
    }
  }

  // Find leftover interns
  let leftoverInterns = shuffledInterns.filter(
    (intern) => !pairedInterns.has(intern.name),
  );

  // Keep creating pairs from leftover interns if possible
  while (leftoverInterns.length > 1) {
    const [first, second, ...rest] = leftoverInterns;
    pairs.push([first, second]); // Pair the first two leftover interns
    pairedInterns.add(first.name);
    pairedInterns.add(second.name);
    leftoverInterns = rest; // Update the leftover interns
  }

  // If there's exactly one intern left, add them to the last pair
  if (leftoverInterns.length === 1) {
    const lastPair = pairs[pairs.length - 1];
    lastPair.push(leftoverInterns[0]); // Add the last leftover intern to the last pair
    pairedInterns.add(leftoverInterns[0].name);
  }

  // Log the unique pairs found
  console.log("Unique Pairs:", pairs);
  // Log the leftover interns (there should be none after the above logic)
  console.log("Leftover Interns:", leftoverInterns);

  return pairs;
}

//case two only unique departments

export function unique_department(departmentTokens, internsMap) {
  const pairs = [];
  const interns = Array.from(internsMap.values());

  if (departmentTokens.length < 2) {
    console.log("Please select at least two cities");
    return;
  }

  const filteredInterns = interns.filter((intern) =>
    departmentTokens.includes(intern.department),
  );

  const shuffledInterns = shuffleArray(filteredInterns);
  const pairedInterns = new Set();

  // Pair the interns based on unique location
  for (let i = 0; i < shuffledInterns.length; i++) {
    if (pairedInterns.has(shuffledInterns[i].name)) continue; // Skip already paired interns

    for (let j = i + 1; j < shuffledInterns.length; j++) {
      // Check if both interns are from different locations
      if (
        shuffledInterns[j] && // Ensure that shuffledInterns[j] exists
        !pairedInterns.has(shuffledInterns[j].name) && // Skip if already paired
        shuffledInterns[i].department !== shuffledInterns[j].department
      ) {
        pairs.push([shuffledInterns[i], shuffledInterns[j]]);
        pairedInterns.add(shuffledInterns[i].name);
        pairedInterns.add(shuffledInterns[j].name);
        break; // Move to the next intern after pairing
      }
    }
  }

  // Find leftover interns
  let leftoverInterns = shuffledInterns.filter(
    (intern) => !pairedInterns.has(intern.name),
  );

  // Keep creating pairs from leftover interns if possible
  while (leftoverInterns.length > 1) {
    const [first, second, ...rest] = leftoverInterns;
    pairs.push([first, second]); // Pair the first two leftover interns
    pairedInterns.add(first.name);
    pairedInterns.add(second.name);
    leftoverInterns = rest; // Update the leftover interns
  }

  // If there's exactly one intern left, add them to the last pair
  if (leftoverInterns.length === 1) {
    const lastPair = pairs[pairs.length - 1];
    lastPair.push(leftoverInterns[0]); // Add the last leftover intern to the last pair
    pairedInterns.add(leftoverInterns[0].name);
  }

  // Log the unique pairs found
  console.log("Unique Pairs:", pairs);
  // Log the leftover interns (there should be none after the above logic)
  console.log("Leftover Interns:", leftoverInterns);

  return pairs;
}

////////////////case three both options selected
export function findUniquePairs(cityTokens, departmentTokens, internsMap) {
  const pairs = [];
  const interns = Array.from(internsMap.values()); // Convert the hashmap to an array of intern objects
  console.log("interns: ", interns);

  // Filter interns based on the provided department and city tokens
  const filteredInterns = interns.filter(
    (intern) =>
      departmentTokens.includes(intern.department) &&
      cityTokens.includes(intern.location),
  );

  // Log the filtered interns
  console.log("Filtered Interns:", filteredInterns);

  // Shuffle the filtered interns for better randomization
  const shuffledInterns = shuffleArray(filteredInterns);

  // Set to keep track of already paired interns
  const pairedInterns = new Set();

  // Loop through each intern in the shuffled array
  for (let i = 0; i < shuffledInterns.length; i++) {
    if (pairedInterns.has(shuffledInterns[i].name)) continue; // Skip already paired interns

    for (let j = i + 1; j < shuffledInterns.length; j++) {
      // Check if both interns are from different locations and departments
      if (
        shuffledInterns[j] && // Ensure that shuffledInterns[j] exists
        !pairedInterns.has(shuffledInterns[j].name) && // Skip if already paired
        shuffledInterns[i].location !== shuffledInterns[j].location &&
        shuffledInterns[i].department !== shuffledInterns[j].department
      ) {
        pairs.push([shuffledInterns[i], shuffledInterns[j]]);
        pairedInterns.add(shuffledInterns[i].name);
        pairedInterns.add(shuffledInterns[j].name);
        break; // Move to the next intern after pairing
      }
    }
  }

  // Log the unique pairs found
  console.log("Unique Pairs:", pairs);

  return pairs;
}

//export function uniqueInterns(cityTokens, internsMap) {
//   console.log("success");
//   const cityInternsMap = new Map(); //hashmap to hold interns structure

//   if (cityTokens.length < 1) {
//     return console.log("Error, please choose at least 2 cities");
//   }

//   if (cityTokens.length > 0) {
//     // if activecities, we will only use the cities specified
//     internsMap.forEach((intern) => {
//       if (cityTokens.includes(intern.location)) {
//         // Check if the `intern.location` exists in the `activeCities` array.
//         // Only proceed with the current intern if their `location` matches one of the active cities.
//         if (!cityInternsMap.has(intern.location)) {
//           //check if city exists in map if not add city and empty array to the city
//           cityInternsMap.set(intern.location, []);
//         }
//         cityInternsMap.get(intern.location).push(intern); //add the current intern to their respective city
//       }
//     });
//   } else {
//     internsMap.forEach((intern) => {
//       if (!cityInternsMap.has(intern.location)) {
//         //same logic as previous code snippet except we are not checking for the active cities
//         cityInternsMap.set(intern.location, []);
//       }
//       cityInternsMap.get(intern.location).push(intern);
//     });
//   }

//   const pairs = [];
//   const cities = Array.from(cityInternsMap.keys());

//   // chat gpt randomizing methods
//   // Pair interns from different cities
//   while (cities.length > 1) {
//     const firstCityIndex = Math.floor(Math.random() * cities.length); //random index to retrieve city
//     const firstCity = cities[firstCityIndex]; //grabs random city
//     const firstInterns = cityInternsMap.get(firstCity); //accesses interns from that chosen city

//     let secondCityIndex = Math.floor(Math.random() * cities.length); //same logic as before
//     while (secondCityIndex === firstCityIndex) {
//       secondCityIndex = Math.floor(Math.random() * cities.length);
//     }
//     const secondCity = cities[secondCityIndex];
//     const secondInterns = cityInternsMap.get(secondCity);

//     // Randomly select one intern from each city
//     const firstIntern =
//       firstInterns[Math.floor(Math.random() * firstInterns.length)]; //random intern selected from list
//     const secondIntern =
//       secondInterns[Math.floor(Math.random() * secondInterns.length)]; // random intern selected fron list

//     pairs.push([firstIntern, secondIntern]);

//     // Remove the interns from the city arrays after pairing to avoid re-pairing
//     firstInterns.splice(firstInterns.indexOf(firstIntern), 1);
//     secondInterns.splice(secondInterns.indexOf(secondIntern), 1);

//     // Remove cities with no remaining interns
//     if (firstInterns.length === 0) {
//       cities.splice(firstCityIndex, 1);
//     }
//     if (secondInterns.length === 0) {
//       cities.splice(secondCityIndex, 1);
//     }
//   }

//   return pairs; // returns pairs
// }
