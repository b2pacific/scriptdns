const dohMainFun = require("./doh");
const doudpMainFun = require("./doudp");
const dotcpMainFun = require("./dtcp");
const doh_wireformatMainFun = require("./doh_wireformat");
const dotlsMainFun = require("./dotls");
const help = require("./help");

let types = [];
const allTypes = ["AAAA", "A", "MX", "NS", "CNAME", "TXT", "SOA"];
const queries = {
  "--time": 0,
  "--json": 0,
  "--google": 0,
  "--cloudFlare": 0,
};

console.log(process.argv);
const hostName = process.argv[2];

if (hostName === "help") {
  help();
  process.exit(0);
}

let serverName = "",
  dnsOver = 1,
  network_class = "IN",
  port = 0;
const serverType = {
  tls: 0,
  https: 1,
  tcp: 2,
  udp: 3,
  https_wireformat: 4,
};

for (let i = 3; i < process.argv.length; ++i) {
  if (allTypes.includes(process.argv[i])) {
    types.push(process.argv[i]);
  } else if (process.argv[i][0] === "@") {
    dnsOver =
      serverType[process.argv[i].substr(1, process.argv[i].indexOf(":") - 1)];
    serverName = process.argv[i].substr(process.argv[i].indexOf("/") + 2);
    if (serverName.indexOf(":") != -1) {
      port = parseInt(serverName.substr(serverName.indexOf(":")));
      serverName = serverName.substr(0, serverName.indexOf(":"));
    }

    if (dnsOver == undefined) {
      dnsOver = 2;
    }
  } else if (process.argv[i] in queries) {
    queries[process.argv[i]] = 1;
  } else if (process.argv[i].indexOf("--ptl=") != -1) {
    if (process.argv[i].substr(6) in serverType)
      dnsOver = serverType[process.argv[i].substr(6)];
    else {
      console.log("Invalid Protocol Type");
      process.exit(0);
    }
  } else if (process.argv[i].indexOf("--protocol=") != -1) {
    if (process.argv[i].substr(11) in serverType)
      dnsOver = serverType[process.argv[i].substr(11)];
    else {
      console.log("Invalid Protocol Type");
      process.exit(0);
    }
  } else if (process.argv[i].indexOf("--class=") != -1) {
    const temp = process.argv[i].substr(7);

    network_class = temp;
  } else if (process.argv[i].indexOf("--c=") != -1) {
    const temp = process.argv[i].substr(4);
    console.log(temp);
    network_class = temp;
  } else if (process.argv[i] === "--wireformat") {
    dnsOver = 4;
  } else {
    console.log(`Unknow parameter ${process.argv[i]}`);
    process.exit(0);
  }
}

if (types.length == 0) {
  types = allTypes;
}

if (dnsOver == 0) {
  dotlsMainFun(
    hostName,
    types,
    serverName,
    port ? port : 853,
    network_class,
    queries
  );
} else if (dnsOver == 1 && serverName) {
  doh_wireformatMainFun(
    hostName,
    types,
    serverName,
    port ? port : 443,
    network_class,
    queries
  );
} else if (dnsOver == 1) {
  dohMainFun(hostName, types, serverName, port ? port : 443, queries);
} else if (dnsOver == 2) {
  dotcpMainFun(
    hostName,
    types,
    serverName,
    port ? port : 53,
    network_class,
    queries
  );
} else if (dnsOver == 3) {
  doudpMainFun(
    hostName,
    types,
    serverName,
    port ? port : 53,
    network_class,
    queries
  );
} else {
  doh_wireformatMainFun(
    hostName,
    types,
    serverName,
    port ? port : 443,
    network_class,
    queries
  );
}
