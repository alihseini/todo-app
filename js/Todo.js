const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const tableBody = document.querySelector("tbody");
const deleteAllbutton = document.getElementById("delete-all");
const filterButtons = document.querySelectorAll(".filter-button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const showTable = (data) => {
  const todoList = data || todos;
  tableBody.innerHTML = "";
  if (!todoList.length) {
    tableBody.innerHTML = "<tr><td colspan='4'>No Task Found!</td></tr>";
    return;
  }
  todoList.forEach((task) => {
    tableBody.innerHTML += `
      <tr>
        <td>${task.task}</td>
        <td>${task.date || "No Date"}</td>
        <td>${task.completed ? "Completed" : "Pending"}</td>
        <td>
          <button onclick="editing('${task.id}')">Edit</button>
          <button id="done-button" onclick="doneButton('${task.id}')">
          ${task.completed ? "Undo!" : "Done!"}
            </button>
          <button class="delete" onclick="deleteTask('${
            task.id
          }')">Delete</button>
        </td>
      </tr>
    `;
  });
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);
  setTimeout(() => {
    alert.style.display = "none";
  }, 3000);
};

const idGenerating = () => {
  return Math.round(Math.random() * Math.random() * Math.pow(10, 8)).toString();
};

const addTodo = () => {
  const task = todoInput.value;
  const date = dateInput.value;
  const todo = {
    id: idGenerating(),
    task,
    date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    addToLocalStorage();
    showTable();
    showAlert("Task added successfully!", "successful");
    todoInput.value = "";
    dateInput.value = "";
  } else {
    showAlert("Enter your Task!", "fail");
  }
};

const addToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const deleteAll = () => {
  todos = [];
  addToLocalStorage();
  showTable();
  showAlert("All Tasks Deleted Successfully!", "successful");
};

const deleteTask = (id) => {
  const newTodos = todos.filter((task) => id !== task.id);
  todos = newTodos;
  addToLocalStorage();
  showTable();
  showAlert("Task Deleted successfully!", "successful");
};

const doneButton = (id) => {
  const selectedTask = todos.find((task) => task.id === id);
  console.log(selectedTask);
  selectedTask.completed = !selectedTask.completed;
  addToLocalStorage();
  showTable();
  showAlert("Status Changed Successfully", "successful");
};

const editing = (id) => {
  const selectedTask = todos.find((task) => task.id === id);
  todoInput.value = selectedTask.task;
  dateInput.value = selectedTask.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEdit = (event) => {
  const task = todos.find((task) => task.id === event.target.dataset.id);
  console.log(task);
  task.task = todoInput.value;
  task.date = dateInput.value;
  todoInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  addToLocalStorage();
  showTable();
  showAlert("Task Changed successfuly!", "successful");
};

const filtering = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((task) => task.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((task) => task.completed === true);
      break;
    default:
      filteredTodos = todos;
      break;
  }
  showTable(filteredTodos);
};

window.addEventListener("load", () => {
  addButton.addEventListener("click", addTodo);
  filterButtons.forEach((button) => {
    button.addEventListener("click", filtering);
  });
  showTable();
  deleteAllbutton.addEventListener("click", deleteAll);
  editButton.addEventListener("click", applyEdit);
});
