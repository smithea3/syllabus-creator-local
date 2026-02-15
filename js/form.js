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

// Fetch JSON data and populate form dropdowns
const [courses, college_policies] = await Promise.all([
  fetch("./json/courses.json").then((r) => r.json()),
  fetch("./json/college_policies.json").then((r) => r.json()),
]);

getListOfCourses(courses);
getListOfColleges(college_policies);