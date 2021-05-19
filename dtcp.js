const net = require("net");
const dnsPacket = require("dns-packet");
const events = require("events");
const mainFun = require("./message_format");
const eventEmitter = new events.EventEmitter();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let final_data = [],
  counter = 0,
  currentServer = 0,
  domain = "",
  type = "",
  port = 53,
  network_class = "IN",
  serverName = "",
  queries;

const google = () => {
  let response = null;
  let expectedLength = 0;
  let date;
  const buf = dnsPacket.streamEncode({
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

  const client = new net.Socket();
  client.connect(port, "8.8.8.8", function () {
    client.write(buf);
    date = new Date();
  });

  client.on("data", function (data) {
    // console.log("Received response: %d bytes", data.byteLength);
    if (response == null) {
      if (data.byteLength > 1) {
        const plen = data.readUInt16BE(0);
        expectedLength = plen;
        if (plen < 12) {
          throw new Error("below DNS minimum packet length");
        }
        response = Buffer.from(data);
      }
    } else {
      response = Buffer.concat([response, data]);
    }

    if (response.byteLength >= expectedLength) {
      client.destroy();
      // console.log(dnsPacket.streamDecode(response));
      eventEmitter.emit(
        "data",
        mainFun(
          dnsPacket.streamDecode(response),
          queries,
          `8.8.8.8:${port}`,
          new Date() - date
        )
      );
    }
  });

  // client.on("close", () => {
  //   eventEmitter.emit("data", []);
  // });

  client.on("error", (err) => {
    eventEmitter.emit("error", err);
  });
};

const cloudFlare = () => {
  let response = null;
  let expectedLength = 0;
  let date;

  const buf = dnsPacket.streamEncode({
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

  const client = new net.Socket();
  client.connect(port, "1.1.1.1", function () {
    client.write(buf);
    date = new Date();
  });

  client.on("data", function (data) {
    // console.log("Received response: %d bytes", data.byteLength);
    if (response == null) {
      if (data.byteLength > 1) {
        const plen = data.readUInt16BE(0);
        expectedLength = plen;
        if (plen < 12) {
          throw new Error("below DNS minimum packet length");
        }
        response = Buffer.from(data);
      }
    } else {
      response = Buffer.concat([response, data]);
    }

    if (response.byteLength >= expectedLength) {
      client.destroy();
      eventEmitter.emit(
        "data",
        mainFun(
          dnsPacket.streamDecode(response),
          queries,
          `1.1.1.1:${port}`,
          new Date() - date
        )
      );
    }
  });

  // client.on("close", () => {
  //   eventEmitter.emit("data", []);
  // });

  client.on("error", (err) => {
    eventEmitter.emit("error", err);
  });
};

const custom = () => {
  let response = null;
  let expectedLength = 0;
  let date;

  const buf = dnsPacket.streamEncode({
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

  const client = new net.Socket();
  client.connect(port, serverName, function () {
    client.write(buf);
    date = new Date();
  });

  client.on("data", function (data) {
    // console.log("Received response: %d bytes", data.byteLength);
    if (response == null) {
      if (data.byteLength > 1) {
        const plen = data.readUInt16BE(0);
        expectedLength = plen;
        if (plen < 12) {
          throw new Error("below DNS minimum packet length");
        }
        response = Buffer.from(data);
      }
    } else {
      response = Buffer.concat([response, data]);
    }

    if (response.byteLength >= expectedLength) {
      client.destroy();
      eventEmitter.emit(
        "data",
        mainFun(
          dnsPacket.streamDecode(response),
          queries,
          `${serverName}:${port}`,
          new Date() - date
        )
      );
    }
  });

  // client.on("close", () => {
  //   eventEmitter.emit("data", []);
  // });

  client.on("error", (err) => {
    eventEmitter.emit("error", err);
  });
};

const dotcpServers = [google, cloudFlare];

const dotcpMainFun = (dmain, types, serverNm, prt, netwrk_class, qeries) => {
  domain = dmain;
  serverName = serverNm;
  type = types[counter];
  port = prt;
  network_class = netwrk_class;
  queries = qeries;

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
      dotcpServers[++currentServer]();
    });

    eventEmitter.on("next", () => {
      type = types[++counter];
      dotcpServers[currentServer]();
    });

    dotcpServers[currentServer]();
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

module.exports = dotcpMainFun;
