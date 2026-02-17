const dns = require('dns');

console.log('Testing DNS resolution for MongoDB Atlas...');
const hostname = '_mongodb._tcp.prayerboardcluster.ncgjylc.mongodb.net';

dns.resolveSrv(hostname, (err, addresses) => {
    if (err) {
        console.error('DNS Resolution Failed:', err);
        console.log('\nPossible causes:');
        console.log('1. The Cluster address is incorrect.');
        console.log('2. Your network is blocking DNS SRV records (common in some corporate/school networks).');
        console.log('3. ISP DNS issues.');
    } else {
        console.log('DNS Resolution Successful:', addresses);
        console.log('Connection should work if IP is whitelisted.');
    }
});
