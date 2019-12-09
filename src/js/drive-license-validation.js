// https://github.com/gas-buddy/usdl-regex
// https://ntsi.com/drivers-license-format/
const regs = require('./regex.json');

function isValidLicense(state, number) {
  const key = (state || '').toUpperCase();
  if (!regs[key]) {
    throw new Error('Invalid state supplied');
  }
  const re = new RegExp(regs[state].rule, 'i');
  if (re.test(number)) {
    return true;
  }
  return false;
}

function isValidOrReturnDescription(state, number) {
  return isValidLicense(state, number) || regs[state].description;
}

module.exports = {
  isValidLicense,
  isValidOrReturnDescription,
};
