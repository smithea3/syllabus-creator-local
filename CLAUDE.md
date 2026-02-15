# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static client-side web application for generating college course syllabi. No build step, no package manager, no backend. Two sub-apps:

1. **Syllabus Creator** (`/index.html`) — form-driven syllabus generator
2. **Course Dates Creator** (`/course-dates-creator/`) — generates calendar dates for a semester

## Running Locally

Serve with any static HTTP server (ES6 module imports require it):
```bash
python3 -m http.server 8000
# or
npx http-server
```

No build, test, or lint commands exist.

## Architecture

**Data-driven rendering**: Five JSON files in `/json/` are the data layer. Two JS modules read them and render HTML.

### Data Flow (Main App)
1. `form.js` imports JSON data, populates dropdowns (college, course)
2. User fills form: instructor ID, semester, college, course, section
3. On submit, `syllabus-preview.js` reads form state into `formInformation` object
4. Rendering functions generate syllabus sections into the preview pane

### Key JSON Data Files (`/json/`)
- `courses.json` — course catalog (SLOs, credit hours, descriptions). Keyed by course code.
- `college_policies.json` — institutional policies per college
- `instructor_information.json` — instructor contact details, keyed by instructor ID
- `section_info.json` — nested by college → semester → section (location, meeting times, dates)
- `important_dates.json` — semester academic calendar with `hasClass`/`collegeOpen` flags

### JS Modules (`/js/`)
- `form.js` — populates form dropdowns, handles form state
- `syllabus-preview.js` — contains all rendering logic: `createSyllabusHeader()`, `createInstructorInformationSection()`, `createCourseInformationSection()`, `createInstitutionalPoliciesSection()`

Both modules use ES6 `import ... from "...json" assert { type: "json" }` syntax.

## Dependencies

All external dependencies loaded via CDN (no npm):
- Bootstrap 5.3.0 (CSS + JS bundle)
- FontAwesome (icons)

## Conventions

- Semester codes follow format like `"2023SP"`, `"2024FA"`
- JSON data updates are the most common type of change (new semesters, sections, courses)
- `.bsdesign` files (Bootstrap Studio) are gitignored
