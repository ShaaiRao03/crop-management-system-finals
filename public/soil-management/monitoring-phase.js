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
            const data_date = item.date
            const date = data_date.split('T');

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
                <td>${date[0]}</td>
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

function fetchFieldNames() {
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

fetchFieldNames()
.then(data => { 
    // Clear existing options
    $('#chartSelect').empty();

    // Add a default option
    $('#chartSelect').append($('<option>', {
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
        $('#chartSelect').append(option);
    });
}) 

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
    $('#fieldSelect').empty();

    // Add a default option
    $('#fieldSelect').append($('<option>', {
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
        $('#fieldSelect').append(option);
    });
}) 
.catch(error => {
    console.error('Error fetching data:', error);
});


document.getElementsByClassName("add-task")[0].addEventListener('click', function() {
    console.log('clicked');
    openPopupN()
}); 


// for the chart (start)

function fetchFieldData(username) {
    return new Promise((resolve, reject) => {
      fetch('/getFieldData', {
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
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  fetchFieldData(username)
  .then(data => {
    const xValues = data.map(item => {
        const data_date = item.date;
        const dateParts = data_date.split('T');
        return dateParts[0]; // Assuming you want to use only the date part
    }); 
    const datasets = [{
        label: 'Nitrogen',
        data: data.map(item => item.nitrogen_N),
        borderColor: "red",
        fill:false
    },{
        label: 'Potassium',
        data: data.map(item => item.potassium_K),
        borderColor: "blue",
        fill:false
    }]


  datasets.forEach(dataset => {
    console.log(`Label: ${dataset.label}`);
    console.log('Data:', dataset.data);
  });
    
    renderChart(xValues, datasets);
  })
  .catch(error => {
    console.error('Error fetching field data:', error);
  });

  function renderChart(xValues, datasets) {
    new Chart("myCharte", {
      type: "line",
      data: {
        labels: xValues,
        datasets: datasets
      },
      options: {
        legend: { display: true }
      }
    });
  }

  // Function to generate random color
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

//for the chart (end)

function openPopupN() {
    document.getElementById('popupN').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}
  
  function closePopupN() {
    document.getElementById('popupN').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

document.getElementById('tableButton').addEventListener('click', function() {
    document.getElementById('table-content').style.display = 'block';
    document.getElementById('visualization-content').style.display = 'none';
    document.getElementById('togglebut').style.display = 'none';
    // document.getElementById('chart-container-1').style.display = 'none';
    // document.getElementById('chart-container-2').style.display = 'none';
    document.getElementById('tableButton').classList.add('highlight'); 
    document.getElementById('visualButton').classList.remove('highlight');   
}); 
 
document.getElementById('visualButton').addEventListener('click', function() {
    document.getElementById('table-content').style.display = 'none';
    document.getElementById('visualization-content').style.display = 'block';
    document.getElementById('togglebut').style.display = 'block';
    // document.getElementById('chart-container-1').style.display = 'block';
    // document.getElementById('chart-container-2').style.display = 'none';
    document.getElementById('tableButton').classList.remove('highlight'); 
    document.getElementById('visualButton').classList.add('highlight'); 
});

function displayGraph(){
    document.getElementById('table-content').style.display = 'none';
    document.getElementById('visualization-content').style.display = 'block';
    // document.getElementById('chart-container-1').style.display = 'block';
    // document.getElementById('chart-container-2').style.display = 'none';
}
function displayChart(){
    document.getElementById('table-content').style.display = 'none';
    document.getElementById('visualization-content').style.display = 'block';
    // document.getElementById('chart-container-1').style.display = 'none'; 
    // document.getElementById('chart-container-2').style.display = 'block';
}

// submit form
document.getElementById('nutrientForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Fetch form inputs
    const fieldID = document.getElementById('fieldSelect').value.trim();
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
    if (!fieldID | !datesampled || !nitrogen || !potassium || !sulfur || !boron || !phosphorus || !magnesium || !calcium || !copper) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }

    fetchUserID()
    .then(userID => { 
        // Construct form data to be sent to the API
        const formData = new FormData(); 
        formData.append('fieldID', fieldID);
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
