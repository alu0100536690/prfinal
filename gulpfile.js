/*
* Dependencias
*/
var run = require('gulp-run');
var GulpSSH = require('gulp-ssh');
var gulp = require('gulp');
var shell = require('gulp-shell');
var install = require('gulp-install');
var path = require('path');
var json = require(path.join(__dirname,'package.json'));
var git = require('simple-git');
var fs = require('fs');
var fe = require('fs-extra');
var exec = require('child_process').exec;
var ssh_exec = require('ssh-exec');


var username = json.remoteserver.usuario_remoto;
var password = json.remoteserver.password_remoto;
var ip = json.remoteserver.ip_remoto;
var host = json.remoteserver.ruta_remoto;
var dominio_web = json.remoteserver.dominio_web;
var privateKey = json.localserver.privateKey_local;
var directorio = json.Directorio.nombre_dir;
var url_repo_git = json.repository.url;

var config = {
  host: `${ip}`,
  port: 22,
  username: `${username}`,
  privateKey: fs.readFileSync(`${privateKey}`)
}

var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
})

gulp.task('paquete-ocean', function(){
    var ocean = require("gitbook-start-digitalocean-merquililycony");
});

gulp.task('deploy', function () {
  return gulp.src('')
      .pipe(shell(['./generar-permisos']))
      .pipe(shell(['./scripts/losh generate-gitbook']))
      //.pipe(shell(['./scripts/losh deploy-gitbook']))

});

gulp.task('push', function(){

    if (!fe.existsSync(path.join(__dirname, '.git'))){
      git()
        .init()
        .add('./*')
        .commit("first commit")
        .addRemote('origin', json.repository.url)
        .push('origin', 'master');
    }
    else
    {
       git()
        .add('./*')
        .commit("Actualizando Gitbook.")
        .push('origin', 'master');
    }
});

gulp.task('deploy-digitalocean',function(){
    return gulpSSH
    .shell(['mkdir -p '+host,'cd '+host, 'git clone '+url_repo_git,'cd '+directorio,'pkill -HUP node', 'node app.js &'], {filePath: 'shell.log'})
    .pipe(gulp.dest('logs'))

});

gulp.task('deploy-update',function(){
    return gulpSSH
    .shell(['cd '+host+'/'+directorio,'git pull','pkill -HUP node', 'node app.js &'], {filePath: 'shell.log'})
    .pipe(gulp.dest('logs'))

});

gulp.task('clone-letsencrypt', function () {
  return gulpSSH
  .shell(['cd '+host,'git clone https://github.com/letsencrypt/letsencrypt'], {filePath: 'shell.log'})
  .pipe(gulp.dest('logs'))

});


gulp.task('start-ssl', function () {

  return gulpSSH
  .shell(['cd '+host,'mkdir certssl','cd certssl','ln -s /etc/letsencrypt/live/'+dominio_web+'/fullchain.pem cert.pem',
          'ln -s /etc/letsencrypt/live/'+dominio_web+'/privkey.pem key.pem','cd '+host+'/'+directorio+'/template',
          'pkill -HUP node','cd'+host+'/'+directorio,'node app.js &'], {filePath: 'shell.log'})
  .pipe(gulp.dest('logs'))

});


gulp.task('stop-server', function () {
  return gulpSSH
  .shell(['pkill -HUP node'], {filePath: 'shell.log'})
  .pipe(gulp.dest('logs'))

});

gulp.task('restart-server', function () {
  return gulpSSH
  .shell(['pkill -HUP node','cd '+host+'/'+directorio,'node app.js &'], {filePath: 'shell.log'})
  .pipe(gulp.dest('logs'))
});

gulp.task('start-server', function () {
  return gulpSSH
  .shell(['cd '+host+'/'+directorio,'node app.js &'], {filePath: 'shell.log'})
  .pipe(gulp.dest('logs'))
});
