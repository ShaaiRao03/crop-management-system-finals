const express = require("express");
const db = require("./src/routes/db-config") 
const app = express(); 
const cookie = require("cookie-parser"); 
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const fs = require('fs'); // File system module
const PORT = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());  
app.use(express.json()); 


app.use("/js",express.static(__dirname + "/public/assets/js"));   // meaning , you can access "public/assets/js" with just  "js/"  
app.use("/css",express.static(__dirname + "/public/assets/css")); 
app.use("/img",express.static(__dirname + "/public/assets/images")); 
app.use("/dashboard",express.static(__dirname + "/public/dashboard")); 
app.use("/pest-management",express.static(__dirname + "/public/pest-management")); 
app.use("/resource-allocation",express.static(__dirname + "/public/resource-allocation"));  
app.use("/settings",express.static(__dirname + "/public/settings")); 
app.use("/soil-management",express.static(__dirname + "/public/soil-management")); 
app.use("/task-management",express.static(__dirname + "/public/task-management")); 
app.use("/tutorials",express.static(__dirname + "/public/tutorials")); 
 

app.set("view engine","ejs");      
app.set("views","./src/views");         
 
app.use(cookie());  
app.use(express.json()); 
 
db.connect((err)=>{
    if(err) throw err;
    console.log("Connected to database");  
});  


// Information about user starts ---------------------------

app.post('/getUserID', (req, res) => {
    const { username } = req.body;

    const sqlQuery1 = `SELECT userID FROM user WHERE username = '${username}';`;  

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1); 
                }
            });
        }); 
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});


// Information about user ends ---------------------------


// Resource allocation (Equipment) starts -------------------------

app.post('/getEquipmentInfo', (req, res) => {

    const { username } = req.body; 

    const sqlQuery1 = `SELECT * FROM equipment
    JOIN user ON user.userID = equipment.user_id
    JOIN equipmentstatus ON equipmentstatus.equipmentStatusID = equipment.equipmentStatusID
    JOIN purchasetype ON equipment.purchaseTypeID = purchasetype.purchaseTypeID 
    WHERE username = "${username}"`     

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => { 
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            }); 
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 


app.post('/getEquipmentInfoBySerialNum', (req, res) => {

    const { serialNum } = req.body; 

    const sqlQuery1 = `SELECT * FROM equipment 
    JOIN user ON user.userID = equipment.user_id
    JOIN equipmentstatus ON equipmentstatus.equipmentStatusID = equipment.equipmentStatusID
    JOIN purchasetype ON equipment.purchaseTypeID = purchasetype.purchaseTypeID 
    WHERE serialNum = "${serialNum}"`     

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => { 
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            }); 
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client 
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 
 

app.post('/getMaintenanceRecord', (req, res) => {

    const { serialNum } = req.body; 
    console.log(serialNum)

    const sqlQuery1 = `SELECT * FROM maintenancerecord JOIN equipment ON equipment.serialNum = maintenancerecord.serialNum
    WHERE maintenancerecord.serialNum = "${serialNum}";`     

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => { 
            db.query(sqlQuery1, (error1, results1) => { 
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1); 
                }
            }); 
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client 
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 




app.post('/submit_equipment', upload.single('image'), (req, res) => {
    // Access form data
    const formData = req.body;
    const imageFile = req.file; // Uploaded image file (if any)

    console.log("Server : ",formData) 

    // Handle file upload
    let fileData = null;
    if (imageFile) {
        fileData = fs.readFileSync(imageFile.path); // Read the file synchronously
        fs.unlinkSync(imageFile.path); // Remove the temporary file after reading
    }

    console.log(formData.userID)

    // Insert form data into the database 
    const sql = 'INSERT INTO equipment (equipmentName, type, brand, model, serialNum, equipmentStatusID, plateNum, lastService, purchaseTypeID, dealerNumber, img, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [formData.name, formData.type, formData.brand, formData.model, formData.serialNumber, 1, formData.plateNumber, formData.lastServiced, 1, formData.dealerNumber, fileData,formData.userID]; 

    db.query(sql, values, (err, result) => {  
        if (err) { 
            console.error('Error inserting data into database:', err);
            res.status(500).json({ message: 'Error submitting form.' });
            return;
        }
        console.log('Form data inserted successfully'); 
        res.status(200).json({ message: 'Form submitted successfully!' });
    });
});
  

app.post('/submit_record', (req, res) => {  
    // Access form data 
    const {description , date , currSerialNum} = req.body;
 
    console.log("Server :  " , description, date, currSerialNum) 

    // Insert form data into the database 
    const sql = `INSERT INTO maintenancerecord (serialNum, serviceDescription, date) VALUES ("${currSerialNum}", "${description}", "${date}")`;

    db.query(sql, (err, result) => {   
        if (err) { 
            console.error('Error inserting data into database:', err);
            res.status(500).json({ message: 'Error submitting form.' });
            return;
        }
        console.log('Form data inserted successfully'); 
        res.status(200).json({ message: 'Form submitted successfully!' });
    });
});


// Resource allocation (Equipment) ends ------------------------- 

// Pest management starts ------------------------- 

app.post('/getPestInfo', (req, res) => {

    const { username } = req.body; 

    const sqlQuery1 = `SELECT * FROM pest_management
    JOIN user ON user.userID = pest_management.userID
    WHERE username = "${username}"`     

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => { 
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            }); 
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 

app.post('/submit_pest', (req, res) =>{ 
    // Access form data
    console.log('insert statement starts');
    const {name, treatment, field, product, inventoryUsed, treatmentStartDate, pestDesc, pic, amount, treatmentDesc} = req.body;
 
    console.log(name) 
    // console.log("Server : ",formData) 
    // console.log(formData.userID) 

    // Insert form data into the database 
    //const sql = 'INSERT INTO pest_management (equipmentName, type, brand, model, serialNum, equipmentStatusID, plateNum, lastService, purchaseTypeID, dealerNumber, img, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    //const values = [formData.name, formData.type, formData.brand, formData.model, formData.serialNumber, 1, formData.plateNumber, formData.lastServiced, 1, formData.dealerNumber, fileData,formData.userID]; 

    const sql = 'INSERT INTO pest_management (currentPest, treatmentPlan, field_crop_id, productUsed, inventoryUsed, treatmentStartDate, pest_description, userID, amountApplied, treatment_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    // const values = [formData.name, formData.treatment, formData.field, formData.product, formData.inventoryUsed, formData.treatmentStartDate, formData.pestDesc, formData.pic, formData.amount, formData.treatmentDesc];
    const values = [name, treatment, field, product, inventoryUsed, treatmentStartDate, pestDesc, pic, amount, treatmentDesc];
    console.log('data inserted');

    db.query(sql, values, (err, result) => {  
        if (err) { 
            console.error('Error inserting data into database:', err);
            res.status(500).json({ message: 'Error submitting form.' });
            return;
        }
        console.log('Form data inserted successfully'); 
        res.status(200).json({ message: 'Form submitted successfully!' });
    });
});

// Pest management ends -------------------------

// Dashboard starts -------------------------

app.post('/getFieldNum', (req, res) => {
    const { username } = req.body;

    const sqlQuery1 = 'SELECT COUNT(*) AS num_rows FROM field';  

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1); 
                }
            });
        }); 
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });

});

// Dashboard ends -------------------------

// Soil relocation (Monitoring) starts -------------------------

app.post('/getMonitoringInfo', (req, res) => {

    // const { username } = req.body; 

    const sqlQuery1 = `SELECT * FROM nutrients_monitoring`     

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => { 
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            }); 
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 


app.post('/submit_nutrients', upload.single('image'), (req, res) => {
    // Access form data
    const formData = req.body;
    const imageFile = req.file; // Uploaded image file (if any)

    console.log("Server : ",formData)

    // Handle file upload
    let fileData = null;
    if (imageFile) {
        fileData = fs.readFileSync(imageFile.path); // Read the file synchronously
        fs.unlinkSync(imageFile.path); // Remove the temporary file after reading
    }

    console.log(formData.userID)

    // Insert form data into the database 
    const sql = 'INSERT INTO nutrients_monitoring (nitrogen_N, potassium_K, sulphur_S, boron_B, phosphorus_P, magnesium_Mg, calcium_Ca, copper_Cu, date, field_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [formData.nitrogen, formData.potassium, formData.sulfur, formData.boron, formData.phosphorus, formData.magnesium, formData.calcium, formData.copper, formData.datesampled, 1]; 

    db.query(sql, values, (err, result) => {  
        if (err) { 
            console.error('Error inserting data into database:', err);
            res.status(500).json({ message: 'Error submitting form.' });
            return;
        }
        console.log('Form data inserted successfully'); 
        res.status(200).json({ message: 'Form submitted successfully!' });
    });
});


// Soil relocation (Monitoring) ends ------------------------- 



app.use("/",require("./src/routes/pages"));     
app.use("/api", require("./src/controllers/auth"));  

app.listen(PORT);   
