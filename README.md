Parfait 😄, on va faire ça très détaillé, mot à mot, pour que tu comprennes vraiment chaque élément de ton JS, même les fonctions les plus basiques. On va reprendre ton JS ligne par ligne et expliquer chaque mot et chaque méthode.

1️⃣ Références DOM et variables globales
const singleWeek = document.getElementById("single-week");

const → mot-clé pour créer une variable constante, c’est-à-dire qu’on ne pourra pas la réaffecter à autre chose après.

singleWeek → nom de notre variable. Ici, c’est juste un nom qu’on donne pour pouvoir manipuler cet élément HTML.

document → objet global qui représente la page entière HTML. Tout le contenu de la page est accessible via document.

getElementById("single-week") → méthode qui retourne l’élément HTML dont l’ID est "single-week". Ici c’est le modèle d’une semaine que l’on va cloner pour remplir le mois.

const monthContainer = document.getElementById("month");

Pareil que ci-dessus : on récupère le conteneur du mois entier (<div id="month">) pour pouvoir y ajouter toutes les semaines dynamiquement.

const monthYearLabel = document.getElementById("month-year");

Récupère l’élément <div> où on affichera “Octobre 2025”, par exemple.

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

Ces deux lignes récupèrent les boutons de navigation, <button id="prev"> et <button id="next">.

Cela nous permettra d’ajouter des événements de clic pour changer de mois.

const today = new Date();

new Date() → crée un objet Date représentant la date et l’heure actuelles du navigateur.

Exemple : si aujourd’hui on est le 11 octobre 2025, today contient toutes ces infos (année, mois, jour, heure, minutes, secondes…).

let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

let → mot-clé pour créer une variable qui peut changer. Contrairement à const.

getFullYear() → méthode de l’objet Date qui retourne l’année en 4 chiffres, par ex. 2025.

getMonth() → méthode de l’objet Date qui retourne le mois actuel de 0 à 11 (0 = janvier, 1 = février, … 9 = octobre).

On stocke ces valeurs pour savoir quel mois et quelle année afficher actuellement.

2️⃣ Fonction generateMonth
function generateMonth(year, monthIndex) {
const days = [];

function → mot-clé pour créer une fonction, une portion de code qu’on peut réutiliser plusieurs fois.

generateMonth → nom de la fonction.

(year, monthIndex) → paramètres, c’est-à-dire les valeurs qu’on donnera à la fonction quand on l’appelle.

const days = [] → crée un tableau vide, qui va contenir toutes les dates du mois, incluant les jours des mois précédent et suivant.

const firstOfMonth = new Date(year, monthIndex, 1);

Crée une date correspondant au premier jour du mois.

new Date(year, monthIndex, 1) → année, mois, jour.

Exemple : new Date(2025, 9, 1) → 1er octobre 2025 (rappel : octobre = 9 car janvier = 0).

let startDay = firstOfMonth.getDay();
startDay = startDay === 0 ? 6 : startDay - 1;

getDay() → retourne le jour de la semaine pour cette date, 0 = dimanche, 1 = lundi… 6 = samedi.

On veut que la semaine commence lundi = 0, donc :

Si getDay() = 0 (dimanche), alors startDay = 6.

Sinon, startDay = getDay() - 1.

Cela nous permet de savoir combien de cases vides du mois précédent remplir avant le 1er du mois courant.

const prevMonthLastDate = new Date(year, monthIndex, 0).getDate();

new Date(year, monthIndex, 0) → crée la date du dernier jour du mois précédent.

Exemple : new Date(2025, 9, 0) → 30 septembre 2025.

getDate() → retourne le jour du mois (1–31). Ici = 30.

On utilise ça pour remplir la première semaine avec les jours du mois précédent si le mois ne commence pas lundi.

for (let i = startDay; i > 0; i--) {
days.push(new Date(year, monthIndex - 1, prevMonthLastDate - i + 1));
}

for → boucle, répète le code entre {} plusieurs fois.

let i = startDay → on commence à startDay et on descend jusqu’à 1.

days.push(...) → ajoute un élément à la fin du tableau days.

new Date(year, monthIndex - 1, prevMonthLastDate - i + 1) → crée la date exacte du mois précédent pour chaque case.

const currentMonthDays = new Date(year, monthIndex + 1, 0).getDate();
for (let i = 1; i <= currentMonthDays; i++) {
days.push(new Date(year, monthIndex, i));
}

new Date(year, monthIndex + 1, 0) → dernier jour du mois courant.

getDate() → combien de jours dans le mois courant (ex: octobre = 31).

La boucle for ajoute tous les jours du mois courant dans le tableau days.

let nextMonthDay = 1;
while (days.length % 7 !== 0) {
days.push(new Date(year, monthIndex + 1, nextMonthDay));
nextMonthDay++;
}

while → boucle qui continue tant que la condition est vraie.

days.length % 7 !== 0 → tant que le nombre total de jours n’est pas un multiple de 7 (dernière semaine incomplète), on ajoute des jours du mois suivant.

nextMonthDay commence à 1 et s’incrémente à chaque itération.

Résultat : toutes les semaines ont exactement 7 jours.

3️⃣ Fonction renderMonth
monthContainer.innerHTML = "";

Vide le conteneur du mois pour réafficher le nouveau mois lors de la navigation.

const days = generateMonth(year, monthIndex);

Appelle generateMonth pour obtenir tous les jours à afficher, incluant ceux du mois précédent et suivant.

monthYearLabel.textContent = `${monthNames[monthIndex]} ${year}`;

textContent → modifie le texte à l’intérieur de l’élément HTML.

Affiche par exemple "Octobre 2025".

const week = singleWeek.cloneNode(true);

cloneNode(true) → copie exacte du modèle .week avec tous ses enfants (les .day), pour créer une nouvelle semaine.

On fait ça pour ne pas toucher au modèle HTML original.

week.classList.remove("template-week");
week.removeAttribute("id");

On supprime la classe template et l’id pour que chaque clone soit indépendant et n’ait pas le même ID (pas autorisé en HTML).

Remplissage des jours
weekDays[d].textContent = dayObj.getDate();
weekDays[d].dataset.date = `${yyyy}-${mm}-${dd}`;

weekDays[d] → une case du jour dans la semaine.

textContent → affiche le numéro du jour (1–31).

dataset.date → stocke la date complète en string dans l’élément HTML pour la récupérer au clic.

Format YYYY-MM-DD → évite les problèmes de fuseau horaire.

weekDays[d].classList.remove("prev-month", "current-month", "next-month");
if (dayObj.getMonth() < monthIndex) weekDays[d].classList.add("prev-month");
else if (dayObj.getMonth() > monthIndex) weekDays[d].classList.add("next-month");
else weekDays[d].classList.add("current-month");

Ajoute une classe CSS selon si le jour appartient au mois précédent, courant ou suivant.

Cela sert pour colorer les jours gris ou normaux.

4️⃣ Navigation mois précédent / suivant
prevBtn.addEventListener("click", () => {
currentMonth--;
if (currentMonth < 0) {
currentMonth = 11;
currentYear--;
}
renderMonth(currentYear, currentMonth);
});

addEventListener("click", callback) → exécute la fonction lorsqu’on clique sur le bouton.

On décrémente le mois (currentMonth--).

Si on dépasse janvier (0 → -1), on passe à décembre de l’année précédente.

Puis on re-render le mois.

Idem pour nextBtn mais on incrémente le mois.

5️⃣ Clic sur un jour
monthContainer.addEventListener("click", (e) => {
if (e.target.classList.contains("day")) {
console.log("Jour cliqué :", e.target.dataset.date);
}
});

e → objet événement passé automatiquement à la fonction.

e.target → l’élément exact sur lequel on a cliqué.

classList.contains("day") → vérifie qu’on a bien cliqué sur une case de jour.

dataset.date → récupère la date stockée pour ce jour.

console.log() → affiche dans la console pour debug.

6️⃣ Initialisation
renderMonth(currentYear, currentMonth);

Appelle renderMonth au chargement de la page pour afficher le mois courant par défaut.
