import courses from "../json/courses.json" assert { type: "json" };
import colllege_policies from "../json/college_policies.json" assert { type: "json" };
import important_dates from "../json/important_dates.json" assert { type: "json" };
import instructor_information from "../json/instructor_information.json" assert { type: "json" };
import section_info from "../json/section_info.json" assert { type: "json" };

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

function convertToCapitalCase(str) {
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

// Function to fill in the instructor information from instructor_information.json
function getInstructorInformation(instructor) {
  var mainContainer = document.getElementById("main-container");
  var header = document.createElement("h2");
  header.innerHTML = "Instructor Information";
  mainContainer.appendChild(header);
  for (var info in instructor) {
    var content = document.createElement("p");
    content.innerHTML = `<strong>${convertToCapitalCase(
      String(info).replace(/-/g, " ")
    )}:</strong> ${instructor[String(info)]}`;
    mainContainer.appendChild(content);
  }
}

// Function to fill in the course's section information from section_info.json
function getSectionInformation(sectionInformation) {
  var mainContainer = document.getElementById("main-container");
  var header = document.createElement("h2");
  header.innerHTML = "Course Section Information";
  mainContainer.appendChild(header);
  for (var info in sectionInformation) {
    var content = document.createElement("p");
    content.innerHTML = `<strong>${convertToCapitalCase(
      String(info).replace(/-/g, " ")
    )}:</strong> ${sectionInformation[String(info)]}`;
    mainContainer.appendChild(content);
  }
}

// This section is for adding the information via the helper functions above to the syllabus
var urlParams = getURLParameters(window.location.search);
// getCourseInformation(urlParams);

//getInstructorInformation(urlParams)
getInstructorInformation(instructor_information[urlParams.instructor]);
getSectionInformation(section_info[urlParams.college][urlParams.semester][urlParams.course]);
console.log(section_info[urlParams.college][urlParams.semester][urlParams.course])


// Used for debugging
