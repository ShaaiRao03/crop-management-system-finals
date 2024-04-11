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
        console.log(fieldCount);

        const fieldStatElement = document.getElementById('fieldNum');
        if (fieldStatElement) { 
            fieldStatElement.textContent = fieldCount;
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