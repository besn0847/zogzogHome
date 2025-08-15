#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password to hash: ', (password) => {
  if (!password) {
    console.log('Password cannot be empty');
    rl.close();
    return;
  }
  
  const hash = bcrypt.hashSync(password, 12);
  console.log('\nGenerated hash:');
  console.log(hash);
  console.log('\nMongoDB update command:');
  console.log(`db.users.updateOne(
  { email: "user@example.com" },
  { $set: { 
    password: "${hash}",
    updatedAt: new Date()
  }}
)`);
  
  rl.close();
});
