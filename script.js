const addToDo = document.getElementById("add-todo-container");
const list = document.getElementById("todos");
const deleteContainer = document.getElementById("delete-todo-container");
const deleteAllBtn = document.getElementById("delete-all");
const url = "http://localhost:4730/todos/";

// state

let todos = [];

// CRUD

async function createToDo(todo) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(todo),
  });
}

async function readToDos() {
  const response = await fetch(url);
  const data = await response.json();
  todos.push(...data);
}

async function updateToDo(id, update) {
  await fetch(url + id, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(update),
  });
}

async function deleteToDo(id) {
  await fetch(url + id, {
    method: "DELETE",
  });
}

// rendering

function renderToDos() {
  list.innerHTML = "";
  if (todos === undefined || todos.length === 0) {
    // Platzhalter für Liste, falls keine Daten vorhanden sind
    const newLi = document.createElement("li");
    const placeholder = document.createTextNode("Noch keine To-Dos...");
    newLi.appendChild(placeholder);
    list.appendChild(newLi);
  } else {
    // dynamische Erstellung der Liste mit den Daten
    todos.forEach((element) => {
      const newLi = document.createElement("li");
      const text = document.createTextNode(element.description);
      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      newLi.appendChild(text);
      newLi.appendChild(checkbox);
      list.appendChild(newLi);
      if (element.done === true) {
        checkbox.setAttribute("checked", "true");
        newLi.classList.add("linethrough");
      }
    });
  }
}

// events

addToDo.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target[0].value !== "") {
    createToDo({
      description: event.target[0].value,
      done: false,
    });
    todos.push({
      description: event.target[0].value,
      done: false,
      id: todos.length + 1,
    });
    renderToDos();
  } else {
    alert("DU KANNST KEIN LEERES TO-DO HINZUFÜGEN, du Esel! :-)");
  }
});

list.addEventListener("change", (event) => {
  const id = getToDoIdByDescription(event.target.previousSibling.data);
  const index = todos.findIndex((element) => element.id === id);
  if (event.target.checked === true) {
    updateToDo(id, {
      description: event.target.previousSibling.data,
      done: true,
    });
    todos[index].done = true;
    event.target.parentElement.classList.add("linethrough");
  } else {
    updateToDo(id, {
      description: event.target.previousSibling.data,
      done: false,
    });
    todos[index].done = false;
    event.target.parentElement.classList.remove("linethrough");
  }
});

deleteContainer.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = getToDoIdByDescription(event.target[0].value);
  if (id === 0) {
    alert("To-Do nicht vorhanden!");
  } else {
    deleteToDo(id);
    todos = todos.filter((todo) => todo.id !== id);
    renderToDos();
  }
});

deleteAllBtn.addEventListener("click", (event) => {
  todos.forEach((element) => {
    if (element.done === true) {
      deleteToDo(element.id);
    }
  });
  todos = todos.filter((todo) => todo.done === false);
  renderToDos();
});

// helper-function

function getToDoIdByDescription(description) {
  let id = 0;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].description === description) {
      id = todos[i].id;
    }
  }
  return id;
}

// initialization

function init() {
  readToDos().then(() => {
    renderToDos();
  });
}

init();
