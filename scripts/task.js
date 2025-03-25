var currentUser

function populateUserTask() {
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            window.location.href = "login.html"; // Redirect to login
        } else {
            currentUser = db.collection("users").doc(user.uid);

            currentUser.get().then(userDoc => {
                if (userDoc.exists) {
                    let userTaskTitle = userDoc.data().taskName;
                    let userStartDate = userDoc.data().startDate;
                    let userDueDate = userDoc.data().dueDate;

                    if (userTaskTitle) {
                        document.getElementById("taskTitleInput").value = userTaskTitle;
                    }
                    if (userStartDate) {
                        document.getElementById("startDateInput").value = userStartDate;
                    }
                    if (userDueDate) {
                        document.getElementById("dueDateInput").value = userDueDate;
                    }
                }
            }).catch(error => {
                console.error("Error fetching user data: ", error);
            });
        }
    });
}

//call the function to run it 
populateUserTask();

function editUserTask() {
    //Enable the form fields
    document.getElementById('personalInfoFields').removeAttribute('disabled');
}

function saveUserTask() {
    if (!currentUser) {
        console.error("Error: currentUser is undefined. Make sure the user is logged in.");
        return;
    }

    userTaskTitle = document.getElementById('taskTitleInput').value;
    userStartDate = document.getElementById('startDateInput').value;
    userDueDate = document.getElementById('dueDateInput').value;
    currentUser.update({
        taskName: userTaskTitle,
        startDate: userStartDate,
        dueDate: userDueDate
    })
        .then(() => {
            alert("Document successfully updated!");
        })
        .catch(error => {
            console.error("Error updating task: ", error);
        });
}

function displayTask(collection) {
    let taskContainer = document.getElementById("displayTask");
    taskContainer.innerHTML = "";

    db.collection(collection).get().then(allTasks => {
        allTasks.forEach(doc => {
            let taskData = doc.data();
            let taskID = doc.id;

            let taskDiv = document.createElement("div");
            taskDiv.classList.add("task");
            taskDiv.innerHTML = `
                <h4 class="title">${taskData.taskName}</h4>
                <p><strong>Start:</strong> <span class="start">${taskData.startDate}</span></p>
                <p><strong>Due:</strong> <span class="due">${taskData.dueDate}</span></p>
                <button onclick="deleteTask('${taskID}')">Delete</button>
            `;

            taskContainer.appendChild(taskDiv);
        });
    }).catch(error => {
        console.error("Error loading tasks: ", error);
    });
}

function deleteTask(taskID) {
    db.collection("tasks").doc(taskID).delete().then(() => {
        console.log("Task deleted!");
        displayTask("tasks"); // Refresh task list
    }).catch(error => {
        console.error("Error deleting task: ", error);
    });
}

displayTask("tasks");