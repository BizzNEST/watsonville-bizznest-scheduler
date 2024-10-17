# Nest Me Up!

This project aims to create a randomized scheduling app using HTML, CSS, and JavaScript. It will pair or group interns from various locations and departments based on customizable rules, allowing users to easily include or exclude interns with simple controls.

## Table of Contents

- [Nest Me Up!](#nestup)
- [Table of Contents](#table-of-contents)
- [Project Requirements](#project-requirements)
- [Project Setup](#project-setup)
- [How to Run the Project](#how-to-run-the-project)
- [Development Process](#development-process)
- [Deployment Instructions](#deployment-instructions)
 
## Project Requirements

### Intern Data Management:
   Store all intern data in a static JSON object that is embedded or loaded into the application.
    Provide an interface to display intern details, such as name, department, and location, pulled from the JSON object.

### Randomized Scheduling:
   
The application should randomly generate a schedule that pairs or groups interns according to specified rules.

### Pairing rules should include:
 
Different city pairing: Interns are paired with others from different cities.

### Different department pairing:

 Interns are paired with others from different departments.
    Users should be able to turn these rules on or off depending on their requirements.

### Selection and Filtering: yuliana


### Rule Configuration: ali
    

### Manual Override: yuliana


### Edge Case Handling: ali
 

### User Interface:
An organized and user-friendly interface that is accessible on both desktop and mobile devices. The modal displays available pairing rules, and allows users to select or deselect interns easily for maximum efficiency.

### Accessibility:
Ensured the application meets accesibility standards (e.g. WCAG 2.1) for visually impaired users.

### Technical Requirements: ali
   

### Data Storage: yuliana
 

### Integration:
There is an export feature where users can either print the file directly from the internet, or download the PDF.

## Project Setup

Step-by-step instructions on how to get the development environment running.

1. Clone the repository:
    ```sh
    git clone git@github.com:BizzNEST/watsonville-bizznest-scheduler.git
    ```

2. Navigate to the project directory:
    ```sh
    cd watsonville-bizznest-scheduler
    ```

3. Create the necessary files:
   - Create `HomePage.html`, `style.css`, `complexity.js`, `filters.js`, `script.js` files in the project directory.
   - Ensure that `HomePage.html` properly links to both `style.css` for styling and `script.js` for functionality.

4. Install dependencies:
    ```sh
    npm install
    ```

5. Run the development server:
    ```sh
    npm start
    ```

## How to Run the project:

1. 
    Install the extension on VsCode titled "Live Server"

2. 
    Right click on the index.html file containing the elements, and press the option "Run with Live Server"
