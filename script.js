let store = {
    _state: [
        // {task: "task1", id: "noP6Z"},
        // {task: "task2", id: "4a75q"},
        // {task: "task3", id: "L2tou"}
    ],
    newTask: "",
    getState () {
        return this._state;
    },
    setState (state) {
        return this._state = state;
    },
    getTasksFromLocalStorage() { 
        // reading
        store._state = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
    },
    setLocalStorage() {
        // recording
        localStorage.tasks = JSON.stringify(store.getState());
    },
    generateTaskId () {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < 5; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    updateNewTask() {
        store.newTask = this.value;
    },
    addTask () {
        if (this.newTask.length != 0) {
            return {...store, _state: [...store._state, {task: this.newTask, id: this.generateTaskId()}]}
        }
    },
    deleteTask (id) {
        for (let i = 0; i < store.getState().length; i++) {
            if (store.getState()[i].id == id) {
                let result = {...store, _state: [...store._state]};
                result.getState().splice(i, 1);
                return result;
            }
        }
    }
}

//render
const root = document.querySelector('.root')
const reRender = () => {
    for (let task of document.querySelectorAll('.task_block')) {
        task.remove();
    }
    store.getTasksFromLocalStorage();
    for (let task of store.getState()) {
        root.insertAdjacentHTML("beforeend", 
        `<div class="task_block" id=${task.id}>
            <p class="task">${task.task}</p>
            <div data-id=${task.id} class="del_icon">
                <div id="line2"></div>
                <div id="line1"></div>
        </div>`);
    }
    addDellEventToButton()
}
reRender();

//updateNewTask function
let input = document.querySelector('input');
input.addEventListener("keyup", store.updateNewTask);
input.addEventListener("keyup", (e)=>{
    if (e.code === "Enter" ) {
        addTask();
    }
});

//addTask function
let button = document.querySelector('button');
function addTask () {
    store.setState(store.addTask().getState());
    store.setLocalStorage();
    reRender();
    let addedTask = document.querySelector('.task_block:last-child');
    addedTask.classList.add('added_task');
    input.value = "";
}
button.addEventListener("click", addTask);

//deleteTask function
function addDellEventToButton() {
    let delButtons = document.querySelectorAll('.del_icon');
    for (let delButton of delButtons) {
        let id = delButton.getAttribute('data-id');        
        delButton.addEventListener('click', () => {
            setTimeout(() => {
                store.setState(store.deleteTask(id).getState());
                store.setLocalStorage();
                reRender();
            }, 400);
            for (let task of document.querySelectorAll('.task_block')) {
                if (id === task.id) {
                    task.classList.add('deleted_task');
                }
            }
        })
    }
}