// Import all of the json files for the app
import courses from "../json/courses.json" assert { type: "json" };
import college_policies from "../json/college_policies.json" assert { type: "json" };
import important_dates from "../json/important_dates.json" assert { type: "json" };
import instructor_information from "../json/instructor_information.json" assert { type: "json" };
import section_info from "../json/section_info.json" assert { type: "json" };

// Fetch and respond to get the json files loaded
fetch("./json/courses.json").then((courses) => courses.json());

fetch("./json/college_policies.json").then((college_policies) =>
  college_policies.json()
);

fetch("./json/important_dates.json").then((important_dates) =>
  important_dates.json()
);

fetch("./json/instructor_information.json").then((instructor_information) =>
  instructor_information.json()
);

fetch("./json/section_info.json").then((section_info) => section_info.json());

// **********
// HELPER FUNCTIONS SECTION
// **********

//  A function to create a UL/OL from a JSON array
function convertArrayToHtmlList(inputList, listType) {
  if ((listType = "ul")) {
    var outputHTML = "<ul>";
  } else {
    var outputHTML = "<ol>";
  }
  for (let i = 0; i < inputList.length; i++) {
    outputHTML += "<li>" + inputList[i] + "</li>";
  }
  if ((listType = "ul")) {
    outputHTML += "</ul>";
  } else {
    outputHTML = "</ol>";
  }
  return outputHTML;
}

// A function to convert the input string to capital case
function convertToStrAndCapitalCase(str) {
  // Replace all - with " "
  str = str.replace(/-/g, " ");
  // Split the string into an array of words
  const words = str.split(" ");
  // Convert the first character of each word to uppercase and
  // lowercase the remaining characters
  const capitalizedWords = words.map((word) => {
    const firstChar = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstChar + restOfWord;
  });
  // Join the capitalized words back into a single string
  const capitalCaseString = capitalizedWords.join(" ");
  return capitalCaseString;
}

// Function to get URL Parameters (updated)
function getURLParameters(url) {
  const params = {};
  const urlParams = new URLSearchParams(url);
  for (let [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
}

// **********
// SYLLABUS PREVIEW GENERATION SECTION
// **********
function createSyllabusHeader(
  college = "MitchellCC",
  course = "MAT-110",
  section = "SSB1",
  semester = "2023FA"
) {
  /** The variables for section and semester are set by default for viewing. **/
  const syllabusPreview = document.getElementById("syllabus-preview");
  const collegeInformation = college_policies[college];
  const courseInformation = courses[course];
  var headerText = "";
  headerText += `<h1 style="text-align:center">${collegeInformation.collegeName}</h1>`;
  syllabusPreview.innerHTML += headerText;
  syllabusPreview.innerHTML += `<h4 style="text-align:center">${courseInformation.title}</h4>`;
  syllabusPreview.innerHTML += `<h4 style="text-align:center">${course}-${section} (${semester})</h4>`;
}

function createInstructorInformationSection(instructor = "example-instructor") {
  const syllabusPreview = document.getElementById("syllabus-preview");
  syllabusPreview.innerHTML += `<h2>Instructor Information</h2>`;
  for (var info in instructor_information[instructor]) {
    syllabusPreview.innerHTML += `<p><strong>${convertToStrAndCapitalCase(
      convertToStrAndCapitalCase(info)
    )}: </strong>${instructor_information[instructor][info]}</p>`;
  }
}

function createCourseInformationSection(
  college = "MitchellCC",
  course = "MAT-110",
  section = "SSB1",
  semester = "2023SP"
) {
  const syllabusPreview = document.getElementById("syllabus-preview");
  const courseInformation = courses[course];
  const sectionInformation =
    section_info[college][semester][course + "-" + section];
  //** Beginning of Course Information Section **/
  syllabusPreview.innerHTML += `<h2>Course Information</h2>`;
  //** Add the course credit, class, and lab hours from the courses json file */
  syllabusPreview.innerHTML +=
    '<div class="row" id="credit-class-lab-hours"></div>';
  var creditClassLabHoursArray = ["credit-hours", "class-hours", "lab-hours"];
  for (var item of creditClassLabHoursArray) {
    console.log(creditClassLabHoursArray[0]);
    document.getElementById(
      "credit-class-lab-hours"
    ).innerHTML += `<div class="col"><p><strong>${convertToStrAndCapitalCase(
      item
    )}:</strong> ${courseInformation[item]}</p></div>`;
  }
  //** Add all of the information from the section_info json file */
  for (var info in sectionInformation) {
    syllabusPreview.innerHTML += `<p><strong>${convertToStrAndCapitalCase(
      info
    )}: </strong>${sectionInformation[info]}</p>`;
  }
  //** Add the course catalog description from the courses json file */
  syllabusPreview.innerHTML += `<p><strong>Course Description: </strong>${courseInformation["catalog-description"]}</p>`;
  //** Add student learning outcomes (slos) */
  syllabusPreview.innerHTML += `<h4>Student Learning Outcomes</h4>`;
  syllabusPreview.innerHTML += convertArrayToHtmlList(courses[course].slos);
}

function createInstitutionalPoliciesSection(college = "MitchellCC") {
  const syllabusPreview = document.getElementById("syllabus-preview");
  const collegePolicies = college_policies[college].policies;
  for (var policy in collegePolicies) {
    syllabusPreview.innerHTML += `<h2>${collegePolicies[policy].title}</h2>`;
    syllabusPreview.innerHTML += collegePolicies[policy].content;
  }
}

createSyllabusHeader();
createInstructorInformationSection();
createCourseInformationSection();
createInstitutionalPoliciesSection();
