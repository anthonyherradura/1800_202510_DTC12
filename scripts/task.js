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
    let userTaskTitle = document.getElementById('taskTitleInput').value;
    let userStartDate = document.getElementById('startDateInput').value;
    let userDueDate = document.getElementById('dueDateInput').value;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("tasks").add({
                taskName: userTaskTitle,
                startDate: userStartDate,
                dueDate: userDueDate,
                userId: user.uid, // To associate task with user
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                window.location.href = "main.html"; // Redirect after saving
            }).catch(error => {
                console.error("Error adding task: ", error);
            });
        } else {
            console.error("User not authenticated.");
        }
    });
}

function displayTask(collection) {
    let taskContainer = document.getElementById("displayTask");
    taskContainer.innerHTML = "";

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection(collection)
                .where("userId", "==", user.uid)
                .orderBy("timestamp", "desc")
                .get()
                .then(allTasks => {
                    allTasks.forEach(doc => {
                        let taskData = doc.data();
                        let taskID = doc.id;

                        let taskDiv = document.createElement("div");
                        taskDiv.id = `task-${taskID}`;
                        taskDiv.innerHTML = `
                            <div class="task">
                                <h4 class="title">${taskData.taskName}</h4>
                                <p><strong>Start:</strong> <span class="start">${taskData.startDate}</span></p>
                                <p><strong>Due:</strong> <span class="due">${taskData.dueDate}</span></p>
                                <button id="delete_button" onclick="deleteTask('${taskID}')">Delete</button>
                            </div>
                        `;

                        taskContainer.appendChild(taskDiv);
                    });
                }).catch(error => {
                    console.error("Error loading tasks: ", error);
                });
        }
    });
}

displayTask("tasks");

function deleteTask(taskID) {
    const taskDiv = document.getElementById(`task-${taskID}`);

    if (taskDiv) {
        db.collection("tasks").doc(taskID).delete().then(() => {
            console.log("Task deleted!");

            taskDiv.remove();
        }).catch(error => {
            console.error("Error deleting task: ", error);
        });
    } else {
        console.error("Task element not found in the DOM.");
    }
}