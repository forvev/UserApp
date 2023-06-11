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
    const token = req.headers['x-access-token'];
    console.log("token: ", token);
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Verify and decode the token
    const user = await User.findOne({_id: decoded._id});

    const usersSelected = await User.find({ _id: { $ne: user._id } }) // Find all users except the current user

    res.status(200).send({ data: usersSelected, message: "Lista użytkowników" });

    //pobranie wszystkich użytkowników z bd:
    // User.find().exec()
    // .then(async () => {
    //     const users = await User.find();
    //     //konfiguracja odpowiedzi res z przekazaniem listy użytkowników: 
    //     res.status(200).send({ data: users, message: "Lista użytkowników" });
    // })
    // .catch(error => {
    //     res.status(500).send({ message: error.message }); });
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

router.put("/addFriend", async (req, res) => {
  const token = req.headers['x-access-token'];
  const user_id_to_add = req.headers['user_to_add'];

  const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Verify and decode the token
  const main_user = await User.findOne({_id: decoded._id});
  const friend = await User.findOne({_id: user_id_to_add})

  if (main_user == null || friend == null) {
    return res.status(404).json({message: 'User or friend not found!'});
  }

  insertedFriendOne = {_id: friend._id, username: friend.firstName}
  await User.updateOne({_id: main_user._id}, {$push: {'friends': insertedFriendOne}})

  insertedFriendTwo = {_id: main_user._id, username: main_user.firstName}
  await User.updateOne({_id: friend._id}, {$push: {'friends': insertedFriendTwo}})


  return res.status(200).json({message : 'Added a new friend ' + friend.firstName});
})
    
module.exports = router