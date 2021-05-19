
const padding = "   ";
const help = () => {
    console.log("NAME:");
    console.log(padding+"scriptDns A Command Line DNS Client written in JS");

    console.log();
    console.log("USAGE:");
    console.log(padding+"scriptdns [domain name] [--] [query options] [arguments...");

    console.log();
    console.log("EXAMPLES:");
    console.log(padding+"scriptdns google.com\t\t\t\tQuery a domain using defaults.");
    console.log(padding+"scriptdns google.com CNAME\t\t\tLooks up for a CNAME record.");
    console.log(padding+"scriptdns google.com MX @https://9.9.9.9\t\tUses a custom https DNS resolver.");
    
    console.log();
    console.log("Transport Options");
    console.log(padding+"Based on the URL scheme the correct resolver chosen.");
    console.log(padding+"Fallbacks to HTTPS resolver if no scheme is present.");
    console.log();
    console.log(padding+"@udp://\teg: @udp://1.1.1.1 initiates a UDP resolver for 1.1.1.1:53.");
    console.log(padding+"@tcp://\teg: @tcp://1.1.1.1 initiates a TCP resolver for 1.1.1.1:53.");
    console.log(padding+"@https://\teg: @https://cloudflare-dns.com/dns-query initiates a DOH resolver for Cloudflare DoH server.");
    console.log(padding+"@tls://\teg: @tls://1.1.1.1 initiates a DoT resolver for 1.1.1.1:853.");
    console.log();
    console.log("Query Options:");
    console.log(padding+"-ptl, --protocol=PROTOCOL\tProtocol over which you want to connect to the DNS Server (tcp, https, udp, tls).");
    console.log(padding+"-c, --class=CLASS\t\tNetwork class of the DS record (IN, CH, HS etc).");
    console.log();
    console.log("Resolver Options:");
    console.log(padding+"-r, --reverse\tDo reverse lookup of an IPv4 or IPv6 address. Returns a list of hostnames.");
    console.log(padding+"--wireformat\tSend the request and receives the response from the DNS server in wire format defined in RFC1035.");
    console.log();
    console.log("Output Options:");
    console.log(padding+"--json\tFormat the output as JSON.");
    console.log(padding+"--time\tShows us the Response Time for the request.");
    
    
}

module.exports = help;