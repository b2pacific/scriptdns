const mainFun = (data, queries, dnsServer, responseTime) => {
  let returnData = [];
  if (data.answers) {
    for (let i = 0; i < data.answers.length; ++i) {
      let address;
      switch (data.answers[i].type) {
        case "A":
          address = data.answers[i].data;
          break;
        case "AAAA":
          address = data.answers[i].data;
          break;
        case "MX":
          address = data.answers[i].data.exchange;
          break;
        case "SOA":
          address = data.answers[i].data.rname;
          break;
        case "TXT":
          address = data.answers[i].data[0].toString();
          break;
        case "NS":
          address = data.answers[i].data;
          break;
        case "CNAME":
          address = data.answers[i].data;
          break;
        default:
          address = "Hello";
          break;
      }
      returnData.push({
        name: data.answers[i].name,
        "query type": data.questions[0].type,
        "response type": data.answers[i].type,
        ttl: data.answers[i].ttl,
        class: data.answers[i].class,
        address: address,
        server: dnsServer,
      });

      if (queries["--time"]) {
        returnData[i] = { ...returnData[i], time: responseTime / 2 };
      }
    }
  }

  if (data.authorities) {
    for (let i = 0; i < data.authorities.length; ++i) {
      let address;
      switch (data.authorities[i].type) {
        case "A":
          address = data.authorities[i].data;
          break;
        case "AAAA":
          address = data.authorities[i].data;
          break;
        case "MX":
          address = data.authorities[i].data.exchange;
          break;
        case "SOA":
          address = data.authorities[i].data.rname;
          break;
        case "TXT":
          address = data.authorities[i].data[0].toString();
          break;
        case "NS":
          address = data.authorities[i].data;
          break;
        case "CNAME":
          address = data.authorities[i].data;
          break;
        default:
          address = "Hello";
          break;
      }
      returnData.push({
        name: data.authorities[i].name,
        "query type": data.questions[0].type,
        "response type": data.authorities[i].type,
        ttl: data.authorities[i].ttl,
        class: data.authorities[i].class,
        address: address,
        server: dnsServer,
      });

      if (queries["--time"]) {
        returnData[i] = { ...returnData[i], time: responseTime / 2 };
      }
    }
  }

  if (data.Answer) {
    for (let i = 0; i < data.Answer.length; ++i) {
      let address, type, query_type;
      switch (data.Answer[i].type) {
        case 1:
          address = data.Answer[i].data;
          type = "A";
          break;
        case 28:
          address = data.Answer[i].data;
          type = "AAAA";
          break;
        case 15:
          address = data.Answer[i].data;
          type = "MX";
          break;
        case 6:
          address = data.Answer[i].data;
          type = "SOA";
          break;
        case 16:
          address = data.Answer[i].data;
          type = "TXT";
          break;
        case 2:
          address = data.Answer[i].data;
          type = "NS";
          break;
        case 5:
          address = data.Answer[i].data;
          type = "CNAME";
          break;
        default:
          address = "Hello";
          type = "Hello";
          break;
      }

      switch (data.Question[0].type) {
        case 1:
          query_type = "A";
          break;
        case 28:
          query_type = "AAAA";
          break;
        case 15:
          query_type = "MX";
          break;
        case 6:
          query_type = "SOA";
          break;
        case 16:
          query_type = "TXT";
          break;
        case 2:
          query_type = "NS";
          break;
        case 5:
          query_type = "CNAME";
          break;
        default:
          query_type = "Hello";
          break;
      }

      returnData.push({
        name: data.Answer[i].name,
        "query type": query_type,
        "response type": type,
        ttl: data.Answer[i].TTL,
        class: "IN",
        address: address,
        server: dnsServer,
      });

      if (queries["--time"]) {
        returnData[i] = { ...returnData[i], time: responseTime / 2 };
      }
    }
  }

  if (data.Authority) {
    for (let i = 0; i < data.Authority.length; ++i) {
      let address, type, query_type;
      switch (data.Authority[i].type) {
        case 1:
          address = data.Authority[i].data;
          type = "A";
          break;
        case 28:
          address = data.Authority[i].data;
          type = "AAAA";
          break;
        case 15:
          address = data.Authority[i].data;
          type = "MX";
          break;
        case 6:
          address = data.Authority[i].data;
          type = "SOA";
          break;
        case 16:
          address = data.Authority[i].data;
          type = "TXT";
          break;
        case 2:
          address = data.Authority[i].data;
          type = "NS";
          break;
        case 5:
          address = data.Authority[i].data;
          type = "CNAME";
          break;
        default:
          address = "Hello";
          type = "Hello";
          break;
      }

      switch (data.Question[0].type) {
        case 1:
          query_type = "A";
          break;
        case 28:
          query_type = "AAAA";
          break;
        case 15:
          query_type = "MX";
          break;
        case 6:
          query_type = "SOA";
          break;
        case 16:
          query_type = "TXT";
          break;
        case 2:
          query_type = "NS";
          break;
        case 5:
          query_type = "CNAME";
          break;
        default:
          query_type = "Hello";
          break;
      }

      returnData.push({
        name: data.Authority[i].name,
        "query type": query_type,
        "response type": type,
        ttl: data.Authority[i].TTL,
        class: "IN",
        address: address,
        server: dnsServer,
      });

      if (queries["--time"]) {
        returnData[i] = { ...returnData[i], time: responseTime / 2 };
      }
    }
  }

  return returnData;
};

module.exports = mainFun;
