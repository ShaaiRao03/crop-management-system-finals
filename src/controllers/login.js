const jwt = require('jsonwebtoken'); 
const db  = require("../routes/db-config");
const md5 = require("md5"); 

const login = async (req,res)=>{
    const {username,password} = req.body;
    if(!username || !password) return res.json({status: "error", error: "Please enter your username and password"}); 
    else { 
        db.query("SELECT * FROM user WHERE username = ?",[username], async (Err, result) => { 
            const hashedPassword = md5(password);

            if (Err) throw Err;
            if (!result.length || hashedPassword !== result[0].password) return res.json({status: "error", error: "Invalid username or password"});  
            else {
                const token = jwt.sign({username : result[0].username}, process.env.JWT_secret, {
                    expiresIn: process.env.JWT_EXPIRES,
                }); 
                
                const cookieOptions = { 
                    expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),    
                    httpOnly: true 
                }
                res.cookie("userRegistered", token, cookieOptions);
                return res.json({status: "success", success: "You have been logged in successfully"});  
            }     
        })
    }
}     

module.exports = login;  