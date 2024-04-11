const express = require("express"); 
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");  

const router = express.Router();
  
// Middleware to parse JSON data
router.use(express.json());

router.get("/",loggedIn,(req,res)=>{   
 
    if (req.user){
        res.render("index",{status:"loggedIn", user:req.user}); 
        
    }else{
        res.sendFile("loginPage.html", {root:"./public/"})   
    }
         
}); 
 

router.get("/logout",logout)     

module.exports = router;   