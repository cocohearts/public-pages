# 1. IP / DNS
## URL
I want to go to some URL. Browser parses into server, path, HTTP/HTTPS, and now I want to find the IP for this server.

Depending on IPv4 / IPv6, device may not / may have a global public IP. If no global public, router will list its own public IP as return addr for all outgoing packets, and keep an internal Network Addr Translation table for port : private IP device.
## DNS / Nameservers
Router picks up signal on the network; modem routes it to the ISP network.

First check DNS caches; hit my device cache, then the router will go through ethernet / cell tower 5G LTE to hit the nearest ISP node/local ISP cache.

If that misses, then it hops inside the internal ISP backbone servers. DNS is handled by resolvers; just big table lookups.

If the domain somehow missed the ISP cache, then it hits a root nameserver, which passes to a Top Level Domain nameserver for a specific extension `.com` `.gov` etc. TLD nameservers then reroute to an authoritative nameserver, which has the IP for that domain name.
## CDN
Content delivery network: a given domain has distributed nodes that pass out that server's content. Most often DNS cache will return a CDN IP directly, and then you just talk directly to CDN. Cache, cache, cache.
# 2. TCP / TLS
Once we've found the correct IP, stuff is still passed around through ISP's through BGP (prefix-based). Of course each ISP finds the shortest internal path. Cached domains are geographically localized.

TCP is a byte-stream protocol, i.e. every byte is indexed. To protect packet loss / prevent spoofing, TCP handshake starts by setting / agreeing to sequence numbers. Init handshake is called SYN / SYN-ACK / ACK. Every packet is labelled, and every ACK is confirmation that the label was received.

Then TLS begins.
1. Certificate check: a certificate authority signs the pkey on the certificate, and server signs with its skey. Certificate is usually a "chain" going back to a trusted root (hardcoded in the browser / OS) and root CAs sign intermediate CAs, which sign domain ceritifcates.
2. Symmetric Diffie-Helman key exchange. ClientHello lists available schemes / ciphers on client (plus secret share), ServerHello replies scheme / cipher with its secret share.
TLS1.3 merged these two.

HTTP/3 dropped TCP handshake, combiend UDP with TLS handshake into QUIC. Modern browsers can also resume using stale TLS connections.
# 3. HTML / CSS / JS
Finally content gets loaded! HTML requests, normal format, typically dynamic text / vars will not be on CDN but other stuff will, CSS / JS can also get sent over even if the client doesn't ask for it, TCP channels can be "multiplexed" so that multiple channels for different streams can be parallelized into the same one, etc.