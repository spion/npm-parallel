
var spawn = require('child_process').spawn;

var process = global.process;

function runTask(taskname) {
    var command, args;
    if (process.platform === 'win32') {
        command = 'cmd'
        args = ['/c', 'npm run ' + taskname]
    } else {
        command = 'npm'
        args = ['run', taskname]
    }
    return spawn(command, args, {
        env: process.env,
        cwd: process.cwd()
    })
}

function parallel(tasks, done) {
    var alreadyDone = false;
    var counter = tasks.length;
    function doneErr(e) {
        if (alreadyDone) return
        alreadyDone = true
        done(e)
    }
    function doneOk() {
        if (alreadyDone) return
        if (--counter > 0) return;
        alreadyDone = true
        done(null)
    }
    tasks.forEach(function(task) {
        var proc = runTask(task)
        proc.on('error', doneErr)
        proc.on('close', function(code, signal) {
            if (code !== 0) doneErr(code)
            else doneOk();
        })
        proc.stderr.pipe(process.stderr);
        proc.stdout.pipe(process.stdout);
        return proc;
    });
}


exports.run = function() {
    parallel(process.argv.slice(2), function(code) {
        if (typeof code === 'number') process.exit(code)
        else if (code == null) process.exit(0)
        else {
            console.error("Error:", code);
            process.exit(1);
        }
    });
}
