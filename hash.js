const bcrypt = require('bcrypt');

async function run(){
    try{
    const password = '12345';
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    console.log("Original Password:", password);
    console.log("Generated Salt:", salt);
    console.log("Hashed Password:", hashed);
    }
    catch (err) {
        console.error("Error while hashing password:", err.message);
    }
} 

run();