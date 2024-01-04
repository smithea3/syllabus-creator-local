function getSpecificDatesBetween(start, end, daysOfWeek) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dateList = [];

  // Make sure the start date is before the end date
  if (startDate > endDate) {
    return dateList;
  }

  // Convert days of the week to uppercase for matching
  const selectedDays = daysOfWeek.map((day) => day.toUpperCase());

  // Helper function to format the date as 'Day, mm-dd-yyyy'
  const formatDateWithDay = (date) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = String(date.getMonth() + 1).padStart(0, "0");
    const day = String(date.getDate()).padStart(0, "0");
    const year = date.getFullYear();
    return `${dayOfWeek}, ${month}/${day}/${year}`;
  };

  // Loop through dates and add them to the list if they match the selected days
  let currentDate = startDate;
  while (currentDate <= endDate) {
    if (
      selectedDays.includes(
        currentDate
          .toLocaleDateString("en-US", {
            weekday: "long",
          })
          .toUpperCase()
      )
    ) {
      dateList.push(formatDateWithDay(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateList;
}

var selectedDaysOfWeek = [];

document
  .getElementById("daySelectionMonday")
  .addEventListener("change", function () {
    if (this.checked) {
      selectedDaysOfWeek.push(this.value);
    }
  });

document
  .getElementById("daySelectionTuesday")
  .addEventListener("change", function () {
    if (this.checked) {
      selectedDaysOfWeek.push(this.value);
    }
  });

document
  .getElementById("daySelectionWednesday")
  .addEventListener("change", function () {
    if (this.checked) {
      selectedDaysOfWeek.push(this.value);
    }
  });

document
  .getElementById("daySelectionThursday")
  .addEventListener("change", function () {
    if (this.checked) {
      selectedDaysOfWeek.push(this.value);
    }
  });

document
  .getElementById("daySelectionFriday")
  .addEventListener("change", function () {
    if (this.checked) {
      selectedDaysOfWeek.push(this.value);
    }
  });

document
  .getElementById("daySelectionSaturday")
  .addEventListener("change", function () {
    if (this.checked) {
      selectedDaysOfWeek.push(this.value);
    }
  });

document
  .getElementById("daySelectionSunday")
  .addEventListener("change", function () {
    if (this.checked) {
      selectedDaysOfWeek.push(this.value);
    }
  });

document
  .getElementById("formSubmitButton")
  .addEventListener("click", function () {
    const startDate = document.getElementById("formStartDate").value;
    const endDate = document.getElementById("formEndDate").value;
    var listOfDatesElement = document.getElementById("listOfDates");
    const listOfDates = getSpecificDatesBetween(
      startDate,
      endDate,
      selectedDaysOfWeek
    );

    for (date of listOfDates) {
      listOfDatesElement.innerHTML += `<h2><strong>${date}</strong></h2>`;
    }
  });
