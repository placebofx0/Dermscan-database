const bcrypt = require("bcrypt");
const users = require("../models/user.model");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await users.findOne({ username });

    if (!user) return res.status(404).json({ message: "invalid_username" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "invalid_password" });

    res.json({ message: "exist", user });
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const check = await users.findOne({ $or: [{ username }, { email }] });
  
      if (check) return res.status(409).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new users({ username, email, password: hashedPassword });
  
      await newUser.save();
  
      res.status(201).json({ message: "notexist", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };
