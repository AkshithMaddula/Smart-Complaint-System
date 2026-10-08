// Run once:  npm run seed
// Creates one admin and one staff account (normal users register via the API).
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const people = [
    { name: "Admin", email: "admin@example.com", password: "admin123", role: "admin" },
    { name: "Staff One", email: "staff@example.com", password: "staff123", role: "staff" },
  ];
  for (const p of people) {
    if (await User.findOne({ email: p.email })) console.log("Already exists:", p.email);
    else {
      await User.create(p);
      console.log("Created:", p.email, "/", p.password);
    }
  }
  await mongoose.disconnect();
})();
