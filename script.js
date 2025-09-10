// tareas con id único para evitar confusiones al filtrar
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// genera id único simple
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  // filtrar según selección
  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  // ordenar
  const sort = document.getElementById("sort").value;
  if (sort === "recent") {
    filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
  } else {
    filteredTasks.sort((a, b) => a.createdAt - b.createdAt);
  }

  // renderizar usando la tarea real (cada tarea tiene id)
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.onclick = () => toggleComplete(task.id);

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => editTask(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text === "") return;

  const newTask = { id: uid(), text, completed: false, createdAt: Date.now() };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  input.value = "";
  input.focus();
}

function editTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return;
  const newText = prompt("Edita tu tarea:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  if (!confirm("¿Eliminar esta tarea?")) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function toggleComplete(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return;
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
  const btn = document.querySelector(`.filters button[onclick="setFilter('${filter}')"]`);
  if (btn) btn.classList.add("active");
  renderTasks();
}

// Enter para agregar
document.getElementById("taskInput").addEventListener("keyup", function(e) {
  if (e.key === "Enter") addTask();
});

// iniciar
renderTasks();