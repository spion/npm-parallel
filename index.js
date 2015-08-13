
var spawn = require('child_process').spawn;

var process = global.process;

function runTask(taskname) {
    var command, args;
    if (process.platform === 'win32') {
        command = 'cmd'
        args = ['/c', 'npm run --loglevel silent ' + taskname]
    } else {
        command = 'npm'
        args = ['run', '--loglevel', 'silent', taskname]
    }
    return spawn(command, args, {
        env: process.env,
        cwd: process.cwd()
    })
}

function multiple(pipeMethod) {
    return function(tasks, done) {
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
        var procs = tasks.map(function(task) {
            var proc = runTask(task)
            proc.on('error', doneErr)
            proc.on('close', function(code, signal) {
                if (code !== 0) doneErr(code)
                else doneOk();
            })
            return proc;
        });
        procs.forEach(function(proc, k) {
            proc.stderr.pipe(process.stderr);
            if (pipeMethod == 'none') {
                proc.stdout.pipe(process.stdout);
            }
            else {
                if (k > 0) procs[k - 1].stdout.pipe(proc.stdin)
                if (k === procs.length - 1) {
                    proc.stdout.pipe(process.stdout)
                }
            }
            return proc;
        })
    }
}

exports.parallel = multiple('none')
exports.pipeline = multiple('pipe')

function series(tasks, done) {
    function next(k) {
        if (k >= tasks.length) return done()
        var proc = runTask(tasks[k])
        proc.on('error', function(e) {
            return done(e)
        })
        proc.on('close', function(code, signal) {
            if (code !== 0) done(code)
            else next(k + 1)
        })
        proc.stderr.pipe(process.stderr);
        proc.stdout.pipe(process.stdout);
    }
    next(0)
}

exports['series'] = series;

exports.run = function(kind) {
    exports[kind](process.argv.slice(2), function(code) {
        if (typeof code === 'number') process.exit(code)
        else if (code == null) process.exit(0)
        else {
            console.error("Error:", code);
            process.exit(1);
        }
    });
}