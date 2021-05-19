const dns = require("dns");

const reverseMainFun = (domain) => {
  dns.reverse(domain, (err, hostnames) => {
    if (err) console.log(err);
    else {
      console.log("IP ", domain);
      console.log("Hostnames:");
      hostnames.forEach((hostname) => {
        console.log(hostname);
      });
    }
  });
};

module.exports = reverseMainFun;
