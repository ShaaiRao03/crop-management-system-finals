function fetchNutrientData() {
    return new Promise((resolve, reject) => {  
        fetch('/getMonitoringInfo', { 
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


fetchNutrientData()
.then(data => { 
    // adding some delay to ensure jquery is fully loaded 
    setTimeout(function() {

        //the table
        var table = $('#example').DataTable(); 
        table.destroy();

        // Map data and create rows 
        data.forEach(item => {
            const row = `<tr> 
                <td>${item.field_ID}</td>
                <td>${item.nitrogen_N}</td>
                <td>${item.potassium_K}</td>
                <td>${item.sulphur_S}</td>
                <td>${item.boron_B}</td>
                <td>${item.phosphorus_P}</td>
                <td>${item.magnesium_Mg}</td>
                <td>${item.calcium_Ca}</td>
                <td>${item.copper_Cu}</td>
                <td>${item.date}</td>
            </tr>`;

            // Add the row to the table
            table.row.add($(row).get(0));
        }); 
        // Redraw the table  
        table.draw();
    }, 100);
}) 
.catch(error => {
    console.error('Error fetching monitoring data:', error);
});

 
// function newPage(name) {
//     console.log(name);
// }

document.getElementsByClassName("add-task")[0].addEventListener('click', function() {
    console.log('clicked');
    openPopupN()
}); 


function openPopupN() {
    document.getElementById('popupN').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}
  
  function closePopupN() {
    document.getElementById('popupN').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function displayTable(){
    document.getElementById('table-content').style.display = 'block';
    document.getElementById('visualization-content').style.display = 'none';
    document.getElementById('togglebut').style.display = 'none';
    document.getElementById('chart-container-1').style.display = 'none';
    document.getElementById('chart-container-2').style.display = 'none';
    document.getElementById('tableid').classList.add('highlight');
    document.getElementById('visualid').classList.remove('highlight');
}
function displayVis(){
    document.getElementById('table-content').style.display = 'none';
    document.getElementById('visualization-content').style.display = 'block';
    document.getElementById('togglebut').style.display = 'block';
    document.getElementById('chart-container-1').style.display = 'block';
    document.getElementById('chart-container-2').style.display = 'none';
    document.getElementById('tableid').classList.remove('highlight');
    document.getElementById('visualid').classList.add('highlight');
}
function displayGraph(){
    document.getElementById('table-content').style.display = 'none';
    document.getElementById('visualization-content').style.display = 'block';
    document.getElementById('chart-container-1').style.display = 'block';
    document.getElementById('chart-container-2').style.display = 'none';
}
function displayChart(){
    document.getElementById('table-content').style.display = 'none';
    document.getElementById('visualization-content').style.display = 'block';
    document.getElementById('chart-container-1').style.display = 'none';
    document.getElementById('chart-container-2').style.display = 'block';
}

// submit form
document.getElementById('nutrientForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Fetch form inputs
    const datesampled = document.getElementById('datesampled').value.trim();
    const nitrogen = document.getElementById('nitrogen').value.trim();
    const potassium = document.getElementById('potassium').value.trim();
    const sulfur = document.getElementById('sulfur').value.trim();
    const boron = document.getElementById('boron').value.trim();
    const phosphorus = document.getElementById('phosphorus').value.trim();
    const magnesium = document.getElementById('magnesium').value.trim();
    const calcium = document.getElementById('calcium').value.trim();
    const copper = document.getElementById('copper').value.trim();

    // Validate required fields
    if (!datesampled || !nitrogen || !potassium || !sulfur || !boron || !phosphorus || !magnesium || !calcium || !copper) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }

    fetchUserID()
    .then(userID => { 
        // Construct form data to be sent to the API
        const formData = new FormData(); 
        formData.append('datesampled', datesampled);
        formData.append('nitrogen', nitrogen);
        formData.append('potassium', potassium);
        formData.append('sulfur', sulfur);
        formData.append('boron', boron);
        formData.append('phosphorus', phosphorus);
        formData.append('magnesium', magnesium);
        formData.append('calcium', calcium);
        formData.append('copper', copper); 


        // Submit the form data to the API
        return fetch('/submit_nutrients', {
            method: 'POST',
            body: formData 
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