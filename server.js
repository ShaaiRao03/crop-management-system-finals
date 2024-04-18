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
app.use("/chatbot",express.static(__dirname + "/public/chatbot"));  
app.use("/crop-management",express.static(__dirname + "/public/crop-management"));   
 

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


app.post('/submit_pest', (req, res) =>{ 
    // Access form data
    console.log('insert statement starts');
    const {name, treatment, field, product, inventoryUsed, treatmentStartDate, pestDesc, pic, amount, treatmentDesc} = req.body;
 
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


// Pest management ends -------------------------------


app.post('/getFieldNum', (req, res) => {
    const { username } = req.body;

    const sqlQuery1 = `SELECT COUNT(*) AS num_rows FROM field`;  

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

    const sqlQuery = 'SELECT COUNT(*) AS num_rows FROM field';  

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

    const sqlQuery = 'SELECT COUNT(*) AS num_rows FROM field_crop';  

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
    JOIN field_crop ON field_crop.fieldID = user_field.fieldID
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




// Crop management ends -----------------------------



app.use("/",require("./src/routes/pages"));     
app.use("/api", require("./src/controllers/auth"));  

app.listen(PORT);   