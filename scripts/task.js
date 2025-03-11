var currentUser

function populateUserTask() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userTaskTitle = userDoc.data().taskName;
                    let userStartDate = userDoc.data().startDate;
                    let userDueDate = userDoc.data().dueDate;

                    //if the data fields are not empty, then write them in to the form.
                    if (userTaskTitle != null) {
                        document.getElementById("taskTitleInput").value = userTaskTitle;
                    }
                    if (userStartDate != null) {
                        document.getElementById("startDateInput").value = userStartDate;
                    }
                    if (userDueDate != null) {
                        document.getElementById("dueDateInput").value = userDueDate;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserTask();

function editUserTask() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserTask() {
    userTaskTitle = document.getElementById('taskTitleInput').value;
    userStartDate = document.getElementById('startDateInput').value;
    userDueDate = document.getElementById('dueDateInput').value;
    currentUser.update({
        taskName: userTaskTitle,
        startDate: userStartDate,
        dueDate: userDueDate
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
    document.getElementById('personalInfoFields').disabled = true;
}

function displayTask(collection) {
    let display = document.getElementById("displayTask");
    db.collection(collection).get()
        .then(allTasks => {
            allTasks.forEach(doc => {
                var taskTitle = doc.data().taskName;
                var taskStart = doc.data().startDate;
                var taskDue = doc.data().dueDate;
                var taskID = doc.id;
                let newTask = display.content.cloneNode(true);

                display.querySelector('.title').innerHTML = taskTitle;
                display.querySelector('.start').innerHTML = taskStart;
                display.querySelector('.due').innerHTML = taskDue;
            })
        })
}

displayTask("tasks");