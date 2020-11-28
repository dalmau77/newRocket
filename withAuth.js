const dotenv = require("dotenv");
dotenv.config();

const withAuth = (req, res, next) => {
  const userToken = req.headers.authorization;
  // console.log(userToken, 'YYOOOO')
  const correctToken = `${process.env.TOKEN}`;

  if (!userToken) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    if (userToken != correctToken) {
      res.status(401).send('Unauthorized: Invalid token');
    } else {
      next();
    }
  };
};

module.exports = withAuth;