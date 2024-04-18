
// get user name 
function fetchUserName() {
    return new Promise((resolve, reject) => {  
        fetch('/getUserName', { 
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

fetchUserName()
.then(data =>{
        const userName = data[0].name;
        console.log(userName);

        const nameElement = document.getElementById('username');
        if (nameElement) { 
            nameElement.textContent = userName;
        } else {
            console.error('fieldStat h2 element not found');
        }
    console.log(data);
})
.catch(error => {
    console.error('Error fetching field data:', error);
});

function newPage(name) {
    console.log(name);
}

//get field data
function fetchFieldNum(){ 
    return new Promise((resolve, reject) => {  
        fetch('/getFieldNum', {  
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


fetchFieldNum()
.then(data =>{
        const fieldCount = data[0].num_rows; 
        console.log("fieldCount",fieldCount);

        const fieldStatElement = document.getElementById('fieldNum');
        if (fieldStatElement) { 
            fieldStatElement.textContent = fieldCount;
        } else {
            console.error('fieldStat h2 element not found');
        }
    console.log(data);
})
.catch(error => {
    console.error('Error fetching field data:',error);
});


function reupdateFetchFieldNum(){
    fetchFieldNum()
    .then(data =>{
            const fieldCount = data[0].num_rows; 
            console.log("fieldCount",fieldCount);

            const fieldStatElement = document.getElementById('fieldNum');
            if (fieldStatElement) { 
                fieldStatElement.textContent = fieldCount;
            } else {
                console.error('fieldStat h2 element not found');
            }
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching field data:',error);
    });
}

//get crop data
function fetchCropNum(){ 
    return new Promise((resolve, reject) => {  
        fetch('/getCropNum', { 
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


fetchCropNum() 
.then(data =>{  
        const cropCount = data[0].num_rows; 
        console.log("cropcount:",cropCount); 

        const cropStatElement = document.getElementById('cropNum');
        if (cropStatElement) { 
            cropStatElement.textContent = cropCount; 
        } else {
            console.error('cropStat h2 element not found');
        }
}) 
.catch(error => {
    console.error('Error fetching field data:', error); 
});



// get field table data (field name + crop name)
function fetchFieldData() {
    return new Promise((resolve, reject) => {  
        fetch('/getFieldInfo', { 
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

function populateTable() {
    fetchFieldData()
    .then(data => { 
        // adding some delay to ensure jquery is fully loaded 
        setTimeout(function() {

            //the table
            var table = $('#example').DataTable(); 
            table.destroy();

            // Map data and create rows 
            data.forEach(item => {
                const row = `<tr> 
                    <td>${item.fieldID}</td>
                    <td><a href="#" class="table-link" onclick="showFieldDetails('${item.fieldID}')">${item.fieldName}</a></td>  
                    <td>${item.soilType}</td> 
                    <td>${item.size}</td>
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

function reupdateTable() {
    fetchFieldData()
        .then(data => {
            // Adding some delay to ensure jQuery is fully loaded
            setTimeout(function () {
                // The table
                var table = $('#example').DataTable();
                
                // Clear existing data
                table.clear();

                // Map data and create rows 
                data.forEach(item => {
                    const row = `<tr>
                    <td>${item.fieldID}</td>
                    <td><a href="#" class="table-link" onclick="showFieldDetails('${item.fieldID}')">${item.fieldName}</a></td>  
                        <td>${item.soilType}</td>
                        <td>${item.size}</td>
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


function showFieldDetails(fieldID) {
    openPopupRecord();
    updateFieldRecord(fieldID);
    console.log(fieldID); 
}


function updateFieldRecord(fieldID) {
    fetch('/getFieldInfoByID', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fieldID })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(fieldRecord => {
        console.log(fieldRecord); 
        const data = fieldRecord[0];

        // Update the field record form with the fetched data
        document.querySelector('.details-info.fieldName').textContent = data.fieldName;  
        document.querySelector('.details-info.fieldLocation').textContent = data.fieldLocation;  
        document.querySelector('.details-info.soilType').textContent = data.soilType;   
        document.querySelector('.details-info.size').textContent = data.size;   

        currLat = data.latitude; 
        currLong = data.longitude;

        fetch('/getPolygonCoordinates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fieldID })
        })
        .then(response => { 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); 
        }).then(data => { 
            console.log(data);
            InitMapViewOnly(currLat, currLong, data);
        }) 

    })
    .catch(error => {
        console.error('Error fetching field record data:', error);
    });
} 


function InitMapViewOnly(lat, long, polygonCoordinates) {
    var location = new google.maps.LatLng(lat, long);
    var mapOptions = {
        zoom: 16,
        center: location,
        mapTypeId: google.maps.MapTypeId.RoadMap
    };
    var map = new google.maps.Map(document.getElementById('map-canvas2'), mapOptions);

    // Create the polygon
    var polygon = new google.maps.Polygon({
        paths: polygonCoordinates,
        fillColor: '#ADFF2F', // Fill color
        fillOpacity: 0.5, // Fill opacity
        strokeWeight: 2, // Stroke weight
        clickable: true, // Allow the polygon to be clicked
        map: map // Add the polygon to the map
    });

    // Center the map on the polygon
    var bounds = new google.maps.LatLngBounds(); 
    polygonCoordinates.forEach(coord => {
        bounds.extend(coord);
    });
    map.fitBounds(bounds);

    // Disable drawing tools
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false
    });
    drawingManager.setMap(map);
}




//get tasks in progress
function fetchTasksInProgress(){
    return new Promise((resolve, reject) => {  
        fetch('/getTasksInProgress', { 
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

fetchTasksInProgress()
.then(data =>{
        const tasksInProgressCount = data[0].num_rows;
        console.log(tasksInProgressCount);

        const tasksInProgressStatElement = document.getElementById('tasksInProgress');
        if (tasksInProgressStatElement) { 
            tasksInProgressStatElement.textContent = tasksInProgressCount;
        } else {
            console.error('tasks in progress element not found');
        }
    console.log(data);
})
.catch(error => {
    console.error('Error fetching task in progress data:', error);
});

//get tasks in progress
function fetchTasksCompleted(){
    return new Promise((resolve, reject) => {  
        fetch('/getTasksCompleted', { 
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

fetchTasksCompleted()
.then(data =>{
        const tasksCompletedCount = data[0].num_rows;
        console.log(tasksCompletedCount);

        const tasksCompletedStatElement = document.getElementById('tasksCompleted');
        if (tasksCompletedStatElement) { 
            tasksCompletedStatElement.textContent = tasksCompletedCount;
        } else {
            console.error('tasks completed element not found');
        }
    console.log(data);
})
.catch(error => {
    console.error('Error fetching tasks completed data:', error);
});

function newPage(name) {
    console.log(name);
}


document.getElementsByClassName("add-field-btn")[0].addEventListener('click', function() {
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
    document.getElementById('popup-fieldRecord').style.display = 'none';
    clearForm2(); 
}

function openPopupRecord() {  
    document.getElementById('popup-fieldRecord').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function insertFieldIntoDatabase(name,soilType,size,address,currLat,currLong){
    fetch('/submit_field', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ name, soilType, size, address, currLat , currLong }) 
    })
    .then(response => {
        if (!response.ok) { 
            throw new Error('Network response was not ok');  
        }
        return response.json();
    })
    .then(data => {
        console.log('Form data inserted successfully:', data);

        fetch('/getFieldIDgivenFieldName', {  
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        }) 
        .then(response => {
            if (!response.ok) {  
                throw new Error('Network response was not ok');
            }
            return response.json();
        })   
        .then(data => { 
            
            console.log(data)
            const fieldID = data[0].fieldID; 

            const parsedCoordinates = currCoord.map(coordString => {
                const [lat, lng] = coordString.split(',').map(parseFloat);
                return { lat, lng };
            });
            

            parsedCoordinates.forEach(coordObject => {
                const { lat, lng } = coordObject;
                const body = JSON.stringify({
                    fieldID,
                    lng,
                    lat
                });
            
                fetch('insertFieldMap', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Coordinate inserted successfully:', data);
                })
                .catch(error => {
                    console.error('Error inserting coordinate into database:', error);
                });
            });
            


            fetchUserID()
            .then(data => {
                const userID = data[0].userID; 
                console.log("userID",userID)
                fetch('/insertUserField', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify({ fieldID, userID })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {

                    console.log('Field User inserted successfully:', data);
                    reupdateTable()
                    reupdateFetchFieldNum()
                    closePopup()
                    
                })
                .catch(error => {
                    console.error('Error inserting field user into database:', error);
                });
            })


        })
        .catch(error => { 
            console.log(error); // Reject with the error
        });  

    })
    .catch(error => {
        console.error('Error inserting form data into database:', error);
        // Handle the error
    }); 
}


function clearForm(event){
    event.preventDefault();
    document.getElementById("fieldForm").reset();
    document.getElementById('map-canvas').style.display = 'none';
}

function clearForm2(){
    document.getElementById("fieldForm").reset();
    document.getElementById('map-canvas').style.display = 'none';
}

// submit form
document.getElementById('fieldForm').addEventListener('submit', function(event) { 
    event.preventDefault(); // Prevent default form submission
    
    // Fetch form inputs
    const name = document.getElementById('name').value.trim(); 
    const soilType = document.getElementById('soilType').value.trim();
    const size = document.getElementById('size').value.trim(); 
    const address = document.getElementById('address').value.trim(); 
     

    // // Validate required fields
    if (!name || !soilType || !size || !address) {
        alert('Please fill in all required fields.');
        return; // Exit the function
    }

    insertFieldIntoDatabase(name,soilType,size,address,currLat,currLong)

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




// Drawing map starts ----------------------------------------------------------------




function InitMap(lat,long) {
    var location = new google.maps.LatLng(lat,long) 
    mapOptions = {
        zoom: 16,
        center: location, 
        mapTypeId: google.maps.MapTypeId.RoadMap
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)
    var all_overlays = [];
    var selectedShape;
    var drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.MARKER, 
        //drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER, 
            drawingModes: [
                //google.maps.drawing.OverlayType.MARKER,
                //google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                //google.maps.drawing.OverlayType.RECTANGLE
            ]
        },
        markerOptions: {
            //icon: 'images/beachflag.png'
        },
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 0.2,
            strokeWeight: 3,
            clickable: false,
            editable: true,
            zIndex: 1
        },
        polygonOptions: {
            clickable: true,
            draggable: false,
            editable: true,
            // fillColor: '#ffff00',
            fillColor: '#ADFF2F',
            fillOpacity: 0.5,

        },  
        rectangleOptions: {
            clickable: true,
            draggable: true,
            editable: true,
            fillColor: '#ffff00',
            fillOpacity: 0.5,
        }
    });

    function clearSelection() {
        if (selectedShape) {
            selectedShape.setEditable(false);
            selectedShape = null;
        }
    }

    //to disable drawing tools
    function stopDrawing() {
        drawingManager.setMap(null);
    }

    function setSelection(shape) {
        clearSelection();
        stopDrawing()
        selectedShape = shape;
        shape.setEditable(true);
    }

    function deleteSelectedShape() {
        if (selectedShape) {
            selectedShape.setMap(null);
            drawingManager.setMap(map);
            coordinates.splice(0, coordinates.length)
            // document.getElementById('info').innerHTML = "" 
        }
    } 

    function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Select to delete the shape';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Delete Selected Area';
        controlUI.appendChild(controlText);

        //to delete the polygon
        controlUI.addEventListener('click', function () {
            deleteSelectedShape();
        });
    }

    drawingManager.setMap(map);

    var getPolygonCoords = function (newShape) {
 
        coordinates.splice(0, coordinates.length)

        var len = newShape.getPath().getLength();

        for (var i = 0; i < len; i++) { 
            coordinates.push(newShape.getPath().getAt(i).toUrlValue(6))
        }
        // document.getElementById('info').innerHTML = coordinates
 
        currCoord = coordinates
        console.log(currCoord) 
       
    }

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (event) {
        event.getPath().getLength();
        google.maps.event.addListener(event, "dragend", getPolygonCoords(event));

        google.maps.event.addListener(event.getPath(), 'insert_at', function () {
            getPolygonCoords(event)
            
        });

        google.maps.event.addListener(event.getPath(), 'set_at', function () {
            getPolygonCoords(event)
        })
    })

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        all_overlays.push(event);
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
            drawingManager.setDrawingMode(null);

            var newShape = event.overlay;
            newShape.type = event.type;
            google.maps.event.addListener(newShape, 'click', function () {
                setSelection(newShape);
            });
            setSelection(newShape);
        }
    })

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

}


// fetching the lat and long for the address
async function fetchGeocodingData(address) {
    const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await fetch(geocodingApiUrl);
        const data = await response.json();

        if (data.status === 'OK') {
            // Geocoding was successful, extract the latitude and longitude
            const location = data.results[0].geometry.location;
            const latitude = location.lat;
            const longitude = location.lng;

            return [latitude, longitude];  
        } else {
            console.error('Geocoding failed. Error message:', data.error_message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching geocoding data:', error);
    }
}

//fetching the map 
function fetchMap(event){
    event.preventDefault()
    address = document.getElementById('address').value
    
    if(!address){
        document.getElementById('map-canvas').style.display = 'none';  
        alert('Please enter an address')
        return
    }else{
        fetchGeocodingData(address)
        .then(coords => { 
            if (coords) {
                const [latitude, longitude] = coords;

                currLat = latitude;
                currLong = longitude;

                console.log('Latitude:', latitude); 
                console.log('Longitude:', longitude);

                document.getElementById('map-canvas').style.display = 'block';  
                InitMap(latitude,longitude) 

            } else {
                console.log('Geocoding failed or encountered an error.');
            }
        });
    }
} 


// view record for the field 


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



// ----------------------- 




var mapOptions;
var map;
var apiKey = 'AIzaSyDPSqtt1iIR3T1txPw6FsFyWXgvX_ui5A8'; 

var coordinates = [];
var lastElement;

var currCoord;

var currLat;
var currLong;

populateTable()
// Drawing map ends ----------------------------------------------------------