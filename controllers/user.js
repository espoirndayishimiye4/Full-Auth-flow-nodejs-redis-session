const { v4: uuidv4 } = require("uuid");
const { BadRequest } = require("http-errors");
const redis = require("redis");
const client = redis.createClient({ legacyMode: true });

const User = require("../models/user");
const { sendAccountActivationEmail } = require("../services/email");

client.on("error", (err) => console.log("Redis Client Error", err));

const register = async (req, res) => {
  const token = uuidv4();
  const isEmailExist = await User.findOne({ email: req.body.email });
  if (!isEmailExist) throw new BadRequest("user with this email Already Exist");
  const user = new User(req.body);
  const newUser = await user.save();

  const userData = {
    id: user._id,
    email: user.email,
  };
  await client.connect();

  await client.setEx(token, 10 * 60 * 24, JSON.stringify(userData));
  await sendAccountActivationEmail(token, user);
  res.status(201).json({
    success: true,
    data: newUser,
  });
};

const activeAccount = async (req, res) => {
  const token = req.param.token;
  await client.connect();
  client.exists(token, async function (err, reply) {
    if (reply === 1) {
      const user = await User.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      });
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      console.log("Does not exist!");
    }
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: req.body.email, status: true });
  if (!user) throw new NotFound("no user with this email exists");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new BadRequest("invalid password");
  const sessionData = {
    id: user._id,
    authenticated: true,
    role: user.role,
  };
  req.session.user = sessionData;

  res.status(200).json({
    success: true,
    data: user,
  });
};

const resetPassword = async (req, res) => {};

const logout = async (req, res) => {
  const token = req.param.token;
  await client.connect();
  await client.del(token);
  res.json({
    success: true,
  });
};

module.exports = { register, activeAccount, login, logout, resetPassword };
