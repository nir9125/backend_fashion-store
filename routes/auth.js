const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
    const existingUser=User.findOne({email: req.body.email});
    if(existingUser) res.status(200).json("already user exist..plz login")
  console.log("register",req.body);
  const newUser = new User({
    username: req.body.username,
    fullname:req.body.fullname,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    phone:req.body.phone,
  });
  
  try {
    const savedUser = await newUser.save();
    console.log('hi');
    return  res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//LOGIN

router.post('/login', async (req, res) => {
    try{
        console.log(req.body);
        const user = await User.findOne(
            {
                username: req.body.username
            }
        );

         if(!user) 
          return res.status(401).json("Wrong User Name or password");
          

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );


        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;
        
        if(originalPassword != inputPassword) 
            return res.status(401).json("Wrong User Name or password");

        const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
  
        const { password, ...others } = user._doc;  
        return res.status(200).json({...others, accessToken});


    }catch(err){
        return res.status(500).json(err);
    }

});

//admin login
router.post('/adminlogin', async (req, res) => {
  try{
      console.log(req.body);
      const user = await User.findOne(
          {
              username: req.body.username
          }
      );

       if(!user) 
        return res.status(401).json("Wrong User Name....");

      const hashedPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC
      );


      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      const inputPassword = req.body.password;
      
      if(originalPassword != inputPassword) 
          return res.status(401).json("Wrong Password....");
       
      if(!user.isAdmin) 
      return res.status(401).json("You are not Admin...."); 

      const accessToken = jwt.sign(
      {
          id: user._id,
          isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
          {expiresIn:"3d"}
      );

      const { password, ...others } = user._doc;  
      return res.status(200).json({...others, accessToken});


  }catch(err){
      return res.status(500).json(err);
  }

});

module.exports = router;