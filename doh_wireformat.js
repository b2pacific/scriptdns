const https = require("https");
const dnsPacket = require("dns-packet");
const events = require("events");
const eventEmitter = new events.EventEmitter();
const mainFun = require("./message_format");

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let final_data = [],
  counter = 0,
  type = "",
  currentServer = 0,
  domain = "",
  network_class = "IN",
  port = 443,
  queries;

const cloudFlareGet = () => {
  const dnsQuery = dnsPacket.encode({
    type: "query",
    id: getRandomInt(1, 65534),
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [
      {
        type: type,
        name: domain,
        class: network_class,
      },
    ],
  });
  const final_query = Buffer.from(dnsQuery).toString("base64");
  const path = `/dns-query?dns=${final_query}`;
  let date;
  const options = {
    hostname: "cloudflare-dns.com",
    path: path,
    port: port,
    method: "GET",
    headers: {
      accept: "application/dns-message",
    },
  };

  const req = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data = chunk;
    });

    response.on("end", () => {
      eventEmitter.emit(
        "data",
        mainFun(dnsPacket.decode(data), queries, "1.1.1.1", new Date() - date)
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

const cloudFlarePost = () => {
  const dnsQuery = dnsPacket.encode({
    type: "query",
    id: getRandomInt(1, 65534),
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [
      {
        type: type,
        name: domain,
        class: network_class,
      },
    ],
  });
  const path = `/dns-query`;
  let date;
  const options = {
    hostname: "cloudflare-dns.com",
    path: path,
    method: "POST",
    port: port,
    headers: {
      "content-type": "application/dns-message",
      accept: "application/dns-message",
      "content-length": Buffer.byteLength(dnsQuery),
    },
  };

  const req = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data = chunk;
    });

    response.on("end", () => {
      eventEmitter.emit(
        "data",
        mainFun(dnsPacket.decode(data), queries, "1.1.1.1", new Date() - date)
      );
    });
  });

  req.on("error", (err) => {
    eventEmitter.emit("error", err);
  });

  date = new Date();
  req.write(dnsQuery);

  req.end();
};

const googleGet = () => {
  const dnsQuery = dnsPacket.encode({
    type: "query",
    id: getRandomInt(1, 65534),
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [
      {
        type: type,
        name: domain,
        class: network_class,
      },
    ],
  });

  const final_query = Buffer.from(dnsQuery).toString("base64");

  const path = `/dns-query?dns=${final_query}`;
  let date;
  const options = {
    hostname: "dns.google",
    path: path,
    port: port,
    method: "GET",
    headers: {
      accept: "application/dns-message",
    },
  };

  const req = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data = chunk;
    });

    response.on("end", () => {
      eventEmitter.emit(
        "data",
        mainFun(dnsPacket.decode(data), queries, "8.8.8.8", new Date() - date)
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

const googlePost = () => {
  const dnsQuery = dnsPacket.encode({
    type: "query",
    id: getRandomInt(1, 65534),
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [
      {
        type: type,
        name: domain,
        class: network_class,
      },
    ],
  });

  const path = `/dns-query`;
  let date;
  const options = {
    hostname: "dns.google",
    path: path,
    port: port,
    method: "POST",
    headers: {
      "content-type": "application/dns-message",
      accept: "application/dns-message",
      "content-length": Buffer.byteLength(dnsQuery),
    },
  };

  const req = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data = chunk;
    });

    response.on("end", () => {
      eventEmitter.emit(
        "data",
        mainFun(dnsPacket.decode(data), queries, "8.8.8.8", new Date() - date)
      );
    });
  });

  req.on("error", (err) => {
    eventEmitter.emit("error", err);
  });

  date = new Date();
  req.write(dnsQuery);

  req.end();
};

const custom = () => {
  const dnsQuery = dnsPacket.encode({
    type: "query",
    id: getRandomInt(1, 65534),
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [
      {
        type: type,
        name: domain,
        class: network_class,
      },
    ],
  });

  const path = serverName.substr(serverName.indexOf("/"));
  let date;
  const options = {
    hostname: serverName.substr(0, serverName.indexOf("/")),
    path: path,
    port: port,
    method: "POST",
    headers: {
      "content-type": "application/dns-message",
      accept: "application/dns-message",
      "content-length": Buffer.byteLength(dnsQuery),
    },
  };

  const req = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data = chunk;
    });

    response.on("end", () => {
      eventEmitter.emit(
        "data",
        mainFun(dnsPacket.decode(data), queries, serverName, new Date() - date)
      );
    });
  });

  req.on("error", (err) => {
    eventEmitter.emit("error", err);
  });

  date = new Date();
  req.write(dnsQuery);

  req.end();
};

const doh_wireformatServers = [
  cloudFlareGet,
  cloudFlarePost,
  googleGet,
  googlePost,
];

const doh_wireformatMainFun = (
  dmain,
  types,
  serverNm,
  prt,
  netwrk_class,
  qries
) => {
  domain = dmain;
  port = prt;
  queries = qries;
  network_class = netwrk_class;
  type = types[counter];
  serverName = serverNm;

  if (!serverName) {
    eventEmitter.on("data", (data) => {
      final_data = final_data.concat(data);
      if (counter === types.length - 1) {
        if (queries["--json"]) console.log(final_data);
        else console.table(final_data);
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
      doh_wireformatServers[++currentServer]();
    });

    eventEmitter.on("next", () => {
      type = types[++counter];
      doh_wireformatServers[currentServer]();
    });

    doh_wireformatServers[currentServer]();
  } else {
    eventEmitter.on("data", (data) => {
      final_data = final_data.concat(data);
      if (counter === types.length - 1) {
        if (queries["--json"]) console.log(final_data);
        else console.table(final_data);
      } else eventEmitter.emit("next");
    });

    eventEmitter.on("error", (err) => {
      console.log(err);
    });

    eventEmitter.on("next", () => {
      type = types[++counter];
      custom();
    });
    custom();
  }
};

module.exports = doh_wireformatMainFun;
