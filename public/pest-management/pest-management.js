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

// submit form original 
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
        // Construct form data to be sent to the API
        // const formData = new FormData(); 
        // console.log('User ID fetched:', userID);
        
        // formData.append('name', name);
        // formData.append('treatment', treatment);
        // formData.append('field', field);
        // formData.append('product', product);
        // formData.append('inventoryUsed', inventoryUsed);
        // formData.append('treatmentStartDate', treatmentStartDate);
        // formData.append('pestDesc', pestDesc);
        // formData.append('pic', pic);
        // formData.append('amount', amount);
        // formData.append('treatmentDesc', treatmentDesc);
        
        // console.log('All data appended');

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