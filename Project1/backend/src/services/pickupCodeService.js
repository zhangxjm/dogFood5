const Express = require('../models/Express');

class PickupCodeService {
  static generatePickupCode() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let code = '';
    for (let i = 0; i < 2; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 4; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
  }

  static async generateUniquePickupCode() {
    let code;
    let exists;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      code = this.generatePickupCode();
      exists = await Express.findOne({ pickupCode: code });
      attempts++;
    } while (exists && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new Error('无法生成唯一取件码，请稍后重试');
    }

    return code;
  }

  static validatePickupCode(code) {
    const pattern = /^[A-Z]{2}[0-9]{4}$/;
    return pattern.test(code);
  }
}

module.exports = PickupCodeService;
