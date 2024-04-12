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
  
function sendMessage(){
    const inputElement = document.getElementById('query-input');
    const message = inputElement.value;

    if(!message){
        alert("No message is being sent")
    }else {
        fetchMessage(message)
    } 
}

 
function clearResult(){
    const labelElement = document.querySelector('.generated-message');
    const inputElement = document.getElementById('query-input');

    inputElement.value = '';

    if (labelElement) {
        labelElement.textContent = "No result available"; // Change 'New message' to whatever message you want to set
    } else {
        console.error('Label element with class "generated-message" not found.');
    }
}