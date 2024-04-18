function update() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userId = localStorage.getItem('userId');

    return new Promise((resolve, reject) => {
        fetch('/updateAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId, username, password})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            resolve(data);
            cancel();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function cancel() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}