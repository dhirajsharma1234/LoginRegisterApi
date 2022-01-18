const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const loginRegisterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Minimum 3 letters"],
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: Number,
      min: 9,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    accountCreated: {
      type: Date,
      default: Date.now,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
    cloudinary_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

loginRegisterSchema.methods.generatingAuthToken = async function () {
  try {
    const token = await jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY_JWT
    );

    this.tokens = this.tokens.concat({ token: token });
    await this.save();

    return token;
  } catch (error) {
    console.log(error);
  }
};

loginRegisterSchema.methods.savingId = async function (result) {
  this.cloudinary_id = result.public_id;
  await this.save();
};

const MongoColl = new mongoose.model("loginRegisterColl", loginRegisterSchema);

module.exports = MongoColl;
