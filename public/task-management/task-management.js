function fetchTaskData() {
    return new Promise((resolve, reject) => {  
        fetch('/getTaskInfo', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            })
            .then(response => {
                if (!response.ok) {  
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })   
            .then(data => {
                resolve(data); // Resolve with the fetched data
            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    });
} 


fetchTaskData()
.then(data => {  
    // adding some delay to ensure jquery is fully loaded 
    setTimeout(function() {

        //the table
        var table = $('#example').DataTable(); 
        table.destroy();

        data.forEach(item => {
            // Splitting the duedate string
            const date = item.duedate.substring(0, 10); // Extract date part
            const time = item.duedate.substring(11, 19); // Extract time part

            const row = `<tr> 
                <td><a href="#" class="table-link" onclick='showTaskDetails(${JSON.stringify(item.taskName)},${JSON.stringify(item.fieldID)},${JSON.stringify(item.fieldName)},${JSON.stringify(date)},${JSON.stringify(item.taskStatusID)},${JSON.stringify(item.taskStatus)},${JSON.stringify(item.assignee)})'>${item.taskName}</a></td>  
                <td>${item.fieldName}</td>
                <td>${date} ${time}</td> <!-- Combine date and time -->
                <td>${item.taskStatus}</td> 
                <td>${item.assignee}</td> 
            </tr>`;

            // Add the row to the table
            table.row.add($(row).get(0));
        }); 
        // Redraw the table  
        table.draw();
    }, 100);
}) 
.catch(error => {
    console.error('Error fetching task data:', error);
});

function showTaskDetails(taskName,fieldID,association,dueDate,statusID,status,assignee) {
    openPopupTask();

    document.getElementById('taskN').innerText = taskName;

    var assoSelect = document.getElementById('asso');
    var option = assoSelect.options[0];
    option.value = fieldID;
    option.innerText = association;

    document.getElementById('dDate').value = dueDate;

    var assoSelect = document.getElementById('stat');
    var option = assoSelect.options[0];
    option.value = statusID;
    option.innerText = status;

    document.getElementById('assig').value = assignee;
}

function openPopupTask() {  
    document.getElementById('popupTask').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; 
}

function closePopupTask() {
    document.getElementById('popupTask').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}


function newPage(name) {
    console.log(name);
}

document.getElementsByClassName("add-task-btn")[0].addEventListener('click', function() {
    console.log('clicked');
    openPopup()
}); 

function openPopup() {  
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; 
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// submit form
document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Fetch form inputs
    const task = document.getElementById('task').value.trim();
    const association = document.getElementById('association').value.trim();
    const dueDate = document.getElementById('dueDate').value.trim();
    const status = document.getElementById('status').value.trim();
    const assignee = document.getElementById('assignee').value.trim();

    // Validate required fields
    if (!task || !association || !dueDate || !status || !assignee) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }

    // Declare userID variable
    let userID;

    fetchUserID()
    .then(data => { 
        // Extract userID from the data
        userID = data[0].userID; // Assuming userID is the key in the response data
        
        // Submit the form data to the API 
        return fetch('/submit_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },  
            body: JSON.stringify({task, association, dueDate, status, assignee, userID})
        });
    })
    .then(response => {
        if (response.ok) { 
            // Form submitted successfully 
            alert('Form submitted successfully!');
        } else {
            throw new Error('Error submitting form.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the form. Please try again.');
    }); 

});


function fetchUserID() {
    return new Promise((resolve, reject) => {  
        fetch('/getUserID', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            })
            .then(response => {
                if (!response.ok) {  
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })   
            .then(data => {
                console.log(data);
                resolve(data); // Resolve with the fetched data
            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    });
} 

function fetchFieldNames2() {
    return new Promise((resolve, reject) => {  
        fetch('/getFieldNames', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            })
            .then(response => {
                if (!response.ok) {  
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })   
            .then(data => {
                resolve(data); // Resolve with the fetched data
            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    });
} 

fetchFieldNames2()
.then(data => { 
    // Clear existing options
    $('#association').empty();

    // Add a default option
    $('#association').append($('<option>', {
        value: '',
        text: 'Select a field'
    }));

    // Map data and create options
    data.forEach(item => {
        // Decide which attributes to use for value and display text
        const value = item.fieldID;
        const text = item.fieldName;
        
        // Create the option element
        const option = $('<option>', {
            value: value,
            text: text
        });

        // Append the option to the select element
        $('#association').append(option);
    });
}) 
.catch(error => {
    console.error('Error fetching data:', error);
});

// Clearing form data starts here ------------------------------
function clearTaskFormData(){
    // Remove the 'required' attribute from all required fields
    document.querySelectorAll('#taskForm [required]').forEach(field => {
        field.removeAttribute('required');
    });

    // Reset the form
    document.getElementById("taskForm").reset();

    // Add back the 'required' attribute to required fields
    document.querySelectorAll('#taskForm [data-required]').forEach(field => {
        field.setAttribute('required', 'required');
    });
}

function clearTaskButtonEventListener(){
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.addEventListener('click', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Clear the form data
        clearTaskFormData();
    });
}

function fetchFieldNames3() {
    return new Promise((resolve, reject) => {  
        fetch('/getFieldNames', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            })
            .then(response => {
                if (!response.ok) {  
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })   
            .then(data => {
                resolve(data); // Resolve with the fetched data
            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    });
} 

fetchFieldNames3()
.then(data => { 

    // Map data and create options
    data.forEach(item => {
        // Decide which attributes to use for value and display text
        const value = item.fieldID;
        const text = item.fieldName;
        
        // Create the option element
        const option = $('<option>', {
            value: value,
            text: text
        });

        // Append the option to the select element
        $('#asso').append(option);
    });
}) 
.catch(error => {
    console.error('Error fetching data:', error);
});

document.getElementById('taskFormDetails').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const taskName = document.getElementById('taskN').innerText;
    const association = document.getElementById('asso').value.trim();
    const dueDate = document.getElementById('dDate').value.trim();
    const status = document.getElementById('stat').value.trim();
    const assignee = document.getElementById('assig').value.trim();

    console.log(taskName,", ",association,", ",dueDate,", ",status,", ",assignee)

    const formData = { taskName, association, dueDate, status, assignee };

    const isDeleteButtonClicked = event.submitter.id === 'clearBtn';

    if (isDeleteButtonClicked) {
        deleteTask(taskName);
    } else {
        fetch('/updateTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                alert('Task details updated successfully!');
            } else {
                throw new Error('Error updating task details.');
            }
        })
        .catch(error => {
            console.error('Error updating task details:', error);
            alert('An error occurred while updating task details. Please try again.');
        });
    }
});

function deleteTask(taskName) {
    fetch('/deleteTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskName }),
    })
    .then(response => {
        if (response.ok) {
            alert('Task details deleted successfully!');
        } else {
            throw new Error('Error deleting task details.');
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}

// Clearing form data ends here ------------------------------

clearTaskButtonEventListener();