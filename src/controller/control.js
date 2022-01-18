const path = require("path");
const MongoColl = require("../model/loginRegister");
const bcryptjs = require("bcryptjs");
const cloudinary = require("../util/cloudinary");
const upload = require("../multer-config/upload");

exports.register = async (req, res) => {
  try {
    const {
      Name: name,
      Email: email,
      Phone: phone,
      Password: password,
      ConfirmPassword: confirmPassword,
    } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(422).json({ Error: "Field shouldnot be empty!" });
    } else {
      const checkEmail = await MongoColl.findOne({ email: email });

      if (checkEmail) {
        return res.status(422).json({ Error: "Email already registered!" });
      }

      if (password !== confirmPassword) {
        return res.status(409).json({ Error: "password must be same!" });
      }
      const hashPass = await bcryptjs.hash(password, 10);
      const mongoInstance = new MongoColl({
        name,
        email,
        phone,
        password: hashPass,
      });

      const token = await mongoInstance.generatingAuthToken();
      console.log(token);

      const saveData = await mongoInstance.save();
      if (saveData) {
        return res.status(201).json({ Success: saveData });
      } else {
        return res.status(422).json({ Error: "Failure to save data!" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ Error: "Bad Request!s" });
  }
};

exports.login = async (req, res) => {
  // console.log(req.body);
  const { Email: email, Password: password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ Error: "Field should not be empty!" });
  }
  const checkEmail = await MongoColl.findOne({ email });

  if (!checkEmail) {
    return res.status(400).json({ Error: "User not Exist" });
  } else {
    const checkPass = await bcryptjs.compare(password, checkEmail.password);

    if (checkPass) {
      const generateAuthToken = await checkEmail.generatingAuthToken();
      return res.status(200).json({ Success: "Login Successful!" });
    }
    return res.status(400).json({ Error: "Login UnSuccessful" });
  }
};

exports.logout = (req, res) => {
  console.log(req.user);
  req.user.tokens = req.user.tokens.filter((tokenObj) => {
    return tokenObj.token !== req.token;
  });

  req.user
    .save()
    .then((data) => {
      // console.log("Data: "+data);
      return res.status(200).json({ Success: "Log-out Successful" });
    })
    .catch((err) => {
      return res.status(500).json({ Error: "Internal server Error!" });
    });
};

exports.logoutAll = (req, res) => {
  req.user.tokens = [];
  req.user
    .save()
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      returnres.status(200).json({ err });
    });
};

exports.getAllRegisterUser = (req, res) => {
  // let queryParam = req.query;
  // console.log(queryParam.name);
  MongoColl.find()
    .then((data) => {
      return res.status(200).json({ AllDoc: data });
    })
    .catch((err) => {
      res.status(400).json({ Error: "Something went wrong!" });
    });
};

exports.getAllRegisterUserById = (req, res) => {
  const _id = req.params.id;
  MongoColl.findOne({ _id: _id })
    .then((data) => {
      if (data) {
        return res.status(200).json({ Success: data });
      } else {
        return res.status(400).json({ Errors: "Data not found! " });
      }
    })
    .catch((err) => {
      return res.status(400).json({ Error: err });
    });
};

exports.updateRegisterUser = (req, res) => {
  const _id = req.params.id;
  const {
    Name: name,
    Email: email,
    Phone: phone,
    Password: password,
    ConfirmPassword: confirmPassword,
  } = req.body;
  // console.log(_id);
  //updateOne we can also use
  const updateUser = MongoColl.findByIdAndUpdate(
    { _id: _id },
    {
      name,
      email,
      phone,
      password,
      confirmPassword,
    },
    {
      new: true,
    }
  )
    .then((data) => {
      return res.status(200).json({ Success: data });
    })
    .catch((err) => {
      return res.status(400).json({ Error: err });
    });
};

exports.deleteAllRegisterUser = (req, res) => {
  MongoColl.deleteMany({})
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      return res.status(400).json({ Error: "Bad Request ......" });
    });
};

exports.authenticatedUser = (req, res) => {
  console.log(req);
  res.status(200).json(req.user);
};

exports.fileUpload = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  const savePublicId = await MongoColl.findOne({ _id: req.user._id });
  const save = await savePublicId.savingId(result);
  res.json(result);

  // console.log(req.user);
  // req.user.avatar = req.file.buffer;
  // req.user
  //   .save()
  //   .then((data) => {
  //     return res.status(200).send("Success Uploading......");
  //   })
  //   .catch((err) => {
  //     return res.status(400).json({ Error: err.message });
  //   });
};

exports.uploadingError = (error, req, res, next) => {
  console.log(error);
  return res.status(400).json({ Error: error.message });
};

//* So, it is necessary to write the custom route at the end of the all routes so that it will not interfere with the function of any other route.
exports.errorPage = (req, res) => {
  const errorPath = path.join(__dirname, "../../Error.html");
  // console.log(errorPath);
  res.status(404).sendFile(errorPath);
};
