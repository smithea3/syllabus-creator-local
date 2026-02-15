/**
 * Project: Date Generator Single-page App
 *
 * This code includes contributions from Claude 3.7 Sonnet by Anthropic.
 * Date of assistance: May 17, 2025
 * https://www.anthropic.com/claude
 */

const importantDates = await fetch("../json/important_dates.json").then((r) => r.json());

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

// Convert a Date to 'YYYY-MM-DD' string for comparison with JSON keys
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Generate dates between start and end that match selected days of week
function getSpecificDatesBetween(start, end, daysOfWeek) {
  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(end);
  endDate.setHours(23, 59, 59, 999);

  const dateList = [];

  if (startDate > endDate) {
    return dateList;
  }

  const selectedDays = daysOfWeek.map((day) => day.toUpperCase());

  let currentDate = new Date(startDate.getTime());

  while (currentDate <= endDate) {
    const currentDayName = currentDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    if (selectedDays.includes(currentDayName)) {
      dateList.push({
        formatted: formatDateWithDay(new Date(currentDate)),
        dateKey: toDateKey(currentDate),
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateList;
}

// Look up important date info for a given date key across all semesters
function getImportantDateInfo(dateKey) {
  for (const semester of Object.values(importantDates)) {
    if (semester.dates && semester.dates[dateKey]) {
      return semester.dates[dateKey];
    }
  }
  return null;
}

// Get all holiday/closure dates within a date range across all semesters
function getHolidayDatesInRange(startDateStr, endDateStr) {
  const holidays = [];
  for (const semester of Object.values(importantDates)) {
    if (!semester.dates) continue;
    for (const [dateKey, info] of Object.entries(semester.dates)) {
      if (dateKey >= startDateStr && dateKey <= endDateStr) {
        if (!info.hasClass || !info.collegeOpen) {
          const parts = dateKey.split("-");
          const date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
          holidays.push({
            formatted: formatDateWithDay(date),
            dateKey: dateKey,
            event: info.event,
            hasClass: info.hasClass,
            collegeOpen: info.collegeOpen,
            isClosedOrHoliday: true,
          });
        }
      }
    }
  }
  return holidays;
}

// Show a Bootstrap inline alert
function showAlert(message, type = "warning") {
  const container = document.getElementById("alertContainer");
  container.textContent = "";

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.setAttribute("role", "alert");
  alert.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "btn-close";
  closeBtn.setAttribute("data-bs-dismiss", "alert");
  closeBtn.setAttribute("aria-label", "Close");
  alert.appendChild(closeBtn);

  container.appendChild(alert);
}

// Clear any visible alerts
function clearAlerts() {
  document.getElementById("alertContainer").textContent = "";
}

// Initialize the app
const selectedDaysOfWeek = new Set();
const semesterSelect = document.getElementById("semesterSelect");
const formStartDate = document.getElementById("formStartDate");
const formEndDate = document.getElementById("formEndDate");
const formSubmitButton = document.getElementById("formSubmitButton");
const listOfDatesElement = document.getElementById("listOfDates");
const copyDatesButton = document.getElementById("copyDatesButton");
const copyIconClipboard = document.getElementById("copyIconClipboard");
const copyIconCheck = document.getElementById("copyIconCheck");
const copyButtonText = document.getElementById("copyButtonText");
const dateCountBadge = document.getElementById("dateCount");
const clearButton = document.getElementById("clearButton");
const downloadDocxButton = document.getElementById("downloadDocxButton");
const excludeHolidaysCheckbox = document.getElementById("excludeHolidays");
const includeAllHolidaysCheckbox = document.getElementById("includeAllHolidays");
const dayCheckboxContainer = document.getElementById("dayCheckboxContainer");

let generatedDates = [];

// Populate semester dropdown from important_dates.json
for (const key of Object.keys(importantDates)) {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = key;
  semesterSelect.appendChild(option);
}

// When a semester is selected, auto-fill start/end dates
semesterSelect.addEventListener("change", function () {
  const selected = this.value;
  if (selected === "custom") {
    formStartDate.value = "";
    formEndDate.value = "";
    formStartDate.readOnly = false;
    formEndDate.readOnly = false;
    return;
  }

  const semester = importantDates[selected];
  if (semester) {
    formStartDate.value = semester.startDate;
    formEndDate.value = semester.endDate;
    formStartDate.readOnly = true;
    formEndDate.readOnly = true;
  }
});

// Event delegation for day checkboxes
dayCheckboxContainer.addEventListener("change", function (e) {
  if (!e.target.matches('[id^="daySelection"]')) return;
  const dayName = e.target.value;
  if (e.target.checked) {
    selectedDaysOfWeek.add(dayName);
  } else {
    selectedDaysOfWeek.delete(dayName);
  }
});

// Copy to clipboard
copyDatesButton.addEventListener("click", function () {
  if (generatedDates.length === 0) return;

  const excludeHolidays = excludeHolidaysCheckbox.checked;
  const datesToCopy = generatedDates
    .filter((d) => !excludeHolidays || !d.isClosedOrHoliday)
    .map((d) => d.formatted);

  navigator.clipboard
    .writeText(datesToCopy.join("\n"))
    .then(() => {
      copyIconClipboard.classList.add("d-none");
      copyIconCheck.classList.remove("d-none");
      copyButtonText.textContent = "Copied!";
      copyDatesButton.classList.remove("btn-outline-secondary");
      copyDatesButton.classList.add("btn-success");

      setTimeout(() => {
        copyIconClipboard.classList.remove("d-none");
        copyIconCheck.classList.add("d-none");
        copyButtonText.textContent = "Copy Dates";
        copyDatesButton.classList.remove("btn-success");
        copyDatesButton.classList.add("btn-outline-secondary");
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      showAlert("Failed to copy dates to clipboard", "danger");
    });
});

// Make the two holiday checkboxes mutually exclusive
includeAllHolidaysCheckbox.addEventListener("change", function () {
  if (this.checked) {
    excludeHolidaysCheckbox.checked = false;
  }
  if (generatedDates.length > 0) {
    // Re-generate to add/remove holiday dates
    formSubmitButton.click();
  }
});

// Re-render when exclude holidays checkbox changes
excludeHolidaysCheckbox.addEventListener("change", function () {
  if (this.checked) {
    includeAllHolidaysCheckbox.checked = false;
  }
  if (generatedDates.length > 0) {
    // Re-generate to add/remove holiday dates
    formSubmitButton.click();
  }
});

// Handle form submission
formSubmitButton.addEventListener("click", function () {
  clearAlerts();

  if (!formStartDate.value || !formEndDate.value) {
    showAlert("Please select both start and end dates.");
    return;
  }

  if (selectedDaysOfWeek.size === 0) {
    showAlert("Please select at least one day of the week.");
    return;
  }

  const startDateStr = formStartDate.value + "T00:00:00";
  const endDateStr = formEndDate.value + "T23:59:59";

  const rawDates = getSpecificDatesBetween(
    startDateStr,
    endDateStr,
    Array.from(selectedDaysOfWeek)
  );

  // Enrich dates with important date info
  generatedDates = rawDates.map((d) => {
    const info = getImportantDateInfo(d.dateKey);
    return {
      formatted: d.formatted,
      dateKey: d.dateKey,
      event: info ? info.event : null,
      hasClass: info ? info.hasClass : true,
      collegeOpen: info ? info.collegeOpen : true,
      isClosedOrHoliday: info ? (!info.hasClass || !info.collegeOpen) : false,
    };
  });

  // If "Include all holidays" is checked, add holidays that fall on non-selected days
  if (includeAllHolidaysCheckbox.checked) {
    const existingKeys = new Set(generatedDates.map((d) => d.dateKey));
    const holidays = getHolidayDatesInRange(formStartDate.value, formEndDate.value);
    for (const h of holidays) {
      if (!existingKeys.has(h.dateKey)) {
        generatedDates.push(h);
      }
    }
    generatedDates.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  }

  renderDates();
});

// Render the generated dates list using DocumentFragment
function renderDates() {
  const excludeHolidays = excludeHolidaysCheckbox.checked;
  const visibleDates = excludeHolidays
    ? generatedDates.filter((d) => !d.isClosedOrHoliday)
    : generatedDates;

  listOfDatesElement.textContent = "";

  copyDatesButton.disabled = visibleDates.length === 0;
  downloadDocxButton.disabled = visibleDates.length === 0;

  // Update date count badge
  if (visibleDates.length > 0) {
    dateCountBadge.textContent = visibleDates.length;
    dateCountBadge.classList.remove("d-none");
  } else {
    dateCountBadge.classList.add("d-none");
  }

  if (visibleDates.length === 0) {
    const emptyItem = document.createElement("div");
    emptyItem.className = "list-group-item";
    emptyItem.textContent = "No dates found matching your criteria";
    listOfDatesElement.appendChild(emptyItem);
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const dateObj of visibleDates) {
    const item = document.createElement("div");
    item.className = "list-group-item";

    if (dateObj.isClosedOrHoliday) {
      item.classList.add("list-group-item-warning");
    }

    const dateText = document.createElement("div");
    dateText.textContent = dateObj.formatted;

    item.appendChild(dateText);

    // Show event description if one exists
    if (dateObj.event) {
      const eventDesc = document.createElement("small");
      eventDesc.className = "text-muted d-block";
      eventDesc.textContent = dateObj.event;
      item.appendChild(eventDesc);
    }

    fragment.appendChild(item);
  }

  listOfDatesElement.appendChild(fragment);
}

// Clear/Reset button
clearButton.addEventListener("click", function () {
  clearAlerts();

  // Reset form
  semesterSelect.value = "custom";
  formStartDate.value = "";
  formEndDate.value = "";
  formStartDate.readOnly = false;
  formEndDate.readOnly = false;
  excludeHolidaysCheckbox.checked = false;
  includeAllHolidaysCheckbox.checked = false;

  // Uncheck all day checkboxes
  dayCheckboxContainer.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = false;
  });
  selectedDaysOfWeek.clear();

  // Clear results
  generatedDates = [];
  listOfDatesElement.textContent = "";
  copyDatesButton.disabled = true;
  downloadDocxButton.disabled = true;
  dateCountBadge.classList.add("d-none");
});

// Set default dates
const today = new Date();
const nextMonth = new Date(today);
nextMonth.setMonth(today.getMonth() + 1);

formStartDate.valueAsDate = today;
formEndDate.valueAsDate = nextMonth;

// Generate and download a Word document from the current dates
function generateDocx() {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = window.docx;

  const excludeHolidays = excludeHolidaysCheckbox.checked;
  const visibleDates = excludeHolidays
    ? generatedDates.filter((d) => !d.isClosedOrHoliday)
    : generatedDates;

  const children = [
    new Paragraph({
      text: "Course Schedule",
      heading: HeadingLevel.HEADING_2,
    }),
  ];

  for (const dateObj of visibleDates) {
    const dateRunOptions = {
      text: dateObj.formatted,
      bold: true,
      font: "Segoe UI",
      size: 22, // 11pt in half-points
    };

    if (dateObj.isClosedOrHoliday) {
      dateRunOptions.highlight = "yellow";
    }

    children.push(
      new Paragraph({
        children: [new TextRun(dateRunOptions)],
      })
    );

    if (dateObj.event) {
      const eventRunOptions = {
        text: dateObj.event,
        font: "Segoe UI",
        size: 22,
      };

      if (dateObj.isClosedOrHoliday) {
        eventRunOptions.highlight = "yellow";
      }

      children.push(
        new Paragraph({
          children: [new TextRun(eventRunOptions)],
          bullet: { level: 0 },
        })
      );
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Segoe UI",
            size: 22,
          },
        },
      },
    },
    sections: [{ children }],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "course-schedule.docx");
  });
}

// Wire up the download button
downloadDocxButton.addEventListener("click", generateDocx);
