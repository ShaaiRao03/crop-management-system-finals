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
    console.log('clicked');
    openPopupRecommendation() 
}); 

document.getElementsByClassName("add-crop-btn")[0].addEventListener('click', function() {
    console.log('clicked');
    openPopup() 
});  



document.getElementsByClassName("add-crop-btn")[0].addEventListener('click', function() {
    console.log('clicked');
    openPopup() 
});  
 

document.getElementsByClassName("generate-plan-btn")[0].addEventListener('click', function() {
    console.log('clicked');
    openPopupGeneratePlan();  
});  
 

 
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
    document.getElementById('popup-cropRecommendation').style.display = 'none';
    document.getElementById('popup').style.display = 'none'; 
    document.getElementById('overlay').style.display = 'none'; 
    document.getElementById('popup-generatePlan').style.display = 'none';
}


function recommendCrop(event){
    event.preventDefault(); 

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
        showRecommendedCrop("Suggest me 5 crops that is suitable to be planted in Malaysia. Strictly give me the name only. Dont give me any descriptions apart from name.Give reason why you suggested the crop. Separate the reason by using '-'. Thank you. ");
    }
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
                var radioButton = document.createElement('input');
                radioButton.type = 'radio';  
                radioButton.id = 'option' + (i + 1);
                radioButton.name = 'option';
                radioButton.value = i + 1;
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
    
    var cropField = document.getElementById("crop-field-plan").value;
    var plantDateTemp = document.getElementById("plant-date").value;
    var plantDate = new Date(plantDateTemp); 


    // Check if both fields have values
    if (cropField.trim() === '' || plantDateTemp.trim() === '') {
        alert('Please provide values for both fields');
    } else {

        fetchCropNameGivenFieldCropID(fieldCropID)
        .then(data => {
     
            console.log("Name : ",data[0].cropName)  
    
            // fetchMessage(`Given ${data[0].cropName} as the preferred crop to be planted in Malaysia. Can you give me a full plan in terms of range of days and the preferred action. The plan must cover the planting phase until the harvesting phase. Dont include unnecessary words. Keep it short and simple for beginners. Give them all the necessary details such as number of seeds per hectare, fertilizer to use, quantity of fertilizer and so on. Use the following format "Day 1-30 : Phase - Action". Only use "-" to differentiate between "Phase" and "Action"`)
            fetchMessage(`Given ${data[0].cropName} as the preferred crop to be planted in Malaysia. Can you give me a full plan in terms of range of days and the preferred action. The plan must cover the planting phase until the harvesting phase. Dont include unnecessary words. Keep it short and simple for beginners. Give them all the necessary details such as number of seeds per hectare, fertilizer to use, quantity of fertilizer and so on. Use the following format "Day 1-30 : Description".Dont use any special characters apart from "-". Thank you`)
            .then(messageData => { 
                
                solution = document.getElementById("generated-plan")   
                        
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
                    
                    document.getElementsByClassName('plan-preview')[0].style.display = 'block';
                    var planContainer = document.getElementById('planContainer');

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


var fieldCropID; 
populateData();