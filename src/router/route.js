const express = require("express");
const control = require("../controller/control");
const router = new express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const upload = require("../multer-config/upload");

// console.log(control);
router.post("/register", control.register);
router.post("/login", control.login);
router.post("/logout", auth, control.logout);
router.post("/logoutAll", auth, control.logoutAll);
router.post(
  "/user/me/avatar",
  auth,
  upload.single("avatar"),
  control.fileUpload,
  control.uploadingError
);
router.get("/user/me", auth, control.authenticatedUser);
router.get("/getAllUser", control.getAllRegisterUser);
router.get("/getAllUser/:id", control.getAllRegisterUserById);
router.patch("/updateUser/:id", control.updateRegisterUser);
router.delete("/deleteAllUser", control.deleteAllRegisterUser);
router.get("*", control.errorPage);

module.exports = router;
