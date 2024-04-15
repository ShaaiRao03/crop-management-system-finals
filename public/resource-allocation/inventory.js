function fetchInventoryData() {
    return new Promise((resolve, reject) => {    
        fetch('/getInventoryInfo', { 
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
    fetchInventoryData() 
    .then(data => { 
        // adding some delay to ensure jquery is fully loaded 
        setTimeout(function() {
            
            console.log(data)

            //the table
            var table = $('#example').DataTable(); 
            
            table.destroy();
    
            // Map data and create rows 
            data.forEach(item => {
                const getStatusValue = ((item.balance - item.flagThreshold) / item.flagThreshold) * 100;
                let getStatus = '';
                if (getStatusValue >= 20){
                    getStatus = "Sufficient";
                } else if (getStatusValue < 20 && getStatusValue >= 0) {
                    getStatus = "Need to Refill";
                } else if (getStatusValue < 0) {
                    getStatus = "Insufficient";
                } else {
                    getStatus = "Error";
                }

                const row = `<tr> 
                    <td><a href="#" class="table-link" onclick="showInventoryDetails('${item.inventoryID}')">${item.inventoryName}</a></td>  
                    <td>${item.inventoryType}</td>
                    <td>${item.manufacturer}</td> 
                    <td>${item.balance}</td> 
                    <td>${item.flagThreshold}</td> 
                    <td>${getStatus}</td>  
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
    fetchInventoryData()
    .then(data => { 
        // adding some delay to ensure jquery is fully loaded 
        setTimeout(function() {
            
            //the table
            var table = $('#example').DataTable(); 
            table.clear();

            // Map data and create rows 
            data.forEach(item => {
                const getStatusValue = ((item.balance - item.flagThreshold) / item.flagThreshold) * 100;
                let getStatus = '';
                if (getStatusValue >= 20){
                    getStatus = "Sufficient";
                } else if (getStatusValue < 20 && getStatusValue >= 0) {
                    getStatus = "Need to Refill";
                } else if (getStatusValue < 0) {
                    getStatus = "Insufficient";
                } else {
                    getStatus = "Error";
                }

                const row = `<tr> 
                    <td><a href="#" class="table-link" onclick="showInventoryDetails('${item.inventoryID}')">${item.inventoryName}</a></td>  
                    <td>${item.inventoryType}</td>
                    <td>${item.manufacturer}</td> 
                    <td>${item.balance}</td> 
                    <td>${item.flagThreshold}</td> 
                    <td>${getStatus}</td>  
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

// Add inventory starts --------------------

document.getElementsByClassName("add-inventory-btn")[0].addEventListener('click', function() {
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
document.getElementById('inventoryForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
     
    // Fetch form inputs 
    const name = document.getElementById('name').value.trim();
    const brand = document.getElementById('inventory-brand').value.trim();
    const type = document.getElementById('inventory-type').value.trim();
    const threshold = document.getElementById('inventory-threshold').value.trim();
    const manufacturer = document.getElementById('inventory-manufacturer').value.trim();
    const manufacturerNum = document.getElementById('inventory-manufacturerNum').value.trim();
    const image = document.getElementById('image').files[0]; // Get the first selected file (if any) 

    // Validate required fields
    if (!name || !type || !brand || !threshold || !manufacturer || !manufacturerNum) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }

    console.log("form details accepted");

 
    fetchUserID()
    .then(userID => { 
        // Construct form data to be sent to the API
        const formData = new FormData(); 
        formData.append('name', name); 
        formData.append('brand', brand); 
        formData.append('type', type);
        formData.append('threshold', threshold);
        formData.append('manufacturer', manufacturer);
        formData.append('manufacturerNum', manufacturerNum);
        formData.append('userID', userID[0].userID);   
        formData.append('image', image);   

        console.log(formData)

        // Submit the form data to the API
        return fetch('/submit_inventory', {
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

// Add inventory ends --------------------

// Add record starts ----------------------
document.getElementsByClassName("add-record-btn")[0].addEventListener('click', function() {
    openPopupUsage()
}); 

function openPopupUsage() {  
    document.getElementById('popup-record').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; 
}

function closePopup() {
    document.getElementById('popup-record').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
// Add record ends ----------------------

// Equipment details starts -------------------- 

function updateInventoryDetails(){
    fetchInventoryData()  
    .then(data => { 

        inventoryData = data[0] 
        console.log(inventoryData.img)

       // const last_serviceDate = equipmentData.lastService;
       // const last_service = last_serviceDate.split('T'); 

        document.querySelector('.details-info.name').textContent = inventoryData.inventoryName;  
        document.querySelector('.details-info.type').textContent = inventoryData.inventoryType;
        document.querySelector('.details-info.brand').textContent = inventoryData.brand;
        document.querySelector('.details-info.threshold').textContent = inventoryData.flagThreshold;
        document.querySelector('.details-info.manufacturer').textContent = inventoryData.manufacturer;
        document.querySelector('.details-info.manufacturer-number').textContent = inventoryData.manufacturerNumber;

        document.querySelector('.overview-label').textContent = inventoryData.inventoryName + " " + inventoryData.inventoryType + " Overview" 


        // Handling images -----------------------------
         
        // imageData contains the Buffer object retrieved from the database
        var imageData = inventoryData.img 
        
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

                imgElement.id = "inventory-image"

                imgElement.alt = "Placeholder Image";

                var existingImgElement = document.getElementById("inventory-image");

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

            imgElement.id = "inventory-image"
 
            // Set the alt attribute 
            imgElement.alt = "Placeholder Image";

            // Get the existing img element by its ID or another suitable selector
            var existingImgElement = document.getElementById("inventory-image");

            // console.log("Data not exist")
            // console.log(existingImgElement); // Check if existingImgElement is found
            // console.log(existingImgElement.parentNode);  

            // Replace the existing img element with the new Image element
            existingImgElement.parentNode.replaceChild(imgElement, existingImgElement);

        }
    }) 
}

// update usage record


// reupdate usage record


// -------------------- TBA ----------------------
// submit usageForm
document.getElementById('usageForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Fetch form inputs
    const amount = document.getElementById('amount').value.trim();
    const date = document.getElementById('date').value.trim();
    const restockUsed = document.querySelector('input[name="stock-restock-used"]:checked');

    // Validate required fields
    if (!date || !!amount || !restockUsed) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }
      
    console.log(amount , date , restockUsed) 

    

    return new Promise((resolve, reject) => { 
        fetch('/submit_usage', {  
            method: 'POST',   
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({inventoryID, restockUsed, amount , date}),     
        }).then(response => { 
            if (response.ok) { 
                // Form submitted successfully    
                alert('Form submitted successfully!');
                reUpdateMaintenanceRecord(currSerialNum) 
                closePopup()  
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
    document.getElementsByClassName('container3-usagetable')[0].style.display = 'none';
    document.getElementsByClassName('container3-inventoryDetails')[0].style.display = 'block';
    document.getElementById('detailsButton').classList.add('highlight'); 
    document.getElementById('usageButton').classList.remove('highlight');   
}); 
 
document.getElementById('usageButton').addEventListener('click', function() {
    document.getElementsByClassName('container3-usagetable')[0].style.display = 'block';
    document.getElementsByClassName('container3-inventoryDetails')[0].style.display = 'none';
    document.getElementById('detailsButton').classList.remove('highlight'); 
    document.getElementById('usageButton').classList.add('highlight'); 
    //updateMaintenanceRecord(currSerialNum) 
});
 
document.getElementById('backButton').addEventListener('click', function() { 
    document.getElementsByClassName('inventory-details')[0].style.display = 'none'; 
    document.getElementsByClassName('container1')[0].style.display = 'block';
    document.getElementById('detailsButton').classList.add('highlight'); 
    document.getElementById('usageButton').classList.remove('highlight'); 
    var table = $('#example2').DataTable(); 
    table.clear();
}); 

function showInventoryDetails(inventoryID) {
    console.log(inventoryID);
    currID = inventoryID;

    updateInventoryDetails()

    document.getElementsByClassName('inventory-details')[0].style.display = 'block';
    document.getElementsByClassName('container1')[0].style.display = 'none';

    // Show details section by default
    document.getElementsByClassName('container3-inventoryDetails')[0].style.display = 'block';
}
 
//  Navigation between pages ends here  ----------------


populateData()  