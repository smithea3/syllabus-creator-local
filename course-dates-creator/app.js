/**
 * Project: Date Generator Single-page App
 * 
 * This code includes contributions from Claude 3.7 Sonnet by Anthropic.
 * Date of assistance: May 17, 2025
 * https://www.anthropic.com/claude
 */

// Helper function to format the date as 'Day, mm/dd/yyyy'
function formatDateWithDay(date) {
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
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${dayOfWeek}, ${month}/${day}/${year}`;
}

// Generate dates between start and end that match selected days of week
function getSpecificDatesBetween(start, end, daysOfWeek) {
  // Parse dates and ensure we're working with date-only values (no time)
  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0); // Reset time to beginning of day

  const endDate = new Date(end);
  endDate.setHours(23, 59, 59, 999); // Set time to end of day

  const dateList = [];

  // Make sure the start date is before the end date
  if (startDate > endDate) {
    return dateList;
  }

  // Convert days of the week to uppercase for matching
  const selectedDays = daysOfWeek.map((day) => day.toUpperCase());

  // Loop through dates and add them to the list if they match the selected days
  // Clone the start date to avoid modifying the original
  let currentDate = new Date(startDate.getTime());

  // Use <= to include the end date in the range
  while (currentDate <= endDate) {
    const currentDayName = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
    }).toUpperCase();

    if (selectedDays.includes(currentDayName)) {
      dateList.push(formatDateWithDay(new Date(currentDate))); // Clone the date for formatting
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateList;
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  const selectedDaysOfWeek = new Set();
  const dayCheckboxes = document.querySelectorAll('[id^="daySelection"]');
  const formStartDate = document.getElementById("formStartDate");
  const formEndDate = document.getElementById("formEndDate");
  const formSubmitButton = document.getElementById("formSubmitButton");
  const listOfDatesElement = document.getElementById("listOfDates");
  const copyDatesButton = document.getElementById("copyDatesButton");

  // Track generated dates for the copy function
  let generatedDates = [];

  // Set up event handlers for all day checkboxes
  dayCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", function () {
      const dayName = this.value;
      if (this.checked) {
        selectedDaysOfWeek.add(dayName);
      } else {
        selectedDaysOfWeek.delete(dayName);
      }
    });
  });

  // Copy to clipboard functionality
  copyDatesButton.addEventListener("click", function () {
    if (generatedDates.length === 0) return;

    // Create a plain text version for clipboard
    const plainTextDates = generatedDates.join('\n');

    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(plainTextDates)
      .then(() => {
        // Provide feedback that copying worked
        const originalText = copyDatesButton.innerHTML;
        copyDatesButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2 me-1" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
          Copied!
        `;
        copyDatesButton.classList.remove('btn-outline-secondary');
        copyDatesButton.classList.add('btn-success');

        // Reset button after 2 seconds
        setTimeout(() => {
          copyDatesButton.innerHTML = originalText;
          copyDatesButton.classList.remove('btn-success');
          copyDatesButton.classList.add('btn-outline-secondary');
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy dates to clipboard');
      });
  });

  // Handle form submission
  formSubmitButton.addEventListener("click", function () {
    // Validate inputs
    if (!formStartDate.value || !formEndDate.value) {
      alert("Please select both start and end dates");
      return;
    }

    if (selectedDaysOfWeek.size === 0) {
      alert("Please select at least one day of the week");
      return;
    }

    // Clear previous results
    listOfDatesElement.innerHTML = "";

    // Get the dates - adding time portion to ensure timezone consistency
    const startDateStr = formStartDate.value + "T00:00:00";
    const endDateStr = formEndDate.value + "T23:59:59";

    generatedDates = getSpecificDatesBetween(
      startDateStr,
      endDateStr,
      Array.from(selectedDaysOfWeek)
    );

    // Enable or disable copy button based on results
    if (generatedDates.length > 0) {
      copyDatesButton.disabled = false;
    } else {
      copyDatesButton.disabled = true;
    }

    // Display results - using Bootstrap list group
    if (generatedDates.length === 0) {
      listOfDatesElement.innerHTML = "<div class='list-group-item'>No dates found matching your criteria</div>";
    } else {
      // Create Bootstrap list group items for each date
      const dateElements = generatedDates.map(date =>
        `<div class="list-group-item">${date}</div>`
      );
      listOfDatesElement.innerHTML = dateElements.join("");
    }
  });

  // Optional: Set default dates for better user experience
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  formStartDate.valueAsDate = today;
  formEndDate.valueAsDate = nextMonth;
});