const bcrypt = require("bcrypt");
const User = require('../Models/user.model');
const jwt = require('jsonwebtoken');
const { verify } = require("crypto");
const jwtkey = "e-com";



exports.getUser = async (req, res) => {
    let user = await User.find(req.body)
    if (user.length > 0) {
        res.send({
            status: "success",
            message: "User Get Successfully",
            result: user
        })
    } else {
        res.send({
            status: "fail",
            message: "No User Found",
            result: null
        })
    }
};

exports.addUser = async (req, res) => {
    try {
        let { name, email, phoneNo, confirmPassword } = req.body;

        if (!email) throw new Error("Email is required.");
        if (!email) throw new Error("Email is required.");
        if (!phoneNo) throw new Error("Password is required.");
        if (!confirmPassword) throw new Error("Confirm password is required.");
        if (confirmPassword !== password) {
            throw new Error("Password and confirm password do not match.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        const user = await newUser.save();

        res.json({
            status: 'success',
            message: `User added.`,
            data: user,
        });

    } catch (err) {
        let message;
       
        res.json({
            status: 'fail',
            message: message || err.message || 'Unknown error occurred.',
            data: null,
        });
    }
};

exports.updateUsers = async (req, res) => {
    const {id} = req.params;
    const data = req.body;
    try {
        
        const user = await User.findByIdAndUpdate({_id: id}, data, {new: true});

        if(!user) throw new Error(`No user found with this id: ${id}`);

        res.json({
			status: 'success',
			message: `user updated.`,
			data: user,
		});

    } catch (err) {
        res.json({
			status: 'fail',
			message: err.message || 'Unknown error occur.',
			data: null,
		});
    }
};

exports.deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
		if(!id) throw new Error('No id found to delete user.');
		
        const user = await User.findByIdAndDelete(id);

		if(!user) throw new Error(`No user found with this id: ${id}`);

		res.json({
			status: 'success',
			message: 'User deleted successfully.',
			data: null
		});

    } catch (err) {
        res.json({
			status: 'fail',
			message: err.message || "Unknown error occur.",
			data: null
		});
    }
};

exports.loginUsers = async (req, res) => {
    const {name , email, phoneNo} = req.body;
    try {
        if(!name)throw new Error("Enter name to login.");
        if(!email)throw new Error("Enter email to login.");
        if(!phoneNo)throw new Error("Enter password to login.");

        let user = await User.findOne({ phoneNo: req.body.phoneNo });

        if(!user) throw new Error("Invalid credentials. Please check Email and Password");
       
        const valid = await bcrypt.compare(password, user?.password);
    
        if(!valid) throw new Error("Invalid credentials. Please check Email and Password");

        const token = jwt.sign({ id: user.phoneNo }, jwtkey, {expiresIn: "20d"});  //20 Days --- Same below for cookie

        // user.password = undefined;

        res.json({
			status: 'success',
			message: 'User loggedin successfully.',
            login: true,
            token,
			data: user
		});

    } catch (err) {
        res.json({
			status: 'fail',
			message: err.message || "Unknown error occur.",
			data: null
		});
    }
}


// exports.searchUser = verifyToken,async(req ,res)=>{
//     let user =await User.find({
//         "$or" : [
//             {
//                 name : {$regex : req.params.key}
//             } , 
//             {
//                 email : {$regex : req.params.key}
//             }
//         ]
//     })
//     res.send(user)
// }

// function verifyToken(req , res , next){
//     let token = req.headers['authorization']
   
//     if(token){
//         token = token.split(' ')[1]
//         console.log(token);
//         jwt.verify(token , jwtkey , (err , valid)=>{
//             if(err){
//                 res.send({result : "Please valid token"})
//             } else {
//                 next()
//             }
//         })
//     } else {
//         res.send({result : "add token with header"})
//     }
// }

exports.searchUser = async (req, res, next) => {
    try {
      const searchQueryName = req.query.name;
  
      if (searchQueryName) {
        const categories = await User.find({
          name: { $regex: new RegExp(searchQueryName, 'i') },
        });
  
        res.status(200).json(categories);
      } else {
        res.status(400).json({ message: 'Invalid search parameters' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };