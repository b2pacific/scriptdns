const tls = require("tls");
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
  serverName = "";

const google = () => {
  let response = null;
  let expectedLength = 0;

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

  const context = tls.createSecureContext({
    secureProtocol: "TLSv1_2_method",
  });

  const options = {
    port: port,
    host: "8.8.8.8",
    secureContext: context,
  };

  const client = tls.connect(options, () => {
    client.write(buf);
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
      // console.log(dnsPacket.streamDecode(response));
      client.destroy();
      eventEmitter.emit(
        "data",
        mainFun(dnsPacket.streamDecode(response), "", `8.8.8.8:${port}`)
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

  const context = tls.createSecureContext({
    secureProtocol: "TLSv1_2_method",
  });

  const options = {
    port: port,
    host: "1.1.1.1",
    secureContext: context,
  };

  const client = tls.connect(options, () => {
    client.write(buf);
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
      // console.log(dnsPacket.streamDecode(response));
      client.destroy();
      eventEmitter.emit(
        "data",
        mainFun(dnsPacket.streamDecode(response), "", `1.1.1.1:${port}`)
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

  const context = tls.createSecureContext({
    secureProtocol: "TLSv1_2_method",
  });

  const options = {
    port: port,
    host: serverName,
    secureContext: context,
  };

  const client = tls.connect(options, () => {
    client.write(buf);
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
      // console.log(dnsPacket.streamDecode(response));
      client.destroy();
      eventEmitter.emit(
        "data",
        mainFun(dnsPacket.streamDecode(response), "", `${serverName}:${port}`)
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

const dotlsServers = [google, cloudFlare];

const dotlsMainFun = (dmain, types, serverNm, prt, netwrk_class) => {
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
      dotlsServers[++currentServer]();
    });

    eventEmitter.on("next", () => {
      type = types[++counter];
      dotlsServers[currentServer]();
    });
    dotlsServers[currentServer]();
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

module.exports = dotlsMainFun;
