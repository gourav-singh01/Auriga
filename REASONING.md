# Reasoning

## 1. Understanding the Problem

The application is designed as a general-purpose habit tracker inspired by Ananya's 75-day self-improvement challenge.

The main requirements identified were:

* Creating habits
* Supporting daily and weekday-based habits
* Showing habits scheduled for the current day
* Logging habit completion by date
* Maintaining current and best-ever streaks
* Searching and updating habits
* Archiving habits without permanently deleting them
* Restoring archived habits
* Reminding the user about incomplete habits for the day

The priority was to make habit logging and streak tracking reliable before adding visual enhancements.

## 2. Design Approach

A lightweight browser-based application was chosen so the user can start tracking habits without requiring an account, backend server, or database.

Habit data is stored in browser Local Storage. Each habit keeps its name, frequency, archive status, creation date, color, and a list of completion dates.

Completion is stored using calendar dates rather than only a completion counter. This allows the application to calculate streaks and display completion history.

## 3. Frequency and Scheduling

Two frequency options are supported:

* Daily — scheduled every day
* Weekdays — scheduled Monday through Friday

The application checks the current date before displaying active habits, so the user sees only habits that are applicable for that day.

The same scheduling logic is also used when calculating streaks so that weekends do not break a weekday habit's streak.

## 4. Streak Calculation

The current streak is calculated by walking backwards through the habit's scheduled dates and checking whether each date was completed.

The best-ever streak is calculated by sorting the recorded completion dates and finding the longest sequence of consecutive scheduled completion dates.

This approach allows daily and weekday habits to use the same streak logic.

## 5. Habit Management

The application supports editing, archiving, and restoring habits.

Editing updates the habit's details while preserving its existing completion history.

Archiving hides a habit from the active list without permanently removing it. Archived habits can later be restored.

A permanent delete option is also available from the history section.

## 6. Search

A search field filters habits by name. This allows users with a larger habit list to quickly find a particular habit before updating or managing it.

## 7. Morning Reminder

The application checks for incomplete habits when it is opened on a new day.

If scheduled active habits remain incomplete, a small reminder notification is displayed telling the user how many habits still need to be logged.

The reminder is limited to once per day to avoid repeatedly interrupting the user.

## 8. User Experience

The interface uses a "Habit Garden" concept where a plant visually grows with the user's streak.

The visual design is intended to make progress understandable at a glance while keeping the main workflow simple:

Open the application → see today's habits → mark them complete → maintain the streak.

## 9. Persistence and Backup

Local Storage keeps habit data available after refreshing or reopening the application in the same browser.

Export and import functionality is also provided so the user can create a backup of their habit data.

## 10. Technology Choice

The application uses:

* HTML5 for structure
* CSS3 for styling and responsive layout
* Vanilla JavaScript for application logic
* Local Storage for persistence

A backend was intentionally avoided because the core requirements could be implemented locally within the available Builder Round time.
