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

function showInventoryDetails(inventoryID) {
    console.log(inventoryID);
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
                const row = `<tr> 
                    <td><a href="#" class="table-link" onclick="showInventoryDetails('${item.inventoryID}')">${item.inventoryName}</a></td>  
                    <td>${item.inventoryType}</td>
                    <td>${item.manufacturer}</td> 
                    <td>${item.balance}</td> 
                    <td>${item.flagThreshold}</td> 
                    <td>Temporary data</td>  
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
    
                const row = `<tr> 
                    <td><a href="#" class="table-link" onclick="showInventoryDetails('${item.inventoryID}')">${item.inventoryName}</a></td>  
                    <td>${item.inventoryType}</td>
                    <td>${item.manufacturer}</td> 
                    <td>${item.balance}</td> 
                    <td>${item.flagThreshold}</td> 
                    <td>Temporary data</td>   
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

populateData()  