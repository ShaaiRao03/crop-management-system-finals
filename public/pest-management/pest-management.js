function fetchPestData() {
    return new Promise((resolve, reject) => {  
        fetch('/getPestInfo', { 
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


fetchPestData()
.then(data => { 
    // adding some delay to ensure jquery is fully loaded 
    setTimeout(function() {

        //the table
        var table = $('#example').DataTable(); 
        table.destroy();

        // Map data and create rows 
        //current pest, treatmentPlan, inventoryUsed, Date, amount applied
        data.forEach(item => {
            const row = `<tr> 
                <td>${item.currentPest}</td>  
                <td>${item.treatmentPlan}</td>
                <td>${item.inventoryUsed}</td>
                <td>${item.treatmentStartDate}</td> 
                <td>${item.amountApplied}</td> 
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

function newPage(name) {
    console.log(name);
}

document.getElementsByClassName("add-pest-btn")[0].addEventListener('click', function() {
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
document.getElementById('pestForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Fetch form inputs
    const name = document.getElementById('name').value.trim();
    const field = document.getElementById('field').value.trim();
    const pestDesc = document.getElementById('pestDesc').value.trim();
    const treatment = document.getElementById('treatment').value.trim();
    const treatmentDesc = document.getElementById('treatmentDesc').value.trim();
    const treatmentStartDate = document.getElementById('treatmentStartDate').value.trim();
    const product = document.getElementById('product').value.trim();
    const inventoryUsed = document.getElementById('inventoryUsed').value.trim();
    const pic = document.getElementById('pic').value.trim();


    const amount= document.getElementById('amount').value.trim();

    // Validate required fields
    if (!field || !name || !pestDesc || !treatment || !treatmentDesc || !treatmentStartDate || !product|| !inventoryUsed || !pic || !amount) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }

    fetchUserID()
    .then(userID => { 
        // Submit the form data to the API 
        return fetch('/submit_pest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },  
            // body: formData 
            body: JSON.stringify({name, treatment, field, product, inventoryUsed, treatmentStartDate, pestDesc, pic, amount, treatmentDesc})
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