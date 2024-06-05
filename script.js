// Fonction pour mettre à jour le progrès de la section
function updateProgress(section) {
    const checkboxes = section.querySelectorAll('.task-checkbox');
    const checked = section.querySelectorAll('.task-checkbox:checked');
    const progressBar = section.querySelector('.progress-bar');

    const progress = checkboxes.length > 0 ? (checked.length / checkboxes.length) * 100 : 0; // Vérifier si des tâches sont présentes
    progressBar.style.width = progress + '%';

    // Sauvegarder le progrès dans le cache du navigateur
    const sectionTitle = section.querySelector('.section-title').value;
    const tasks = [];
    checkboxes.forEach(checkbox => {
        const taskName = checkbox.nextElementSibling.nextElementSibling.value;
        const isChecked = checkbox.checked;
        tasks.push({ task: taskName, completed: isChecked });
    });
    const sectionData = {
        title: sectionTitle,
        progress: progress,
        tasks: tasks
    };
    localStorage.setItem(sectionTitle, JSON.stringify(sectionData)); // Utiliser le titre de la section comme clé
}

// Fonction pour charger les données depuis le cache du navigateur lors du chargement de la page
window.onload = function() {
    const progressSections = document.getElementById('progressSections');
    for (let i = 0; i < localStorage.length; i++) {
        const sectionTitle = localStorage.key(i);
        const sectionData = JSON.parse(localStorage.getItem(sectionTitle));
        if (sectionData && sectionData.title && sectionData.progress) {
            addProgressSectionFromStorage(sectionData, progressSections);
        }
    }
};

// Fonction pour ajouter une nouvelle tâche
function addTask(section) {
    const taskContainer = section.querySelector('.task-container');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.id = `task-${Date.now()}`;
    checkbox.onchange = () => updateProgress(section);

    const checkboxLabel = document.createElement('label');
    checkboxLabel.setAttribute('for', checkbox.id);

    const textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.value = 'Nouvelle tâche';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.onclick = () => {
        taskDiv.remove();
        updateProgress(section);
    };

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(checkboxLabel);
    taskDiv.appendChild(textBox);
    taskDiv.appendChild(deleteButton);
    taskContainer.appendChild(taskDiv);
    updateProgress(section); // Mettre à jour le progrès lors de l'ajout d'une nouvelle tâche
}

// Fonction pour supprimer une section de progression
function deleteProgressSection(section) {
    const sectionTitle = section.querySelector('.section-title').value;
    localStorage.removeItem(sectionTitle); // Supprimer les données associées à cette section
    section.remove();
}

// Fonction pour ajouter une nouvelle section de progression
function addProgressSection() {
    const progressSections = document.getElementById('progressSections');
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'progress-section';

    const sectionTitle = document.createElement('input');
    sectionTitle.type = 'text';
    sectionTitle.className = 'section-title';
    sectionTitle.placeholder = 'Titre de la section';

    const taskContainer = document.createElement('div');
    taskContainer.className = 'task-container';

    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progress-bar-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const deleteSectionBtn = document.createElement('button');
    deleteSectionBtn.className = 'delete-section-btn';
    deleteSectionBtn.textContent = '×';
    deleteSectionBtn.onclick = () => deleteProgressSection(sectionDiv);

    progressBarContainer.appendChild(progressBar);
    sectionDiv.appendChild(sectionTitle);
    sectionDiv.appendChild(taskContainer);
    sectionDiv.appendChild(progressBarContainer);
    sectionDiv.appendChild(deleteSectionBtn);

    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Ajouter une tâche';
    addTaskButton.style.marginTop = '10px';
    addTaskButton.style.backgroundColor = '#007bff';
    addTaskButton.style.color = 'white';
    addTaskButton.style.border = 'none';
    addTaskButton.style.borderRadius = '4px';
    addTaskButton.style.padding = '10px 20px';
    addTaskButton.style.cursor = 'pointer';
    addTaskButton.style.transition = 'background-color 0.3s';
    addTaskButton.onmouseover = function() {
        addTaskButton.style.backgroundColor = '#0056b3';
    };
    addTaskButton.onmouseout = function() {
        addTaskButton.style.backgroundColor = '#007bff';
    };
    addTaskButton.onclick = () => addTask(sectionDiv);

    sectionDiv.appendChild(addTaskButton);
    progressSections.appendChild(sectionDiv);
}

// Fonction pour créer une section de progression à partir des données sauvegardées
function addProgressSectionFromStorage(sectionData, container) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'progress-section';

    const sectionTitle = document.createElement('input');
    sectionTitle.type = 'text';
    sectionTitle.className = 'section-title';
    sectionTitle.value = sectionData.title; // Utiliser le titre récupéré depuis le stockage
    sectionTitle.placeholder = 'Titre de la section';

    const taskContainer = document.createElement('div');
    taskContainer.className = 'task-container';

    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progress-bar-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = sectionData.progress + '%'; // Définir la largeur de la barre de progression

    const deleteSectionBtn = document.createElement('button');
    deleteSectionBtn.className = 'delete-section-btn';
    deleteSectionBtn.textContent = '×';
    deleteSectionBtn.onclick = () => deleteProgressSection(sectionDiv);

    progressBarContainer.appendChild(progressBar);
    sectionDiv.appendChild(sectionTitle);
    sectionDiv.appendChild(taskContainer);
    sectionDiv.appendChild(progressBarContainer);
    sectionDiv.appendChild(deleteSectionBtn);

    sectionData.tasks.forEach(taskData => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = taskData.completed;

        const checkboxLabel = document.createElement('label');

        const textBox = document.createElement('input');
        textBox.type = 'text';
        textBox.value = taskData.task;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.onclick = () => {
            taskDiv.remove();
            updateProgress(sectionDiv);
        };

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(checkboxLabel);
        taskDiv.appendChild(textBox);
        taskDiv.appendChild(deleteButton);
        taskContainer.appendChild(taskDiv);

        checkbox.onchange = () => updateProgress(sectionDiv); // Réattacher l'événement onchange
   
        sectionDiv.appendChild(addTaskButton);
        container.appendChild(sectionDiv);
    }