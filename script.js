/* ============================================================
   ANANYA'S HABIT GARDEN — script.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Habit color palette ---------- */
  var COLORS = [
    { hex: "#3E8B5F", name: "Moss" },
    { hex: "#C98A3E", name: "Amber" },
    { hex: "#B85C3E", name: "Rust" },
    { hex: "#3E7A7A", name: "Teal" },
    { hex: "#7A4E72", name: "Plum" },
    { hex: "#3E5F8A", name: "Denim" }
  ];

  /* ---------- Confetti Particle FX ---------- */
  var confettiCanvas = document.getElementById("confettiCanvas");
  var ctx = confettiCanvas.getContext("2d");
  var particles = [];

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function triggerConfetti(x, y) {
    var colors = ["#2E6B45", "#6FBE8B", "#B97A34", "#E0A868", "#A34A2E"];
    for (var i = 0; i < 28; i++) {
      particles.push({
        x: x || window.innerWidth / 2,
        y: y || window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.8) * 8,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  }

  function updateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(updateConfetti);
  }
  requestAnimationFrame(updateConfetti);

  /* ---------- Storage ---------- */
  function loadHabits() {
    try {
      var raw = localStorage.getItem("habits");
      var parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.map(function (h) {
        return {
          id: h.id || generateId(),
          name: h.name || "Untitled habit",
          frequency: h.frequency === "weekdays" ? "weekdays" : "daily",
          archived: !!h.archived,
          createdAt: h.createdAt || new Date().toISOString(),
          completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
          color: h.color || COLORS[0].hex
        };
      });
    } catch (e) {
      console.error("Could not read saved habits:", e);
      return [];
    }
  }

  function saveHabits() {
    try {
      localStorage.setItem("habits", JSON.stringify(habits));
    } catch (e) {
      console.error("Could not save habits:", e);
      showToast("Couldn't save — your browser storage may be full.");
    }
  }

  var habits = loadHabits();
  var currentTab = "active";
  var selectedColor = COLORS[0].hex;
  var expandedHistory = {};
  var justCompletedId = null;
  var editingId = null;

  /* ---------- DOM ---------- */
  var habitList = document.getElementById("habitList");
  var emptyState = document.getElementById("emptyState");
  var addHabitBtn = document.getElementById("addHabitBtn");
  var exportBtn = document.getElementById("exportBtn");
  var importBtn = document.getElementById("importBtn");
  var importInput = document.getElementById("importInput");
  var closeModalBtn = document.getElementById("closeModalBtn");
  var habitModal = document.getElementById("habitModal");
  var habitForm = document.getElementById("habitForm");
  var modalTitle = document.getElementById("modalTitle");
  var submitBtn = document.getElementById("submitBtn");
  var habitName = document.getElementById("habitName");
  var frequency = document.getElementById("frequency");
  var colorSwatches = document.getElementById("colorSwatches");
  var searchInput = document.getElementById("searchInput");
  var todayDate = document.getElementById("todayDate");
  var progressText = document.getElementById("progressText");
  var completedCount = document.getElementById("completedCount");
  var remainingCount = document.getElementById("remainingCount");
  var tabs = document.querySelectorAll(".tab");
  var trailMarks = document.getElementById("trailMarks");
  var toastStack = document.getElementById("toastStack");

  /* ---------- Date helpers ---------- */
  function formatDate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function getToday() { return formatDate(new Date()); }

  function isScheduledOnDate(date, freq) {
    var day = date.getDay();
    if (freq === "daily") return true;
    if (freq === "weekdays") return day >= 1 && day <= 5;
    return false;
  }

  function isScheduledToday(habit) {
    return isScheduledOnDate(new Date(), habit.frequency);
  }

  function getPreviousScheduledDate(dateString, freq) {
    var date = new Date(dateString + "T00:00:00");
    date.setDate(date.getDate() - 1);
    while (true) {
      if (isScheduledOnDate(date, freq)) return formatDate(date);
      date.setDate(date.getDate() - 1);
    }
  }

  function getNextScheduledDate(dateString, freq) {
    var date = new Date(dateString + "T00:00:00");
    date.setDate(date.getDate() + 1);
    while (true) {
      if (isScheduledOnDate(date, freq)) return formatDate(date);
      date.setDate(date.getDate() + 1);
    }
  }

  /* ---------- Streaks ---------- */
  function isCompletedToday(habit) { return habit.completedDates.indexOf(getToday()) !== -1; }

  function getCurrentStreak(habit) {
    if (habit.completedDates.length === 0) return 0;

    var streak = 0;
    var checkDate = getToday();

    if (habit.completedDates.indexOf(checkDate) === -1) {
      var previousDate = getPreviousScheduledDate(checkDate, habit.frequency);
      if (habit.completedDates.indexOf(previousDate) === -1) return 0;
      checkDate = previousDate;
    }

    while (habit.completedDates.indexOf(checkDate) !== -1) {
      streak++;
      checkDate = getPreviousScheduledDate(checkDate, habit.frequency);
    }

    return streak;
  }

  function getBestStreak(habit) {
    if (habit.completedDates.length === 0) return 0;

    var completed = habit.completedDates.slice().sort();
    var best = 1;
    var current = 1;

    for (var i = 1; i < completed.length; i++) {
      var previousDate = completed[i - 1];
      var currentDate = completed[i];
      var nextExpected = getNextScheduledDate(previousDate, habit.frequency);

      if (nextExpected === currentDate) {
        current++;
        if (current > best) best = current;
      } else {
        current = 1;
      }
    }

    return best;
  }

  function getStreakMessage(streak) {
    if (streak === 0) return "Start your streak today";
    if (streak === 1) return "First day planted";
    if (streak < 3) return "Building momentum";
    if (streak < 7) return "3+ day streak";
    if (streak < 14) return "7+ day streak";
    if (streak < 30) return "14+ day streak";
    if (streak < 75) return "30+ day streak";
    return "75-day season complete";
  }

  /* ---------- Plant icon ---------- */
  function plantIcon(streak, color) {
    var stage =
      streak <= 0 ? 0 :
      streak <= 2 ? 1 :
      streak <= 6 ? 2 :
      streak <= 13 ? 3 :
      streak <= 29 ? 4 :
      streak <= 74 ? 5 : 6;

    var stemTops = [34, 30, 25, 20, 15, 11, 8];
    var leafCounts = [0, 1, 2, 3, 4, 5, 6];
    var stemTop = stemTops[stage];
    var leafCount = leafCounts[stage];
    var flower = stage >= 5;

    var leaves = "";
    for (var i = 0; i < leafCount; i++) {
      var y = 33 - (i * ((33 - stemTop) / Math.max(leafCount, 1)));
      var side = i % 2 === 0 ? 1 : -1;
      leaves += '<ellipse cx="' + (20 + side * 6) + '" cy="' + y + '" rx="6" ry="3.2" ' +
        'transform="rotate(' + (side * 35) + ' ' + (20 + side * 6) + ' ' + y + ')" fill="' + color + '" opacity="0.85"/>';
    }

    var bloom = flower
      ? '<circle cx="20" cy="' + (stemTop - 2) + '" r="4.4" fill="' + color + '"/>' +
        '<circle cx="20" cy="' + (stemTop - 2) + '" r="1.8" fill="var(--surface)"/>'
      : "";

    return '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse cx="20" cy="35" rx="9" ry="2.6" fill="var(--surface-2)"/>' +
      '<path d="M20 34 C 20 ' + ((34 + stemTop) / 2) + ', 20 ' + (stemTop + 3) + ', 20 ' + stemTop + '" ' +
      'stroke="' + color + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
      leaves + bloom +
      '</svg>';
  }

  function hexToRgba(hex, alpha) {
    var clean = hex.replace("#", "");
    var r = parseInt(clean.substring(0, 2), 16);
    var g = parseInt(clean.substring(2, 4), 16);
    var b = parseInt(clean.substring(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
  }

  /* ---------- Heatmap ---------- */
  function buildHeatmapWeeks(habit, weekCount) {
    var totalDays = weekCount * 7;
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var cells = [];
    for (var i = totalDays - 1; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var dateStr = formatDate(d);
      cells.push({
        dateStr: dateStr,
        scheduled: isScheduledOnDate(d, habit.frequency),
        completed: habit.completedDates.indexOf(dateStr) !== -1
      });
    }

    var weeks = [];
    for (var w = 0; w < weekCount; w++) {
      weeks.push(cells.slice(w * 7, w * 7 + 7));
    }
    return weeks;
  }

  function renderHeatmap(habit) {
    var weeks = buildHeatmapWeeks(habit, 12);
    var html = "";
    for (var w = 0; w < weeks.length; w++) {
      html += '<div class="heatmap-week">';
      for (var d = 0; d < weeks[w].length; d++) {
        var cell = weeks[w][d];
        var classes = "heatmap-cell";
        var style = "";
        var label = cell.dateStr + ": ";
        if (cell.completed) {
          classes += " completed";
          style = ' style="background:' + habit.color + '"';
          label += "completed";
        } else if (cell.scheduled) {
          classes += " scheduled";
          label += "missed";
        } else {
          label += "not scheduled";
        }
        html += '<div class="' + classes + '" title="' + label + '"' + style + '></div>';
      }
      html += "</div>";
    }
    return html;
  }

  function getMonthStats(habit) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var year = today.getFullYear();
    var month = today.getMonth();

    var scheduledCount = 0;
    var completedCount = 0;

    for (var day = 1; day <= today.getDate(); day++) {
      var d = new Date(year, month, day);
      if (isScheduledOnDate(d, habit.frequency)) {
        scheduledCount++;
        if (habit.completedDates.indexOf(formatDate(d)) !== -1) completedCount++;
      }
    }

    var pct = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;
    return { scheduledCount: scheduledCount, completedCount: completedCount, pct: pct };
  }

  /* ---------- Season trail ---------- */
  function renderTrailMarks(currentDay) {
    var stops = [0, 15, 30, 45, 60, 75];
    var html = "";
    for (var i = 0; i < stops.length; i++) {
      var day = stops[i];
      var left = (day / 75) * 100;
      var reached = currentDay >= day ? "reached" : "";
      html += '<div class="trail-mark ' + reached + '" style="left:' + left + '%">' +
        '<span class="mark-day">' + (day === 0 ? "Start" : "Day " + day) + "</span></div>";
    }
    trailMarks.innerHTML = html;
  }

  function updateSeason() {
    var challengeDayEl = document.getElementById("challengeDay");
    var challengeProgress = document.getElementById("challengeProgress");
    var challengePercentage = document.getElementById("challengePercentage");
    var challengeMessage = document.getElementById("challengeMessage");
    var challengeSubtext = document.getElementById("challengeSubtext");

    var earliestDate = null;
    habits.forEach(function (habit) {
      if (!habit.createdAt) return;
      var date = new Date(habit.createdAt);
      date.setHours(0, 0, 0, 0);
      if (!earliestDate || date < earliestDate) earliestDate = date;
    });

    if (!earliestDate) {
      challengeDayEl.textContent = "Day 1";
      challengeProgress.style.width = "0%";
      challengePercentage.textContent = "0% of the season";
      challengeMessage.textContent = "Let's get started";
      challengeSubtext.textContent = "Complete today's habits and keep your streak alive.";
      renderTrailMarks(0);
      return;
    }

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var difference = Math.floor((today - earliestDate) / (1000 * 60 * 60 * 24));
    var day = Math.min(difference + 1, 75);
    var percentage = Math.round((day / 75) * 100);

    challengeDayEl.textContent = "Day " + day;
    challengeProgress.style.width = percentage + "%";
    challengePercentage.textContent = percentage + "% of the season";

    if (day >= 75) {
      challengeMessage.textContent = "75 days complete";
      challengeSubtext.textContent = "You completed the season. What a run.";
    } else if (day >= 30) {
      challengeMessage.textContent = "On a serious streak";
      challengeSubtext.textContent = (75 - day) + " days left. Keep going.";
    } else if (day >= 7) {
      challengeMessage.textContent = "One week strong";
      challengeSubtext.textContent = (75 - day) + " days left in the season.";
    } else {
      challengeMessage.textContent = "Building the habit";
      challengeSubtext.textContent = (75 - day) + " days left.";
    }

    renderTrailMarks(day);
  }

  /* ---------- Render habits ---------- */
  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function renderHabits() {
    habitList.innerHTML = "";

    var searchText = searchInput.value.toLowerCase().trim();

    var filteredHabits = habits.filter(function (habit) {
      var matchesTab = currentTab === "active" ? !habit.archived : habit.archived;
      var matchesSearch = habit.name.toLowerCase().indexOf(searchText) !== -1;
      return matchesTab && matchesSearch;
    });

    if (currentTab === "active") {
      filteredHabits = filteredHabits.filter(isScheduledToday);
    }

    if (filteredHabits.length === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");

      filteredHabits.forEach(function (habit) {
        var card = document.createElement("div");
        card.className = "habit-card";
        if (habit.id === justCompletedId) card.classList.add("just-completed");

        var currentStreak = getCurrentStreak(habit);
        var bestStreak = getBestStreak(habit);
        var completed = isCompletedToday(habit);
        var isOpen = !!expandedHistory[habit.id];
        var monthStats = getMonthStats(habit);

        var actionsHtml = currentTab === "active"
          ? '<button class="complete-btn ' + (completed ? "completed" : "") + '" data-action="toggle" data-id="' + habit.id + '">' +
            (completed ? "Done" : "Mark done") + "</button>" +
            '<button class="action-btn" data-action="edit" data-id="' + habit.id + '">Edit</button>' +
            '<button class="action-btn" data-action="archive" data-id="' + habit.id + '">Archive</button>'
          : '<button class="action-btn" data-action="edit" data-id="' + habit.id + '">Edit</button>' +
            '<button class="action-btn" data-action="restore" data-id="' + habit.id + '">Restore</button>';

        card.innerHTML =
          '<div class="habit-row">' +
            '<div class="plant-icon-wrap" style="background:' + hexToRgba(habit.color, 0.16) + '">' +
              plantIcon(currentStreak, habit.color) +
            "</div>" +
            '<div class="habit-info">' +
              '<div class="habit-title">' + escapeHtml(habit.name) + "</div>" +
              '<span class="habit-frequency">' + (habit.frequency === "daily" ? "Every day" : "Weekdays") + "</span>" +
              '<div class="streak-info">' +
                "<span><strong>" + currentStreak + "</strong> day" + (currentStreak !== 1 ? "s" : "") + " current</span>" +
                "<span><strong>" + bestStreak + "</strong> day" + (bestStreak !== 1 ? "s" : "") + " best</span>" +
                "<span>" + getStreakMessage(currentStreak) + "</span>" +
              "</div>" +
            "</div>" +
            '<div class="habit-actions">' + actionsHtml + "</div>" +
            '<button class="history-toggle ' + (isOpen ? "open" : "") + '" data-action="history" data-id="' + habit.id + '">' +
              "History" +
              '<svg viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            "</button>" +
          "</div>" +
          '<div class="history-panel ' + (isOpen ? "open" : "") + '">' +
            '<div class="history-inner">' +
              '<div class="heatmap">' + renderHeatmap(habit) + "</div>" +
              '<div class="history-stats">' +
                '<div class="big-stat">' + monthStats.pct + "%</div>" +
                '<div class="big-stat-label">' + monthStats.completedCount + " of " + monthStats.scheduledCount + " scheduled days this month</div>" +
                '<button class="history-delete" data-action="delete" data-id="' + habit.id + '">' +
                  '<svg viewBox="0 0 16 16" fill="none"><path d="M3 4.5H13M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5V13a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                  "Delete habit" +
                "</button>" +
              "</div>" +
            "</div>" +
          "</div>";

        habitList.appendChild(card);
      });
    }

    updateSummary();

    if (justCompletedId) {
      window.setTimeout(function () {
        var el = habitList.querySelector('.habit-card.just-completed');
        if (el) el.classList.remove("just-completed");
      }, 380);
      justCompletedId = null;
    }
  }

  function updateSummary() {
    var todayHabits = habits.filter(function (habit) {
      return !habit.archived && isScheduledToday(habit);
    });

    var completed = todayHabits.filter(isCompletedToday);
    var total = todayHabits.length;
    var completedTotal = completed.length;
    var remaining = total - completedTotal;

    progressText.textContent = completedTotal + " / " + total;
    completedCount.textContent = completedTotal;
    remainingCount.textContent = remaining;
  }

  /* ---------- Morning reminder ---------- */
  function showMorningReminder() {
    var today = getToday();
    var lastReminderDate = localStorage.getItem("morningReminderDate");
    if (lastReminderDate === today) return;

    var todayHabits = habits.filter(function (habit) {
      return !habit.archived && isScheduledToday(habit);
    });

    var remaining = todayHabits.filter(function (habit) {
      return !isCompletedToday(habit);
    }).length;

    if (remaining > 0) {
      localStorage.setItem("morningReminderDate", today);
      showToast(
        "Good morning, Ananya 🌱 You still have " +
        remaining +
        " habit" +
        (remaining !== 1 ? "s" : "") +
        " to log today."
      );
    }
  }

  /* ---------- Toasts ---------- */
  function showToast(message) {
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    toastStack.appendChild(el);
    window.setTimeout(function () {
      el.classList.add("leaving");
      window.setTimeout(function () { el.remove(); }, 200);
    }, 2600);
  }

  /* ---------- Actions ---------- */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function findHabit(id) {
    return habits.find(function (h) { return h.id === id; });
  }

  function toggleHabit(id, event) {
    var habit = findHabit(id);
    if (!habit) return;

    var today = getToday();
    var index = habit.completedDates.indexOf(today);

    if (index === -1) {
      habit.completedDates.push(today);
      justCompletedId = id;
      showToast('Nice — "' + habit.name + '" marked done for today.');
      if (event) {
        var rect = event.target.getBoundingClientRect();
        triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    } else {
      habit.completedDates.splice(index, 1);
    }

    saveHabits();
    renderHabits();
    updateSeason();
  }

  function archiveHabit(id) {
    var habit = findHabit(id);
    if (!habit) return;
    habit.archived = true;
    saveHabits();
    renderHabits();
    showToast('"' + habit.name + '" archived.');
  }

  function restoreHabit(id) {
    var habit = findHabit(id);
    if (!habit) return;
    habit.archived = false;
    saveHabits();
    renderHabits();
    showToast('"' + habit.name + '" restored.');
  }

  function deleteHabit(id) {
    var habit = findHabit(id);
    if (!habit) return;
    var ok = window.confirm('Delete "' + habit.name + '"? This can\'t be undone.');
    if (!ok) return;
    habits = habits.filter(function (h) { return h.id !== id; });
    delete expandedHistory[id];
    saveHabits();
    renderHabits();
    updateSeason();
    showToast('"' + habit.name + '" deleted.');
  }

  function toggleHistory(id) {
    expandedHistory[id] = !expandedHistory[id];
    renderHabits();
  }

  habitList.addEventListener("click", function (event) {
    var btn = event.target.closest("button[data-action]");
    if (!btn) return;
    var id = btn.dataset.id;
    var action = btn.dataset.action;
    if (action === "toggle") toggleHabit(id, event);
    else if (action === "edit") openEditModal(id);
    else if (action === "archive") archiveHabit(id);
    else if (action === "restore") restoreHabit(id);
    else if (action === "delete") deleteHabit(id);
    else if (action === "history") toggleHistory(id);
  });

  /* ---------- Presets & Swatches ---------- */
  var presetChips = document.querySelectorAll(".preset-chip");
  presetChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      habitName.value = chip.dataset.name;
      frequency.value = chip.dataset.freq;
      selectedColor = chip.dataset.color;
      renderSwatches();
    });
  });

  function renderSwatches() {
    colorSwatches.innerHTML = COLORS.map(function (c) {
      var selected = c.hex === selectedColor ? "selected" : "";
      return '<button type="button" class="swatch ' + selected + '" style="background:' + c.hex + '" ' +
        'data-color="' + c.hex + '" aria-label="' + c.name + '"></button>';
    }).join("");
  }

  colorSwatches.addEventListener("click", function (event) {
    var btn = event.target.closest(".swatch");
    if (!btn) return;
    selectedColor = btn.dataset.color;
    renderSwatches();
  });

  /* ---------- Form / modal ---------- */
  function setModalMode(mode) {
    if (mode === "edit") {
      modalTitle.textContent = "Edit habit";
      submitBtn.textContent = "Save changes";
    } else {
      modalTitle.textContent = "Add a habit";
      submitBtn.textContent = "Plant this habit";
    }
  }

  function openAddModal() {
    editingId = null;
    habitForm.reset();
    selectedColor = COLORS[0].hex;
    renderSwatches();
    setModalMode("add");
    habitModal.classList.remove("hidden");
    habitName.focus();
  }

  function openEditModal(id) {
    var habit = findHabit(id);
    if (!habit) return;

    editingId = id;
    habitName.value = habit.name;
    frequency.value = habit.frequency;
    selectedColor = habit.color;
    renderSwatches();
    setModalMode("edit");
    habitModal.classList.remove("hidden");
    habitName.focus();
  }

  function closeModal() {
    habitModal.classList.add("hidden");
    editingId = null;
    habitForm.reset();
    selectedColor = COLORS[0].hex;
    renderSwatches();
    setModalMode("add");
  }

  habitForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = habitName.value.trim();
    var selectedFrequency = frequency.value;
    if (name === "") return;

    if (editingId) {
      var habit = findHabit(editingId);
      if (!habit) { closeModal(); return; }

      habit.name = name;
      habit.frequency = selectedFrequency;
      habit.color = selectedColor;

      saveHabits();
      closeModal();
      renderHabits();
      updateSeason();
      showToast('"' + name + '" updated.');
      return;
    }

    habits.push({
      id: generateId(),
      name: name,
      frequency: selectedFrequency,
      archived: false,
      createdAt: new Date().toISOString(),
      completedDates: [],
      color: selectedColor
    });

    saveHabits();
    closeModal();
    renderHabits();
    updateSeason();
    showToast('"' + name + '" planted. Good luck!');
  });

  addHabitBtn.addEventListener("click", openAddModal);
  closeModalBtn.addEventListener("click", closeModal);

  habitModal.addEventListener("click", function (event) {
    if (event.target === habitModal) closeModal();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !habitModal.classList.contains("hidden")) closeModal();
  });

  /* ---------- Search / tabs ---------- */
  searchInput.addEventListener("input", renderHabits);

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      currentTab = tab.dataset.tab;
      renderHabits();
    });
  });

  /* ---------- Export / import backup ---------- */
  exportBtn.addEventListener("click", function () {
    try {
      var dataStr = JSON.stringify(habits, null, 2);
      var blob = new Blob([dataStr], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "habit-garden-backup-" + getToday() + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Backup downloaded.");
    } catch (e) {
      console.error(e);
      showToast("Couldn't create a backup file.");
    }
  });

  importBtn.addEventListener("click", function () {
    importInput.click();
  });

  importInput.addEventListener("change", function (event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed)) throw new Error("Backup file is not a list of habits.");

        var ok = window.confirm("Import " + parsed.length + " habit(s)? This replaces your current habits.");
        if (!ok) { event.target.value = ""; return; }

        habits = parsed.map(function (h) {
          return {
            id: h.id || generateId(),
            name: h.name || "Untitled habit",
            frequency: h.frequency === "weekdays" ? "weekdays" : "daily",
            archived: !!h.archived,
            createdAt: h.createdAt || new Date().toISOString(),
            completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
            color: h.color || COLORS[0].hex
          };
        });

        saveHabits();
        renderHabits();
        updateSeason();
        showToast("Habits imported.");
      } catch (err) {
        console.error(err);
        showToast("That file couldn't be read as a backup.");
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  });

  /* ---------- Start ---------- */
  function displayDate() {
    todayDate.textContent = new Date().toLocaleDateString("en-IN", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
  }

  renderSwatches();
  displayDate();
  renderHabits();
  updateSeason();
  showMorningReminder();

})();