var plan = require('flightplan');

// configuration

plan.target('production', {
    host: 'vanilla.adhikasetyap.me',
    username: 'dhika',
    agent: process.env.SSH_AUTH_SOCK
});

var tmpDir  = 'adhikasetyap.me-' + new Date().getTime();
var prodDir = '/var/www/adhikasetyap.me/public';

// Confirm last gulp build from local
plan.local(function(local) {
    local.log('Gulp build');
    local.exec('gulp styles');
    local.exec('gulp scripts');

    local.log('Copy files to remote hosts');
    var filesToCopy = local.exec('git ls-files', {silent: true});

    local.transfer(filesToCopy, prodDir);
});

plan.remote(function(remote) {
    // remote.log('Move files to web root');
    // remote.sudo('cp -R /tmp/' + tmpDir + '/* /var/www/adhikasetyap.me/public', {user: 'dhika'});
    // remote.rm('-rf /tmp/' + tmpDir);

    remote.log('Install dependencies');
    remote.sudo('npm --production install ' + prodDir, {user: 'dhika'});
    remote.sudo('bower --production install ' + prodDir, {user: 'dhika'});
});