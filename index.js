// let allTodoList = [{id: '6.82684', todoName: 'My First Todo List'}, {id: '6.82685', todoName: "It's Working!"}];
let allTodoList = [];
let recycleBinList = [];
let reStoredTodoList = []
const submitButton = document.getElementById('submitButton');
let updateButton = document.querySelector('#submitButton');
let reStoreButton = document.querySelector('#reStoreButton');
let updateCancleButtonId = document.querySelector('#updateCancleButtonId');
let restoreButton = document.querySelector('#reStoreButton');
let restoreConfirmBox = document.querySelector('#confirm');
let restoreYesConfirmBox = document.querySelector('#yes');
let restoreNoConfirmBox = document.querySelector('#no');

let checkUpdateId = 0;
let todoNameInputField = document.querySelector('#todoName');
todoNameInputField.focus();

const submitHandler = (event) =>{
    event.preventDefault();
    let todoName = document.querySelector('#todoName').value;
    if(todoName.trim().length == 0){
        todoNameInputField.style.border = '2px solid red';
        return;
    }
    if(checkUpdateId !== 0) {
        allTodoList.splice(allTodoList.findIndex(a => (a.id == checkUpdateId) ? a.todoName = todoName : ""), 0);
        localStorage.setItem("allTodoList", JSON.stringify(allTodoList));
        setTodoList(allTodoList);
        updateButton.innerHTML = 'Add';
        updateCancleButtonId.className = 'displayNone';
        restoreButton.className = 'displayFlex';
        checkUpdateId = 0;
        document.querySelector('#todoName').value = ""; 
        return;
    };
    let todoList = {id: (Math.random() * 10).toFixed(5).toString(), todoName: todoName};
    allTodoList = [todoList, ...allTodoList];  
    localStorage.setItem("allTodoList", JSON.stringify(allTodoList));
    setTodoList(allTodoList);
    todoNameInputField.style.border = '2px solid black';
    document.querySelector('#todoName').value = "";
}

const deleteHandler = (elementId, todoId) =>{
    let deletedTodoList = allTodoList.splice(allTodoList.findIndex(a => a.id == todoId), 1);
    // remove specific div has different id 
    let id = document.getElementById(`${elementId}`);
    id.remove();
    localStorage.setItem("allTodoList", JSON.stringify(allTodoList));
    recycleBinList = [deletedTodoList, ...recycleBinList];
    localStorage.setItem("recycleBinTodoList", JSON.stringify(recycleBinList));
}

const editTodoList = (elementId, todoId) => {
    let elemId = document.getElementById(elementId);
    let selectedListValue = elemId.childNodes[0].innerHTML;
    document.querySelector('#todoName').value = selectedListValue;
    if (allTodoList.length !== 0){
        allTodoList.map((elem, index) => {
            if(document.getElementById(index)){
                document.getElementById(index).firstChild.className = "";
            }
        });
    }
    elemId.firstChild.className = 'textDexorationLineThrough';
    todoNameInputField.focus();
    updateButton.innerHTML = 'Update';
    restoreButton.className = 'displayNone';
    updateCancleButtonId.className = 'displayFlex';
    checkUpdateId = todoId;
}

const updateCancelHandler = () =>{
    document.querySelector('#todoName').value = "";
    updateCancleButtonId.className = 'displayNone';
    restoreButton.className = 'displayFlex';
    updateButton.innerHTML = 'Add';
    setTodoList(allTodoList);
    checkUpdateId = 0;
}

const getdataFromLocalStorage = () =>{
    allTodoList = JSON.parse(localStorage.getItem('allTodoList'));
    (allTodoList == null ? allTodoList = [] : "")
    if(allTodoList !== null && allTodoList.length !== 0){
        allTodoList = JSON.parse(localStorage.getItem('allTodoList'));
    }
    setTodoList(allTodoList);
}

const reStoteTodoListHandler = (event) => {
    event.preventDefault();
    restoreConfirmBox.className='displayFlex';
}

const restoreYesButton = () =>{
    reStoredTodoList = JSON.parse(localStorage.getItem('recycleBinTodoList'));
    (reStoredTodoList == null ? reStoredTodoList = [] : '');
    if(reStoredTodoList.length !== 0){
        reStoredTodoList = reStoredTodoList.reduce(function(prev, next){
            return prev.concat(next);
        });
        allTodoList = [...allTodoList, ...reStoredTodoList];
        localStorage.removeItem('recycleBinTodoList');
        recycleBinList.splice(0, recycleBinList.length);
        localStorage.setItem('allTodoList', JSON.stringify(allTodoList));
        setTodoList(allTodoList);
    }
    restoreConfirmBox.className='displayNone';
}
const restoreNoButton = () =>{
    restoreConfirmBox.className='displayNone';
}

const setTodoList = (todoName) => {
    let container = document.querySelector('.container');
    if (todoName !== null && todoName.length !== 0){
        todoName.map((elem, index) => {
            if(document.getElementById(index)){
                document.getElementById(index).remove();
            }
        });
        todoName.map((todoItem, index) =>{
            let div = document.createElement('div');
            div.className = 'list-container';
            div.id = index; // create and assign different id to every div
            div.innerHTML = `<label>${todoItem.todoName}</label>
            <button class='right-shift' onclick='editTodoList(${div.id}, ${todoItem.id})'><i class="fa-solid fa-pen-to-square fa-lg aria-hidden="true" title='Edit' "></i></button>
            <button class='right-shift' onclick='deleteHandler(${div.id}, ${todoItem.id})'><i class="fa-solid fa-trash-can fa-lg aria-hidden="true" title='Delete' "></i></button>`;
            container.appendChild(div);
        })
    }
}

submitButton.addEventListener('click', submitHandler);
reStoreButton.addEventListener('click', reStoteTodoListHandler);
restoreYesConfirmBox.addEventListener('click', restoreYesButton);
restoreNoConfirmBox.addEventListener('click', restoreNoButton);
getdataFromLocalStorage();