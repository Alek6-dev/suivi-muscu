// ----------------------------
// Références DOM
// ----------------------------
const singleWeek = document.getElementById("single-week");
const monthContainer = document.getElementById("month");
const monthYearLabel = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const popupPreviewDay = document.getElementById("popup-preview-day");
const popupDate = document.getElementById("popup-date");

const prevDayBtn = document.getElementById("prev-day");
const nextDayBtn = document.getElementById("next-day");

const overlay = document.querySelector(".overlay");

const dayContent = document.getElementById("day-content");
const addGroupBtn = document.getElementById("add-group");

// ----------------------------
// Constantes
// ----------------------------
const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const dayNames = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const exoModal = document.getElementById("exo-modal");
const exoModalTitle = document.getElementById("exo-modal-title");
const exoModalClose = document.getElementById("exo-modal-close");

const exoSeriesInput = document.getElementById("exo-series");
const exoRepsInput = document.getElementById("exo-reps");
const exoWeightInput = document.getElementById("exo-weight");
const exoRestInput = document.getElementById("exo-rest");

const exoSaveBtn = document.getElementById("exo-save");

let selectedGroupName = null;
let selectedExoIndex = null;

const STORAGE_KEY = "kop-muscu-data-v1";

// ----------------------------
// Variables globales
// ----------------------------
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth(); // 0 = janvier

let currentDay = null; // Date (jour affiché dans la popup)
let currentDateStr = null; // "YYYY-MM-DD" (clé stockage du jour affiché)

let threeMonthsDays = [];
window.threeMonthsDays = threeMonthsDays; // debug console

// ----------------------------
// Storage helpers
// ----------------------------
function loadData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getDayEntry(dateStr) {
  const data = loadData();
  if (!data[dateStr]) data[dateStr] = { groups: [] };
  return { data, entry: data[dateStr] };
}

// ----------------------------
// Date helpers
// ----------------------------
function dateToKey(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Parsing fiable (évite les surprises de new Date("YYYY-MM-DD"))
function keyToDate(dateStr) {
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

// ----------------------------
// Popup helpers
// ----------------------------
function setPopupDate(date) {
  const idx = (date.getDay() + 6) % 7; // lundi = 0
  popupDate.textContent = `${dayNames[idx]} ${date.getDate()} ${
    monthNames[date.getMonth()]
  }`;
}

function closeDay() {
  overlay.style.display = "none";
  popupPreviewDay.style.display = "none";
}

function bindAddGroup(dateStr) {
  addGroupBtn.onclick = () => {
    const g = prompt(
      "Nom du groupe (Dos, Pecs, Épaules, Bras, Abdos, Jambes) ?"
    );
    const name = (g || "").trim();
    if (!name) return;

    const { data, entry } = getDayEntry(dateStr);

    // IMPORTANT: groups = objets => pas de includes()
    const exists = entry.groups.some((x) => x.name === name);
    if (!exists) entry.groups.push({ name, exercises: [] });

    saveData(data);
    renderDay(dateStr);
  };
}

function openDay(dateStr) {
  currentDateStr = dateStr;
  currentDay = keyToDate(dateStr);

  popupPreviewDay.style.display = "flex";
  overlay.style.display = "block";

  setPopupDate(currentDay);
  renderDay(dateStr);
  bindAddGroup(dateStr);
}

function openExoModal(groupName, exoIndex) {
  selectedGroupName = groupName;
  selectedExoIndex = exoIndex;

  const { entry } = getDayEntry(currentDateStr);
  const group = entry.groups.find((g) => g.name === groupName);
  const exo = group?.exercises?.[exoIndex];
  if (!exo) return;

  exoModalTitle.textContent = exo.name;

  exoSeriesInput.value = exo.seriesCount ?? "";
  exoRepsInput.value = exo.reps ?? "";
  exoWeightInput.value = exo.weight ?? "";
  exoRestInput.value = exo.rest ?? "";

  exoModal.style.display = "flex";
}

function closeExoModal() {
  exoModal.style.display = "none";
  selectedGroupName = null;
  selectedExoIndex = null;
}

exoModalClose.addEventListener("click", closeExoModal);

// ----------------------------
// Render du jour (popup)
// ----------------------------
function renderDay(dateStr) {
  const data = loadData();
  const entry = data[dateStr] || { groups: [] };

  dayContent.innerHTML = entry.groups
    .map(
      (g) => `
    <div class="group-row" data-group="${g.name}">
      <div class="group-header">
        <span class="group-name">${g.name}</span>
        <button class="del-group" data-group="${g.name}">×</button>
      </div>

      <div class="group-details" style="display:none;">
        <div class="exercises-list">
          ${(g.exercises || [])
            .map(
              (ex, idx) => `
                <div class="exo-row">
                  <button class="exo-name" type="button" data-group="${g.name}" data-exo-index="${idx}">${ex.name}</button>
                  <button class="del-exo" data-group="${g.name}" data-exo-index="${idx}">×</button>
                </div>
              `
            )
            .join("")}
        </div>

        <button class="add-exo" data-group="${g.name}">+ Exo</button>
      </div>
    </div>
  `
    )
    .join("");
}

// ----------------------------
// Overlay
// ----------------------------
overlay.addEventListener("click", closeDay);

// ----------------------------
// Calendar - Générer un mois complet avec débordements
// ----------------------------
function generateMonth(year, monthIndex) {
  const days = [];

  const firstOfMonth = new Date(year, monthIndex, 1);
  let startDay = firstOfMonth.getDay(); // dimanche = 0
  startDay = startDay === 0 ? 6 : startDay - 1; // lundi = 0

  const prevMonthLastDate = new Date(year, monthIndex, 0).getDate();
  for (let i = startDay; i > 0; i--) {
    days.push(new Date(year, monthIndex - 1, prevMonthLastDate - i + 1));
  }

  const currentMonthDays = new Date(year, monthIndex + 1, 0).getDate();
  for (let i = 1; i <= currentMonthDays; i++) {
    days.push(new Date(year, monthIndex, i));
  }

  let nextMonthDay = 1;
  while (days.length % 7 !== 0) {
    days.push(new Date(year, monthIndex + 1, nextMonthDay));
    nextMonthDay++;
  }

  return days;
}

// ----------------------------
// Calendar - Render du mois
// ----------------------------
function renderMonth(year, monthIndex) {
  monthContainer.innerHTML = "";

  const days = generateMonth(year, monthIndex);
  monthYearLabel.textContent = `${monthNames[monthIndex]} ${year}`;

  const weeksCount = days.length / 7;

  for (let w = 0; w < weeksCount; w++) {
    const week = singleWeek.cloneNode(true);
    week.classList.remove("template-week");
    week.removeAttribute("id");

    const weekDays = week.querySelectorAll(".day");

    for (let d = 0; d < 7; d++) {
      const dayObj = days[w * 7 + d];
      const weekDayCell = weekDays[d];

      weekDayCell.innerHTML = "";

      const dayNumber = document.createElement("span");
      dayNumber.textContent = dayObj.getDate();
      dayNumber.classList.add("day-number");

      if (
        dayObj.getFullYear() === today.getFullYear() &&
        dayObj.getMonth() === today.getMonth() &&
        dayObj.getDate() === today.getDate()
      ) {
        dayNumber.classList.add("today");
      }

      weekDayCell.appendChild(dayNumber);

      weekDayCell.dataset.date = dateToKey(dayObj);

      weekDayCell.classList.remove("prev-month", "current-month", "next-month");
      if (dayObj.getMonth() < monthIndex)
        weekDayCell.classList.add("prev-month");
      else if (dayObj.getMonth() > monthIndex)
        weekDayCell.classList.add("next-month");
      else weekDayCell.classList.add("current-month");
    }

    monthContainer.appendChild(week);
  }
}

// ----------------------------
// 3 mois (utilisé pour navigation jour)
// ----------------------------
function generateThreeMonths(year, monthIndex) {
  const days = [];

  const prevMonth = monthIndex - 1 < 0 ? 11 : monthIndex - 1;
  const prevYear = monthIndex - 1 < 0 ? year - 1 : year;
  const prevMonthLastDate = new Date(prevYear, prevMonth + 1, 0).getDate();
  for (let i = 1; i <= prevMonthLastDate; i++)
    days.push(new Date(prevYear, prevMonth, i));

  const currentMonthLastDate = new Date(year, monthIndex + 1, 0).getDate();
  for (let i = 1; i <= currentMonthLastDate; i++)
    days.push(new Date(year, monthIndex, i));

  const nextMonth = monthIndex + 1 > 11 ? 0 : monthIndex + 1;
  const nextYear = monthIndex + 1 > 11 ? year + 1 : year;
  const nextMonthLastDate = new Date(nextYear, nextMonth + 1, 0).getDate();
  for (let i = 1; i <= nextMonthLastDate; i++)
    days.push(new Date(nextYear, nextMonth, i));

  threeMonthsDays = days;
  window.threeMonthsDays = threeMonthsDays;
  return days;
}

// Helper navigation jour: compare par key (robuste)
function indexOfDayInThreeMonths(date) {
  const k = dateToKey(date);
  return threeMonthsDays.findIndex((d) => dateToKey(d) === k);
}

function goToRelativeDay(delta) {
  if (!currentDay) return;

  const i = indexOfDayInThreeMonths(currentDay);

  if (i !== -1 && i + delta >= 0 && i + delta < threeMonthsDays.length) {
    currentDay = threeMonthsDays[i + delta];
  } else {
    const d = new Date(currentDay);
    d.setDate(d.getDate() + delta);
    currentDay = d;
  }

  openDay(dateToKey(currentDay));
}

// ----------------------------
// Navigation Mois
// ----------------------------
prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateThreeMonths(currentYear, currentMonth);
  renderMonth(currentYear, currentMonth);
});

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateThreeMonths(currentYear, currentMonth);
  renderMonth(currentYear, currentMonth);
});

// ----------------------------
// Clic sur un jour (ouvre popup)
// ----------------------------
monthContainer.addEventListener("click", (e) => {
  const dayEl = e.target.closest(".day");
  if (!dayEl) return;

  const dateClicked = dayEl.dataset.date; // "YYYY-MM-DD"
  openDay(dateClicked);
});

// ----------------------------
// Contenu dynamique popup (groupes/exos)
// ----------------------------
dayContent.addEventListener("click", (e) => {
  if (!currentDateStr) return;
  const dateStr = currentDateStr;

  // Supprimer un groupe
  const delGroupBtn = e.target.closest(".del-group");
  if (delGroupBtn) {
    const groupToDelete = delGroupBtn.dataset.group;
    const { data, entry } = getDayEntry(dateStr);
    entry.groups = entry.groups.filter((g) => g.name !== groupToDelete);
    saveData(data);
    renderDay(dateStr);
    return;
  }

  // Supprimer un exo
  const delExoBtn = e.target.closest(".del-exo");
  if (delExoBtn) {
    const groupName = delExoBtn.dataset.group;
    const exoIndex = Number(delExoBtn.dataset.exoIndex);

    const { data, entry } = getDayEntry(dateStr);
    const group = entry.groups.find((g) => g.name === groupName);
    if (!group || !group.exercises) return;

    group.exercises.splice(exoIndex, 1);

    saveData(data);
    renderDay(dateStr);

    // UX: réouvrir le groupe
    const row = dayContent.querySelector(
      `.group-row[data-group="${groupName}"]`
    );
    if (row) {
      const details = row.querySelector(".group-details");
      if (details) details.style.display = "block";
    }
    return;
  }

  // Ajouter un exo
  const addExoBtn = e.target.closest(".add-exo");
  if (addExoBtn) {
    const groupName = addExoBtn.dataset.group;
    const exoName = prompt("Nom de l'exercice ?");
    const name = (exoName || "").trim();
    if (!name) return;

    const { data, entry } = getDayEntry(dateStr);
    const group = entry.groups.find((g) => g.name === groupName);
    if (!group) return;

    if (!group.exercises) group.exercises = [];
    group.exercises.push({ name });

    saveData(data);
    renderDay(dateStr);

    // UX: réouvrir le groupe
    const row = dayContent.querySelector(
      `.group-row[data-group="${groupName}"]`
    );
    if (row) {
      const details = row.querySelector(".group-details");
      if (details) details.style.display = "block";
    }
    return;
  }

  // Ouvrir le modal quand on clique sur le nom d’un exo
  const exoNameBtn = e.target.closest(".exo-name");
  if (exoNameBtn) {
    const groupName = exoNameBtn.dataset.group;
    const exoIndex = Number(exoNameBtn.dataset.exoIndex);
    openExoModal(groupName, exoIndex);
    return;
  }

  // Ouvrir/fermer détails d’un groupe (multi-ouvert)
  const nameEl = e.target.closest(".group-name");
  if (nameEl) {
    const row = nameEl.closest(".group-row");
    const details = row.querySelector(".group-details");
    details.style.display = details.style.display === "none" ? "block" : "none";
  }
});

exoSaveBtn.addEventListener("click", () => {
  if (!currentDateStr || selectedGroupName == null || selectedExoIndex == null)
    return;

  const { data, entry } = getDayEntry(currentDateStr);
  const group = entry.groups.find((g) => g.name === selectedGroupName);
  const exo = group?.exercises?.[selectedExoIndex];
  if (!exo) return;

  exo.seriesCount = Number(exoSeriesInput.value) || 0;
  exo.reps = Number(exoRepsInput.value) || 0;
  exo.weight = Number(exoWeightInput.value) || 0;
  exo.rest = Number(exoRestInput.value) || 0;

  saveData(data);
  renderDay(currentDateStr);

  // UX: ré-ouvrir le groupe après re-render
  const row = dayContent.querySelector(
    `.group-row[data-group="${selectedGroupName}"]`
  );
  if (row) {
    const details = row.querySelector(".group-details");
    if (details) details.style.display = "block";
  }

  closeExoModal();
});

// ----------------------------
// Navigation jour (flèches popup)
// ----------------------------
prevDayBtn.addEventListener("click", () => goToRelativeDay(-1));
nextDayBtn.addEventListener("click", () => goToRelativeDay(1));

// ----------------------------
// Initialisation
// ----------------------------
generateThreeMonths(currentYear, currentMonth);
renderMonth(currentYear, currentMonth);

// ----------------------------
// PWA
// ----------------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => console.log("SW OK"))
      .catch((err) => console.error("SW ERROR", err));
  });
}
