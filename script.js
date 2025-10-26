// ----------------------------
// Références DOM
// ----------------------------
const singleWeek = document.getElementById("single-week");
const monthContainer = document.getElementById("month");
const monthYearLabel = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const popupPreviewDay = document.getElementById("popup-preview-day");
const popupDate = document.getElementById("popup-date"); // ajouté ici
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
const prevDayBtn = document.getElementById("prev-day");
const nextDayBtn = document.getElementById("next-day");

// ----------------------------
// Variables globales
// ----------------------------
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth(); // 0 = janvier
let currentDay = null; // ajouté ici

// NEW: stockage global du tableau généré par generateThreeMonths
let threeMonthsDays = [];
window.threeMonthsDays = threeMonthsDays; // accessible depuis la console

// ----------------------------
// Fonction utilitaire pour formater la date dans la popup
// ----------------------------
function setPopupDate(date) {
  const idx = (date.getDay() + 6) % 7; // lundi = 0
  popupDate.textContent = `${dayNames[idx]} ${date.getDate()} ${
    monthNames[date.getMonth()]
  }`;
}

// ----------------------------
// Générer un mois complet avec débordements
// ----------------------------
function generateMonth(year, monthIndex) {
  const days = [];

  // 1er jour du mois
  const firstOfMonth = new Date(year, monthIndex, 1);
  let startDay = firstOfMonth.getDay(); // dimanche = 0
  startDay = startDay === 0 ? 6 : startDay - 1; // lundi = 0

  // Jours du mois précédent
  const prevMonthLastDate = new Date(year, monthIndex, 0).getDate();
  for (let i = startDay; i > 0; i--) {
    days.push(new Date(year, monthIndex - 1, prevMonthLastDate - i + 1));
  }

  // Jours du mois courant
  const currentMonthDays = new Date(year, monthIndex + 1, 0).getDate();
  for (let i = 1; i <= currentMonthDays; i++) {
    days.push(new Date(year, monthIndex, i));
  }

  // Compléter la dernière semaine avec le mois suivant
  let nextMonthDay = 1; // commence à 1
  while (days.length % 7 !== 0) {
    days.push(new Date(year, monthIndex + 1, nextMonthDay));
    nextMonthDay++;
  }

  return days;
}

// ----------------------------
// Affichage du mois
// ----------------------------
function renderMonth(year, monthIndex) {
  monthContainer.innerHTML = "";

  const days = generateMonth(year, monthIndex);

  // Mettre à jour le label mois/année
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

      // Vider le contenu précédent
      weekDayCell.innerHTML = "";

      // Création du span pour le chiffre du jour
      const dayNumber = document.createElement("span");
      dayNumber.textContent = dayObj.getDate();
      dayNumber.classList.add("day-number");

      // Ajouter la classe today si c'est le jour actuel
      if (
        dayObj.getFullYear() === today.getFullYear() &&
        dayObj.getMonth() === today.getMonth() &&
        dayObj.getDate() === today.getDate()
      ) {
        dayNumber.classList.add("today");
      }

      // Ajouter le span à la case
      weekDayCell.appendChild(dayNumber);

      // Dataset pour la date
      const yyyy = dayObj.getFullYear();
      const mm = String(dayObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dayObj.getDate()).padStart(2, "0");
      weekDayCell.dataset.date = `${yyyy}-${mm}-${dd}`;

      // Classes CSS pour le mois précédent / courant / suivant
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
// Initialisation
// ----------------------------
renderMonth(currentYear, currentMonth);

// ----------------------------
// Fonction génération 3 mois
// ----------------------------
function generateThreeMonths(year, monthIndex) {
  const days = [];
  // Mois précédent
  const prevMonth = monthIndex - 1 < 0 ? 11 : monthIndex - 1;
  const prevYear = monthIndex - 1 < 0 ? year - 1 : year;
  const prevMonthLastDate = new Date(prevYear, prevMonth + 1, 0).getDate();
  for (let i = 1; i <= prevMonthLastDate; i++) {
    days.push(new Date(prevYear, prevMonth, i));
  }

  // Mois courant
  const currentMonthLastDate = new Date(year, monthIndex + 1, 0).getDate();
  for (let i = 1; i <= currentMonthLastDate; i++) {
    days.push(new Date(year, monthIndex, i));
  }

  // Mois suivant
  const nextMonth = monthIndex + 1 > 11 ? 0 : monthIndex + 1;
  const nextYear = monthIndex + 1 > 11 ? year + 1 : year;
  const nextMonthLastDate = new Date(nextYear, nextMonth + 1, 0).getDate();
  for (let i = 1; i <= nextMonthLastDate; i++) {
    days.push(new Date(nextYear, nextMonth, i));
  }

  // MAJ du stockage global
  threeMonthsDays = days;
  window.threeMonthsDays = threeMonthsDays;

  return days;
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
  const days = generateThreeMonths(currentYear, currentMonth);
  renderMonth(currentYear, currentMonth, days);
});

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  const days = generateThreeMonths(currentYear, currentMonth);
  renderMonth(currentYear, currentMonth, days);
});

// ----------------------------
// Initialisation affichage
// ----------------------------
const initialDays = generateThreeMonths(currentYear, currentMonth);
renderMonth(currentYear, currentMonth, initialDays);

// ----------------------------
// Clic sur un jour & Apparition popup preview-day
// ----------------------------
monthContainer.addEventListener("click", (e) => {
  if (e.target.closest(".day")) {
    const dateClicked = e.target.closest(".day").dataset.date;
    currentDay = new Date(dateClicked);
    popupPreviewDay.style.display = "flex";
    setPopupDate(currentDay);
  }
  console.log("Jour cliqué :", currentDay);
});

// ----------------------------
// Navigation d'un jour à l'autre
// ----------------------------
prevDayBtn.addEventListener("click", () => {
  if (!currentDay) return;
  const i = threeMonthsDays.findIndex(
    (d) => d.getTime() === currentDay.getTime()
  );

  if (i > 0) {
    currentDay = threeMonthsDays[i - 1];
  } else {
    const d = new Date(currentDay);
    d.setDate(d.getDate() - 1);
    currentDay = d;
  }

  setPopupDate(currentDay);
});

nextDayBtn.addEventListener("click", () => {
  if (!currentDay) return;
  const i = threeMonthsDays.findIndex(
    (d) => d.getTime() === currentDay.getTime()
  );

  if (i !== -1 && i < threeMonthsDays.length - 1) {
    currentDay = threeMonthsDays[i + 1];
  } else {
    const d = new Date(currentDay);
    d.setDate(d.getDate() + 1);
    currentDay = d;
  }

  setPopupDate(currentDay);
});
