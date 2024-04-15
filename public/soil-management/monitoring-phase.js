function fetchNutrientData(startDate = null, endDate = null) {
    return new Promise((resolve, reject) => {  
        // Construct the request body based on provided start and end dates
        const requestBody = { username };
        if (startDate && endDate) {
            requestBody.startDate = startDate;
            requestBody.endDate = endDate;
        }

        fetch('/getMonitoringInfo', { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
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
    // Render the table with the fetched data
    renderTable(data);
})
.catch(error => {
    console.error('Error fetching monitoring data:', error);
});

$('#update').on('click', function() {
    const startDate = $('#startdate').val(); // Get the start date value
    const endDate = $('#enddate').val(); // Get the end date value

    fetchNutrientData(startDate, endDate)
    .then(data => {
        // Render the table with the fetched data
        renderTable(data);
    })
    .catch(error => {
        console.error('Error fetching monitoring data:', error);
    });
});

function renderTable(data) {
    // Destroy existing DataTable instance
    $('#example').DataTable().destroy();

    // Render the table with the fetched data
    const table = $('#example').DataTable({
        data: data,
        columns: [
            { data: 'fieldName' },
            { data: 'nitrogen_N' },
            { data: 'potassium_K' },
            { data: 'sulphur_S' },
            { data: 'boron_B' },
            { data: 'phosphorus_P' },
            { data: 'magnesium_Mg' },
            { data: 'calcium_Ca' },
            { data: 'copper_Cu' },
            { data: 'date' }
        ],
        destroy: true // Destroy previous DataTable instance
    });
}

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

  $('#chartSelect').on('change', function() {
    const selectedField = $(this).val(); // Get the selected field ID
    fetchFieldData(username, selectedField)
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
          borderColor: "orange",
          fill:false
      },{
          label: 'Sulfur',
          data: data.map(item => item.sulphur_S),
          borderColor: "yellow",
          fill:false
      },{
          label: 'Boron',
          data: data.map(item => item.boron_B),
          borderColor: "lime",
          fill:false
      },{
          label: 'Phosphorus',
          data: data.map(item => item.phosphorus_P),
          borderColor: "green",
          fill:false
      },{
          label: 'Magnesium',
          data: data.map(item => item.magnesium_Mg),
          borderColor: "cyan",
          fill:false
      },{
          label: 'Calcium',
          data: data.map(item => item.calcium_Ca),
          borderColor: "blue",
          fill:false
      },{
          label: 'Copper',
          data: data.map(item => item.copper_Cu),
          borderColor: "purple",
          fill:false
      }]
  
  
        // Get the canvas element
        const chartCanvas = document.getElementById('myCharte');
        
        // Check if the chart exists, and destroy it if it does
        if (window.myLine) {
            window.myLine.destroy();
        }

        // Render the new chart
        renderChart(chartCanvas, xValues, datasets);
    })
    .catch(error => {
      console.error('Error fetching field data:', error);
    });
});

function fetchFieldData(username, fieldID) {
    return new Promise((resolve, reject) => {
        fetch('/getFieldData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, fieldID }),
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

    function renderChart(canvas, xValues, datasets) {
        window.myLine = new Chart(canvas, {
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
    document.getElementById('tableButton').classList.add('highlight'); 
    document.getElementById('visualButton').classList.remove('highlight');   
}); 
 
document.getElementById('visualButton').addEventListener('click', function() {
    document.getElementById('table-content').style.display = 'none';
    document.getElementById('visualization-content').style.display = 'block';
    document.getElementById('tableButton').classList.remove('highlight'); 
    document.getElementById('visualButton').classList.add('highlight'); 
});

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
