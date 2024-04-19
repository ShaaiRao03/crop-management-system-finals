function fetchCropData() {
    return new Promise((resolve, reject) => {  
        fetch('/getCropData', { 
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

function populateData(){
    fetchCropData() 
    .then(data => { 
        // adding some delay to ensure jquery is fully loaded 
        setTimeout(function() { 
            
            console.log(data)  

            //the table
            var table = $('#example').DataTable(); 
            
            table.destroy();
    
            // Map data and create rows 
            data.forEach(item => {

                // const plantDate = item.startPlantingDate;
                // const plantDateAmended = plantDate.split('T'); 

                const row = `<tr> 
                    <td>${item.fieldID}</td>  
                    <td>${item.fieldName}</td>
                    <td><a href="#" class="table-link" onclick="showCropPlan('${item.field_crop_id}')">${item.cropName}</a></td>  
                    <td>${item.coveredArea}</td>   
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
}   

function rePopulateData(){
    fetchCropData() 
    .then(data => { 
        // adding some delay to ensure jquery is fully loaded 
        setTimeout(function() { 
            
            console.log(data)  

            //the table
            var table = $('#example').DataTable(); 
            
            table.destroy();
    
            // Map data and create rows 
            data.forEach(item => {

                // const plantDate = item.startPlantingDate; 
                // const plantDateAmended = plantDate.split('T'); 

                const row = `<tr>  
                <td>${item.fieldID}</td>  
                    <td>${item.fieldName}</td>
                    <td><a href="#" class="table-link" onclick="showCropPlan('${item.field_crop_id}')">${item.cropName}</a></td>  
                    <td>${item.coveredArea}</td>   
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
}   
 


document.getElementById("backButton").addEventListener('click', function() {
    document.getElementsByClassName('container2')[0].style.display = 'none';
    document.getElementsByClassName('container1')[0].style.display = 'block';
    var table = $('#example2').DataTable(); 
    table.clear();
}); 


document.getElementsByClassName("crop-recommendation-btn")[0].addEventListener('click', function() {
    openPopupRecommendation() 
}); 

document.getElementsByClassName("add-crop-btn")[0].addEventListener('click', function() {
    openPopup() 
});  



document.getElementsByClassName("generate-plan-btn")[0].addEventListener('click', function() {
    openPopupGeneratePlan();  
});  
 
document.getElementsByClassName("autofill-plan-form")[0].addEventListener('click', function() { 
    openPopupAutoFillPlan();  
});  

document.getElementsByClassName("autofill-crop-form")[0].addEventListener('click', function() { 
    const selectedCrop = document.querySelector('input[name="option"]:checked').value;
    currentChosenCrop = selectedCrop;
    openPopupAutoFillCrop();  
});  


function openPopupAutoFillCrop() {
    document.getElementsByClassName('popup-crop-autofill')[0].style.display = 'block'; 
    document.getElementById('popup-cropRecommendation').style.display = 'none';
    document.getElementById('overlay').style.display = 'block';  
    generateAutoFillCropForm(currentChosenCrop); 
}

 
function openPopupAutoFillPlan() {
    document.getElementsByClassName('popup-plan-autofill')[0].style.display = 'block'; 
    document.getElementById('popup-generatePlan').style.display = 'none';
    document.getElementById('overlay').style.display = 'block'; 
    generateAutoFillPlanForm(currentPlan);
} 

 
function openPopup() {  
    document.getElementById('popup-cropRecommendation').style.display = 'none';
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; 
    document.getElementById('popup-generatePlan').style.display = 'none';
}


function openPopupGeneratePlan() {  
    document.getElementById('popup-cropRecommendation').style.display = 'none';
    document.getElementById('popup').style.display = 'none'; 
    document.getElementById('popup-generatePlan').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; 
}


function openPopupRecommendation() {  
    document.getElementById('popup-cropRecommendation').style.display = 'block';
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'block'; 
    document.getElementById('popup-generatePlan').style.display = 'none';
}

function closePopup() {
    document.getElementsByClassName('popup-crop-autofill')[0].style.display = 'none'; 
    document.getElementById('popup-cropRecommendation').style.display = 'none';
    document.getElementById('popup').style.display = 'none'; 
    document.getElementById('overlay').style.display = 'none'; 
    document.getElementById('popup-generatePlan').style.display = 'none';
    document.getElementsByClassName('popup-plan-autofill')[0].style.display = 'none'; 
}


function recommendCrop(event){
    event.preventDefault(); 

    fieldID = document.getElementById("crop-field-recommendation").value
    console.log(fieldID) 


    fetch('/getFieldInfoByID', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({ fieldID }),           
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
         
        fieldData = data[0];

        currLat = fieldData.latitude;
        currLng = fieldData.longitude;

        console.log(currLat)
        console.log(currLng)

        document.querySelector('.crop-preview').style.display = 'none';
        document.getElementById("label-cropPreview").textContent= ""
        var container = document.getElementById('radioButtonsContainer');

        if (container) { 
            while (container.firstChild) {
                container.removeChild(container.firstChild); 
            }
        } else {
            console.error('Container element with ID "radioButtonsContainer" not found.'); 
        }

        value = document.getElementById('crop-field-recommendation').value; 

        if(value == ""){
            alert("Please select a field"); 
            return;
        } else {
            // showRecommendedCrop("Suggest me 5 crops that is suitable to be planted in Malaysia. Strictly give me the name only. Dont give me any descriptions apart from name.Give reason why you suggested the crop. Separate the reason by using '-'. Thank you. ");
            
            fetch('/getLatestNutrientDataGivenID', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ fieldID }),           
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(nutrientData => {

                n = nutrientData[0].nitrogen_N; 
                p = nutrientData[0].phosphorus_P;
                k = nutrientData[0].potassium_K; 
                

                fetch('/getWeatherDataGivenCoord', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    body: JSON.stringify({ currLat , currLng }),            
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(weatherData => {
    
                    console.log(weatherData);

                    const humidity = weatherData.list[0].main.humidity;
                    const temperature = weatherData.list[0].main.temp;

                    console.log("Humidity:", humidity);
                    console.log("Temperature:", temperature);
                        
                    showRecommendedCrop(`Suggest me 5 crops that is suitable to be planted with the following condition. The nutrients for the field are as following : nitrogen = ${n}, phosphorus = ${p} , potassium = ${k}. The weather data for the field are as following : temperature = ${temperature} , humidity = ${humidity} Strictly give me the name only. Dont give me any descriptions apart from name.Give reason why you suggested the crop. Separate the reason by using '-'. Thank you. `);
                    
                    // showRecommendedCrop("Suggest me 5 crops that is suitable to be planted in Malaysia. Strictly give me the name only. Dont give me any descriptions apart from name.Give reason why you suggested the crop. Separate the reason by using '-'. Thank you. ");

                })
                .catch(error => {
                    console.error('Error fetching nutrient data:', error);
                });



            })
            .catch(error => {
                console.error('Error fetching nutrient data:', error);
            });
        
            
        }

    }).catch(error => {
        console.error('Error fetching equipment data:', error);
    });


} 


function clearCrop(event){
    event.preventDefault();
    document.getElementById("recordForm").reset(); // Reset the form
    document.querySelector('.crop-preview').style.display = 'none';
    document.getElementById("label-cropPreview").textContent= ""
    var container = document.getElementById('radioButtonsContainer');

    if (container) { 
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    } else {
        console.error('Container element with ID "radioButtonsContainer" not found.'); 
    }

}


function showRecommendedCrop(query) { 
    fetchMessage(query)
    .then(data => {
        
        solution = document.getElementById("generated-crop")   
                
        if (solution) {   
            document.querySelector('.crop-preview').style.display = 'block';
            document.getElementById("label-cropPreview").textContent= "Recommended Crops :"

            var descriptions = data.message.split(/\d+\.\s/).filter(Boolean);


            var parentContainer = document.getElementById('radioButtonsContainer'); 

            for (var i = 0; i < descriptions.length; i++) {

                getCropName = descriptions[i].split('-')[0].trim();

                var radioButton = document.createElement('input');
                radioButton.type = 'radio';  
                radioButton.id = 'option' + (i + 1);
                radioButton.name = 'option';
                radioButton.value = getCropName;   
                radioButton.style.width = '20px'; // Set a fixed width for the radio button
                radioButton.style.flexShrink = 0; // Ensure radio button doesn't shrink
            
                var container = document.createElement('div'); // Create a container for each radio button and label
                container.style.display = 'flex'; // Use flexbox for layout
                container.style.alignItems = 'center'; // Align items vertically in the container
            
                var label = document.createElement('label');
                label.htmlFor = 'option' + (i + 1); 
                label.appendChild(document.createTextNode(descriptions[i]));
                label.style.color = 'black';  
            
                container.appendChild(radioButton);
                container.appendChild(label);
                container.appendChild(document.createElement('br'));
                parentContainer.appendChild(container); // Append the container to its parent
            }

        } else {
            console.error('Label element with class "generated-message" not found.'); 
        }

    })
    .catch(error => {
        console.error(error); 
    });
}



function fetchMessage(query) { 
    return new Promise((resolve, reject) => {    
        fetch('/getMessage', {  
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ query }), 
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

function showCropPlan(fieldCropIDFromLink){ 
    fieldCropID = fieldCropIDFromLink; 
    populateDataPlan(fieldCropID); 
    document.getElementsByClassName('container2')[0].style.display = 'block';
    document.getElementsByClassName('container1')[0].style.display = 'none';
} 

 
function fetchPlanData(fieldCropID) {
    return new Promise((resolve, reject) => {  
        fetch('/getCropPlan', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fieldCropID }),
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


function populateDataPlan(fieldCropID){
    console.log("In populate data : ",fieldCropID)
    fetchPlanData(fieldCropID)  
    .then(data => { 
        // adding some delay to ensure jquery is fully loaded 
        setTimeout(function() { 
            
            console.log(data)  

            //the table
            var table = $('#example2').DataTable(); 
            
            table.destroy();
    
            // Map data and create rows 
            data.forEach(item => {

                const startDate = item.startDate;
                const startDateAmended = startDate.split('T'); 

                const endDate = item.endDate;
                const endDateAmended = endDate.split('T'); 
 
                const row = `<tr> 
                    <td>${item.description}</td>
                    <td>${startDateAmended[0]}</td> 
                    <td>${endDateAmended[0]}</td>  
                    <td>${item.status === 0 ? 'Inactive' : 'Active'}</td>    
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
}   

function rePopulateDataPlan(fieldCropID){
    fetchPlanData(fieldCropID)  
    .then(data => { 
        // adding some delay to ensure jquery is fully loaded 
        setTimeout(function() { 
            
            console.log(data)  

            //the table
            var table = $('#example2').DataTable(); 
            
            table.destroy();
    
            // Map data and create rows 
            data.forEach(item => {

                const startDate = item.startDate;
                const startDateAmended = startDate.split('T'); 

                const endDate = item.endDate;
                const endDateAmended = endDate.split('T'); 

                const row = `<tr> 
                    <td>${item.description}</td>
                    <td>${startDateAmended[0]}</td> 
                    <td>${endDateAmended[0]}</td> 
                    <td>${item.status === 0 ? '-' : 'Ongoing'}</td>    
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
}   


function fetchCropNameGivenFieldCropID(fieldCropID) {
    return new Promise((resolve, reject) => {  
        fetch('/getCropGivenFieldCropID', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fieldCropID }),
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

function calculateNewDates(dayRange,plantDate) {
    const [days, description] = dayRange.split(': '); 
    const [startDay, endDay] = days.split('-');

    const startDateParts = startDay.trim().split(' ');
    const endDateParts = endDay.trim().split(' ');

    const startOffset = parseInt(startDateParts[1]);
    const newStartDate = new Date(plantDate.getFullYear(), plantDate.getMonth(), plantDate.getDate() + startOffset - 1);

    const endOffset = parseInt(endDateParts[0]);
    const newEndDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), newStartDate.getDate() + endOffset - startOffset);

    return `${newStartDate.toLocaleDateString()} - ${newEndDate.toLocaleDateString()}`;
}



function generatePlan(event){
    event.preventDefault();
    console.log("In generate plan")
    
    var plantDateTemp = document.getElementById("plant-date").value; 
    var plantDate = new Date(plantDateTemp); 

    solution = document.getElementById("generated-plan")   

    document.getElementById("label-planPreview").textContent= "Generating plan ..."

    // Check if both fields have values
    if (plantDateTemp.trim() === '') {
        alert('Please provide values for both fields');
    } else {

        fetchCropNameGivenFieldCropID(fieldCropID)
        .then(data => {
     
            console.log("Name : ",data[0].cropName)  
    
            // fetchMessage(`Given ${data[0].cropName} as the preferred crop to be planted in Malaysia. Can you give me a full plan in terms of range of days and the preferred action. The plan must cover the planting phase until the harvesting phase. Dont include unnecessary words. Keep it short and simple for beginners. Give them all the necessary details such as number of seeds per hectare, fertilizer to use, quantity of fertilizer and so on. Use the following format "Day 1-30 : Phase - Action". Only use "-" to differentiate between "Phase" and "Action"`)
            fetchMessage(`Given ${data[0].cropName} as the preferred crop to be planted in Malaysia. Can you give me a full plan in terms of range of days and the preferred action. The plan must cover the planting phase until the harvesting phase. Dont include unnecessary words. Keep it short and simple for beginners. Give them all the necessary details such as number of seeds per hectare, fertilizer to use, quantity of fertilizer and so on. Use the following format "Day 1-30 : Description".Dont use any special characters apart from "-". Thank you`)
            .then(messageData => { 
                
                if (solution) {   
                    
                    text = messageData.message  
                    
                    const sections = text.split('Day ').slice(1);

                    const dict = {};

                    sections.forEach(section => {
                        const parts = section.split(': ');
                        const key = 'Day ' + parts[0];
                        const value = parts[1].replace(/\n/g, '');
                        dict[key] = value;
                    });
                    
                    const amendedData = {};

                    // Iterate through the original data and calculate new dates for each key 
                    for (const [key, value] of Object.entries(dict)) {
                        const newDateRange = calculateNewDates(key,plantDate);
                        amendedData[newDateRange] = value; // Assign the value to the new key
                    } 
 
                    console.log(amendedData);  
 
                    currentPlan = amendedData; 

                    document.getElementById("label-planPreview").textContent= ""

                    document.getElementsByClassName('plan-preview')[0].style.display = 'block';
                    var planContainer = document.getElementById('planContainer');

                    solution.innerHTML = "Generated Plan :";         

                    // Loop through the data and generate HTML for each date range and action description
                    for (const [dateRange, actionDescription] of Object.entries(amendedData)) {
                        var section = document.createElement('div');
                        section.classList.add('section');

                        var dateHeading = document.createElement('h2');
                        dateHeading.textContent = dateRange;

                        var actionParagraph = document.createElement('p');
                        actionParagraph.textContent = actionDescription;

                        section.appendChild(dateHeading);
                        section.appendChild(actionParagraph);

                        planContainer.appendChild(section);
                    }


                    // Get all sections within planContainer
                    const sections2 = planContainer.querySelectorAll('.section');

                    // Iterate over each section and print the date range and action description
                    sections2.forEach(section => {
                        // Get date heading and action paragraph within each section
                        const dateHeading = section.querySelector('h2');
                        const actionParagraph = section.querySelector('p');
                        
                        // Print the text content of date heading and action paragraph
                        console.log('Date Range:', dateHeading.textContent);
                        console.log('Action Description:', actionParagraph.textContent);
                    });
                
                } else {
                    console.error('Label element with class "generated-plan" not found.'); 
                }
    
            })
            .catch(error => {
                console.error(error); 
            });
    
    
        })
        .catch(error => {
            console.error('Error fetching equipment data:', error);
        });

    }
}


// dynamic form for auto fill recommended crop -------------------------------------


function createFormCropRecommendation(cropName) {
    const form = document.createElement('form');
    form.className = 'cropRecommendation-form'; // Added a class for styling purposes
    form.enctype = 'multipart/form-data';  
    form.id = 'cropForm2'; 

    form.innerHTML = `   
    <label class="form-title">Add New Crop</label> 
        <label for="name">Crop:</label> 
        <input type="text" id="name" name="name" value="${cropName}"><br>

        <label for="type">Field:</label> 
        <select id="fieldRecom" name="field" style="height: 35px;">
        </select>

    
        <label for="coveredArea">Covered Area (Hectare):</label>
        <input type="text" id="coveredArea" name="coveredArea"><br>

        <div class="button-container">
            <button type="submit" onclick="submitNewCrop(event)" class="submit-new-crop">Submit</button>
            <button class="clear-btn">Clear</button> 
        </div>
    `; 

    // Add the following line to get the <select> element
    const select = form.querySelector('#fieldRecom');

    // Clear existing options
    select.innerHTML = '';

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select a field';
    select.appendChild(defaultOption);

    // Fetch field names and add them to the <select> element
    fetchFieldNames3()
        .then(data => {
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.fieldID;
                option.text = item.fieldName;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error(error);

    });


    return form; 
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



function generateAutoFillCropForm(cropName){
    const container = document.getElementsByClassName('popup-crop-autofill')[0]; 
    const form = createFormCropRecommendation(cropName);
    container.appendChild(form);
}
  

function submitNewCrop(event){    
    event.preventDefault(); 
    
    const form = document.getElementById('cropForm2');
    console.log(form)

    // Access the input fields by their IDs
    const cropName = form.querySelector('#name').value;
    const field = form.querySelector('#fieldRecom').value; 
    const coveredArea = form.querySelector('#coveredArea').value;
 
    console.log(cropName, field, coveredArea); 

    // // Check if any of the required fields are empty
    if (!cropName || !field || !coveredArea) {
        alert('Please fill in all fields.');
        return; // Exit the function early if any field is empty
    } 
   
    insertCropDataIntoDatabase(form);

}

function insertCropDataIntoDatabase(form) { 
    const formData = new FormData(form); // Get form data using FormData API

    // Extract data from form fields
    const cropName = formData.get('name');
    const fieldID = formData.get('field');
    const coveredArea = formData.get('coveredArea');


    fetch('/insertCrop', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({cropName , fieldID, coveredArea}) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');  
        }
        return response.json();
    })
    .then(data => {
        console.log('Form data inserted successfully:', data);
        // Handle successful insertion
    })
    .catch(error => {
        console.error('Error inserting form data into database:', error);
        // Handle the error
    }); 

}

// dynamic form for auto fill generate plan -------------------------------------

function createForm(startDate, endDate, description, isActive , isFirstForm = false) {
    const form = document.createElement('form');
    form.className = 'phase-form'; // Added a class for styling purposes
    form.enctype = 'multipart/form-data';

    if (isFirstForm) {
        form.innerHTML = `
        <label for="type">Description:</label>
        <input type="text" class="plan-description" name="description" value="${description}"><br> 

        <label for="type">Start date:</label>
        <input type="date" class="plan-start-date" name="startDate" value="${startDate}"><br> 

        <label for="type">End date:</label> 
        <input type="date" class="plan-end-date" name="endDate" value="${endDate}"><br> 

        <div class="radio-buttons">    
            <label>Status:</label>
            <input type="radio" class="active" name="status" value="1" ${isActive ? 'checked' : ''}>
            <label for="active">Active</label><br>
            <input type="radio" class="inactive" name="status" value="0" ${isActive ? '' : 'checked'}>
            <label for="inactive">Inactive</label><br>
        </div>
        `; 
        
    } else {
        form.innerHTML = ` 
        <label for="type">Description:</label>
        <input type="text" class="plan-description" name="description" value="${description}"><br> 

        <label for="type">Start date:</label>
        <input type="date" class="plan-start-date" name="startDate" value="${startDate}"><br> 

        <label for="type">End date:</label> 
        <input type="date" class="plan-end-date" name="endDate" value="${endDate}"><br> 

        <div class="radio-buttons">    
            <label>Status:</label>
            <input type="radio" class="active" name="status" value="1" ${isActive ? 'checked' : ''}>
            <label for="active">Active</label><br>
            <input type="radio" class="inactive" name="status" value="0" ${isActive ? '' : 'checked'}>
            <label for="inactive">Inactive</label><br>
        </div>
    
        <div class="button-container"> 
            <button type="button" onclick="removeForm(this)" class="remove-form-btn red-button">Remove</button>
        </div>
    `;
    }

    return form; 
}

function insertPlanDataIntoDatabase(forms) {
    // Iterate over each form
    forms.forEach(form => {
        const formData = new FormData(form); // Get form data using FormData API

        // Extract data from form fields
        const description = formData.get('description'); 
        const startDate = formData.get('startDate');
        const endDate = formData.get('endDate');
        const status = formData.get('status');
 
        console.log(description)
        
        // Prepare the request body
        const requestBody = {
            fieldCropID, // Assuming you have a hidden field with name 'fieldCropID' in your form 
            description,
            startDate,
            endDate,
            status
        };

        // Make a POST request to the /insertCropPlan endpoint
        fetch('/insertCropPlan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');  
            }
            return response.json();
        })
        .then(data => {
            console.log('Form data inserted successfully:', data);
            // Handle successful insertion
        })
        .catch(error => {
            console.error('Error inserting form data into database:', error);
            // Handle the error
        });
    });
}


function updateEntirePlanStatus(fieldCropID){
    return new Promise((resolve, reject) => {  
        fetch('/updateExistingPlanStatus', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fieldCropID }), 
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



// Function to handle form submission 
function submitForms(event) {
    event.preventDefault();
    const forms = document.querySelectorAll('.phase-form');
    
    // Count the number of checked active radio buttons
    const activeCount = document.querySelectorAll('.active:checked').length;
    
    // If more than one active status is selected, show an alert
    if (activeCount > 1) {
        alert('Please choose only one active status.');
        return; // Prevent further execution of submission logic
    }

    updateEntirePlanStatus(fieldCropID)
    .then(data => {
        insertPlanDataIntoDatabase(forms);
        console.log("Updated all status") 
    }) 
    .catch(error => {
        console.error('Error updating plan status:', error);
    });

}

// Function to clear all forms
function clearForms(event) { 
    event.preventDefault();
    const descriptions = document.querySelectorAll('.plan-description');
    const startDates = document.querySelectorAll('.plan-start-date');
    const endDates = document.querySelectorAll('.plan-end-date');
    const activeRadios = document.querySelectorAll('.active');
    const inactiveRadios = document.querySelectorAll('.inactive');

    descriptions.forEach(input => input.value = '');
    startDates.forEach(input => input.value = '');
    endDates.forEach(input => input.value = '');
    activeRadios.forEach(input => input.checked = false);  
    inactiveRadios.forEach(input => input.checked = false);  
} 


// Function to remove a form
function removeForm(button) {
    const form = button.closest('.phase-form');
    const container = form.parentNode;
    const forms = container.querySelectorAll('.phase-form');

    // Check if there's only one form left
    if (forms.length > 1) { 
        form.parentNode.removeChild(form);
    } else {
        alert("At least one form must remain.");
    }
}

// Function to add a new form without data 
function addForm() {

    const container = document.getElementsByClassName('popup-plan-autofill')[0];
    const buttonContainer = container.querySelector('.button-container2');
    const form = createForm('', '', '', false);
    container.insertBefore(form, buttonContainer);

}


function generateAutoFillPlanForm(currentPlan){ 
    const container = document.getElementsByClassName('popup-plan-autofill')[0];
    // container.style.display = 'block'; 

    const formTitle = document.createElement('label');
    formTitle.className = 'form-title';
    formTitle.textContent = 'Add Plan';
    container.appendChild(formTitle); 

    console.log(currentPlan);

    let firstForm = true;
    // let dataCount = 0;
    Object.entries(currentPlan).forEach(([dateRange, description]) => { 
        const [startDate, endDate] = dateRange.split(' - ');
        const isActive = firstForm;
        firstForm = false;

        console.log(startDate, endDate);

        const [startDatemonth, startDateday,  startDateyear] = startDate.split('/');
        const startDateObject = new Date(`${startDateyear}-${startDatemonth.padStart(2, '0')}-${startDateday.padStart(2, '0')}`);
        finalStartDate = startDateObject.toISOString().split('T')[0]; // Output: 2024-05-16
    
        const [endDatemonth, endDateday, endDateyear] = endDate.split('/'); 
        const endDateObject = new Date(`${endDateyear}-${endDatemonth.padStart(2, '0')}-${endDateday.padStart(2, '0')}`);
        finalEndDate = endDateObject.toISOString().split('T')[0]; // Output: 2024-06-30  
     
        const form = createForm(finalStartDate, finalEndDate, description, isActive, isActive);
        container.appendChild(form); 
    });


    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'form-container'; 
    buttonContainer.className = 'button-container2'; 

    // Add event listeners to submit and clear buttons 
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', submitForms); 
    buttonContainer.appendChild(submitButton);

    // Add button to add a new form
    const addFormButton = document.createElement('button');
    addFormButton.textContent = 'Add Form';
    addFormButton.addEventListener('click', addForm);
    buttonContainer.appendChild(addFormButton);  


    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Clear All';
    clearButton.className = 'red-button';
    clearButton.addEventListener('click', clearForms);
    buttonContainer.appendChild(clearButton);


    container.appendChild(buttonContainer); 
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
    $('#crop-field-recommendation').empty();

    // Add a default option
    $('#crop-field-recommendation').append($('<option>', {
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
        $('#crop-field-recommendation').append(option);
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
    $('#field').empty();

    // Add a default option
    $('#field').append($('<option>', {
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
        $('#field').append(option);
    });
}) 

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


var currTemp; 
var n;
var p; 
var k; 
var currLat;
var currLng;
var currentChosenCrop;
var currentPlan;
var fieldCropID;  
populateData(); 