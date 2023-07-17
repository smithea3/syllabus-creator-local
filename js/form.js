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

function getListOfCourses(courses) {
    var courseList = "";
    var count = 1;
    for (const courseID in courses) {
        courseList += `<option value=${count}>${courseID}</option>`;
        count++;
    }    
    document.getElementById("inputCourseList").innerHTML += courseList;
}

function getListOfColleges(college_policies) {
    var collegeList = "";
    var count = 1;
    for (const collegeID in college_policies) {
        collegeList += `<option value=${count}>${collegeID}</option>`;
        count++;
    }    
    document.getElementById("inputCollegeList").innerHTML += collegeList;
}

getListOfCourses(courses);
getListOfColleges(college_policies);