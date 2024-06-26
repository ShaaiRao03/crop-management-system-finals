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
 
function refetchData(){
    fetchPestData()
    .then(data => { 
        // adding some delay to ensure jquery is fully loaded 
        setTimeout(function() {
            
            console.log(data)

            //the table
            var table = $('#example').DataTable(); 
            table.clear();
    
            // Map data and create rows 
            data.forEach(item => {
                const row = `<tr> 
                    <td><a href="#" class="table-link" onclick="showPestDetails('${item.pestID}')">${item.currentPest}</a></td>  
                    <td>${item.treatmentPlan}</td>
                    <td>${item.treatmentStartDate}</td>
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
                <td><a href="#" class="table-link" onclick="showPestDetails('${item.pestID}')">${item.currentPest}</a></td>  
                <td>${item.treatmentPlan}</td>
                <td>${item.treatmentStartDate}</td>
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

function fetchPestByID(pestID) {
    return new Promise((resolve, reject) => {  
        fetch('/getPestInfoByID', {  
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ pestID }),
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

function fetchPestRecord(pestID) { 
    return new Promise((resolve, reject) => {  
        fetch('/getPestRecord', {   
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ pestID }),
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
    document.getElementsByClassName("preview-container")[0].style.display = 'none';
    document.getElementsByClassName("img-preview")[0].style.display = 'block';
    document.getElementsByClassName('popup-pest-autofill')[0].style.display = 'none'; 

    if (container) { 
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    } else {
        console.error('Container element with ID "radioButtonsContainer" not found.'); 
    }   

} 

// Pest details starts -------------------- 

function updatePestDetails(pestID){ 
    fetchPestByID(pestID)     
    .then(data => {  

        pestData = data[0] 
        // console.log(inventoryData.img)

        console.log(data)

       // const last_serviceDate = equipmentData.lastService;
       // const last_service = last_serviceDate.split('T'); 
 
        document.querySelector('.details-info.name').textContent = pestData.currentPest;  
        document.querySelector('.details-info.treatment').textContent = pestData.treatmentPlan;
        document.querySelector('.details-info.date').textContent = pestData.treatmentStartDate;

        document.querySelector('.overview-label').textContent = pestData.currentPest + " Overview" 

        // Handling images -----------------------------
         
        // imageData contains the Buffer object retrieved from the database
        var imageData = pestData.img 
        
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

                imgElement.id = "pest-image"

                imgElement.alt = "Placeholder Image";

                var existingImgElement = document.getElementById("pest-image");

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

            imgElement.id = "pest-image"
 
            // Set the alt attribute 
            imgElement.alt = "Placeholder Image";

            // Get the existing img element by its ID or another suitable selector
            var existingImgElement = document.getElementById("pest-image");

            // console.log("Data not exist")
            // console.log(existingImgElement); // Check if existingImgElement is found
            // console.log(existingImgElement.parentNode);  

            // Replace the existing img element with the new Image element
            existingImgElement.parentNode.replaceChild(imgElement, existingImgElement);

        }
    }) 
}

// Pest details ends -------------------- 

// submit form
// document.getElementById('pestForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission
    
//     // Fetch form inputs
//     const name = document.getElementById('name').value.trim();
//     const field = document.getElementById('field').value.trim();
//     const pestDesc = document.getElementById('pestDesc').value.trim();
//     const treatment = document.getElementById('treatment').value.trim();
//     const treatmentDesc = document.getElementById('treatmentDesc').value.trim();
//     const treatmentStartDate = document.getElementById('treatmentStartDate').value.trim();
//    // const product = document.getElementById('product').value.trim();
//     //const inventoryUsed = document.getElementById('inventoryUsed').value.trim();
//     const pic = document.getElementById('pic').value.trim();


//     //const amount= document.getElementById('amount').value.trim();

//     // Validate required fields
//     if (!field || !name || !pestDesc || !treatment || !treatmentDesc || !treatmentStartDate || !pic) {
//         alert('Please fill in all required fields.');
//         return; // Exit the function
//     }

//     const image = document.getElementById('image').files[0];
//     console.log(image)  

//     fetchUserID()
//     .then(user_userID => { 

//         userID = user_userID[0].userID 
//         console.log(userID) 
//         // Submit the form data to the API 
//         return fetch('/submit_pest', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },  
//             // body: formData 
//             body: JSON.stringify({name, treatment, field, treatmentStartDate, pestDesc, pic, treatmentDesc , image , userID})
//         });
//     })
//     .then(response => {
//         if (response.ok) { 
//             // Form submitted successfully 
//             alert('Form submitted successfully!');
//         } else {
//             throw new Error('Error submitting form.');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('An error occurred while submitting the form. Please try again.');
//     }); 

// });


document.getElementById('pestForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Fetch form inputs
    const name = document.getElementById('name').value.trim();
    const field = document.getElementById('field').value.trim();
    const pestDesc = document.getElementById('pestDesc').value.trim();
    const treatment = document.getElementById('treatment').value.trim();
    const treatmentDesc = document.getElementById('treatmentDesc').value.trim();
    const treatmentStartDate = document.getElementById('treatmentStartDate').value.trim();
    // const pic = document.getElementById('pic').value.trim();

    // Validate required fields
    if (!field || !name || !pestDesc || !treatment || !treatmentDesc || !treatmentStartDate ) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }

    const image = document.getElementById('image2').files[0];

    fetchUserID()
    .then(user_userID => { 
        const userID = user_userID[0].userID;
        console.log(userID);

        // Create FormData object and append form data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('field', field);
        formData.append('pestDesc', pestDesc);
        formData.append('treatment', treatment);
        formData.append('treatmentDesc', treatmentDesc);
        formData.append('treatmentStartDate', treatmentStartDate);
        // formData.append('pic', pic);
        formData.append('image', image); // Append image file
        formData.append('userID', userID);


        // Submit the form data to the API 
        return fetch('/submit_pest', {
            method: 'POST',
            body: formData // Use FormData object as the body
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

function updatePestRecord(pestID){ 
    fetchPestRecord(pestID) 
    .then(data => {   
        console.log(data)

        setTimeout(function() {

            //the table
            var table = $('#example2').DataTable(); 
            table.clear(); 
    
            // Map data and create rows   
            data.forEach(item => {

                const treatment_date = item.treatmentDate;
                const date = treatment_date.split('T'); 

                const row = `<tr> 
                    <td>${item.treatment}</td>
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


function reUpdatePestRecord(pestID){ 
    fetchPestRecord(pestID) 
    .then(data => {  
        console.log(data)

        setTimeout(function() {

            //the table
            var table = $('#example2').DataTable(); 
            table.clear(); 
    
            // Map data and create rows   
            data.forEach(item => {

                const treatment_date = item.treatmentDate;
                const date = treatment_date.split('T'); 

                const row = `<tr> 
                    <td>${item.treatment}</td>
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

function detectPest(event) { 
    event.preventDefault();  
    clearPestWithoutImage(event) 
    document.getElementById("pestName").textContent= "Predicting pest..."

    document.getElementById("pestDescription").textContent= ""
    document.getElementById("label-pestDescription").textContent= ""
    document.querySelector('.preview-container').style.display = 'block';
    document.getElementsByClassName("img-preview")[0].style.display = 'none';
    
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
            // document.getElementById("pestName").textContent= "Predicted Pest : " + labelWithHighestScore

            const parsedScore = parseFloat(highestScore); // Convert highestScore to a number

            if(parsedScore > 0.5){
                document.getElementById("pestName").innerHTML = "Predicted Pest: <span style='color: black;'>" + labelWithHighestScore + "</span>";

                document.getElementById("label-pestSolution").textContent= "Fetching possible solutions..."
                showPestDescription(`Can you give me a description for the following pest "${labelWithHighestScore}" ? Keep your answer as short as possible. I dont need unnecessary information. Dont use any special characters. Thank you`);
                showPossibleSolution(`Can you suggest 3 pest management for the following pest "${labelWithHighestScore}" ? Keep your answer in point form and as short as possible. Give me in numbers and only the points. I dont need unnecessary information. Dont use any special characters other than ':'. Thank you`);

            } else { 
                document.getElementById("pestName").textContent= "Sorry, we could'nt detect the pest"
            }

        })
        .catch(error => {
            console.error('Error:', error);
        }); 


    } else {
        document.getElementsByClassName("preview-container")[0].style.display = 'none';
        document.getElementsByClassName("img-preview")[0].style.display = 'block';
        alert('No file selected.'); 
    } 

} 

function showPestDescription(query) { 
    fetchMessage(query)
    .then(data => {
        pestDescription = document.getElementById("pestDescription") 
                
        if (pestDescription) {    
            document.getElementById("label-pestDescription").textContent= "Pest Description :"
            pestDescription.textContent = data.message;  
            pestDescription.style.color = 'black';
        } else {
            console.error('Label element with class "generated-message" not found.'); 
        }

    })
    .catch(error => {
        console.error(error); 
    });
}

function showPossibleSolution(query) {
    fetchMessage(query)
    .then(data => {
        // console.log(data); 
        
        solution = document.getElementById("generated-solution")
                
        if (solution) {   

            document.getElementById("label-pestSolution").textContent= "Possible solutions :"

            var descriptions = data.message.split(/\d+\.\s/).filter(Boolean);
            var parentContainer = document.getElementById('radioButtonsContainer'); 

            for (var i = 0; i < descriptions.length; i++) {
                var radioButton = document.createElement('input');
                radioButton.type = 'radio';  
                radioButton.id = 'option' + (i + 1);
                radioButton.name = 'option';
                radioButton.value = descriptions[i];
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

document.getElementById('recordPestForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Fetch form inputs
    const treatment = document.getElementById('description').value.trim();
    const date = document.getElementById('treatment-date').value.trim();

    // Validate required fields
    if (!date || !treatment) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }
      
    console.log(treatment , date , pestID) 

    return new Promise((resolve, reject) => { 
        fetch('/submit_pest_record', {  
            method: 'POST',   
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({treatment , date , pestID}),     
        }).then(response => { 
            if (response.ok) { 
                // Form submitted successfully    
                alert('Form submitted successfully!'); 
                reUpdatePestRecord(pestID) 
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

//  Navigation between pages starts here  ----------------

function showPestDetails(pestIDFromLink) {    
    console.log("Test: ", pestID);  
    pestID = pestIDFromLink; 
  
    updatePestDetails(pestID)

    document.getElementsByClassName('pest-details')[0].style.display = 'block';
    document.getElementsByClassName('container1')[0].style.display = 'none';

    // Show details section by default
    document.getElementsByClassName('container3-pestDetails')[0].style.display = 'block';
    document.getElementsByClassName('container3-pesttable')[0].style.display = 'none';
}

document.getElementById('detailsButton').addEventListener('click', function() {
    document.getElementsByClassName('container3-pesttable')[0].style.display = 'none';
    document.getElementsByClassName('container3-pestDetails')[0].style.display = 'block';
    document.getElementById('detailsButton').classList.add('highlight'); 
    document.getElementById('pestButton').classList.remove('highlight');   
}); 

document.getElementById('backButton').addEventListener('click', function() { 
    //document.getElementsByClassName('container3-usagetable')[0].style.display = 'none'; 
    document.getElementsByClassName('pest-details')[0].style.display = 'none'; 
    document.getElementsByClassName('container1')[0].style.display = 'block';
    document.getElementById('detailsButton').classList.add('highlight'); 
    document.getElementById('pestButton').classList.remove('highlight'); 
    //TBA
    var table = $('#example').DataTable(); 
    table.clear();
}); 

document.getElementById('pestButton').addEventListener('click', function() { 
    // document.getElementsByClassName('maintenance-section')[0].style.display = 'block';
    document.getElementsByClassName('container3-pesttable')[0].style.display = 'block';
    document.getElementsByClassName('container3-pestDetails')[0].style.display = 'none';
    document.getElementById('detailsButton').classList.remove('highlight'); 
    document.getElementById('pestButton').classList.add('highlight'); 
    updatePestRecord(pestID) 
});

//  Navigation between pages ends here  ----------------

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

// Editable starts here ------------------------------
function makeDetailsEditable() {
    const detailsContainer = document.querySelector('.details-container');

    const deleteButton = document.getElementById('deleteButton');
    // Add a disabled class to the button
    deleteButton.classList.add('disabled');

    // Also, set the disabled attribute to prevent default button behavior
    deleteButton.setAttribute('disabled', 'disabled');

    // Show update button
    const updateButton = document.getElementById('updateButton'); 
    // Hide the edit button
    const editButton = document.getElementById('editButton'); 

        // Hide the edit button
        editButton.style.display = 'none';
        // Show update button 
        updateButton.style.display = 'block'; 
        // Loop through each details item and replace it with an input field
        detailsContainer.querySelectorAll('.details-item').forEach(item => {
            const infoSpan = item.querySelector('.details-info');
            const labelSpan = item.querySelector('.details-label');
            const separator = item.querySelector('.separator');

            // Create an input field
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.value = infoSpan.textContent.trim();

            // Set input field styles to match original details-info class
            input.style.width = '600px'; // Set width to match
            input.style.padding = '0'; // Reset padding to match original
            input.style.marginLeft = '30px';
            input.style.marginBottom = '0px';

            // Replace the info span with the input field
            item.removeChild(infoSpan); // Remove the span
            item.insertBefore(separator, labelSpan.nextSibling); // Insert : after label
            item.insertBefore(input, separator.nextSibling); // Insert input after :
        });


    // Add event listener to the update button
    updateButton.addEventListener('click', function() {
        // Create an object to store updated details
        let updatedDetails = {};

        // Loop through each details item and gather the updated information
        detailsContainer.querySelectorAll('.details-item').forEach(item => {
            const label = item.querySelector('.details-label').textContent.trim();
            const input = item.querySelector('input[type="text"]');

            if (input == '' || input == null){
                console.log("no changes made.");
            } else {
                updatedDetails[label.toLowerCase()] = input.value.trim();
            }
            
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
        // Send updated details to the server
        if(updatedDetails != {}) {
            updateDetails(pestID, updatedDetails)
            .then(() => {
                console.log('Details updated successfully');
                refetchData();
            })
            .catch(error => {
                console.error('Error updating details:', error);
            });
        } else {
            console.log('No changes made.');
        }
    });
    
}

function updateDetails(pestID, updatedDetails){
    console.log("new details gathered");

    return new Promise((resolve, reject) => {  
        fetch('/updatePestDetails', { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pestID, updatedDetails }),
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

function editButtonEventListener(){
    // Call makeDetailsEditable() when the edit button is clicked
    const editButton = document.getElementById('editButton')
    editButton.addEventListener('click', makeDetailsEditable);
}

function updateButtonListener(){
    // Call updateDetails() when the update button is clicked
    console.log("update button clicked");
    const updateBtn = document.getElementById('updateButton');
    updateBtn.addEventListener('click', updateDetails(pestID));
}

// Editable ends here ------------------------------

// Clearing form data starts here ------------------------------

function clearButtonEventListener(){
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.addEventListener('click', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Clear the form data
        clearPestFormData();
    });
}

function clearPestFormData(){
    // Remove the 'required' attribute from all required fields
    document.querySelectorAll('#pestForm [required]').forEach(field => {
        field.removeAttribute('required');
    });

    // Reset the form
    document.getElementById("pestForm").reset();

    // Add back the 'required' attribute to required fields
    document.querySelectorAll('#pestForm [data-required]').forEach(field => {
        field.setAttribute('required', 'required');
    });
}

function clearRecordFormData(){
    // Remove the 'required' attribute from all required fields
    document.querySelectorAll('#recordPestForm [required]').forEach(field => {
        field.removeAttribute('required');
    });

    // Reset the form
    document.getElementById("recordPestForm").reset();

    // Add back the 'required' attribute to required fields
    document.querySelectorAll('#recordPestForm [data-required]').forEach(field => {
        field.setAttribute('required', 'required');
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

function clearPest(event) {
    event.preventDefault(); // Prevent form submission

    // Reset the form
    document.getElementById('recordForm').reset();  
    solution = document.getElementById("generated-solution")
    solution.textContent = ""
    document.getElementById("pestDescription").textContent= ""
    document.getElementById("label-pestSolution").textContent= "" 
    document.getElementById("label-pestDescription").textContent= ""

    // Hide the image preview container and show the image preview label
    document.querySelector('.img-preview').style.display = 'block';
    document.querySelector('.preview-container').style.display = 'none';

    var container = document.getElementById('radioButtonsContainer');

    if (container) { 
        while (container.firstChild) { 
            container.removeChild(container.firstChild);
        }
    } else {
        console.error('Container element with ID "radioButtonsContainer" not found.'); 
    }

}


function clearPestWithoutImage(event) { 
    event.preventDefault(); // Prevent form submission

    // Reset the form
    // document.getElementById('recordForm').reset();   
    solution = document.getElementById("generated-solution")
    solution.textContent = ""
    document.getElementById("label-pestSolution").textContent= "" 

    // Hide the image preview container and show the image preview label
    document.querySelector('.img-preview').style.display = 'block';
    document.querySelector('.preview-container').style.display = 'none';

    var container = document.getElementById('radioButtonsContainer');

    if (container) { 
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    } else {
        console.error('Container element with ID "radioButtonsContainer" not found.'); 
    }

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

// Clearing form data ends here ------------------------------


// Autofill form data starts here ----------------------------

function createFormPestDetection(pestName,pestDescription,treatmentPlan,treatmentDesc) {
    const form = document.createElement('form'); 
    form.className = 'pestDetection-form'; // Added a class for styling purposes
    form.enctype = 'multipart/form-data';  
    form.id = 'pestDetection2'; 

    form.innerHTML = `   
            <label class="form-title">Add New Pest</label> 
            <label for="name">Pest Name:</label>
            <input type="text" id="name" name="name" value="${pestName}" required><br>

            <label for="type">Field:</label>
            <select id="fieldRecom" name="field" style="height: 35px;">
            </select>
        
            <label for="pestDesc">Pest description:</label> <!--autofill-->
            <input type="text" id="pestDesc" name="pestDesc" value="${pestDescription}"><br>
        
            <label for="treatment">Treatment Plan:</label>
            <input type="text" id="treatment" name="treatment" value="${treatmentPlan}"><br>
        
            <label for="treatmentDesc">Treatment Description:</label> <!--autofill--> 
            <input type="text" id="treatmentDesc" name="treatmentDesc" value="${treatmentDesc}"><br> 

            <label for="treatmentStartDate">Treatment Start Date:</label>
            <input type="date" id="treatmentStartDate" name="treatmentStartDate"><br>
        

            <label for="image">Upload Image:</label> 
            <input type="file" id="image3" name="image"><br>
        
            <div class="button-container">
                <button type="submit" onclick="submitNewPest(event)" class="submit-new-pest">Submit</button>
                <button class="clear-btn" id="clearBtn">Clear</button>
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

document.getElementsByClassName("autofill-pest-form")[0].addEventListener('click', function() { 
    const selectedSolution = document.querySelector('input[name="option"]:checked').value;
    const pestDescription = document.getElementById("pestDescription").textContent 
    
    //pest name 
    const pestNameLabel = document.getElementById("pestName");
    const pestName = pestNameLabel.textContent
 
    getTreatmentPlan = selectedSolution.split(':')[0];   
    getTreatmentDesc = selectedSolution.split(':')[1]; 
    getPestName = pestName.split(':')[1]  
    getPestDescription = pestDescription 
 

    console.log(getTreatmentDesc) 

    openPopupAutoFillPest(getPestName,getPestDescription,getTreatmentPlan,getTreatmentDesc);   

});  

 
function openPopupAutoFillPest(pestName,pestDescription,treatmentPlan,treatmentDesc) {
    document.getElementsByClassName('popup-pest-autofill')[0].style.display = 'block'; 
    document.getElementById('popup-pestDetection').style.display = 'none';
    document.getElementById('overlay').style.display = 'block';  
    generateAutoFillPestForm(pestName,pestDescription,treatmentPlan,treatmentDesc); 
}


function generateAutoFillPestForm(pestName,pestDescription,treatmentPlan,treatmentDesc){
    const container = document.getElementsByClassName('popup-pest-autofill')[0]; 
    const form = createFormPestDetection(pestName,pestDescription,treatmentPlan,treatmentDesc);
    container.appendChild(form);
}
  

function submitNewPest(event){    
    event.preventDefault(); 
    
    const form = document.getElementById('pestDetection2');
    console.log(form)

    // Access the input fields by their IDs
    const field = form.querySelector('#fieldRecom').value; 
    const name = form.querySelector('#name').value; 
    const pestDesc = form.querySelector('#pestDesc').value; 
    const treatment = form.querySelector('#treatment').value; 
    const treatmentDesc = form.querySelector('#treatmentDesc').value; 
    const treatmentStartDate = form.querySelector('#treatmentStartDate').value;  
 

    if (!field || !name || !pestDesc || !treatment || !treatmentDesc || !treatmentStartDate ) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }

    const image = document.getElementById('image3').files[0];

    fetchUserID()
    .then(user_userID => { 
        const userID = user_userID[0].userID;
        console.log(userID);

        // Create FormData object and append form data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('field', field);
        formData.append('pestDesc', pestDesc);
        formData.append('treatment', treatment);
        formData.append('treatmentDesc', treatmentDesc);
        formData.append('treatmentStartDate', treatmentStartDate);
        formData.append('image', image); // Append image file
        formData.append('userID', userID);


        // Submit the form data to the API 
        return fetch('/submit_pest', {
            method: 'POST',
            body: formData // Use FormData object as the body 
        });  
    })
    .then(response => {
        if (response.ok) {  
            // Form submitted successfully 
            alert('Form submitted successfully!');
            refetchData() 
            closePopup() 
        } else {
            throw new Error('Error submitting form.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
   
}

 
// Autofill form data ends here ------------------------------

var pestID;
editButtonEventListener();
clearButtonEventListener();
clearRecordButtonEventListener();
