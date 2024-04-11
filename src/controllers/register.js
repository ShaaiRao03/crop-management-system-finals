const db = require("../routes/db-config");
const bcrypt = require("bcrypt"); // for encrypting passwords

const register = async (req,res)=>{
    const { username , password:Npassword } = req.body; //Npassword mean normal password
    if(!username || !Npassword){ 
        return res.json({status: "error", error: "Please enter your username and password"}); 
    } else {
         console.log(username)
        db.query("SELECT username FROM user WHERE username = ?",[username],async (err,result)=> { 
            if(err) throw err;
            if(result[0]) return res.json({status: "error", error: "Username already exists"});  
            else{
                const password = await bcrypt.hash(Npassword,8); //encrypting password  , without await , we will get [object promise] in database 
                console.log(password)
                db.query("INSERT INTO user SET ?",{username:username,password:password},(error,result)=>{
                    if(error) throw error;
                    return res.json({status: "success", success: "You have been registered successfully"});  
                })
            }
        })  
    }
   
}

module.exports = register;     