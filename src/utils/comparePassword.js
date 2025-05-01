const comparePassword = async (password, savedPass) => {
  
  return password === savedPass;
};

module.exports = { comparePassword };