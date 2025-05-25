import jwt from "jsonwebtoken";
import moment from "moment";

const createAccessToken = (user) => {
  const payload = {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    salary: user.salary,
    currency: user.currency,
    iat: moment().unix(),
    exp: moment().add(15, "minutes").unix(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

const createRefreshToken = (user) => {
  const payload = {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    salary: user.salary,
    currency: user.currency,
    iat: moment().unix(),
    exp: moment().add(7, "days").unix(),
  };

  return jwt.sign(payload, process.env.REFRESH_SECRET);
};

const createNewToken = (user) => {
  const payload = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    salary: user.salary,
    currency: user.currency,
    iat: moment().unix(),
    exp: moment().add(15, "minutes").unix(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

export default {
  createAccessToken,
  createRefreshToken,
  createNewToken,
};
