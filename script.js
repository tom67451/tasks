const btnAddNewTask = document.getElementById("open-task-form-btn");
const formWrapper = document.getElementById("div-task-form");
const btnCancel = document.getElementById("btn-cancel");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const btnClearTasks = document.getElementById("clear-tasks-btn");
const addNoteBtn = document.getElementById("add-note-btn");
const noteContainer = document.getElementById("note-container");
const settingsContent = document.getElementById("settings-content");
const btnSettings = document.getElementById("open-settings-btn");
const tasksContent = document.getElementById("tasks-content");
const btnBackToTasks = document.getElementById("back-to-main-btn");
const themeSelect = document.getElementById("theme-select");
const btnCompactMode = document.getElementById("compact-mode-btn");
const completedTasks = document.getElementById("completed-tasks");
const btnSort = document.getElementById("sort-btn");
const openApp = document.getElementById("open-app");
const introductionContent = document.getElementById("introduction-content");
const body = document.getElementById("body");
const btnOpenPomodoroTimer = document.getElementById("open-pomodoro-timer");
const pomodoroTimerContent = document.getElementById("pomodoro-timer-content");

themeSelect.addEventListener("change", (e) => {
  const selectedTheme = e.target.value;
  applyTheme(selectedTheme);
  localStorage.setItem("theme", selectedTheme);
});

const applyTheme = (theme) => {
  document.body.classList.remove("light-mode", "dark-mode", "black-mode");
  document
    .querySelector("nav")
    .classList.remove("light-mode", "dark-mode", "black-mode");
  themeSelect.classList.remove("light-mode", "dark-mode", "black-mode");

  if (theme === "light") {
    document.body.classList.add("light-mode");
    document.querySelector("nav").classList.add("light-mode");
    themeSelect.classList.add("light-mode");
  } else if (theme === "dark") {
    document.body.classList.add("dark-mode");
    document.querySelector("nav").classList.add("dark-mode");
    themeSelect.classList.add("dark-mode");
  } else if (theme === "black") {
    document.body.classList.add("black-mode");
    document.querySelector("nav").classList.add("black-mode");
    themeSelect.classList.add("black-mode");
  }
};
document.getElementById("reset-settings").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

btnSettings.addEventListener("click", () => {
  tasksContent.classList.add("hidden");
  settingsContent.classList.remove("hidden");
});
btnBackToTasks.addEventListener("click", () => {
  tasksContent.classList.remove("hidden");
  settingsContent.classList.add("hidden");
});

let selectedPriority = null;

flatpickr("#due-date", {
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  defaultDate: new Date(),
});

const openTaskForm = () => {
  formWrapper.classList.toggle("hidden");
  if (!formWrapper.classList.contains("hidden")) {
    taskForm.reset();
    document.getElementById("task-title").focus();
  }
};

document.querySelectorAll(".option-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    document
      .querySelectorAll(".option-btn")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    selectedPriority = e.target.dataset.option;
  });
});

addNoteBtn.addEventListener("click", () => {
  noteContainer.classList.toggle("hidden");
  addNoteBtn.textContent = noteContainer.classList.contains("hidden")
    ? "➕ Add Note"
    : "➖ Remove Note";
});

const clear = () => {
  localStorage.clear();
  renderTasks();
  showNotification("All tasks are deleted successfully!", "error");
};

const saveTasksToLocalStorage = (task) => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getTasksFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("tasks")) || [];
};

const showNotification = (message, type = "success") => {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `show ${type}`;
  setTimeout(() => {
    notification.className = "hidden";
  }, 3000);
};

const renderTasks = () => {
  const tasks = getTasksFromLocalStorage();
  taskList.innerHTML = "<h3>Inbox</h3>";
  if (tasks.length === 0) {
    showEmptyDiv();
    return;
  }
  tasks.forEach((task, index) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("shared-task", "task");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "complete-checkbox";

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        moveTaskToCompleted(task, index, taskElement);
      }
    });

    const priorityClass =
      task.priority === "Low"
        ? "priority-low"
        : task.priority === "Medium"
        ? "priority-medium"
        : task.priority === "High"
        ? "priority-high"
        : "";

    taskElement.innerHTML = `
                <div class="task-header">

            <h3>${task.title}</h3>
            <span class="task-date">${task.dueDate || "No date set"}</span>
            <span class="priority-badge ${priorityClass}">${
      task.priority || "Not set"
    }</span>
          </div>
          <p class="task-note">${task.note || ""}</p>
          <div class="task-buttons">
            <button data-index="${index}" class="delete-btn">✖</button>
            <button data-index="${index}" class="edit-btn">✏️</button>
          </div>
        `;
    taskElement.prepend(checkbox);
    taskList.appendChild(taskElement);
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      deleteTask(index);
    });
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      editTask(index);
    });
  });
};

const showEmptyDiv = () => {
  const tasks = getTasksFromLocalStorage();

  if (tasks.length === 0) {
    taskList.innerHTML = `
        <div class="shared-task empty-task">
          <p>You've completed all tasks ツ</p>
        </div>
      `;
  }
};

const deleteTask = (index) => {
  const tasks = getTasksFromLocalStorage();
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  showNotification("Task deleted successfully!", "error");
};

const editTask = (index) => {
  const tasks = getTasksFromLocalStorage();
  const taskToEdit = tasks[index];

  document.getElementById("task-title").value = taskToEdit.title;
  document.getElementById("due-date").value = taskToEdit.dueDate || "";
  document.getElementById("note").value = taskToEdit.note || "";
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.option === taskToEdit.priority) {
      btn.classList.add("active");
    }
  });

  formWrapper.classList.remove("hidden");

  taskForm.onsubmit = (e) => {
    e.preventDefault();
    taskToEdit.title = document.getElementById("task-title").value;
    taskToEdit.dueDate = document.getElementById("due-date").value;
    taskToEdit.note = document.getElementById("note").value;
    taskToEdit.priority =
      document.querySelector(".option-btn.active")?.dataset.option || "";

    tasks[index] = taskToEdit;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    taskForm.reset();
    formWrapper.classList.add("hidden");
    showNotification("Task updated successfully!", "success");

    taskForm.onsubmit = defaultTaskFormHandler;
  };
};
const moveTaskToCompleted = (task, index, taskElement) => {
  const tasks = getTasksFromLocalStorage();
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  completedTasks.appendChild(taskElement);

  const deleteBtn = taskElement.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    completedTasks.removeChild(taskElement);
    showNotification("Task deleted from completed tasks!", "error");
  });
  const moveTaskToMain = (task, taskElement) => {
    completedTasks.removeChild(taskElement);

    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

    showNotification("Task moved back to the main list.");
  };

  const editBtn = taskElement.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    const taskTitle = taskElement.querySelector("h3").textContent;
    const taskNote = taskElement.querySelector(".task-note").textContent;
    const taskDueDate = taskElement.querySelector(".task-date").textContent;

    document.getElementById("task-title").value = taskTitle;
    document.getElementById("due-date").value = taskDueDate || "";
    document.getElementById("note").value = taskNote || "";
    document.querySelectorAll(".option-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    formWrapper.classList.remove("hidden");

    taskForm.onsubmit = (e) => {
      e.preventDefault();
      const updatedTask = {
        title: document.getElementById("task-title").value,
        dueDate: document.getElementById("due-date").value,
        note: document.getElementById("note").value,
        priority: selectedPriority || "Not set",
      };

      saveTasksToLocalStorage(updatedTask);
      renderTasks();
      taskForm.reset();
      formWrapper.classList.add("hidden");
      showNotification(
        "Task updated and moved back to the task list!",
        "success"
      );
    };

    completedTasks.removeChild(taskElement);
  });

  showNotification("Task completed");

  renderTasks();
};

const defaultTaskFormHandler = (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const note = document.getElementById("note").value;
  const dueDate = document.getElementById("due-date").value;

  if (!title) {
    showNotification("⚠️ Task title is required.", "error");
    return;
  }

  const newTask = { title, dueDate, note, priority: selectedPriority };
  saveTasksToLocalStorage(newTask);
  renderTasks();
  taskForm.reset();
  formWrapper.classList.add("hidden");
  showNotification("Task added successfully!", "success");
};
const skipIntroduction = () => {
  hasVisited = localStorage.getItem("hasVisited");
  if (hasVisited) {
    introductionContent.classList.add("hidden");
    tasksContent.classList.remove("hidden");
  }
};

// Event Listeners
taskForm.onsubmit = defaultTaskFormHandler;
btnAddNewTask.addEventListener("click", openTaskForm);
btnCancel.addEventListener("click", () => {
  formWrapper.classList.add("hidden");
  taskForm.reset();
});
btnClearTasks.addEventListener("click", clear);

openApp.addEventListener("click", () => {
  tasksContent.classList.remove("hidden");
  introductionContent.classList.add("hidden");
  body.classList.remove("intr-body");
  localStorage.setItem("hasVisited", "true");
  const savedTheme = localStorage.getItem("theme") || "dark";
  themeSelect.value = savedTheme;
  applyTheme(savedTheme);
});
btnOpenPomodoroTimer.addEventListener(() => {
  tasksContent.classList.add("hidden");
  pomodoroTimerContent.classList.remove("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  skipIntroduction();
});
