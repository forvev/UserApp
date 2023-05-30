const router = require("express").Router()
const { User, validate } = require("../models/user") 
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');


router.post("/", async (req, res) => {
    try {
      const { error } = validate(req.body);
  
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      const user = await User.findOne({ email: req.body.email });
      if (user)
        return res
          .status(409)
          .send({ message: "User with given email already Exist!" });
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      await new User({ ...req.body, password: hashPassword }).save();
      res.status(201).send({ message: "User created successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

router.get("/", async (req, res) => {
    console.log("get /")
    //pobranie wszystkich użytkowników z bd:
    User.find().exec()
    .then(async () => {
        const users = await User.find();
        //konfiguracja odpowiedzi res z przekazaniem listy użytkowników: 
        res.status(200).send({ data: users, message: "Lista użytkowników" });
    })
    .catch(error => {
        res.status(500).send({ message: error.message }); });
    }
)

router.get("/first", async (req, res)=>{
    console.log("my token:", req.headers['x-access-token'])
    console.log("code:", process.env.JWTPRIVATEKEY)
    User.find().exec()
        .then(async () =>{
            const token = req.headers['x-access-token'];
            const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Verify and decode the token
            const users = await User.findOne({_id: decoded._id});
            res.status(200).send({ data: users, message: "Lista użytkowników" });
        })
        .catch(error => {
            res.status(500).send({ message: error.message }); });

})

router.delete("/delete", async (req, res) => {
    console.log("del start")
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Verify and decode the token
    const userDel = await User.findByIdAndDelete({_id: decoded._id});
    
    if (!userDel) {
        return res.status(400).json("User not found");
      }
      res.status(200).json("User deleted successfully");

      console.log("del end")

})
    
module.exports = router