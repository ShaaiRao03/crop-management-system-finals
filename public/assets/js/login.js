form.addEventListener("submit", () => {
    const login = {
        username : username.value,
        password: password.value
    } 
    
    fetch("/api/login" , {
        method: "POST", 
        body: JSON.stringify(login),
        headers: {
            "Content-Type": "application/json" 
        } 
    }).then(res => res.json())
    .then(data => {
        console.log(data);
        if(data.status == "error"){ 
            console.log(data.error)
        } else {
            console.log(data.success)
            localStorage.setItem('username', login.username);
            fetch ("/getUserID", {
                method: "POST",
                body: JSON.stringify({username: login.username}),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then (res => res.json())
            .then (data => {
                if (data.length > 0 && data[0].userID) {
                    localStorage.setItem('userId', data[0].userID);
                    window.location.href = "/";
                } else {
                    console.error ("Error: User ID not found");
                }
            })
            .catch (error => {
                console.error ('Error retrieving user ID:', error);
            });
        }
    }) 
    .catch (error => {
        console.error ('Error logging in:', error);
    });
});