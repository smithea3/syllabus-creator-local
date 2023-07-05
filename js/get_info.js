import courses from '../json/courses.json' assert { type: 'json' };
import colllege_policies from '../json/college_policies.json' assert { type: 'json' };
import important_dates from '../json/important_dates.json' assert { type: 'json' };
import instructor_information from '../json/instructor_information.json' assert { type: 'json' };
import section_info from '../json/section_info.json' assert { type: 'json' };

fetch("./json/courses.json")
//    .then(response => response.json())

fetch("./json/college_policies.json")
    .then(response => response.json())

fetch("./json/important_dates.json")
//    .then(response => response.json())

fetch("./json/instructor_information.json")
//    .then(response => response.json())

fetch("./json/section_info.json")
//    .then(response => response.json())

//  A function to create a UL/OL from a JSON array
function convertArrayToHtmlList (inputList, listType) {
    if (listType = "ul") {
        var outputHTML = "<ul>"
    } else {
        var outputHTML = "<ol>"
    }
    for (let i = 0; i < inputList.length; i++) {
        outputHTML += "<li>"+inputList[i]+"</li>"
    }
    if (listType = "ul") {
        outputHTML += "</ul>"
    } else {
        outputHTML = "</ol>"
    }
    return outputHTML
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

function getCourseInformation(urlParams) {
    // Get the college name
    if (urlParams.hasOwnProperty("college")) {
        document.getElementById("college-name").innerText = colllege_policies[urlParams["college"]]["college-name"]
    } else {
        document.getElementById("college-name").innerText = colllege_policies["templateCollege"]["college-name"]
    }
    // Get the subject (i.e. MAT, BIO, etc.) from URL parameters
    if (urlParams.hasOwnProperty("subject")) {
        document.getElementById("subject").innerText = urlParams.subject

    } else {
        document.getElementById("subject").innerText = "ABC"
    }

    // Get the course (i.e. 101, 110, 171, etc.) from URL parameters
    if (urlParams.hasOwnProperty("course")) {
        document.getElementById("course").innerText = urlParams.course
    } else {
        document.getElementById("course").innerText = "100"
    }

    // Get the course section
    if (urlParams.hasOwnProperty("section")) {
        document.getElementById("section").innerText = urlParams.section
    } else {
        document.getElementById("section").innerText = "SSB1"
    }

    // Get the semester from URL parameters
    if (urlParams.hasOwnProperty("semester")) {
        document.getElementById("semester").innerText = "("+urlParams.semester+")"
    } else {
        document.getElementById("semester").innerText = "(20YYXX)"
    }

    if (urlParams.hasOwnProperty("subject") && urlParams.hasOwnProperty("course")) {
        // Get catalog title
        document.getElementById("course-title-catalog").innerText = courses[urlParams["subject"]][urlParams["course"]]["title"]
        
        // Append credit hours
        document.getElementById("credit-hours").innerHTML += courses[urlParams["subject"]][urlParams["course"]]["credit-hours"]

        // Append class hours
        document.getElementById("class-hours").innerHTML += courses[urlParams["subject"]][urlParams["course"]]["class-hours"]

        // Append lab hours
        document.getElementById("lab-hours").innerHTML += courses[urlParams["subject"]][urlParams["course"]]["lab-hours"]

        // Update catalog description section
        document.getElementById("catalog-description").innerHTML = courses[urlParams["subject"]][urlParams["course"]]["catalog-description"]

        // Update SLO section
        document.getElementById("slos").innerHTML = convertArrayToHtmlList(courses[urlParams["subject"]][urlParams["course"]]["slos"], '')
    }
}

function getInstructorInformation(urlParams) {
    if (urlParams.hasOwnProperty("instructor")) {
        document.getElementById("instructor-name").innerHTML += instructor_information[urlParams.instructor]["instructor-name"]
        document.getElementById("instructor-email-address").innerHTML += instructor_information[urlParams.instructor]["instructor-email-address"]
        document.getElementById("instructor-response-time").innerHTML += instructor_information[urlParams.instructor]["instructor-response-time"]
        document.getElementById("instructor-office-phone-number").innerHTML += instructor_information[urlParams.instructor]["instructor-office-phone-number"]
        document.getElementById("instructor-office-location").innerHTML += instructor_information[urlParams.instructor]["instructor-office-location"]
        document.getElementById("instructor-student-support-hours").innerHTML += instructor_information[urlParams.instructor]["instructor-student-support-hours"]
    }
}

var urlParams = getURLParameters(window.location.search)
getCourseInformation(urlParams)
getInstructorInformation(urlParams)