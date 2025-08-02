let tasks = [];
let editIndex = null;

const taskInput = document.getElementById("task");
const descInput = document.getElementById("taskDescription");
const priorityInput = document.getElementById("taskPriority");
const statusInput = document.getElementById("taskStatus");
const imageInput = document.getElementById("taskImage");
const saveBtn = document.getElementById("saveTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("search");

if(localStorage.getItem("tasks")){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    showTasks();
}

saveBtn.addEventListener("click", function(e){
    e.preventDefault();

    let title = taskInput.value;
    let description = descInput.value;
    let priority = priorityInput.value;
    let status = statusInput.value;
    let imageFile = imageInput.files[0];

    if(title === "" || description === "" || priority === "Select" || status === "Select"){
        alert("Please fill all fields!");
        return;
    }

    if(imageFile){
        let reader = new FileReader();
        reader.onload = function(){
            addOrEditTask(title, description, priority, status, reader.result);
        }
        reader.readAsDataURL(imageFile);
    }else{
        addOrEditTask(title, description, priority, status, "");
    }
});

function addOrEditTask(title, description, priority, status, image){
    let task = {
        title: title,
        description: description,
        priority: priority,
        status: status,
        image: image
    };

    if(editIndex !== null){
        tasks[editIndex] = task;
        editIndex = null;
    }else{
        tasks.push(task);
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
    clearForm();
}

function showTasks(filter = ""){
    taskList.innerHTML = "";
    for(let i=0; i<tasks.length; i++){
        if(tasks[i].title.toLowerCase().includes(filter.toLowerCase())){
            let div = document.createElement("div");
            div.className = "task-card";
            div.innerHTML = `
                <h3>${tasks[i].title}</h3>
                <p>${tasks[i].description}</p>
                <p><strong>Priority:</strong> ${tasks[i].priority}</p>
                <p><strong>Status:</strong> ${tasks[i].status}</p>
                ${tasks[i].image ? `<img src="${tasks[i].image}" width="100">` : ""}
                <div class="task-actions">
                    <button onclick="editTask(${i})" class="btn btn-add">Edit</button>
                    <button onclick="deleteTask(${i})" class="btn btn-cansel">Delete</button>
                </div>
            `;
            taskList.appendChild(div);
        }
    }
}

function deleteTask(index){
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks(searchInput.value);
}

function editTask(index){
    taskInput.value = tasks[index].title;
    descInput.value = tasks[index].description;
    priorityInput.value = tasks[index].priority;
    statusInput.value = tasks[index].status;
    editIndex = index;
}

function clearForm(){
    taskInput.value = "";
    descInput.value = "";
    priorityInput.value = "Select";
    statusInput.value = "Select";
    imageInput.value = "";
}

searchInput.addEventListener("input", function(){
    showTasks(searchInput.value);
});