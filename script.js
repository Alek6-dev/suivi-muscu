// ----------------------------
// Références DOM
// ----------------------------
const singleWeek = document.getElementById("single-week");
const monthContainer = document.getElementById("month");
const monthYearLabel = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const popupTraining = document.getElementById("popup-training");
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

// ----------------------------
// Variables globales
// ----------------------------
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth(); // 0 = janvier

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
// Navigation
// ----------------------------
prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderMonth(currentYear, currentMonth);
});

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderMonth(currentYear, currentMonth);
});

// ----------------------------
// Clic sur un jour & Apparition popup groupe musculaire
// ----------------------------
monthContainer.addEventListener("click", (e) => {
  if (e.target.closest(".day")) {
    const popupDate = document.getElementById("popup-date");
    const dateClicked = e.target.closest(".day").dataset.date;
    const dateObj = new Date(dateClicked);

    const formattedDate =
      dayNames[(dateObj.getDay() + 6) % 7] +
      " " +
      dateObj.getDate() +
      " " +
      monthNames[dateObj.getMonth()];

    popupTraining.style.display = "flex";

    popupDate.textContent = formattedDate;
  }
});

// ----------------------------
// Initialisation
// ----------------------------
renderMonth(currentYear, currentMonth);
