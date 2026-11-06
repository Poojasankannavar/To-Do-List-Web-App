const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const emptyMessage = document.getElementById("emptyMessage");

// Load saved tasks from Local Storage.
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;

    totalCount.textContent = tasks.length;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task-item";
        if (task.completed) li.classList.add("completed");

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const completeBtn = document.createElement("button");
        completeBtn.type = "button";
        completeBtn.className = "complete-btn";
        completeBtn.textContent = task.completed ? "Undo" : "Complete";
        completeBtn.setAttribute("aria-label", `${task.completed ? "Undo" : "Complete"} ${task.text}`);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("aria-label", `Delete ${task.text}`);

        li.append(span, completeBtn, deleteBtn);
        taskList.appendChild(li);
    });

    updateStats();
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (!taskText) {
        alert("Please enter a task!");
        taskInput.focus();
        return;
    }

    tasks.push({ text: taskText, completed: false });
    taskInput.value = "";
    saveTasks();
    displayTasks();
    taskInput.focus();
}

// Event delegation: one listener handles buttons in every task row.
taskList.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    const taskItem = button.closest(".task-item");
    if (!taskItem) return;

    const index = Array.from(taskList.children).indexOf(taskItem);
    if (index < 0) return;

    if (button.classList.contains("complete-btn")) {
        tasks[index].completed = !tasks[index].completed;
    } else if (button.classList.contains("delete-btn")) {
        tasks.splice(index, 1);
    } else {
        return;
    }

    saveTasks();
    displayTasks();
});

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") addTask();
});

// Initial render.
displayTasks();
