# Syllabus Creator

A static, client-side web application for generating college course syllabi and course date calendars. No build tools, no package manager, no backend — just HTML, CSS, JavaScript, and JSON data files served over HTTP.

## Sub-Applications

### Syllabus Creator (`/index.html`)

A form-driven syllabus generator. The user selects an instructor, semester, college, course, and section, then the app renders a formatted syllabus preview by combining data from multiple JSON files.

### Course Dates Creator (`/course-dates-creator/`)

A date range generator for building course calendars. Features include:

- **Semester presets** — select a semester from a dropdown to auto-fill start/end dates from `important_dates.json`
- **Custom date ranges** — manually enter any start and end date
- **Day-of-week filtering** — check which days the course meets
- **Holiday awareness** — dates that fall on holidays or college closures are flagged with strikethrough styling and a badge; event descriptions from the academic calendar are shown inline
- **Exclude holidays** — toggle a checkbox to filter out non-class days from the list and clipboard copy
- **Copy to clipboard** — one-click copy of all generated dates
- **Date count** — badge showing the number of generated dates

## Project Structure

```
syllabus-creator-local/
├── index.html                      # Main syllabus creator app
├── assets/
│   └── css/
│       └── styles.css              # Shared stylesheet
├── js/
│   ├── form.js                     # Populates form dropdowns, handles form state
│   └── syllabus-preview.js         # Rendering logic for syllabus sections
├── json/
│   ├── courses.json                # Course catalog (SLOs, credit hours, descriptions)
│   ├── college_policies.json       # Institutional policies per college
│   ├── instructor_information.json # Instructor contact details, keyed by ID
│   ├── section_info.json           # Section details: location, meeting times, dates
│   ├── important_dates.json        # Semester academic calendar with hasClass/collegeOpen flags
│   └── example.json                # Example/template data
├── course-dates-creator/
│   ├── index.html                  # Course dates creator app
│   └── app.js                      # Date generation logic (ES6 module)
└── view/
    └── index.html                  # Alternate/dev view page
```

## Running Locally

ES6 module imports (`import ... from "...json" assert { type: "json" }`) require the files to be served over HTTP. Opening `index.html` directly as a file will not work.

Start any static HTTP server from the project root:

```bash
# Python (built-in)
python3 -m http.server 8000

# Node.js (npx, no install needed)
npx http-server -p 8000
```

Then open:

- **Syllabus Creator:** [http://localhost:8000/](http://localhost:8000/)
- **Course Dates Creator:** [http://localhost:8000/course-dates-creator/](http://localhost:8000/course-dates-creator/)

## Architecture

### Data-Driven Rendering

Five JSON files in `/json/` serve as the data layer. The JavaScript modules import them directly using ES6 static imports and render HTML based on their contents.

### Data Flow (Syllabus Creator)

1. `form.js` imports JSON data and populates the college and course dropdowns
2. The user fills in the form: instructor ID, semester, college, course, section
3. On submit, `syllabus-preview.js` reads form state into a `formInformation` object
4. Rendering functions (`createSyllabusHeader`, `createInstructorInformationSection`, `createCourseInformationSection`, `createInstitutionalPoliciesSection`) generate the syllabus into the preview pane

### Data Flow (Course Dates Creator)

1. `app.js` imports `important_dates.json` and populates the semester dropdown
2. The user selects a semester preset (which auto-fills dates) or enters custom dates, then checks the desired days of the week
3. On submit, dates are generated and cross-referenced against `important_dates.json` for holiday/closure info
4. Results render using a `DocumentFragment` with inline event descriptions and visual flags for non-class days

### JSON Data Files

| File | Purpose | Key Structure |
|---|---|---|
| `courses.json` | Course catalog | Keyed by course code (e.g., `"MAT-110"`). Contains title, credit/class/lab hours, prerequisites, catalog description, SLOs. |
| `college_policies.json` | Institutional policies | Keyed by college ID (e.g., `"MitchellCC"`). Contains college name and array of policy objects with title and HTML content. |
| `instructor_information.json` | Instructor details | Keyed by instructor ID. Contains name, email, phone, office location, response time, support hours. |
| `section_info.json` | Section meeting info | Nested: college > semester > section key (e.g., `"MAT-110-SSB1"`). Contains location, meeting times, start/end dates, census date. |
| `important_dates.json` | Academic calendar | Keyed by semester code (e.g., `"2023SU"`). Contains `startDate`, `endDate`, and a `dates` object mapping date strings to `{ event, hasClass, collegeOpen }`. |

## Common Development Tasks

### Adding a New Semester

1. Add the semester entry to `json/important_dates.json` with `startDate`, `endDate`, and the `dates` object containing key academic dates
2. Add section information to `json/section_info.json` under the appropriate college and semester code

### Adding a New Course

Add the course to `json/courses.json` with all required fields:

```json
"MAT-999": {
  "is-active": true,
  "title": "Course Title",
  "credit-hours": "3",
  "class-hours": "3",
  "lab-hours": "0",
  "prerequisites": "...",
  "catalog-description": "...",
  "slos": ["SLO1: ...", "SLO2: ..."]
}
```

### Adding a New Instructor

Add the instructor to `json/instructor_information.json` keyed by their ID:

```json
"instructor-id": {
  "Instructor-Name": "...",
  "Instructor-Email-Address": "...",
  "Instructor-Office-Phone-Number": "...",
  "Instructor-Office-Location": "...",
  "Instructor-Response-Time": "...",
  "Instructor-Student-Support-Hours": "..."
}
```

### Adding a New College

1. Add the college to `json/college_policies.json` with `collegeName` and `policies`
2. Add a top-level key for the college in `json/section_info.json`

## Conventions

- **Semester codes** follow the format `"2023SP"` (Spring), `"2023SU"` (Summer), `"2024FA"` (Fall)
- **Section keys** in `section_info.json` are formatted as `"COURSE-SECTION"` (e.g., `"MAT-110-SSB1"`)
- **ES6 modules** — both sub-apps use `<script type="module">` and `import ... assert { type: "json" }` for JSON imports
- **No build step** — all code runs directly in the browser
- **JSON data updates** are the most common type of change (new semesters, sections, courses)

## Dependencies

All external dependencies are loaded via CDN (no npm):

- [Bootstrap 5.3.0](https://getbootstrap.com/) — CSS framework and JS bundle
- [Font Awesome](https://fontawesome.com/) — icons (main app only)
