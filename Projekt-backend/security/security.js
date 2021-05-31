var jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const hash_password = (password) => {
    
    const salt = bcrypt.genSaltSync(parseInt(process.env.NUM_SALT))
    return bcrypt.hashSync(password,salt);
}

const check_password_with_hash = (password, hash) => {
    return bcrypt.compareSync(password,hash)
}

const createJWT = (user_id) => {
    return token = jwt.sign(
        { 
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            user_id,
            iss: "ČŽS_e-Termin",
         },
        process.env.SECRET);
}

const validateJWT = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        print(decoded)
    }
    catch (err){
        if(err.name === "TokenExpiredError"){
            console.log(err);            
        }
        else if (err.name === "JsonWebTokenError"){
            console.log(err);            
        }
        console.log(err);
        return null;
    }
}

exports.check_password_with_hash = check_password_with_hash;
exports.hash_password = hash_password;
exports.createJWT = createJWT;
exports.validateJWT = validateJWT;