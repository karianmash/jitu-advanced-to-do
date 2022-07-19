window.onload = loadTodos;

const titleElement = document.getElementById("title");
const descriptionElement = document.getElementById("description");
const dateElement = document.getElementById("date");
const submitBtn = document.getElementById("submit");

// Todo status
// const firstChild = document.getElementById("all-todos");
// firstChild.addEventListener("click", filterTodos);
// const secondChild = document.getElementById("completed-todos");

// secondChild.addEventListener("click", filterTodos);
// const thirdChild = document.getElementById("uncompleted-todos");
// thirdChild.addEventListener("click", filterTodos);

// Todos container
const listTodos = document.querySelector(".list-todos");

submitBtn.addEventListener("click", addTodo);

function addTodo(e) {
  e.preventDefault();
  if (
    (titleElement.value === "") |
    (descriptionElement.value === "") |
    (dateElement.value === "")
  ) {
    alert("Please fill all form inputs!");
  } else {
    // Create todo
    createTodo(
      titleElement.value,
      descriptionElement.value,
      dateElement.value,
      false
    );
  }
}

// Create todo
function createTodo(title, description, date, completed) {
  // Create html elements
  const todo = listTodos.appendChild(document.createElement("div"));
  const doneBtn = todo.appendChild(document.createElement("i"));
  const todoDetails = todo.appendChild(document.createElement("div"));
  const todoTitle = todoDetails.appendChild(document.createElement("h4"));
  const todoDescription = todoDetails.appendChild(document.createElement("p"));
  const todoDate = todoDetails.appendChild(document.createElement("p"));
  const deleteBtn = todo.appendChild(document.createElement("i"));

  // Add css classes to html elements
  todo.className = "todo";
  doneBtn.className = "fas fa-check";
  todoDetails.className = "todo-details";
  deleteBtn.className = "fas fa-trash-alt";

  let todoId = title.replace(/\s/g, "");

  todo.setAttribute("id", `${todoId}`);

  // Insert todo values to html
  todoTitle.innerHTML = title;
  todoDescription.innerHTML = description;
  todoDate.innerHTML = date;

  storeTodo(todoId, title, description, date, completed);
  // Clear form inputs
  titleElement.value = "";
  descriptionElement.value = "";
  dateElement.value = "";

  // Delete todo
  deleteBtn.addEventListener("click", deleteTask);
  function deleteTask(e) {
    // Remove from localstorage
    deleteTodo(todoId);
    e.target.parentElement.remove();
  }

  // Mark complete
  doneBtn.addEventListener("click", checkBtn);
  function checkBtn(e) {
    if (
      e.target.nextSibling.firstElementChild.style.textDecoration ==
        "line-through" ||
      e.target.nextSibling.firstElementChild.nextSibling.style.textDecoration ==
        "line-through" ||
      e.target.nextSibling.lastElementChild.style.textDecoration ==
        "line-through"
    ) {
      e.target.nextSibling.firstElementChild.style.textDecoration = "none";
      e.target.nextSibling.firstElementChild.nextSibling.style.textDecoration =
        "none";
      e.target.nextSibling.lastElementChild.style.textDecoration = "none";

      let completed = false;

      updateTodo(todoId, completed);

      // storeTodo(todoId, title, description, date, false);
    } else {
      e.target.nextSibling.firstElementChild.style.textDecoration =
        "line-through";
      e.target.nextSibling.firstElementChild.nextSibling.style.textDecoration =
        "line-through";
      e.target.nextSibling.lastElementChild.style.textDecoration =
        "line-through";

      let completed = true;

      updateTodo(todoId, completed);

      // storeTodo(todoId, title, description, date, true);
    }
  }
  // Filter todos
  function filterTodos() {}
}

// Store todo from localstorage
function storeTodo(id, title, description, date, completed) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  if (todos.length === 0) {
    // alert("no todos");
    let todo = {
      todoId: id,
      todoTitle: title,
      todoDescription: description,
      todoDate: date,
      completed,
    };
    todos.push(todo);
    //   Add to local storage
    localStorage.setItem("todos", JSON.stringify(todos));
    return true;
  } else {
    todos.forEach(function (task) {
      // alert(task.todoId);
      if (task.todoId === id) {
        return;
      } else {
        let todo = {
          todoId: id,
          todoTitle: title,
          todoDescription: description,
          todoDate: date,
          completed,
        };
        todos.push(todo);
        //   Add to local storage
        localStorage.setItem("todos", JSON.stringify(todos));
        return true;
      }
    });
  }
}

// Load todo from from localstorage if there's any
function loadTodos() {
  let todos = JSON.parse(localStorage.getItem("todos"));
  if (!todos) {
    alert("No todos in localStorage!");
    // return;
  } else {
    todos.forEach(function (task) {
      const todo = listTodos.appendChild(document.createElement("div"));
      const doneBtn = todo.appendChild(document.createElement("i"));
      const todoDetails = todo.appendChild(document.createElement("div"));
      const todoTitle = todoDetails.appendChild(document.createElement("h4"));
      const todoDescription = todoDetails.appendChild(
        document.createElement("p")
      );
      const todoDate = todoDetails.appendChild(document.createElement("p"));
      const deleteBtn = todo.appendChild(document.createElement("i"));

      // Add css classes to html elements
      todo.className = "todo";
      doneBtn.className = "fas fa-check";
      todoDetails.className = "todo-details";
      deleteBtn.className = "fas fa-trash-alt";

      // Insert todo values to html
      todoTitle.innerHTML = task.todoTitle;
      todoDescription.innerHTML = task.todoDescription;
      todoDate.innerHTML = task.todoDate;

      todo.setAttribute("id", `${task.todoId}`);

      if (task.completed === false) {
        todoTitle.style.textDecoration = "none";
        todoDescription.style.textDecoration = "none";
        todoDate.style.textDecoration = "none";
      } else {
        todoTitle.style.textDecoration = "line-through";
        todoDescription.style.textDecoration = "line-through";
        todoDate.style.textDecoration = "line-through";
      }

      // Edit
      todo.addEventListener("click", function (e) {
        let todos = JSON.parse(localStorage.getItem("todos")) || [];

        let id = e.target.id;

        todos.forEach(function (task) {
          // alert(task.todoId);
          if (task.todoId === id) {
            titleElement.value = task.todoTitle;
            descriptionElement.value = task.todoDescription;
            dateElement.value = task.todoDate;
            // alert(task.todoTitle);

            // Remove initial object
            const indexOfObject = todos.findIndex((object) => {
              return object.id === id;
            });
            // alert(indexOfObject);
            todos.splice(indexOfObject, 1);

            //   Add to local storage
            localStorage.setItem("todos", JSON.stringify(todos));
            return true;
          }
        });
        e.target.remove();
      });

      // Delete todo
      deleteBtn.addEventListener("click", deleteTask);
      function deleteTask(e) {
        // Remove from localstorage
        deleteTodo(task.todoId);
        e.target.parentElement.remove();
      }

      // Mark complete
      doneBtn.addEventListener("click", checkBtn);
      function checkBtn(e) {
        if (
          e.target.nextSibling.firstElementChild.style.textDecoration ==
            "line-through" ||
          e.target.nextSibling.firstElementChild.nextSibling.style
            .textDecoration == "line-through" ||
          e.target.nextSibling.lastElementChild.style.textDecoration ==
            "line-through"
        ) {
          e.target.nextSibling.firstElementChild.style.textDecoration = "none";
          e.target.nextSibling.firstElementChild.nextSibling.style.textDecoration =
            "none";
          e.target.nextSibling.lastElementChild.style.textDecoration = "none";

          task.completed = false;

          updateTodo(task.todoId, task.completed);
        } else {
          e.target.nextSibling.firstElementChild.style.textDecoration =
            "line-through";
          e.target.nextSibling.firstElementChild.nextSibling.style.textDecoration =
            "line-through";
          e.target.nextSibling.lastElementChild.style.textDecoration =
            "line-through";

          task.completed = true;

          updateTodo(task.todoId, task.completed);
        }
      }
      return;
    });
  }
}

// Store todo from localstorage
function updateTodo(id, completed) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.forEach(function (task) {
    // alert(task.todoId);
    if (task.todoId === id) {
      task.completed = completed;
      todos.push({ ...task, completed: completed });

      // Remove initial object
      const indexOfObject = todos.findIndex((object) => {
        return object.id === id;
      });
      // alert(indexOfObject);
      todos.splice(indexOfObject, 1);

      //   Add to local storage
      localStorage.setItem("todos", JSON.stringify(todos));
      return true;
    }
  });
}

// Remove from localstorage
function deleteTodo(id) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.forEach(function (task) {
    // alert(task.todoId);
    if (task.todoId === id) {
      // Remove object
      const indexOfObject = todos.findIndex((object) => {
        return object.id === id;
      });
      todos.splice(indexOfObject, 1);
      //   Remove from local storage
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  });
}

// // Filter todos
// function filterTodos(e) {
//   // alert(e.target.innerHTML);
//   let value = e.target.innerHTML;
//   switch (value) {
//     case "All":
//       loadTodos("all");
//       break;

//     case "Completed":
//       loadTodos("completed");
//       break;

//     case "Uncompleted":
//       loadTodos("uncompleted");
//       break;
//   }
// }
