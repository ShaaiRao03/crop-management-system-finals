const express = require("express");
const db = require("./src/routes/db-config") 
const app = express(); 
const cookie = require("cookie-parser"); 
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const fs = require('fs'); // File system module
const PORT = process.env.PORT || 5000;

const cors = require('cors');

const crypto = require('crypto');

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
app.use("/chatbot",express.static(__dirname + "/public/chatbot"));  
app.use("/crop-management",express.static(__dirname + "/public/crop-management"));   
app.use("/irrigation-system",express.static(__dirname + "/public/irrigation-system"));     
 

app.set("view engine","ejs");      
app.set("views","./src/views");         
 
app.use(cookie());  
app.use(express.json()); 
 
db.connect((err)=>{
    if(err) throw err;
    console.log("Connected to database");  
});  

// Chatbot starts -------

"use strict";
const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: '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' 
});
 
app.post('/getMessage', async (req, res) => {

    const { query } = req.body;

    try { 
        const messageChatbot = await getMessageFromChatbot(query);
        res.status(200).json({ message: messageChatbot });  
        console.log(messageChatbot)   
    }catch(error){
        console.error("An error occurred:", error);
        res.status(500).json({ error: 'An error occurred' })
    } 
}); 
  
async function getMessageFromChatbot(query){
    try {
        const chatCompletion = await getGroqChatCompletion(query);
        const message = chatCompletion.choices[0]?.message?.content || "";
        // process.stdout.write(chatCompletion.choices[0]?.message?.content || ""); 
        console.log(chatCompletion.choices[0]?.message?.content || "")
        return message
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
async function getGroqChatCompletion(query) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `${query}`
            }
        ],
        model: "mixtral-8x7b-32768"
    });
}


// Chatbot ends ----------



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

app.post('/getUserName', (req, res) => {
    const { username } = req.body;

    const sqlQuery1 = `SELECT name FROM user WHERE username = '${username}';`;  

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

/*
app.post('/updateEquipmentDetails', (req, res) => { 
    // Access updated details from the request body
    const { currSerialNum, updatedDetails } = req.body;

    const statusVal = 1;

    // Construct the SQL update statement for specific fields
    const sql = 'UPDATE equipment SET equipmentName = ?, type = ?, brand = ?, model = ?, serialNum = ?, equipmentStatusID = ?, plateNum = ?, lastService = ?, purchaseTypeID =?, dealerNumber =? WHERE serialNum = ?';
    const values = [updatedDetails.name, updatedDetails.type, updatedDetails.brand, updatedDetails.model, updatedDetails.serial-number, 1, updatedDetails.plate-number, updatedDetails.last-service, 1, updatedDetails.dealer-number, currSerialNum];

    // Execute the SQL query
    db.query(sql, values, (err, result) => {  
        if (err) { 
            console.error('Error updating data into database:', err);
            res.status(500).json({ message: 'Error updating form.' });
            return;
        }
        console.log('Data updated successfully'); 
        res.status(200).json({ message: 'Data updated successfully!' });
    });
});*/

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
  
app.post('/getPestRecord', (req, res) => {

    const { pestID } = req.body; 
    console.log(pestID)

    const sqlQuery1 = `SELECT * FROM pestrecord JOIN pest_management ON pest_management.pestID = pestrecord.pestID
    WHERE pestrecord.pestID = "${pestID}";`     

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

app.post('/getPestInfoByID', (req, res) => { 
  
    const { pestID } = req.body;  
 
    //need inventory ID, action, amount, date
    const sqlQuery1 = `SELECT * FROM pest_management 
    WHERE pestID = "${pestID}"` 

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


// app.post('/submit_pest', upload.single('image'), (req, res) =>{ 
//     // Access form data
//     console.log('insert statement starts');
//     const {name, treatment, field, treatmentStartDate, pestDesc, pic, treatmentDesc, image , userID} = req.body;
//     const imageFile = image;

//     let fileData = null;
//     if (imageFile) {
//         fileData = fs.readFileSync(imageFile.path); // Read the file synchronously
//         fs.unlinkSync(imageFile.path); // Remove the temporary file after reading
//     }

//     console.log(fileData)
//     console.log(userID)
 
//     const sql = 'INSERT INTO pest_management (currentPest, treatmentPlan, field_crop_id, treatmentStartDate, pest_description, userID, treatment_description) VALUES (?, ?, ?, ?, ?, ?, ?)';
//     // const values = [formData.name, formData.treatment, formData.field, formData.product, formData.inventoryUsed, formData.treatmentStartDate, formData.pestDesc, formData.pic, formData.amount, formData.treatmentDesc];
//     const values = [name, treatment, field, treatmentStartDate, pestDesc, pic, treatmentDesc];
//     console.log('data inserted');

//     db.query(sql, values, (err, result) => {  
//         if (err) { 
//             console.error('Error inserting data into database:', err);
//             res.status(500).json({ message: 'Error submitting form.' });
//             return;
//         }
//         console.log('Form data inserted successfully'); 
//         res.status(200).json({ message: 'Form submitted successfully!' });
//     });
// });

app.post('/submit_pest', upload.single('image'), (req, res) => {
    // Access form data
    console.log('insert statement starts');
    const { name, treatment, field, treatmentStartDate, pestDesc, treatmentDesc, userID } = req.body;

    const imageFile = req.file; // Access uploaded image file from req.file

    // Ensure that the image file exists
    if (!imageFile) {
        return res.status(400).json({ message: 'Image file not provided.' });
    }

    // Read the image file asynchronously
    fs.readFile(imageFile.path, (err, fileData) => {
        if (err) {
            console.error('Error reading image file:', err);
            return res.status(500).json({ message: 'Error reading image file.' });
        }

        // Remove the temporary file after reading
        fs.unlink(imageFile.path, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error removing temporary image file:', unlinkErr);
            }

            console.log(fileData);
            console.log(userID);

            const sql = 'INSERT INTO pest_management (currentPest, treatmentPlan, field_crop_id, treatmentStartDate, pest_description, treatment_description, img, userID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [name, treatment, field, treatmentStartDate, pestDesc, treatmentDesc, fileData, userID]; // Add fileData to values array
            console.log('Data inserted');

            db.query(sql, values, (dbErr, result) => {
                if (dbErr) { 
                    console.error('Error inserting data into database:', dbErr);
                    return res.status(500).json({ message: 'Error submitting form.' });
                } 
                console.log('Form data inserted successfully');
                res.status(200).json({ message: 'Form submitted successfully!' });
            });
        });
    });
});





app.post('/updatePestDetails', (req, res) => { 
    // Access updated details from the request body
    const { pestID, updatedDetails } = req.body;

    // Construct the SQL update statement for specific fields
    const sql = 'UPDATE pest_management SET currentPest = ?, treatmentPlan = ?, treatmentStartDate = ? WHERE pestID = ?';
    const values = [updatedDetails.name, updatedDetails.treatment, updatedDetails.date, pestID];

    // Execute the SQL query
    db.query(sql, values, (err, result) => {  
        if (err) { 
            console.error('Error updating data into database:', err);
            res.status(500).json({ message: 'Error updating form.' });
            return;
        }
        console.log('Data updated successfully'); 
        res.status(200).json({ message: 'Data updated successfully!' });
    });
});

app.post('/submit_pest_record', (req, res) => {  
    // Access form data 
    const {treatment , date , pestID} = req.body;
 
    console.log("Server :  " , treatment, date, pestID) 

    // Insert form data into the database 
    const sql = `INSERT INTO pestrecord (pestID, treatment, treatmentDate) VALUES ("${pestID}", "${treatment}", "${date}")`;

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

app.post('/insertPest', (req, res) => { 

    const { pestName , field, pestDesc, treatment, treatmentDesc, treatmentStartDate, pic } = req.body; 
 
    const sqlQuery1 = `INSERT INTO pest_management (currentPest, treatmentPlan, field_crop_id, treatmentStartDate, pest_description, pic, treatment_description) 
    VALUES ("${pestName}", ${treatment}, ${field} , ${treatmentStartDate}, ${pestDesc}, ${pic}, ${treatmentDesc})`         
  
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

// Pest management ends -------------------------------





// Soil relocation (Monitoring) starts -------------------------

app.post('/getMonitoringInfo', (req, res) => {

    const { username, fieldName } = req.body; 
    let sqlQuery1;

    // Check if fieldName is not empty
    if (fieldName) {
        sqlQuery1 = `SELECT * FROM nutrients_monitoring JOIN field ON field.fieldID = nutrients_monitoring.field_ID WHERE field_ID IN (SELECT fieldID FROM user_field JOIN user ON user_field.userID = user.userID WHERE user.username = '${username}') AND field_ID='${fieldName}';`;
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
    } else {
        // If fieldName is empty, send an error response
        res.status(400).json({ error: 'fieldName cannot be empty' });
    }
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
    const values = [formData.nitrogen, formData.potassium, formData.sulfur, formData.boron, formData.phosphorus, formData.magnesium, formData.calcium, formData.copper, formData.datesampled, formData.fieldID]; 

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

app.post('/getFieldNames', (req, res) => {

    const { username } = req.body; 

    const sqlQuery1 = `SELECT fieldID, fieldName FROM field WHERE (fieldID) IN (SELECT fieldID FROM user_field JOIN user ON user_field.userID = user.userID WHERE user.username = '${username}');`     

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => { 
                if (error1) {
                    reject({ error: 'Error getting field names' });
                } else {
                    resolve(results1);
                }
            }); 
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // gitSend the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 

app.post('/getFieldData', (req, res) => {

    const { username, fieldID } = req.body; 

    const sqlQuery1 = `SELECT nitrogen_N, potassium_K, sulphur_S, boron_B, phosphorus_P, magnesium_Mg, calcium_Ca, copper_Cu, date FROM nutrients_monitoring WHERE (field_ID) IN (SELECT fieldID FROM user_field JOIN user ON user_field.userID = user.userID WHERE user.username = '${username}' AND user_field.fieldID = '${fieldID}' ORDER BY date ASC);`     

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => { 
                if (error1) {
                    reject({ error: 'Error getting field data' });
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

// Soil relocation (Monitoring) ends ------------------------- 

// Dashboard starts -------------------------

//Field data
app.post('/getFieldNum', (req, res) => {
    const { username } = req.body;
    console.log(username)
    const sqlQuery = `SELECT COUNT(*) AS num_rows FROM field
    JOIN user_field ON user_field.fieldID = field.fieldID
    JOIN user ON user_field.userID = user.userID
    WHERE user.username = "${username}";`;    

    // Wrapping the database query inside a promise
    const executeQuery = () => { 
        return new Promise((resolve, reject) => {
            db.query(sqlQuery, (error, results) => {
                if (error) {
                    reject({ error: 'Error querying table2' }); 
                } else { 
                    resolve(results); 
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

// Crop Data
app.post('/getCropNum', (req, res) => {  
    const { username } = req.body; 

    const sqlQuery = `SELECT COUNT(*) as num_rows FROM field_crop 
    JOIN user_field ON user_field.fieldID = field_crop.fieldID
    JOIN user ON user.userID = user_field.userID
    WHERE username = "${username}"`;   

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery, (error, results) => {
                if (error) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results); 
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

// Field + crop name data
app.post('/getFieldInfo', (req, res) => {

    const { username } = req.body; 

    const sqlQuery1 = `SELECT * FROM user_field
    JOIN user ON user.userID = user_field.userID
    JOIN field ON field.fieldID = user_field.fieldID
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


app.post('/getFieldInfoByID', (req, res) => {

    const { fieldID } = req.body; 

    const sqlQuery1 = `SELECT * FROM user_field
    JOIN user ON user.userID = user_field.userID
    JOIN field ON field.fieldID = user_field.fieldID
    WHERE field.fieldID = ${fieldID}`     

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

const fetchWeatherForecast = async (latitude, longitude) => {
    const apiKey = '0e0ca3df46cc04a4bfe39ce905df666e';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        throw new Error('Error fetching weather forecast:', error);
    }
};



app.post('/getWeatherDataGivenCoord', async (req, res) => {
    const { currLat , currLng } = req.body;

    try {
        // Call the fetchWeatherForecast function
        const weatherForecast = await fetchWeatherForecast(currLat , currLng); 
        res.status(200).json(weatherForecast); // Send the result back to the client
    } catch (error) {
        res.status(500).json({ error: error.message }); // Send the error back to the client
    }
}); 


app.post('/getLatestNutrientDataGivenID', (req, res) => {

    const { fieldID } = req.body; 

    const sqlQuery1 = `SELECT * FROM nutrients_monitoring WHERE date = (SELECT MAX(date) FROM nutrients_monitoring WHERE field_ID = ${fieldID});`     

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




app.post('/getPolygonCoordinates', (req, res) => {

    const { fieldID } = req.body; 

    const sqlQuery1 = `SELECT polygonID , lat, lng FROM fieldmap WHERE fieldID = ${fieldID};`     

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


// Tasks in progress
app.post('/getTasksInProgress', (req, res) => {

    const { username } = req.body; 

    const sqlQuery1 = `SELECT COUNT(*) as num_rows FROM task_association
    JOIN user ON user.userID = task_association.user_id
    JOIN task_status ON task_status.taskStatusID = task_association.taskStatusID
    WHERE username = "${username}" AND task_association.taskStatusID = '1'`   

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

// Tasks Completed
app.post('/getTasksCompleted', (req, res) => {

    const { username } = req.body; 

    const sqlQuery1 = `SELECT COUNT(*) as num_rows FROM task_association
    JOIN user ON user.userID = task_association.user_id
    JOIN task_status ON task_status.taskStatusID = task_association.taskStatusID
    WHERE username = "${username}" AND task_association.taskStatusID = '2'`   

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


app.post('/submit_field', (req, res) => {

    const { name, soilType, size, address, currLat , currLong  } = req.body; 

    const sqlQuery1 = `INSERT INTO field(fieldName, fieldLocation, soilType, size, latitude, longitude) VALUES ('${name}','${address}','${soilType}','${size}',${currLat},${currLong})`     
 
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
             

app.post('/insertFieldMap', (req, res) => {

    const { fieldID, lng, lat  } = req.body; 

    const sqlQuery1 = `INSERT INTO fieldmap(fieldID, lng, lat) VALUES (${fieldID},${lng},${lat})`     
 
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


app.post('/insertUserField', (req, res) => {

    const { fieldID, userID   } = req.body; 

    const sqlQuery1 = `INSERT INTO user_field (userID, fieldID) VALUES (${userID},${fieldID})`     
 
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


app.post('/getFieldIDgivenFieldName', (req, res) => {

    const { name } = req.body;  

    const sqlQuery1 = `SELECT fieldID FROM field WHERE fieldName = "${name}";`     
 
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


// Resource allocation (Inventory) starts -------------------------  

app.post('/getInventoryInfo', (req, res) => {

    const { username } = req.body; 

    const sqlQuery1 = `SELECT * FROM inventory
    JOIN user ON user.userID = inventory.user_id 
    JOIN inventorytype ON inventorytype.inventoryTypeID = inventory.inventoryTypeID
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


app.post('/getInventoryInfoByID', (req, res) => { 
  
    const { inventoryID } = req.body;  
 
    //need inventory ID, action, amount, date
    const sqlQuery1 = `SELECT * FROM inventory
    JOIN inventory_stock ON inventory_stock.inventoryID = inventory.inventoryID
    JOIN inventorytype ON inventorytype.inventoryTypeID = inventory.inventoryTypeID  
    WHERE inventory.inventoryID = "${inventoryID}"` 

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
/*
app.post('/updateInventoryDetails', (req, res) => { 
    // Access updated details from the request body
    console.log("Inventory ID: ", inventoryID);
    const { inventoryID, updatedDetails } = req.body;
    //let inventoryTypeVal = '';
    console.log(updatedDetails.name, "", updatedDetails.brand, "", updatedDetails.threshold, "", updatedDetails.manufacturer, "", updatedDetails.manufacturer-number, "", updatedDetails.type, "", inventoryID);

    // Construct the SQL update statement for specific fields
    const sql = 'UPDATE inventory SET inventoryName = ?, brand = ?, flagThreshold = ?, manufacturer = ?, manufacturerNumber = ? inventoryTypeID = ? WHERE inventoryID = ?';
    const values = [updatedDetails.name, updatedDetails.brand, updatedDetails.threshold, updatedDetails.manufacturer, updatedDetails.manufacturer-number, updatedDetails.type, inventoryID];

    // Execute the SQL query
    db.query(sql, values, (err, result) => {  
        if (err) { 
            console.error('Error updating data into database:', err);
            res.status(500).json({ message: 'Error updating form.' });
            return;
        }
        console.log('Data updated successfully'); 
        res.status(200).json({ message: 'Data updated successfully!' });
    });
});*/

app.post('/submit_inventory', upload.single('image'), (req, res) => {
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

    // console.log(formData.inventory-brand)
    console.log(formData.userID)
    console.log('insert statement starts'); 
  
    // Insert form data into the database 
    const sql = 'INSERT INTO inventory (inventoryName, brand, flagThreshold, manufacturer, manufacturerNumber, img, inventoryTypeID, user_id, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [formData.name, formData.brand, formData.threshold, formData.manufacturer, formData.manufacturerNum, fileData, formData.type, formData.userID, formData.balance];
 
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

app.post('/submit_usage', (req, res) => { 
    // Access form data 
    const { inventoryID, amount, date, restockUsedValue } = req.body;

    console.log("Server : ", inventoryID, amount, date, restockUsedValue);

    // Insert form data into the database using parameterized query
    const sqlInsert = `INSERT INTO inventory_stock (inventoryID, date, quantity, action) VALUES (?, ?, ?, ?)`;
    const valuesInsert = [inventoryID, date, amount, restockUsedValue];

    let sqlUpdate = '', valuesUpdate = [];
    // Update balance of inventory item 
    if (restockUsedValue == 'Restock') {
        sqlUpdate = `UPDATE inventory SET balance = (balance + ? ) WHERE inventoryID = ? `;
        valuesUpdate = [amount, inventoryID];
    } else if (restockUsedValue == 'Used') {
        sqlUpdate = `UPDATE inventory SET balance = (balance - ? ) WHERE inventoryID = ? `;
        valuesUpdate = [amount, inventoryID];
    } else {
        console.log("Value does not exist");
        res.status(500).json({ message: 'Error updating balance.' });
        return;
    }

    db.query(sqlInsert, valuesInsert, (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            res.status(500).json({ message: 'Error submitting form.' });
            return;
        }
        console.log('Form data inserted successfully');
        
        // If insertion is successful, proceed to update balance
        db.query(sqlUpdate, valuesUpdate, (error, result) => {
            if (error) {
                console.error('Error updating balance from database:', error);
                res.status(500).json({ message: 'Error updating balance.' });
                return;
            }
            console.log('Balance updated successfully');
            res.status(200).json({ message: 'Form submitted successfully! Balance updated successfully!' });
        });
    });
});

// Resource allocation (inventory) ends ------------------------- 


app.use("/",require("./src/routes/pages"));     
app.use("/api", require("./src/controllers/auth"));  

app.post('/getCrops', (req, res) => {
    const sqlQuery1 = `SELECT * FROM crop_info`     

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => { 
                if (error1) {
                    reject({ error: 'Error querying' });
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

app.post('/getWebsites', (req, res) => {
    const sqlQuery1 = `SELECT * FROM website`     

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => { 
                if (error1) {
                    reject({ error: 'Error querying' });
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

app.post('/getArticles', (req, res) => {
    const sqlQuery1 = `SELECT * FROM article`     

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => { 
                if (error1) {
                    reject({ error: 'Error querying' });
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

app.listen(5000, () => {
    console.log(`Server is running on port ${PORT}`);
});
// app.listen(PORT);   

// Task management starts ------------------------- 

app.post('/getTaskInfo', (req, res) => { 

    const { username } = req.body; 

    const sqlQuery1 = `SELECT taskName, field.fieldID, field.fieldName, duedate, task_status.taskStatusID, task_status.taskStatus, assignee FROM task_association JOIN field ON field.fieldID=task_association.fieldID JOIN task_status ON task_status.taskStatusID=task_association.taskStatusID JOIN user ON user.userID=task_association.user_id WHERE user.username='${username}'`     

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


app.post('/submit_task', (req, res) =>{ 
    // Access form data
    console.log('insert statement starts');
    const {task,association,dueDate,status,assignee,userID} = req.body;
 
    const sql = 'INSERT INTO task_association (assignee,fieldID,taskName,taskStatusID,dueDate,user_id) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [assignee,association,task,status,dueDate,userID];
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


// Define an endpoint for updating task details
app.post('/updateTask', (req, res) => {
    // Access form data from the request body
    const { taskName, association, dueDate, status, assignee } = req.body;

    // Query to update the task details in the database
    const sqlQuery = `
        UPDATE task_association
        SET fieldID = ?, duedate = ?, taskStatusID = ?, assignee = ?
        WHERE taskName = ?;
    `;

    // Execute the query
    db.query(sqlQuery, [association, dueDate, status, assignee, taskName], (error, results) => {
        if (error) {
            console.error('Error updating task details:', error);
            res.status(500).json({ message: 'Error updating task details.' });
        } else {
            console.log('Task details updated successfully.');
            res.status(200).json({ message: 'Task details updated successfully.' });
        }
    });
});

app.post('/deleteTask', (req, res) => {
    // Access task name from the request body
    const { taskName } = req.body;

    // Query to delete the task from the database
    const sqlQuery = `
        DELETE FROM task_association
        WHERE taskName = ?;
    `;

    // Execute the query
    db.query(sqlQuery, [taskName], (error, results) => {
        if (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ message: 'Error deleting task.' });
        } else {
            console.log('Task deleted successfully.');
            res.status(200).json({ message: 'Task deleted successfully.' });
        }
    });
});

// Task management ends -------------------------------

// Crop management starts -----------------------------

app.post('/weather', (req, res) => {
    const { lat, lon } = req.body;
  
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=0e0ca3df46cc04a4bfe39ce905df666e&units=metric`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Send the weather forecast data as a response
        res.json(data);
      })
      .catch(error => {
        console.error('Error fetching weather forecast data:', error);
        res.status(500).json({ error: 'An error occurred while fetching weather data' });
      });
}); 





app.post('/getCropData', (req, res) => { 

    const { username } = req.body; 

    const sqlQuery1 = `SELECT * FROM field_crop 
    JOIN user_field ON user_field.fieldID = field_crop.fieldID
    JOIN user ON user_field.userID = user.userID
    JOIN field ON field.fieldID = field_crop.fieldID
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

 
app.post('/getCropPlan', (req, res) => { 

    const { fieldCropID } = req.body; 

    const sqlQuery1 = `SELECT * FROM cropplanning
    JOIN field_crop ON field_crop.field_crop_id = cropplanning.cropID 
    WHERE field_crop_id = ${fieldCropID}`       
  
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


app.post('/getCropGivenFieldCropID', (req, res) => { 

    const { fieldCropID } = req.body; 

    const sqlQuery1 = `SELECT cropName FROM field_crop
    WHERE field_crop_id = ${fieldCropID}`        
  
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



app.post('/updateExistingPlanStatus', (req, res) => { 

    const { fieldCropID } = req.body; 
 
    const sqlQuery1 = `UPDATE cropplanning 
    SET status = 0 
    WHERE cropID = ${fieldCropID}`        
  
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


app.post('/insertCropPlan', (req, res) => { 

    const { fieldCropID,description, startDate, endDate, status } = req.body; 

    console.log("Server : ",fieldCropID,description, startDate, endDate, status)
 
    const sqlQuery1 = `INSERT INTO cropplanning (cropID, startDate, endDate, description, status) VALUES (${fieldCropID}, "${startDate}" , "${endDate}" , "${description}", ${status})`        
  
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

 
app.post('/insertCrop', (req, res) => { 

    const { cropName , fieldID, coveredArea } = req.body; 
 
    const sqlQuery1 = `INSERT INTO field_crop (cropName, fieldID, coveredArea) VALUES ("${cropName}", ${fieldID} , ${coveredArea})`         
  
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

app.post('/updateAccount', (req, res) => {
    const {userId, username, password} = req.body;


    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    const sqlQuery = `UPDATE user SET username = ?, password = ? WHERE userId = ?`;
    const values = [username, hashedPassword, userId];

    const executeQuery = () => {
        return new Promise ((resolve, reject) => {
            db.query (sqlQuery, values, (error, results) => {
                if (error) {
                    reject ({error : 'Error updating account details in the database'});
                } else {
                    resolve (results);
                }
            });
        });
    };

    executeQuery() 
    .then ((data) => {
        res.status(200).json(data);
    })
    .catch ((error) => {
        res.status(500).json(error);
    });
});



// Irrigation system starts ---------------------------


app.post('/getIrrigationSummary', (req, res) => { 

    const { fieldID } = req.body; 

    const sqlQuery1 = `SELECT * FROM irrigationsummary WHERE fieldID = ${fieldID};`        
  
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



app.post('/getIrrigationSchedule', (req, res) => { 

    const { fieldID } = req.body; 

    const sqlQuery1 = `SELECT * FROM irrigationschedule WHERE fieldID = ${fieldID};`        
  
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


app.post('/getSensorData', (req, res) => { 

    const { fieldID } = req.body; 

    const sqlQuery1 = `SELECT * FROM fieldsensor WHERE fieldID = ${fieldID};`        
  
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



// Irrigation system ends ---------------------------




app.use("/",require("./src/routes/pages"));     
app.use("/api", require("./src/controllers/auth"));  

// app.listen(PORT);   