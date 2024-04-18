// Get the canvas element
var canvas = document.getElementById('circleCanvas');
var ctx = canvas.getContext('2d');

// Function to draw a small circle
function drawSmallCircle(radius, labelOn) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);

    // Check if label is on or off
    if (labelOn === 'On') {
        ctx.fillStyle = 'green'; // Green color if label is on
    } else {
        ctx.fillStyle = 'grey'; // Grey color if label is off
    }

    // Add shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fill();
    ctx.closePath();
}




function InitMapViewOnly(lat, long, polygonCoordinates) {
    var location = new google.maps.LatLng(lat, long);
    var mapOptions = {
        zoom: 16,
        center: location,
        mapTypeId: google.maps.MapTypeId.SATELLITE 
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

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



function populateDropDown(){

    const selectElement = document.getElementById('field');

    // Fetch field names and populate the <select> element 
    fetchFieldNames3()
        .then(data => {
            // Clear existing options
            selectElement.innerHTML = '';


            // Add fetched field names as options
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.fieldID;
                option.text = item.fieldName; 
                selectElement.appendChild(option);
            });

            const firstOptionValue = selectElement.options[0].value;
            populateMapData(firstOptionValue )
            
            selectElement.addEventListener('change', function(event) {
                const selectedValue = event.target.value;
                console.log('Selected value:', selectedValue);

                fieldID = selectedValue;

                populateMapData(fieldID);

               
            });

        })
        .catch(error => { 
            console.error(error); 
    });
}

function populateMapData(fieldID) {
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

            
            updateIrrigationDetails(fieldID);

        }) 

    })
    .catch(error => {
        console.error('Error fetching field record data:', error);
    });
}



function updateIrrigationDetails(fieldID) {

    fetch('/getIrrigationSummary', { 
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
    .then(summary => {

        data = summary[0]

        drawSmallCircle(radius, data.irrigationStatus);


        document.getElementById('minimum').innerHTML = "Minimum : " + data.minThreshold + " %"; 
        document.getElementById('maximum').innerHTML = "Maximum : " + data.maxThreshold + " %"; 
        document.getElementById('irrigation-status').innerHTML = data.irrigationStatus;  
        document.getElementById('waterConsumption').innerHTML = data.waterConsumption + " L"; 
        

        fetch('/getIrrigationSchedule', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fieldID }) 
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => { 

            setTimeout(function() { 
            
                console.log(data)  
    
                //the table
                var table = $('#example2').DataTable(); 
                
                table.clear(); 
                table.destroy();
        
                // Map data and create rows 
                data.forEach(item => {
    
                
                    const row = `<tr> 
                        <td>${item.startTime}</td>
                        <td>${item.duration}</td>
                        <td>${item.volume}</td> 
                    </tr>`;
         
                    // Add the row to the table
                    table.row.add($(row).get(0));
                }); 
                // Redraw the table  
                table.draw(); 
            }, 100); 


            fetch('/getSensorData', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fieldID }) 
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => { 
    
                setTimeout(function() { 
                
                    console.log(data)  
        
                    //the table
                    var table = $('#example').DataTable(); 
                    
                    table.clear(); 
                    table.destroy();
            
                    // Map data and create rows 
                    data.forEach(item => {
        
                    
                        const row = `<tr> 
                            <td>${item.sensorID}</td>
                            <td>${item.sensorName}</td>
                            <td>${item.sensorStatus}</td> 
                            <td>${item.moistureLevel}</td>  
                        </tr>`;
             
                        // Add the row to the table
                        table.row.add($(row).get(0));
                    }); 
                    // Redraw the table  
                    table.draw(); 
                }, 100); 

                createChart(fieldID);

            })
            .catch(error => {
                console.error('Error fetching field record data:', error);
            });

        })
        .catch(error => {
            console.error('Error fetching field record data:', error);
        });
    });

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




function createChart(fieldID){ 

    const xValues = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];

        // Generate slightly randomized moisture level data for each sensor
        const generateRandomData = () => {
            const data = [];
            for (let i = 0; i < xValues.length; i++) {
                // Generate random moisture levels between 30 and 70
                const y = Math.floor(Math.random() * (70 - 30 + 1)) + 30;
                data.push(y);
            }
            return data;
        };

        // Generate data for each sensor
        const sensor1Data = generateRandomData();
        const sensor2Data = generateRandomData();
        const sensor3Data = generateRandomData();
        const sensor4Data = generateRandomData(); 

        new Chart("irrigationChart", { 
            type: "line", 
            data: {
                labels: xValues,
                datasets: [
                    {
                        data: sensor1Data,
                        borderColor: "red",
                        fill: false,
                        label: 'Sensor 1'
                    },
                    {
                        data: sensor2Data,
                        borderColor: "green",
                        fill: false,
                        label: 'Sensor 2'
                    },
                    {
                        data: sensor3Data,
                        borderColor: "blue",
                        fill: false,
                        label: 'Sensor 3'
                    },
                    {
                        data: sensor4Data,
                        borderColor: "orange",
                        fill: false,
                        label: 'Sensor 4'
                    }
                ]
            },
            options: {
                legend: { display: true },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 100
                        }
                    }]
                }
            }
        });
}




// Example usage
var radius = 15; // Adjust the radius as needed
populateDropDown();

 