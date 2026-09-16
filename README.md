# Ananya's Habit Garden

A simple, responsive habit-tracking web application built for Ananya's 75-day self-improvement challenge. The app is designed for anyone who wants to build consistent habits, track daily progress, and maintain streaks.

## Features

* Create new habits
* Set habit frequency as:

  * Daily
  * Weekdays (Monday to Friday)
* View only the habits scheduled for the current day
* Mark habits as completed or incomplete
* Persistent completion tracking using browser local storage
* Track current streak for every habit
* Track best-ever streak for every habit
* Search habits by name
* Edit existing habits
* Archive habits without permanently deleting them
* Restore archived habits
* View completion history for individual habits
* 75-day challenge progress indicator
* In-app morning reminder for habits that are still incomplete for the current day
* Responsive design for desktop and mobile screens
* Export and import habit data

## Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript
* Browser Local Storage

No external backend or database is required.

## How to Run

1. Clone or open this repository in GitHub Codespaces.
2. Open the project files in the Codespace.
3. Run the project using a local development server, such as the VS Code Live Server extension.
4. Open the application in a browser.
5. Start creating and tracking habits.

The application can also be opened directly by opening `index.html` in a browser.

## How to Use

### Add a Habit

Click **Add Habit**, enter the habit name, choose Daily or Weekdays frequency, select a color, and create the habit.

### Track Completion

Today's scheduled habits are displayed on the Active tab. Use the completion button to mark a habit as done or incomplete. The completion status is stored by date.

### Track Streaks

Each habit displays its current streak and best-ever streak based on its recorded completion dates.

### Edit a Habit

Use the **Edit** button on a habit to update its name, frequency, or color without losing its existing completion history.

### Archive and Restore

Use **Archive** when a habit is no longer active but should not be permanently removed. Archived habits can be viewed from the Archived tab and restored later.

### Search

Use the search field to quickly find a habit by name.

### History

Open a habit's history to review its recorded completion dates.

### Morning Reminder

When the application is opened, it checks today's scheduled habits. If any scheduled habits are still incomplete, an in-app reminder is shown to remind the user to log them.

### Export and Import

Use the export option to create a backup of the habit data. The exported data can be imported later to restore the saved habits.

## Data Storage

Habit data is stored locally in the browser using `localStorage`. This means the application works without a server or account, but data is specific to the browser/device unless it is exported.

## Debugging / Troubleshooting

If the application does not behave as expected:

1. Refresh the page and check whether the issue persists.
2. Open the browser Developer Tools and check the **Console** for JavaScript errors.
3. Check browser Local Storage if habit data appears to be missing.
4. If local data becomes corrupted, clear the application's Local Storage and recreate the test habits.
5. For development, make sure all project files (`index.html`, `style.css`, and `script.js`) are present in the repository root.

## Project Structure

```text
auriga/
├── index.html
├── style.css
├── script.js
├── README.md
├── REASONING.md
└── AI_LOGS.md
```

## Project Goal

The main focus of the application is reliable habit logging and streak tracking, while keeping the daily experience simple: open the app, see today's habits, and tick them off one by one.

The application is designed around the key needs identified in the challenge: daily habit visibility, reliable streak tracking, easy habit management, and reminders for habits that still need to be logged.
