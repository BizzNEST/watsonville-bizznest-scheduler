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
  let filteredInterns = interns;

  if (cityTokens.length === 1) {
    console.log("Please pick at least two cities");
    return [];
  }

  if (cityTokens.length > 1) {
    filteredInterns = interns.filter((intern) =>
      cityTokens.includes(intern.location),
    );
  }

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
  let filteredInterns = interns;

  if (departmentTokens.length === 1) {
    console.log("Please pick at least two departments");
    return [];
  }

  if (departmentTokens.length > 1) {
    filteredInterns = interns.filter((intern) =>
      departmentTokens.includes(intern.department),
    );
  }

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
  let filteredInterns = interns;

  if (departmentTokens.length === 1 || cityTokens.length === 1) {
    console.log("Please pick at least two cities and two departments");
    return [];
  }

  // Filter interns based on the provided department and city tokens
  if (departmentTokens.length > 1 && cityTokens.length > 1) {
    filteredInterns = interns.filter(
      (intern) =>
        departmentTokens.includes(intern.department) &&
        cityTokens.includes(intern.location),
    );
  }

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

  // Log the unique pairs found
  console.log("Unique Pairs:", pairs);

  return pairs;
}
