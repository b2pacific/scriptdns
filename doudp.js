const dnsPacket = require("dns-packet");
const dgram = require("dgram");
const events = require("events");
const mainFun = require("./message_format");

const eventEmitter = new events.EventEmitter();

let final_data = [],
  counter = 0,
  currentServer = 0,
  domain = "",
  type = "",
  port = 53,
  network_class = "IN",
  serverName = "";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const google = () => {
  const socket = dgram.createSocket("udp4");

  const buf = dnsPacket.encode({
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
  let date;

  socket.on("message", (message) => {
    socket.close();
    eventEmitter.emit(
      "data",
      mainFun(
        dnsPacket.decode(message),
        "",
        `8.8.8.8:${port}`,
        new Date() - date
      )
    );
  });

  socket.on("error", (err) => {
    eventEmitter.emit("error", err);
  });

  socket.send(buf, 0, buf.length, port, "8.8.8.8");
  date = new Date();
};

const cloudFlare = () => {
  const socket = dgram.createSocket("udp4");

  const buf = dnsPacket.encode({
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
  let date;

  socket.on("message", (message) => {
    socket.close();
    eventEmitter.emit(
      "data",
      mainFun(
        dnsPacket.decode(message),
        "",
        `1.1.1.1:${port}`,
        new Date() - date
      )
    );
  });

  socket.on("error", (err) => {
    eventEmitter.emit("error", err);
  });

  socket.send(buf, 0, buf.length, port, "1.1.1.1");
  date = new Date();
};

const custom = () => {
  const socket = dgram.createSocket("udp4");

  const buf = dnsPacket.encode({
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
  let date;

  socket.on("message", (message) => {
    socket.close();
    eventEmitter.emit(
      "data",
      mainFun(
        dnsPacket.decode(message),
        "",
        `${serverName}:${port}`,
        new Date() - date
      )
    );
  });

  socket.on("error", (err) => {
    eventEmitter.emit("error", err);
  });

  socket.send(buf, 0, buf.length, port, serverName);
  date = new Date();
};

const doudpServers = [cloudFlare, google];

const doudpMainFun = (dmain, types, serverNm, prt, netwrk_class) => {
  domain = dmain;
  serverName = serverNm;
  type = types[counter];
  port = prt;
  network_class = netwrk_class;

  if (!serverName) {
    eventEmitter.on("data", (data) => {
      final_data = final_data.concat(data);
      if (counter === types.length - 1) {
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
      doudpServers[++currentServer]();
    });

    eventEmitter.on("next", () => {
      type = types[++counter];
      doudpServers[currentServer]();
    });
    doudpServers[currentServer]();
  } else {
    eventEmitter.on("data", (data) => {
      final_data = final_data.concat(data);
      if (counter === types.length - 1) {
        console.table(final_data);
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

module.exports = doudpMainFun;
