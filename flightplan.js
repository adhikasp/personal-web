var plan = require('flightplan');

// configuration

plan.target('production', {
    host: 'vanilla.adhikasetyap.me',
    username: 'dhika',
    agent: process.env.SSH_AUTH_SOCK
});

var tmpDir = 'adhikasetyap.me-' + new Date().getTime();

// Confirm last gulp build from local
plan.local(function(local) {
    local.log('Gulp build');
    local.exec('gulp styles');
    local.exec('gulp scripts');

    local.log('Copy files to remote hosts');
    var filesToCopy = local.exec('git ls-files', {silent: true});

    local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

plan.remote(function(remote) {
    remote.log('Move files to web root');
    remote.sudo('cp -R /tmp/' + tmpDir + '/* /var/www/adhikasetyap.me/public', {user: 'dhika'});
    remote.rm('-rf /tmp/' + tmpDir);

    remote.log('Install dependencies');
    remote.sudo('npm --production install /var/www/adhikasetyap.me/public', {user: 'dhika'});
    remote.sudo('bower --production install /var/www/adhikasetyap.me/public', {user: 'dhika'});
});