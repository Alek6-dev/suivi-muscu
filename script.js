const singleWeek = document.getElementById('single-week');
const month = document.getElementById('month');

// On prend l'année et le mois du jour actuel
const today = new Date();
const year = today.getFullYear();
const monthIndex = today.getMonth(); // 0 = janvier

// Générer toutes les dates du mois
function getDaysInMonth(year, month) {
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

const monthDays = getDaysInMonth(year, monthIndex);

// Calculer le jour de la semaine du 1er (lundi = 0)
let firstDay = new Date(year, monthIndex, 1).getDay();
firstDay = (firstDay === 0) ? 6 : firstDay - 1; 

// Cloner 5 semaines supplémentaires (la première existe déjà)
for (let i = 0; i < 5; i++) {
    const clone = singleWeek.cloneNode(true);
    month.appendChild(clone);
}

// Récupérer toutes les semaines (maintenant toutes les 6)
const weeks = document.querySelectorAll('.week');
let dayIndex = 0;

weeks.forEach((week, wIndex) => {
    const days = week.querySelectorAll('.day');
    days.forEach((day, i) => {
        // Décalage pour la première semaine
        if(wIndex === 0 && i < firstDay){
            day.textContent = '';
            return;
        }

        // Remplir les jours
        if(dayIndex < monthDays.length){
            day.textContent = monthDays[dayIndex].getDate();
            day.dataset.date = monthDays[dayIndex].toISOString();
            dayIndex++;
        } else {
            day.textContent = '';
        }
    });
});
