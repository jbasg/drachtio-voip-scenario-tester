
const unregister = (user, srf, reregister, logger) => new Promise((resolve, reject) => {
  srf.request(`sip:${user.username}@${user.domain}`, {
    method: 'REGISTER',
    headers: {
      Expires: '0',
      From: `sip:${user.username}@${user.domain}`,
      Contact: `sip:${user.username}@${user.domain}:${user.hostport}`,
    },
    auth: {
      username: user.username,
      password: user.password,
    },
  }, (err, req) => {
    if (err) {
      return err;
    }
    req.on('response', (res) => {
      if (res.status !== 200) {
        throw err;
      } else if (res.status === 200) {
        clearInterval(reregister);
        resolve();
      }
    });
  });
}); // unregister

const register = (user, srf, logger) => new Promise((resolve, reject) => {
  srf.request(`sip:${user.username}@${user.domain}`, {
    method: 'REGISTER',
    headers: {
      Expires: '3600',
      From: `sip:${user.username}@${user.domain}`,
      Contact: `sip:${user.username}@${user.domain}:5060`,
    },
    auth: {
      username: user.username,
      password: user.password,
    },
  }, (err, req) => {
    if (err) {
      reject(err);
    }
    req.on('response', (res) => {
      if (res.status === 200) {
        const expiresPosition = res.headers.contact.search('expires=');
        const headerLength = res.headers.contact.length;
        const expires = res.headers.contact.substring(expiresPosition + 8, headerLength);
        resolve(expires);
      }
    }); // req.on
  }); // srf.request
}); // register

const reRegister = (user, srf, expires) => {
  srf.request(`sip:${user.username}@${user.domain}`, {
    method: 'REGISTER',
    headers: {
      Expires: expires,
      From: `sip:${user.username}@${user.domain}`,
      Contact: `sip:${user.username}@${user.domain}:${user.hostport}`,
    },
    auth: {
      username: user.username,
      password: user.password,
    },
  }); // srf.request
}; // reRegister

module.exports.register = register;
module.exports.unregister = unregister;
module.exports.reRegister = reRegister;
