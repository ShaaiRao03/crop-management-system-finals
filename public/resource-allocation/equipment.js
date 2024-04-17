function fetchEquipmentData() {
    return new Promise((resolve, reject) => {    
        fetch('/getEquipmentInfo', { 
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

function fetchEquipmentDataBySerialNum(serialNum) {
    return new Promise((resolve, reject) => {  
        fetch('/getEquipmentInfoBySerialNum', {  
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ serialNum }),
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
 
function fetchMaintenanceRecord(serialNum) { 
    return new Promise((resolve, reject) => {  
        fetch('/getMaintenanceRecord', {   
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ serialNum }),
            })
            .then(response => { 
                console.log(response)
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

function populateData(){
fetchEquipmentData()
.then(data => { 
    // adding some delay to ensure jquery is fully loaded 
    setTimeout(function() {

        //the table
        var table = $('#example').DataTable(); 
        
        table.destroy();

        // Map data and create rows 
        data.forEach(item => {
            const row = `<tr> 
                <td><a href="#" class="table-link" onclick="showEquipmentDetails('${item.serialNum}')">${item.equipmentName}</a></td>  
                <td>${item.type}</td>
                <td>${item.brand}</td>
                <td>${item.model}</td> 
                <td>${item.equipmentStatus}</td> 
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


function repopulateData(){
fetchEquipmentData()
.then(data => { 
    // adding some delay to ensure jquery is fully loaded 
    setTimeout(function() {

        //the table
        var table = $('#example').DataTable(); 
        table.clear();

        // Map data and create rows 
        data.forEach(item => {
            const row = `<tr> 
                <td><a href="#" class="table-link" onclick="showEquipmentDetails('${item.serialNum}')">${item.equipmentName}</a></td>  
                <td>${item.type}</td>
                <td>${item.brand}</td>
                <td>${item.model}</td> 
                <td>${item.equipmentStatus}</td> 
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


 
// Add equipment starts --------------------

document.getElementsByClassName("add-equipment-btn")[0].addEventListener('click', function() {
    console.log('clicked');
    openPopup()
}); 

function openPopup() {  
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; 
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup-record').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// submit form
document.getElementById('equipmentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Fetch form inputs
    const name = document.getElementById('name').value.trim();
    const type = document.getElementById('type').value.trim();
    const brand = document.getElementById('brand').value.trim();
    const model = document.getElementById('model').value.trim();
    const status = document.getElementById('status').value.trim();
    const serialNumber = document.getElementById('serialNumber').value.trim();
    const plateNumber = document.getElementById('plateNumber').value.trim();
    const lastServiced = document.getElementById('lastServiced').value.trim();
    const leasePurchase = document.querySelector('input[name="leasePurchase"]:checked');
    const dealerNumber = document.getElementById('dealerNumber').value.trim();
    const image = document.getElementById('image').files[0]; // Get the first selected file (if any) 

    // Validate required fields
    if (!name || !type || !brand || !model || !status || !serialNumber || !plateNumber || !lastServiced || !leasePurchase || !dealerNumber) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }


    fetchUserID()
    .then(userID => { 
        // Construct form data to be sent to the API
        const formData = new FormData(); 
        formData.append('name', name);
        formData.append('type', type);
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('status', status);
        formData.append('serialNumber', serialNumber);
        formData.append('plateNumber', plateNumber);
        formData.append('lastServiced', lastServiced);
        formData.append('leasePurchase', leasePurchase.value);
        formData.append('dealerNumber', dealerNumber);
        formData.append('userID', userID[0].userID);   
        formData.append('image', image);   

        console.log(formData)

        // Submit the form data to the API
        return fetch('/submit_equipment', {
            method: 'POST',
            body: formData 
        }); 
    })
    .then(response => {
        if (response.ok) {
            // Form submitted successfully 
            alert('Form submitted successfully!');
            repopulateData() 
            closePopup() 
        } else {
            throw new Error('Error submitting form.');
        }
    })
    .catch(error => {
        console.error('Error:', error); 
        alert('An error occurred while submitting the form. Please try again.');
    }); 
});

// Add equipment ends --------------------

// Add record starts ----------------------
document.getElementsByClassName("add-record-btn")[0].addEventListener('click', function() {
    openPopupRecord()
}); 
 
function openPopupRecord() {  
    document.getElementById('popup-record').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; 
}

function closePopupRecord() { 
    document.getElementById('popup-record').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
// Add record ends ----------------------


// Equipment details starts -------------------- 

function updateEquipmentDetails(serialNum){ 
    fetchEquipmentDataBySerialNum(serialNum)  
    .then(data => { 
 
        equipmentData = data[0] 
        console.log(equipmentData.img)

        const last_serviceDate = equipmentData.lastService;
        const last_service = last_serviceDate.split('T'); 

        document.querySelector('.details-info.name').textContent = equipmentData.equipmentName;  
        document.querySelector('.details-info.type').textContent = equipmentData.type;
        document.querySelector('.details-info.brand').textContent = equipmentData.brand;
        document.querySelector('.details-info.model').textContent = equipmentData.model;
        document.querySelector('.details-info.status').textContent = equipmentData.equipmentStatus;
        document.querySelector('.details-info.serial-number').textContent = equipmentData.serialNum;
        document.querySelector('.details-info.plate-number').textContent = equipmentData.plateNum;
        document.querySelector('.details-info.last-service').textContent = last_service[0];
        document.querySelector('.details-info.purchase-type').textContent = equipmentData.purchaseType;
        document.querySelector('.details-info.dealer-number').textContent = equipmentData.dealerNumber;

        document.querySelector('.overview-label').textContent = equipmentData.equipmentName + " " + equipmentData.type + " Overview" 


        // Handling images -----------------------------
         
        // imageData contains the Buffer object retrieved from the database
        var imageData = equipmentData.img 
        
        if(imageData){
            // convert the Buffer object to a Uint8Array   
            var uint8Array = new Uint8Array(imageData.data); 

            // create a Blob object from the Uint8Array
            var blob = new Blob([uint8Array], { type: 'image/jpeg' }); // Adjust the MIME type if necessary

            // create a FileReader object to read the Blob  
            var reader = new FileReader();

            // define the onload event handler for when the FileReader finishes reading
            reader.onload = function(event) {
                var imgElement = document.createElement("img");

                imgElement.src = event.target.result;

                imgElement.id = "equipment-image"

                imgElement.alt = "Placeholder Image";

                var existingImgElement = document.getElementById("equipment-image");

                // console.log("Data exist")
                // console.log(existingImgElement); // Check if existingImgElement is found
                // console.log(existingImgElement.parentNode);  

                existingImgElement.parentNode.replaceChild(imgElement, existingImgElement);
            };
            reader.readAsDataURL(blob);

        }else{

            // If no image data is given, use a fallback image URL 
            var fallbackImageUrl = "img/no image available.jpg"; // Replace with your fallback image URL
 
            // Create a new Image element 
            var imgElement = document.createElement("img");
 
            // Set the src attribute to the fallback image URL
            imgElement.src = fallbackImageUrl;

            imgElement.id = "equipment-image"
 
            // Set the alt attribute 
            imgElement.alt = "Placeholder Image";

            // Get the existing img element by its ID or another suitable selector
            var existingImgElement = document.getElementById("equipment-image");

            // console.log("Data not exist")
            // console.log(existingImgElement); // Check if existingImgElement is found
            // console.log(existingImgElement.parentNode);  

            // Replace the existing img element with the new Image element
            existingImgElement.parentNode.replaceChild(imgElement, existingImgElement);

        }
    }) 
}

function updateMaintenanceRecord(serialNum){ 
    fetchMaintenanceRecord(serialNum) 
    .then(data => {   
        console.log(data)

        setTimeout(function() {

            //the table
            var table = $('#example2').DataTable(); 
            table.clear(); 
    
            // Map data and create rows   
            data.forEach(item => {

                const maintenance_date = item.date;
                const date = maintenance_date.split('T'); 

                const row = `<tr> 
                    <td>${item.serviceDescription}</td>
                    <td>${date[0]}</td> 
                </tr>`; 
    
                // Add the row to the table
                table.row.add($(row).get(0));
            }); 
            // Redraw the table   
            table.draw();
        }, 100);

    })
}


function reUpdateMaintenanceRecord(serialNum){ 
    fetchMaintenanceRecord(serialNum) 
    .then(data => {  
        console.log(data)

        setTimeout(function() {

            //the table
            var table = $('#example2').DataTable(); 
            table.clear(); 
    
            // Map data and create rows   
            data.forEach(item => {

                const maintenance_date = item.date;
                const date = maintenance_date.split('T'); 

                const row = `<tr> 
                    <td>${item.serviceDescription}</td>
                    <td>${date[0]}</td> 
                </tr>`; 
    
                // Add the row to the table
                table.row.add($(row).get(0));
            }); 
            // Redraw the table  
            table.draw();
        }, 100);

    })
}
 

document.getElementById('recordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Fetch form inputs
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('maintenance-date').value.trim();

    // Validate required fields
    if (!date || !description) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }
      
    console.log(description , date , currSerialNum) 

    return new Promise((resolve, reject) => { 
        fetch('/submit_record', {  
            method: 'POST',   
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({description , date , currSerialNum}),     
        }).then(response => { 
            if (response.ok) { 
                // Form submitted successfully    
                alert('Form submitted successfully!');
                reUpdateMaintenanceRecord(currSerialNum) 
                closePopupRecord()  
            } else { 
                throw new Error('Error submitting form.'); 
            }
        }).catch(error => {
            reject(error) 
            alert('An error occurred while submitting the form. Please try again.');
        });


    })
});

// Equipment details ends --------------------

// Navigation between pages starts here ---------------- 
document.getElementById('detailsButton').addEventListener('click', function() {
    document.getElementsByClassName('container3-maintenancetable')[0].style.display = 'none';
    document.getElementsByClassName('container3-equipmentdetails')[0].style.display = 'block';
    document.getElementById('detailsButton').classList.add('highlight'); 
    document.getElementById('maintenanceButton').classList.remove('highlight');   
}); 
 
document.getElementById('maintenanceButton').addEventListener('click', function() { 
    document.getElementsByClassName('maintenance-section')[0].style.display = 'block';
    document.getElementsByClassName('container3-maintenancetable')[0].style.display = 'block';
    document.getElementsByClassName('container3-equipmentdetails')[0].style.display = 'none';
    document.getElementById('detailsButton').classList.remove('highlight'); 
    document.getElementById('maintenanceButton').classList.add('highlight'); 
    updateMaintenanceRecord(currSerialNum) 
});
 
document.getElementById('backButton').addEventListener('click', function() { 
    document.getElementsByClassName('equipment-details')[0].style.display = 'none'; 
    document.getElementsByClassName('container1')[0].style.display = 'block';
    document.getElementById('detailsButton').classList.add('highlight'); 
    document.getElementById('maintenanceButton').classList.remove('highlight'); 
    var table = $('#example2').DataTable(); 
    table.clear();
}); 
 
  
function showEquipmentDetails(serialNum){
    currSerialNum = serialNum
    
    updateEquipmentDetails(serialNum)

    document.getElementsByClassName('equipment-details')[0].style.display = 'block';
    document.getElementsByClassName('container1')[0].style.display = 'none';

    // Show details section by default
    document.getElementsByClassName('container3-equipmentdetails')[0].style.display = 'block';
}
 
 
//  Navigation between pages ends here  ----------------

// Editable starts here ------------------------------
function makeDetailsEditable() {
    const detailsContainer = document.querySelector('.details-container');

    // Loop through each details item and replace it with an input field
    detailsContainer.querySelectorAll('.details-info').forEach(info => {
        // Create an input field
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('value', info.textContent.trim());

        // Set input field styles to match original details-info class
        input.style.width = info.offsetWidth + 'px'; // Set width to match
        input.style.padding = '0'; // Reset padding to match original
        input.style.marginLeft = '30px';
        input.style.marginBottom = '0px';


        // Replace the details info span with the input field
        info.parentNode.replaceChild(input, info);
    });

    // Hide the edit button
    const editButton = document.getElementById('editButton'); 
    editButton.style.display = 'none';

    // Show update button 
    const updateButton = document.getElementById('updateButton'); 
    updateButton.style.display = 'block'; 

    const deleteButton = document.getElementById('deleteButton');
    // Add a disabled class to the button
    deleteButton.classList.add('disabled');

    // Also, set the disabled attribute to prevent default button behavior
    deleteButton.setAttribute('disabled', 'disabled');
    
    // Add event listener to the update button
    updateButton.addEventListener('click', function() {
        // Loop through each input field and replace it with the original text content
        detailsContainer.querySelectorAll('input[type="text"]').forEach(input => {
            const span = document.createElement('span');
            span.classList.add('details-info');
            span.textContent = input.value.trim();
            // Replace the input field with the original details info span
            input.parentNode.replaceChild(span, input);
        });

        editButton.style.display = 'block';
        updateButton.style.display = 'none'; 
        
        deleteButton.classList.remove('disabled');
        deleteButton.removeAttribute('disabled');
    });
}


function editButtonEventListener(){
    // Call makeDetailsEditable() when the edit button is clicked
    const editButton = document.getElementById('editButton')
    editButton.addEventListener('click', makeDetailsEditable);
}

// Editable ends here ------------------------------

// Clearing form data starts here ------------------------------
function clearEquipmentFormData(){
    // Remove the 'required' attribute from all required fields
    document.querySelectorAll('#equipmentForm [required]').forEach(field => {
        field.removeAttribute('required');
    });

    // Reset the form
    document.getElementById("equipmentForm").reset();

    // Add back the 'required' attribute to required fields
    document.querySelectorAll('#equipmentForm [data-required]').forEach(field => {
        field.setAttribute('required', 'required');
    });
}

function clearRecordFormData(){
    // Remove the 'required' attribute from all required fields
    document.querySelectorAll('#recordForm [required]').forEach(field => {
        field.removeAttribute('required');
    });

    // Reset the form
    document.getElementById("recordForm").reset();

    // Add back the 'required' attribute to required fields
    document.querySelectorAll('#recordForm [data-required]').forEach(field => {
        field.setAttribute('required', 'required');
    });
}

function clearButtonEventListener(){
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.addEventListener('click', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Clear the form data
        clearEquipmentFormData();
    });
}

function clearRecordButtonEventListener(){
    const clearBtn = document.getElementById('clearRecordBtn');
    clearBtn.addEventListener('click', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Clear the form data
        clearRecordFormData();
    });
}

// Clearing form data ends here ------------------------------

var currSerialNum; 
populateData()
editButtonEventListener()
clearButtonEventListener()
clearRecordButtonEventListener()