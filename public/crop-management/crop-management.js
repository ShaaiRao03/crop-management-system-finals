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

                const plantDate = item.startPlantingDate;
                const plantDateAmended = plantDate.split('T'); 

                const row = `<tr> 
                    <td>${item.fieldName}</td>
                    <td><a href="#" class="table-link" onclick="showCropPlan('${item.field_crop_id}')">${item.cropName}</a></td>  
                    <td>${plantDateAmended[0]}</td> 
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


function showCropPlan(inventoryIDFromLink){
    inventoryID = inventoryIDFromLink; 
    console.log(inventoryID); 

}


var inventoryID; 
populateData();