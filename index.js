console.log('JS loaded');

function addButton(button){
    
    let taskList = document.querySelector("li.task-list");

    let newButton = document.createElement("button");

    newButton.classList.add("my-Button")

    newButton.addEventListener("click",delateTask); 

    taskList.appendChild(newButton);

}

function toSmallDate(date) {
    let smallDate = new Date(date);
    return smallDate.toLocaleString("es-mx", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
}


function App() {

    let taskList = [];

    let catList = [];

    let filteredTasks;

    let filteredCat;

    let taskListElement;

    let filter;


    function init(){

        taskList = [];

        if (localStorage.getItem("task-list") != null){
            taskList = JSON.parse(localStorage.getItem("task-list"));

        }

        filteredTasks = taskList;

        filter = "";

        taskListElement = document.getElementById("task-list");
        let addTaskForm = document.getElementById("add-task");
        addTaskForm.addEventListener("submit", handleSubmit);

        let filterInput = document.getElementById("filter-task");

        filterInput.oninput = handleFilter;

        render();
    }

    init();



    function handleSubmit(event){

        event.preventDefault();
        
        let form = event.target;
        
        let input = form.querySelector(".tarea");

        let inputcategory = form.querySelector(".category");

        let taskText = input.value;

        let inputText = inputcategory.value;
    
        addTask(taskText, inputText);
    
        input.value = "";

        inputcategory = "";


    }

    function addTask(task,category){

        taskList.push({
            text: task,
            done:false,
            dateCreated: Date.now(),
        });
        catList.push({
            text:category,
            done:false,
        });
        saveTasks();
        filterTasks();
        render();
    }

    function saveTasks() {
        localStorage.setItem("task-list", JSON.stringify(taskList));
    }

    function toggleTask(event){

        let parent = event.target.parentNode;


        let el = event.target.parentNode;
    
        el.classList.toggle('-done');
        
    }

    function handleFilter(e) {
        let value = e.target.value;
        filter = value;
        filterTasks();
      }
    
    function delateTask(event){

        let parent = event.target.parentNode;

        let index = parent.dataset.index;

        taskList.splice(index,1);

        saveTasks();
        filterTasks();
        render();
    }

    function filterTasks() {
        filteredTasks = taskList.filter((task) => {
          return task.text.toLowerCase().includes(filter.toLowerCase());
        });
    
        if (!filter) {
          filteredTasks = taskList;
        }
    
        render();
      }

    function filterCat(){
        filteredCat = catList.filter((category) => {
            return category.text.toLowerCase().incdes(filter.toLowerCase());
        });

        if(!filter){
            filteredCat = catList;
        }
    }  
    

    function render(){

        let template = "<ul>";

        for (let i = 0; i < filteredTasks.length; i++) {

            let task = filteredTasks[i];

            let dateCreated = toSmallDate(task.dateCreated);

            let category = filterCat[i];

            

            let className = "task-item";
              if (task.done) {
              className += " -done";
            }

            template =
            template +
            `
            <li class="task-item data-index="$[i]">
            <span class="task-date">${dateCreated}</span>
            <span class="task-text"> ${task.text} </span>
            <span class="category-text"> ${category} </span>
            <button class="task-delete"> ☹ </button>
            </li>`;
        }

        if (filteredTasks.length > 0) {

            template = template + "</ul>";

          } else if (taskList.length === 0) {
            template = `
            <div class="task-empty">
              <p>No tienes ninguna tarea</p>
            </div>
            `;

          } else {
            template = `
            <div class="task-empty">
              <p>No hay tareas que tengan el texto <strong>${filter}</strong></p>
              <p>Intenta con un filtro diferente</strong></p>
            </div>
            `;
          }

    
          taskListElement.innerHTML = template;


         let taskElements = document.querySelectorAll(".task-item");

          for (task of taskElements) 
            {
                task.querySelector(".task-text").addEventListener("click", toggleTask);
                task.querySelector("button").addEventListener("click", delateTask);
            }


    }

    render();
    

    
}

document.addEventListener('DOMContentLoaded', App);