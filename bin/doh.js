const https = require("https");
const mainFun = require("./message_format");
const events = require("events");
const eventEmitter = new events.EventEmitter();

let final_data = [],
  counter = 0,
  type = "",
  currentServer = 0,
  domain = "",
  port = 443,
  queries;

const cloudFlare = () => {
  const path = `/dns-query?name=${domain}&type=${type}`;
  let date;
  const options = {
    hostname: "cloudflare-dns.com",
    path: path,
    port: port,
    method: "GET",
    headers: {
      accept: "application/dns-json",
    },
  };

  const req = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      eventEmitter.emit(
        "data",
        mainFun(JSON.parse(data), queries, "1.1.1.1", new Date() - date)
      );
      // console.log(JSON.parse(data));
    });
  });

  req.on("error", (err) => {
    eventEmitter.emit("error", err);
  });

  req.on("socket", (socket) => {
    socket.on("secureConnect", () => {
      date = new Date();
    });
  });

  req.end();
};

const google = (type) => {
  const path = `/resolve?name=${domain}&type=${type}`;
  let date;
  const options = {
    hostname: "dns.google.com",
    path: path,
    port: port,
    method: "GET",
    headers: {
      accept: "application/dns-json",
    },
  };

  const req = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      eventEmitter.emit(
        "data",
        mainFun(JSON.parse(data), queries, "8.8.8.8", new Date() - date)
      );
    });
  });

  req.on("error", (err) => {
    eventEmitter.emit("error", err);
  });

  req.on("socket", (socket) => {
    socket.on("secureConnect", () => {
      date = new Date();
    });
  });

  req.end();
};

const dohServers = [cloudFlare, google];

const dohMainFun = (dmain, types, serverName, prt, qries) => {
  domain = dmain;
  port = prt;
  queries = qries;
  type = types[counter];

  if (!serverName) {
    eventEmitter.on("data", (data) => {
      final_data = final_data.concat(data);
      if (counter === types.length - 1) {
        if(queries["--json"])
          console.log(final_data);
        else
          console.table(final_data);
      } else eventEmitter.emit("next");
    });

    eventEmitter.on("error", (err) => {
      if (currentServer) {
        currentServer = 0;
        console.log(err);
        eventEmitter.emit("next");
      } else eventEmitter.emit("repeat");
    });

    eventEmitter.on("repeat", () => {
      type = types[counter];
      dohServers[++currentServer]();
    });

    eventEmitter.on("next", () => {
      type = types[++counter];
      dohServers[currentServer]();
    });

    dohServers[currentServer]();
  } else {
    console.log("Custom DNS Server for https is not supported");
  }
};

module.exports = dohMainFun;
