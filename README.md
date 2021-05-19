<br />
<p align="center">
  <h2 align="center">scriptDns</h2>
  <p align="center">
    <i>Command-line DNS client written in JS</i>
  </p>
</p>

---

**scriptDns** is a command-line DNS client written in Javascript. It can query a DNS server for a domain and output the result on the command line in a human readable format and even perform a reverse DNS lookup for an IPv4 or IPv6 address.

## Features

- Human readable output - in table format.
- Supports **JSON** format.
- Supports DNS over multiple protocols:
  - DNS over **HTTPS** (DoH)
  - DNS over **TLS** (DoT)
  - DNS over **TCP**
  - DNS over **UDP**
  - DNS over **HTTPS** in wireformat
- Can query any custom DNS resolver of your choice over any protocol.

## Installation

You can install it globally in your System only and only if you have node js and npm already installed on your System.

```bash
$ npm install -g scriptdns
```

## Usage Examples

**Note: The domain name to be queried should always be the first argument**

**Do a simple DNS Lookup for `google.com`**

Run scriptdns help to get list of all the available commands

```bash
$ scriptdns google.com A
┌─────────┬──────────────┬────────────┬───────────────┬─────┬───────┬───────────────────┬───────────┐
│ (index) │     name     │ query type │ response type │ ttl │ class │      address      │  server   │
├─────────┼──────────────┼────────────┼───────────────┼─────┼───────┼───────────────────┼───────────┤
│    0    │ 'google.com' │    'A'     │      'A'      │ 233 │ 'IN'  │ '142.250.192.110' │ '1.1.1.1' │
└─────────┴──────────────┴────────────┴───────────────┴─────┴───────┴───────────────────┴───────────┘
```

**Querying more than one type**

```
$ scriptdns youtube.com A MX
┌─────────┬───────────────┬────────────┬───────────────┬─────┬───────┬───────────────────────────────┬───────────┐
│ (index) │     name      │ query type │ response type │ ttl │ class │            address            │  server   │
├─────────┼───────────────┼────────────┼───────────────┼─────┼───────┼───────────────────────────────┼───────────┤
│    0    │ 'youtube.com' │    'A'     │      'A'      │ 101 │ 'IN'  │       '142.250.76.174'        │ '1.1.1.1' │
│    1    │ 'youtube.com' │    'MX'    │     'MX'      │ 600 │ 'IN'  │ '40 alt3.aspmx.l.google.com.' │ '1.1.1.1' │
│    2    │ 'youtube.com' │    'MX'    │     'MX'      │ 600 │ 'IN'  │ '30 alt2.aspmx.l.google.com.' │ '1.1.1.1' │
│    3    │ 'youtube.com' │    'MX'    │     'MX'      │ 600 │ 'IN'  │ '20 alt1.aspmx.l.google.com.' │ '1.1.1.1' │
│    4    │ 'youtube.com' │    'MX'    │     'MX'      │ 600 │ 'IN'  │   '10 aspmx.l.google.com.'    │ '1.1.1.1' │
│    5    │ 'youtube.com' │    'MX'    │     'MX'      │ 600 │ 'IN'  │ '50 alt4.aspmx.l.google.com.' │ '1.1.1.1' │
└─────────┴───────────────┴────────────┴───────────────┴─────┴───────┴───────────────────────────────┴───────────┘
```

**Using a different DNS resolver**

```bash
$ scriptdns github.com @tcp://9.9.9.9:53 A NS
┌─────────┬──────────────┬────────────┬───────────────┬─────┬───────┬───────────────────────────┬──────────────┐
│ (index) │     name     │ query type │ response type │ ttl │ class │          address          │    server    │
├─────────┼──────────────┼────────────┼───────────────┼─────┼───────┼───────────────────────────┼──────────────┤
│    0    │ 'github.com' │    'A'     │      'A'      │ 60  │ 'IN'  │      '13.234.210.38'      │ '9.9.9.9:53' │
│    1    │ 'github.com' │    'NS'    │     'NS'      │ 150 │ 'IN'  │  'ns-421.awsdns-52.com'   │ '9.9.9.9:53' │
│    2    │ 'github.com' │    'NS'    │     'NS'      │ 150 │ 'IN'  │   'dns3.p08.nsone.net'    │ '9.9.9.9:53' │
│    3    │ 'github.com' │    'NS'    │     'NS'      │ 150 │ 'IN'  │  'ns-1283.awsdns-32.org'  │ '9.9.9.9:53' │
│    4    │ 'github.com' │    'NS'    │     'NS'      │ 150 │ 'IN'  │   'dns2.p08.nsone.net'    │ '9.9.9.9:53' │
│    5    │ 'github.com' │    'NS'    │     'NS'      │ 150 │ 'IN'  │   'dns4.p08.nsone.net'    │ '9.9.9.9:53' │
│    6    │ 'github.com' │    'NS'    │     'NS'      │ 150 │ 'IN'  │  'ns-520.awsdns-01.net'   │ '9.9.9.9:53' │
│    7    │ 'github.com' │    'NS'    │     'NS'      │ 150 │ 'IN'  │ 'ns-1707.awsdns-21.co.uk' │ '9.9.9.9:53' │
│    8    │ 'github.com' │    'NS'    │     'NS'      │ 150 │ 'IN'  │   'dns1.p08.nsone.net'    │ '9.9.9.9:53' │
└─────────┴──────────────┴────────────┴───────────────┴─────┴───────┴───────────────────────────┴──────────────┘
```

**Running the same Query as above but now the output should be displayed in JSON**

```bash
$ scriptdns github.com @tcp://9.9.9.9:53 A NS --json
[
  {
    name: 'github.com',
    'query type': 'A',
    'response type': 'A',
    ttl: 23,
    class: 'IN',
    address: '13.234.210.38',
    server: '9.9.9.9:53'
  },
  {
    name: 'github.com',
    'query type': 'NS',
    'response type': 'NS',
    ttl: 113,
    class: 'IN',
    address: 'ns-421.awsdns-52.com',
    server: '9.9.9.9:53'
  },
  {
    name: 'github.com',
    'query type': 'NS',
    'response type': 'NS',
    ttl: 113,
    class: 'IN',
    address: 'dns3.p08.nsone.net',
    server: '9.9.9.9:53'
  },
  {
    name: 'github.com',
    'query type': 'NS',
    'response type': 'NS',
    ttl: 113,
    class: 'IN',
    address: 'ns-1283.awsdns-32.org',
    server: '9.9.9.9:53'
  },
  {
    name: 'github.com',
    'query type': 'NS',
    'response type': 'NS',
    ttl: 113,
    class: 'IN',
    address: 'dns2.p08.nsone.net',
    server: '9.9.9.9:53'
  },
  {
    name: 'github.com',
    'query type': 'NS',
    'response type': 'NS',
    ttl: 113,
    class: 'IN',
    address: 'dns4.p08.nsone.net',
    server: '9.9.9.9:53'
  },
  {
    name: 'github.com',
    'query type': 'NS',
    'response type': 'NS',
    ttl: 113,
    class: 'IN',
    address: 'ns-520.awsdns-01.net',
    server: '9.9.9.9:53'
  },
  {
    name: 'github.com',
    'query type': 'NS',
    'response type': 'NS',
    ttl: 113,
    class: 'IN',
    address: 'ns-1707.awsdns-21.co.uk',
    server: '9.9.9.9:53'
  },
  {
    name: 'github.com',
    'query type': 'NS',
    'response type': 'NS',
    ttl: 113,
    class: 'IN',
    address: 'dns1.p08.nsone.net',
    server: '9.9.9.9:53'
  }
]
```

**Query DNS records for `facebook.com` over tcp and Output the Response Time for this request**

```bash
$ scriptdns facebook --protocol=tcp --time A AAAA
┌─────────┬────────────────┬────────────┬───────────────┬─────┬───────┬───────────────────────────────────────┬──────────────┬──────┐
│ (index) │      name      │ query type │ response type │ ttl │ class │                address                │    server    │ time │
├─────────┼────────────────┼────────────┼───────────────┼─────┼───────┼───────────────────────────────────────┼──────────────┼──────┤
│    0    │ 'facebook.com' │    'A'     │      'A'      │ 238 │ 'IN'  │             '31.13.79.35'             │ '8.8.8.8:53' │ 44.5 │
│    1    │ 'facebook.com' │   'AAAA'   │    'AAAA'     │ 299 │ 'IN'  │ '2a03:2880:f12f:183:face:b00c:0:25de' │ '8.8.8.8:53' │  42  │
└─────────┴────────────────┴────────────┴───────────────┴─────┴───────┴───────────────────────────────────────┴──────────────┴──────┘
```

**Perform a revers DNS lookup for `157.240.23.35`**

```bash
$ scriptdns 157.240.23.35 --reverse
IP  157.240.23.35
Hostnames:
edge-star-mini-shv-01-maa2.facebook.com
```

**In case a DNS server address is not provided, then either google or cloudflare's DNS server is used**

### Transport Options

The transport over which the DNS request must be made should be provided either before the DNS server url or with the -ptl or --protocol query option.

## Example

@tcp://1.1.1.1 or -ptl=tcp or --protocol=tcp

**If no Protocol is provided then by default DNS over HTTPS is used**

```
   @udp://	  eg: @udp://1.1.1.1 initiates a UDP resolver for 1.1.1.1:53.
   @tcp://	  eg: @tcp://1.1.1.1 initiates a TCP resolver for 1.1.1.1:53.
   @https://	eg: @https://cloudflare-dns.com/dns-query initiates a DOH resolver for Cloudflare DoH server.
   @tls://	  eg: @tls://1.1.1.1 initiates a DoT resolver for 1.1.1.1:853.
```

### Resolver Options

```
  -r, --reverse   Do reverse lookup of an IPv4 or IPv6 address. Returns a list of hostnames.
  --wireformat    Send the request and receives the response from the DNS server in wire format defined in RFC1035.

```

### Query Options

```
  -ptl, --protocol=PROTOCOL       Protocol over which you want to connect to the DNS Server (tcp, https, udp, tls).
  -c, --class=CLASS               Network class of the DNS record (IN, CH, HS etc).
```

### Output Options

```
  --json                      Format the output as JSON.
  --time                      Shows how long the response took from the server.
```

### License 

MIT