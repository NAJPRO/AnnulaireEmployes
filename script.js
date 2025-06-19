// On commence par définir un tableau qui contiendra nos employer


// Fonction qui récupère la liste des employé dans le localstorage
const getEmploye = () =>{
    // On essaie de récupérer notre tableau d'employer dans le localstorage ayant la clé listeEmployes
    const listeEmployes = localStorage.getItem("listeEmployes")
    if(listeEmployes === null){
        return []
    }
    return JSON.parse(listeEmployes)
}

/**
 * Cette fonction permet d'enregistrer un employer dans le localstorage et retourne la nouvelle liste complete des empleyées
 * @param {object} employe 
 * @returns array
 */
const saveEmploye = (employe) =>{
    const listeEmployes = getEmploye()
    console.log(listeEmployes);
    
    listeEmployes.unshift(employe)

    localStorage.setItem('listeEmployes', JSON.stringify(listeEmployes))

    return listeEmployes
}

/**
 * Cette fonction permet de rechercher un employer à partir de son email et de le supprimer
 * @param {string} email 
 */
const deleteUser = (email) => {
    const listeEmployes = getEmploye()
    if(listeEmployes){
        let tabFilter = listeEmployes.filter((element) => element.email !== email)
        localStorage.setItem('listeEmployes', JSON.stringify(tabFilter))
        reloadTable(tabFilter)
    }
}

const isUniqueEmail = email =>{
    const listeEmployes = getEmploye()
    let tabFilter = listeEmployes.filter((element) => element.email === email)
    if(tabFilter.length > 0){
        return false
    }
    return true
}

/**
 * Fonction pour ajouter un nouvel employé dans le tableau
 * @param {table} listeEmployes - La liste d'employé
 */
function reloadTable(listeEmployes) {
    // Crée une nouvelle ligne dans le tableau
    const tbody = document.getElementById('employes');
    tbody.innerHTML = ""
    listeEmployes.forEach(employe => {
        const tr = document.createElement('tr');
        const tdNom = document.createElement('td');
        const tdEmail = document.createElement('td');
        const tdPoste = document.createElement('td');
        const tdActions = document.createElement('td');

        tdNom.textContent = employe.name;
        tdEmail.textContent = employe.email;
        tdPoste.textContent = employe.poste;

        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Supprimer';
        btnDelete.className = 'delete';
        btnDelete.addEventListener('click', function() {
            tbody.removeChild(tr); // Supprime la ligne du tableau
            deleteUser(employe.email)
        });
        tdActions.appendChild(btnDelete);


        tr.appendChild(tdNom);
        tr.appendChild(tdEmail);
        tr.appendChild(tdPoste);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);  
    })

}


// Écouteurs d'événements pour chaque champ de saisie

const form = document.getElementById('formulaire');
form.addEventListener('submit', function(event) {
    const nom = document.getElementById('name');
    const prenom = document.getElementById('prenom');
    const email = document.getElementById('email');
    const poste = document.getElementById('poste');
    event.preventDefault(); // Empêche l'envoi du formulaire
    let estValide = true;
    // Récupération des valeurs des champs
    const nomValue = nom.value;
    const prenomValue = prenom.value;
    const emailValue = email.value;
    const posteValue = poste.value;

    if(nomValue.length < 3){
        nom.style.borderColor = "red"
        const tmpSpan = document.getElementById("spanName")
        tmpSpan.textContent = "3 caractères minimum"
        estValide = false
    }else{
        nom.style.borderColor = "#20b2aa"
        const tmpSpan = document.getElementById("spanName")
        tmpSpan.textContent = ""
    }
    if(prenomValue.length < 3){
        prenom.style.borderColor = "red"
        const tmpSpan = document.getElementById("spanPrenom")
        tmpSpan.textContent = "3 caractères minimum"
        estValide = false

    }else{
        prenom.style.borderColor = "#20b2aa"
        const tmpSpan = document.getElementById("spanPrenom")
        tmpSpan.textContent = ""
    }
    if(posteValue.length < 3){
        poste.style.borderColor = "red"
        const tmpSpan = document.getElementById("spanPoste")
        tmpSpan.textContent = "3 caractères minimum"
        estValide = false

    }else{
        poste.style.borderColor = "#20b2aa"
        const tmpSpan = document.getElementById("spanPoste")
        tmpSpan.textContent = ""
    }
    if(!validateEmail(emailValue)){
        email.style.borderColor = "red"
        const tmpEmailSpan = document.getElementById("spanEmail")
        tmpEmailSpan.textContent = "Votre adresse email n'est pas conforme"
        estValide = false
    }else{
        email.style.borderColor = "#20b2aa"
        const tmpEmailSpan = document.getElementById("spanEmail")
        tmpEmailSpan.textContent = ""
    }

    if(!isUniqueEmail(emailValue)){
        estValide = false

        alert("Cette adresse email existe déjà")
    }
    // Affichage des valeurs dans la console (ou vous pouvez les envoyer à un serveur)
    console.log(`Nom: ${nomValue}, Prénom: ${prenomValue}, Email: ${emailValue}, Poste: ${posteValue}`);
    if(estValide){
        // Réinitialisation du formulaire
        const employe = {
            name: `${nomValue} ${prenomValue}`,
            email: emailValue,
            poste: posteValue
        }
        let listeEmployes = getEmploye()
        listeEmployes = saveEmploye(employe)
        reloadTable(listeEmployes)
        form.reset();
    }
});

// Fonction pour valider l'email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Écouteur d'événement pour la validation de l'email
email.addEventListener('input', function() {
    if (!validateEmail(email.value)) {
        email.setCustomValidity('Veuillez entrer une adresse e-mail valide.');
    } else {
        email.setCustomValidity('');
    }
});



reloadTable(getEmploye())