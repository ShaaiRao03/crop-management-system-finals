
// get user name
function fetchUserName() {
    return new Promise((resolve, reject) => {  
        fetch('/getUserName', { 
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

fetchUserName()
.then(data =>{
        const userName = data[0].name;
        console.log(userName);

        const nameElement = document.getElementById('username');
        if (nameElement) { 
            nameElement.textContent = userName;
        } else {
            console.error('fieldStat h2 element not found');
        }
    console.log(data);
})
.catch(error => {
    console.error('Error fetching field data:', error);
});

function newPage(name) {
    console.log(name);
}

//get field data
function fetchFieldNum(){
    return new Promise((resolve, reject) => {  
        fetch('/getFieldNum', { 
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


fetchFieldNum()
.then(data =>{
        const fieldCount = data[0].num_rows;
        console.log(fieldCount);

        const fieldStatElement = document.getElementById('fieldNum');
        if (fieldStatElement) { 
            fieldStatElement.textContent = fieldCount;
        } else {
            console.error('fieldStat h2 element not found');
        }
    console.log(data);
})
.catch(error => {
    console.error('Error fetching field data:', error);
});

//get crop data
function fetchCropNum(){
    return new Promise((resolve, reject) => {  
        fetch('/getCropNum', { 
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

fetchCropNum()
.then(data =>{
        const cropCount = data[0].num_rows;
        console.log(cropCount);

        const cropStatElement = document.getElementById('cropNum');
        if (cropStatElement) { 
            cropStatElement.textContent = cropCount;
        } else {
            console.error('cropStat h2 element not found');
        }
    console.log(data);
})
.catch(error => {
    console.error('Error fetching field data:', error);
});

// get field table data (field name + crop name)
function fetchFieldData() {
    return new Promise((resolve, reject) => {  
        fetch('/getFieldInfo', { 
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

fetchFieldData()
.then(data => { 
    // adding some delay to ensure jquery is fully loaded 
    setTimeout(function() {

        //the table
        var table = $('#example').DataTable(); 
        table.destroy();

        // Map data and create rows 
        data.forEach(item => {
            const row = `<tr> 
                <td>${item.fieldName}</td>  
                <td>${item.cropName}</td>
            </tr>`;

            // Add the row to the table
            table.row.add($(row).get(0));
        }); 
        // Redraw the table  
        table.draw();
    }, 100);
}) 
.catch(error => {
    console.error('Error fetching equipment data:', error);
});

//get tasks in progress
function fetchTasksInProgress(){
    return new Promise((resolve, reject) => {  
        fetch('/getTasksInProgress', { 
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

fetchTasksInProgress()
.then(data =>{
        const tasksInProgressCount = data[0].num_rows;
        console.log(tasksInProgressCount);

        const tasksInProgressStatElement = document.getElementById('tasksInProgress');
        if (tasksInProgressStatElement) { 
            tasksInProgressStatElement.textContent = tasksInProgressCount;
        } else {
            console.error('tasks in progress element not found');
        }
    console.log(data);
})
.catch(error => {
    console.error('Error fetching task in progress data:', error);
});

//get tasks in progress
function fetchTasksCompleted(){
    return new Promise((resolve, reject) => {  
        fetch('/getTasksCompleted', { 
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

fetchTasksCompleted()
.then(data =>{
        const tasksCompletedCount = data[0].num_rows;
        console.log(tasksCompletedCount);

        const tasksCompletedStatElement = document.getElementById('tasksCompleted');
        if (tasksCompletedStatElement) { 
            tasksCompletedStatElement.textContent = tasksCompletedCount;
        } else {
            console.error('tasks completed element not found');
        }
    console.log(data);
})
.catch(error => {
    console.error('Error fetching tasks completed data:', error);
});

function newPage(name) {
    console.log(name);
}