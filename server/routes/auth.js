// const router = require("express").Router();
// require("dotenv").config();
// const { auth } = require("../middleware/auth");

// router.get("/", auth, (req, res) => {
//   let isAuth = req.user;
//   let newToken = req.newToken;
//   if (isAuth) {
//     let response = { message: "success", isAuth: true };
//     if (newToken) {
//       response.access_token = newToken;
//     }

//     return res.status(200).json(response);
//   }

//   return res.status(400).json({ message: "fail", isAuth: false });
// });

// module.exports = router;
