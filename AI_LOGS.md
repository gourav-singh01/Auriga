# AI_LOGS.md

## Reconstructed AI-Assisted Development Prompts

### Prompt 1

i have a builder round today and the problem statement is about a 75 day habit tracker. read the problem properly and tell me what all features i should make from it. also tell me what things are implied in the statement.

### Prompt 2

i only have 2.5 hours so i dont want to make it too complicated. can i make it using html css and javascript with localstorage? suggest me the simplest stack which will still look good and cover all requirements.

### Prompt 3

okay lets start with the basic app. what data should i store for each habit? i need options for daily and weekdays habits and also completion history.

### Prompt 4

now help me with the scheduling logic. daily habit should show everyday and weekday habit should only show monday to friday. also it should only show the habits which are scheduled for today.

### Prompt 5

i need to mark habits as done one by one. when i click done it should save today's date and after refresh also it should remain completed. how should i implement this?

### Prompt 6

now the main thing is streak. i need current streak and best ever streak for every habit. please make the logic properly because weekday habits should not break on saturday sunday.

### Prompt 7

one thing, if i have not completed today's habit yet but i completed the previous scheduled day, the current streak should not directly become 0. can you check and fix the logic for this?

### Prompt 8

i also need edit habit option. can we use the same add habit modal for edit also? when i click edit it should show the old values and update only the changed fields without deleting completion history.

### Prompt 9

some habits are given up by the user but problem says they should not be gone forever. so i think archive and restore will be better than delete. help me add this.

### Prompt 10

the list can become long so add search also. user should be able to search a habit by name and then edit it easily.

### Prompt 11

core functionality is working. now ui looks a little basic. i want something more clean and attractive, maybe a habit garden type theme. can you improve the ui but dont break the existing functionality.

### Prompt 12

add a 75 day challenge progress section also. it should show current day and some visual progress so user can understand how much of the challenge is completed.

### Prompt 13

can we add history for each habit? maybe a small heatmap or something which shows the previous completed days. user is proud about streaks so it should be visible.

### Prompt 14

since we are using localstorage, can we add export and import also? just simple json backup so user can save their data and restore it later.

### Prompt 15

there is one more twist in the problem. app should remind the user every morning about habits which they have not logged for that day. how can i do this in frontend only without making backend?

### Prompt 16

okay lets implement it when app opens. check active habits scheduled for today and if some are incomplete show a small toast like good morning you still have x habits to log today. make sure it only shows once per day.

### Prompt 17

now please check the important edge cases in the code. specially streak calculation, weekday weekends, localstorage after refresh, archive restore and search. i dont want to add more features unless something important is missing.

### Prompt 18

give me a quick testing list for the app. i want to test create habit, daily weekday, done undo, refresh, streaks, edit, search, archive restore and morning reminder.

### Prompt 19

i tested edit, mark done and refresh, undo, search and reminder. everything seems to be working. what should i check now before pushing the project to github?

### Prompt 20

assessment says the github repo should be public and root folder must have README.md, REASONING.md and AI_LOGS.md. give me final steps to push everything and make sure i dont miss anything before submitting the repo link.

### Prompt 21

i have around 1 hour left now and i want to make the project more attractive and add some useful functionality.

I am going to give you my current index.html, style.css and script.js files. First read and understand all three files properly before making any changes.

Do NOT remove anything that is already working. Do NOT ruin the existing structure or rewrite everything unnecessarily. Keep all current functionality including habit creation, edit, search, completion, undo, archive, restore, streak calculation, history, 75 day progress, export/import and morning reminder.

I mainly want you to improve the UI, UX, animations, responsiveness and add a few meaningful features that make this look like a polished real-world habit tracker.

Please build on the existing project instead of replacing it.

After understanding all three files, make the improvements carefully and then give me the complete updated code for all three files so I can replace my current files.

Also tell me what you changed and what I should test after replacing the files.
