// Function to update the progress of the section
function updateProgress(section) {
    const checkboxes = section.querySelectorAll('.task-checkbox');
    const checked = section.querySelectorAll('.task-checkbox:checked');
    const progressBar = section.querySelector('.progress-bar');

    const progress = (checked.length / checkboxes.length) * 100;
    progressBar.style.width = progress + '%';

    // Save the progress in the browser cache
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
    localStorage.setItem(sectionTitle, JSON.stringify(sectionData)); // Use the section title as the key
}

// Function to add a new task
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
    textBox.value = 'New Task';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
        taskDiv.remove();
        updateProgress(section);
    };

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(checkboxLabel);
    taskDiv.appendChild(textBox);
    taskDiv.appendChild(deleteButton);
    taskContainer.appendChild(taskDiv);
    updateProgress(section); // Update progress when adding a new task
}

// Function to delete a progress section
function deleteProgressSection(section) {
    const sectionTitle = section.querySelector('.section-title').value;
    localStorage.removeItem(sectionTitle); // Remove the associated data for this section
    section.remove();
}

// Function to add a new progress section
function addProgressSection() {
    const progressSections = document.getElementById('progressSections');
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'progress-section';

    const sectionTitle = document.createElement('input');
    sectionTitle.type = 'text';
    sectionTitle.className = 'section-title';
    sectionTitle.placeholder = 'Section Title';

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
    addTaskButton.textContent = 'Add Task';
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

// Function to load data from browser cache when the page loads
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

function addProgressSectionFromStorage(sectionData, container) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'progress-section';

    const sectionTitle = document.createElement('input');
    sectionTitle.type = 'text';
    sectionTitle.className = 'section-title';
    sectionTitle.value = sectionData.title; // Use the retrieved title from storage
    sectionTitle.placeholder = 'Section Title';

    const taskContainer = document.createElement('div');
    taskContainer.className = 'task-container';

    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progress-bar-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = sectionData.progress + '%'; // Set the width of the progress bar

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

        // Ajouter un gestionnaire d'événements onchange pour mettre à jour le progrès
        checkbox.onchange = () => updateProgress(sectionDiv);

        const checkboxLabel = document.createElement('label');

        const textBox = document.createElement('input');
        textBox.type = 'text';
        textBox.value = taskData.task;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            taskDiv.remove();
            updateProgress(sectionDiv);
        };

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(checkboxLabel);
        taskDiv.appendChild(textBox);
        taskDiv.appendChild(deleteButton);
        taskContainer.appendChild(taskDiv);
    });

    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Add Task';
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
    container.appendChild(sectionDiv);
}
