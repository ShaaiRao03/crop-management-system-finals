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
    console.log('clicked add pest');
    openPopup()
}); 

document.getElementsByClassName("pest-detection-btn")[0].addEventListener('click', function() {
    console.log('clicked pest detection');
    openPopupDetection()
}); 

function openPopup() {  
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; 
}

function openPopupDetection() {  
    document.getElementById('popup-pestDetection').style.display = 'block'; 
    document.getElementById('overlay').style.display = 'block'; 
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup-pestDetection').style.display = 'none';
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


function detectPest(event) { 
    event.preventDefault(); 
    // Show the preview container
    document.getElementById("pestName").textContent= "" 
    document.querySelector('.preview-container').style.display = 'block';
    
    // Call the previewImage function to display the image preview
    previewImage();
  }
 
function previewImage() {

    var input = document.getElementById('image');
    var preview = document.getElementById('preview');
    var file = input.files[0];

    if (file) { 

        document.getElementsByClassName("preview-container")[0].style.display = 'block';
        document.getElementsByClassName("img-preview")[0].style.display = 'none';

        var reader = new FileReader();
        reader.onload = function() {
            preview.src = reader.result;
        }
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('image', file);
        
        const imageData = formData.get('image');

        query(imageData) 
        .then(response => {
            const stringifiedData = response.map(item => JSON.stringify(item));

            let highestScore = -Infinity;
            let labelWithHighestScore = '';

            for (let i = 0; i < stringifiedData.length; i++) {
                const obj = JSON.parse(stringifiedData[i]);
                if (obj.score > highestScore) {
                    highestScore = obj.score;
                    labelWithHighestScore = obj.label;
                }
            }

            console.log("Label with highest score:", labelWithHighestScore);
            console.log("Highest score:", highestScore);
 
            console.log(stringifiedData);
            document.getElementById("pestName").textContent= "Predicted Pest : " + labelWithHighestScore
            const parsedScore = parseFloat(highestScore); // Convert highestScore to a number

            if(parsedScore > 0.5){
                document.getElementById("pestName").textContent= "Predicted Pest : " + labelWithHighestScore 
                message = fetchMessage(`Can you suggest 3 pest management for the following pest "${labelWithHighestScore}" ? Keep your answer in point form and as short as possible. Give me in numbers.`)
                console.log(message)
            } else {
                document.getElementById("pestName").textContent= "Sorry, we could'nt detect the pest"
            }

        })
        .catch(error => {
            console.error('Error:', error);
        }); 


    } else {
        alert('No file selected.'); 
    }

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
 
                // Select the label element with the class "generated-message"
                const labelElement = document.querySelector('.generated-message');

                if (labelElement) { 
                    labelElement.textContent = data.message; // Change 'New message' to whatever message you want to set
                } else {
                    console.error('Label element with class "generated-message" not found.'); 
                }
 
                resolve(data); // Resolve with the fetched data  
            })
            .catch(error => { 
                reject(error); // Reject with the error
            });     
    }); 
} 


async function query(imageData) {
    const API_TOKEN = "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";
    const response = await fetch(
        "https://api-inference.huggingface.co/models/Bazaar/cv_forest_pest_detection",
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST", 
            body: imageData,
        }
    );
    const result = await response.json();
    return result;
}




function clearPest(event) {
    event.preventDefault(); // Prevent form submission

    // Reset the form
    document.getElementById('recordForm').reset();

    // Hide the image preview container and show the image preview label
    document.querySelector('.img-preview').style.display = 'block';
    document.querySelector('.preview-container').style.display = 'none';
}