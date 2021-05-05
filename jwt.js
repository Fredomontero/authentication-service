const { sign, verify } = require('jsonwebtoken');

const createTokens = user => {
  const  accessToken = sign({ email: user.email, id: user._id }, "jwtsecret");
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if(!accessToken) return res.status(400).json({error: "User not authenticated"});
  try{
    const validToken = verify(accessToken, "jwtsecret");
    if(validToken){
      req.authenticated = true;
      return next;
    }
  }catch(error){
    return res.status(400).json({error: error});
  }
};

module.exports = { createTokens, validateToken };
