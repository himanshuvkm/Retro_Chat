import User from "../Models/user-model.js";
import bcrypt from "bcryptjs"
import generateTokenandSetCookie from "../utilis/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const userExists = await User.findOne({ username })
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    //Hashing the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    //https://avatar.iran.liara.run/public/boy?username=Scott
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic
    })

    if (newUser) {
      await newUser.save()
      await generateTokenandSetCookie(newUser._id, res)
      res.status(201).json({ message: "User created successfully", data: newUser });
    }
    else {
      res.status(400).json({ error: "User creation failed" });
    }

  } catch (error) {
    console.error("Error occurred during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    await generateTokenandSetCookie(user._id, res)
    res.status(200).json({ message: "Login successful", data: user });

  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    })
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error occurred during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
