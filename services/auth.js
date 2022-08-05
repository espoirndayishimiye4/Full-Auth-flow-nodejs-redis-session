const { v4: uuidv4 } = require("uuid");
const { createClient } = require("redis");
const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

const createUserActivationToken = async (user) => {
  try {
    const token = uuidv4()
    const userData = {
      id: user._id,
      email: user.email,
    };
    await client.connect();
    await client.hSet(token, userData);
    await client.disconnect()
    return token
  } catch (e) {

  }
};


module.exports = {
    createUserActivationToken
}