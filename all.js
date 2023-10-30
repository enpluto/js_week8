import { token, nickname } from "./src/modules/login.js";
const apiUrl = "https://todoo.5xcamp.us";

// init todos
const todoList = document.querySelector("#todoList");
const todoStyle =
  "flex items-center border-b-lightGrey border-b-[1px] py-4 justify-between";
const check =
  '<li><input type="checkbox" class="w-5 h-5 mr-4" id="checkbox"/></li>';
const count = document.querySelector("#count");

// todosArray element: [todo_content, todo_id, if_completed(boolean)]
const todosArray = [];
let renderArray = todosArray;

// 取得todos
function initTodo() {
  axios
    .get(`${apiUrl}/todos`, {
      headers: {
        authorization: token,
      },
    })
    .then(function (response) {
      response.data.todos.map((obj) => {
        let todoUnit = [];
        todoUnit.push(obj.content);
        todoUnit.push(obj.id);
        if (obj["completed_at"] === null) {
          todoUnit.push(false);
        } else {
          todoUnit.push(true);
        }
        todosArray.push(todoUnit);
      });
      renderTodos();
    })
    .catch(function (error) {
      console.log(error);
    });
}
initTodo();

// 渲染
function renderTodos() {
  if (todosArray.length > 0) {
    let createLi = "";
    let countNum = 0;
    todosArray.forEach((item) => {
      if (item[2] === false) {
        countNum++;
      }
    });
    renderArray.forEach((item) => {
      const deleteSvg = `<li class="cursor-pointer"><img src="src/img/delect.svg" class="delete" id="${item[1]}" /></li>`;
      if (item[2] === false) {
        createLi += `
          <ul class="${todoStyle}">
            <ol class="flex">
              <li><input type="checkbox" class="w-5 h-5 mr-4 checkbox" id="${item[1]}"/></li>
              <li id="${item[1]}">${item[0]}</li>
            </ol>
            ${deleteSvg}
          </ul>`;
      } else {
        createLi += `<ul class="${todoStyle}">
         <ol class="flex">
         <li><img class="w-5 h-5 mr-4 checkSvg" src="src/img/check.svg" id="${item[1]}"></li>
         <li class="text-grey line-through checkbox" id="${item[1]}">${item[0]}</li></ol>${deleteSvg}
       </ul>`;
      }
    });
    document.querySelector("#empty").classList = "mt-[60px] hidden";
    document.querySelector("#listCard").classList =
      "mt-4 bg-white rounded-[10px] text-sm block box-shadow";
    todoList.innerHTML = createLi;
    count.innerHTML = `${countNum}個待完成項目`;
  } else {
    document.querySelector("#listCard").classList =
      "mt-4 bg-white rounded-[10px] text-sm hidden";
    document.querySelector("#empty").classList = "mt-[60px] block";
  }
  document.querySelector("#nickname").textContent = `${nickname}的待辦`;
}

// 新增todos
const submit = document.querySelector("#submit");
const addList = document.querySelector("#addList");

submit.addEventListener("click", (e) => {
  if (addList.value === "") {
    alert("請確實輸入待辦事項");
    return;
  }
  addTodos();
});

function addTodos() {
  axios
    .post(
      `${apiUrl}/todos`,
      {
        todo: {
          content: addList.value,
        },
      },
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then(function (response) {
      let newTodo = [];
      newTodo.push(response.data.content);
      newTodo.push(response.data.id);
      newTodo.push(false);
      todosArray.unshift(newTodo);
      renderArray = todosArray;
      renderTodos();
      selectAll();
      addList.value = "";
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 監聽todo變更
let todoId = "";
todoList.addEventListener("click", (e) => {
  const target = e.target;

  // 刪除todo
  if (target.classList.contains("delete")) {
    todoId = target.id;
    deleteTodo(todoId);
  }
  // 勾選完成
  if (
    target.classList.contains("checkSvg") ||
    target.classList.contains("checkbox")
  ) {
    todoId = target.id;
    patchTodo();
  }
});

function deleteTodo(todoId) {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `${apiUrl}/todos/${todoId}`,
        {
          headers: {
            authorization: token,
          },
        },
        {
          todo: {
            id: todoId,
          },
        }
      )
      .then((response) => {
        console.log(response);
        todosArray.forEach((item, index) => {
          if (item[1] === todoId) {
            todosArray.splice(index, 1);
            renderTodos();
            selectAll();
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function patchTodo() {
  axios
    .patch(
      `${apiUrl}/todos/${todoId}/toggle`,
      {},
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((response) => {
      console.log(response);

      todosArray.forEach((item) => {
        if (item[1] === todoId) {
          item[2] = !item[2];
        }
      });
      renderTodos();
      selectAll();
    })
    .catch((error) => {
      console.log(error);
    });
}

// 篩選
const listCard = document.querySelector("#listCard");
const all = document.querySelector("#all");
const pending = document.querySelector("#pending");
const done = document.querySelector("#done");

// 樣式
const selectStyle = "w-1/3 border-b-primary border-b-2 py-4 cursor-pointer";
const defaultStyle =
  "w-1/3 text-grey border-b-lightGrey border-b-2 py-4 cursor-pointer";

listCard.addEventListener("click", (e) => {
  const target = e.target;

  if (target.id === "all") {
    selectAll();
  } else if (target.id === "pending") {
    selectYet();
  } else if (target.id === "done") {
    selectDone();
  }
});

function selectAll() {
  all.classList = selectStyle;
  pending.classList = defaultStyle;
  done.classList = defaultStyle;

  renderArray = todosArray;
  renderTodos();
}

function selectYet() {
  all.classList = defaultStyle;
  pending.classList = selectStyle;
  done.classList = defaultStyle;

  renderArray = todosArray.filter((item) => item[2] === false);
  renderTodos();
}

function selectDone() {
  all.classList = defaultStyle;
  pending.classList = defaultStyle;
  done.classList = selectStyle;

  renderArray = todosArray.filter((item) => item[2] === true);
  renderTodos();
}

const delectDone = document.querySelector("#delectDone");
delectDone.addEventListener("click", (e) => {
  let deletePromises = renderArray.map((item) => {
    const todoId = item[1];
    if (item[2] === true) {
      return deleteTodo(todoId);
    } else {
      return Promise.resolve();
    }
  });

  Promise.all(deletePromises)
    .then(() => {
      console.log("all done");
    })
    .catch((error) => {
      console.error("error");
    });
});
