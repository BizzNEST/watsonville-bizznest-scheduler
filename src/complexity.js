// Function to shuffle an array

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

export function pairInterns(
  uniqueCheckbox,
  uniqueDepartment,
  cityTokens,
  departmentTokens,
  selectedInterns,
  internsMap,
) {
  console.log("pairInterns function called");
  if (!internsMap || internsMap.size === 0) {
    // ensures interns are loaded
    logToPage("Error: No Interns Found");
    return null;
  }

  if (selectedInterns.length > 0) {
    selectedInterns.forEach((intern) => {
      if (internsMap.has(intern)) {
        internsMap.delete(intern);
      }
    });
  }

  if (!internsMap || internsMap.size === 0) {
    // ensures interns are loaded
    logToPage("Error: No Interns Found");
    return null;
  }

  // Get the checkbox element
  const uniqueCheckboxValue = uniqueCheckbox.checked; // Access the checked property
  const uniqueDepartmentValue = uniqueDepartment.checked; // Access the checked property

  console.log("uniqueCheckbox value:", uniqueCheckboxValue); // Check the boolean value
  console.log("uniqueDepartment value:", uniqueDepartmentValue);

  if (uniqueCheckboxValue == true && uniqueDepartmentValue == true) {
    // if unique is checked, calls complex algoritihm
    console.log("Calling uniqueInterns...");
    return findUniquePairs(cityTokens, departmentTokens, internsMap);
  }

  if (uniqueCheckboxValue == true && uniqueDepartmentValue == false) {
    // if unique is checked, calls complex algoritihm
    console.log("Calling uniqueInterns...");
    return unique_location(cityTokens, departmentTokens, internsMap);
  }

  if (uniqueCheckboxValue == false && uniqueDepartmentValue == true) {
    // if unique is checked, calls complex algoritihm
    console.log("Calling uniqueInterns...");
    return unique_department(cityTokens, departmentTokens, internsMap);
  }

  let internsArray;

  if (cityTokens.length != 0 || departmentTokens.length != 0) {
    //checks if there are tokens
    // filter interns whose city is within the cityTokens array or department is within the departmentTokens array
    internsArray = Array.from(internsMap.values()).filter((intern) => {
      const cityMatch =
        cityTokens.length === 0 || cityTokens.includes(intern.location); //checks if tokens are empty or if the intern's location is included in tokens
      const departmentMatch =
        departmentTokens.length === 0 ||
        departmentTokens.includes(intern.department); //same logic as below, they are just booleans that allow interns to filter
      return cityMatch && departmentMatch;
    });
  } else {
    // If no cityTokens or departmentTokens are provided, just create the array from internsMap values
    internsArray = Array.from(internsMap.values());
  }
  // store the selected interns within array

  // shuffle the array around to ensure randomization pairs
  shuffleArray(internsArray);

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

//case 1 only unique cities location

function unique_location(cityTokens, departmentTokens, internsMap) {
  const pairs = [];
  const interns = Array.from(internsMap.values());
  let filteredInterns = interns;

  if (cityTokens.length === 1) {
    logToPage("Please select at least two cities");
    return null;
  }

  if (departmentTokens.length > 0) {
    filteredInterns = filteredInterns.filter((intern) =>
      departmentTokens.includes(intern.department),
    );
  }

  if (cityTokens.length > 1) {
    filteredInterns = filteredInterns.filter((intern) =>
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

  let leftoverInternsAmt = leftoverInterns.length;

  if (leftoverInternsAmt >= 1) {
    logToPage(
      `There are ${leftoverInternsAmt} leftover intern(s). Pairs may be bigger`,
    );
    let pairIndex = 0;
    while (leftoverInterns.length > 0) {
      const intern = leftoverInterns.shift(); // Get the first leftover intern
      pairs[pairIndex].push(intern); // Add the leftover intern to the pair
      pairedInterns.add(intern.name);
      pairIndex = (pairIndex + 1) % pairs.length; // Move to the next pair in a circular manner
    }
  }
  // Add leftover interns to existing pairs

  // Log the unique pairs found
  console.log("Unique Pairs:", pairs);
  // Log the leftover interns (there should be none after the above logic)
  console.log("Leftover Interns:", leftoverInternsAmt);
  validate(pairs, "location");
  return pairs;
}

//case two only unique departments

function unique_department(cityTokens, departmentTokens, internsMap) {
  const pairs = [];
  const interns = Array.from(internsMap.values());
  let filteredInterns = interns;

  if (cityTokens.length > 0) {
    filteredInterns = filteredInterns.filter((intern) =>
      cityTokens.includes(intern.location),
    );
  }

  if (departmentTokens.length === 1) {
    logToPage("Please pick at least two departments");
    return null;
  }

  if (departmentTokens.length > 1) {
    filteredInterns = filteredInterns.filter((intern) =>
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

  let leftoverInternsAmt = leftoverInterns.length;

  if (leftoverInternsAmt >= 1) {
    logToPage(
      `There are ${leftoverInternsAmt} leftover intern(s). Pairs may be bigger`,
    );
    let pairIndex = 0;
    while (leftoverInterns.length > 0) {
      const intern = leftoverInterns.shift(); // Get the first leftover intern
      pairs[pairIndex].push(intern); // Add the leftover intern to the pair
      pairedInterns.add(intern.name);
      pairIndex = (pairIndex + 1) % pairs.length; // Move to the next pair in a circular manner
    }
  }
  // Add leftover interns to existing pairs

  // Log the unique pairs found
  console.log("Unique Pairs:", pairs);
  // Log the leftover interns (there should be none after the above logic)
  console.log("Leftover Interns:", leftoverInternsAmt);
  validate(pairs, "department");
  return pairs;
}

////////////////case three both options selected
function findUniquePairs(cityTokens, departmentTokens, internsMap) {
  const pairs = [];
  const interns = Array.from(internsMap.values()); // Convert the hashmap to an array of intern objects
  let filteredInterns = interns;

  if (departmentTokens.length === 1 || cityTokens.length === 1) {
    logToPage("Please pick at least two cities and two departments");
    return null;
  }

  // Filter interns based on the provided department and city tokens
  if (departmentTokens.length > 1) {
    filteredInterns = filteredInterns.filter((intern) =>
      departmentTokens.includes(intern.department),
    );
  }

  if (cityTokens.length > 1) {
    filteredInterns = filteredInterns.filter((intern) =>
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

  // Find leftover interns
  let leftoverInterns = shuffledInterns.filter(
    (intern) => !pairedInterns.has(intern.name),
  );

  let leftoverInternsAmt = leftoverInterns.length;

  if (leftoverInternsAmt >= 1) {
    logToPage(
      `There are ${leftoverInternsAmt} leftover intern(s). Pairs may be bigger`,
    );
    let pairIndex = 0;
    while (leftoverInterns.length > 0) {
      const intern = leftoverInterns.shift(); // Get the first leftover intern
      pairs[pairIndex].push(intern); // Add the leftover intern to the pair
      pairedInterns.add(intern.name);
      pairIndex = (pairIndex + 1) % pairs.length; // Move to the next pair in a circular manner
    }
  }
  // Add leftover interns to existing pairs

  // Log the unique pairs found
  console.log("Unique Pairs:", pairs);
  // Log the leftover interns (there should be none after the above logic)
  console.log("Leftover Interns:", leftoverInternsAmt);
  validate(pairs, "both");
  return pairs;
}

function logToPage(message) {
  const logDiv = document.getElementById("logOutput");
  // Check if the current log message is already displayed
  if (logDiv.textContent === message) {
    return; // Don't append the same message again
  }
  logDiv.innerHTML = "";
  /*const newLog = document.createElement("p");
  newLog.textContent = message;*/
  logDiv.textContent = message;
  logDiv.style.visibility = "visible";
  /*logDiv.appendChild(newLog);*/
}

function logAccuracy(message) {
  const logDiv = document.getElementById("accuracy-display");
  if (logDiv.textContent === message) {
    return; // Don't append the same message again
  }
  logDiv.innerHTML = "";
  logDiv.textContent = message;
  logDiv.style.visibility = "visible";
}

function validate(pairs, token) {
  let total = 0;
  let mismatch = 0;

  // Loop through each pair of interns
  if (token == "location") {
    console.log("validation triggered1");
    pairs.forEach((pair) => {
      if (pair.length === 2) {
        total++; // Count valid pairs
        // Check if interns are from different locations
        if (pair[0].location == pair[1].location) {
          mismatch++;
        }
      }
    });
    if (mismatch == 0) {
      let accuracy = 100;
      return logAccuracy(`Accuracy: ${accuracy}`);
    } else {
      let accuracy = (mismatch / total) * 100;
      return logAccuracy(`Accuracy: ${accuracy}`);
    }
  }

  if (token == "department") {
    console.log("validation triggered2");
    pairs.forEach((pair) => {
      if (pair.length === 2) {
        total++; // Count valid pairs
        // Check if interns are from different locations
        if (pair[0].department == pair[1].department) {
          mismatch++;
        }
      }
    });
    if (mismatch == 0) {
      let accuracy = 100;
      return logAccuracy(`Accuracy: ${accuracy}`);
    } else {
      let accuracy = (mismatch / total) * 100;
      return logAccuracy(`Accuracy: ${accuracy}`);
    }
  }
  if (token == "both") {
    console.log("validation triggered3");
    pairs.forEach((pair) => {
      if (pair.length === 2) {
        total++; // Count valid pairs
        // Check if interns are from different locations
        if (
          pair[0].location == pair[1].location ||
          pair[0].department == pair[1].department
        ) {
          mismatch++;
        }
      }
    });
    if (mismatch == 0) {
      let accuracy = 100;
      return logAccuracy(`Accuracy: ${accuracy}`);
    } else {
      let accuracy = (mismatch / total) * 100;
      return logAccuracy(`Accuracy: ${accuracy}`);
    }
  }
}
