# npm-runtools

Run npm tasks in series, parallel or pipeline - even on Windows!

Solves most of the remaining problems of [task automation with npm run][1]

# getting started

Install npm-runtools in your project as a dev dependency

    npm install --save-dev npm-runtools

Now you can use `parallel`, `series` and `pipe` in your project's
scripts!

Example:

```json
{
    "scripts": {
        "test": "npm run test-series",
        "test-series": "series test-parallel test-pipeline",
        "test-parallel": "parallel echo-first echo-second",
        "echo-first": "echo First",
        "echo-second": "echo Second",
        "test-pipeline": "pipe filelist linecount",
        "filelist": "ls -l",
        "linecount": "wc -l"
      }
}
```

Want to run both watchify and typescript --watch ?

```json
{
    "watch": "parallel watchify tsc-watch",
    "watchify": "watchify lib/main.js -o bundle.js -d",
    "tsc-watch": "tsc --watch"
}
```

Here is the example from [substack's article][1]. Note that `cat` wont work on windows

```json
{
    "browserify-js": "browserify browser/main.js",
    "uglify-js": "uglifyjs -mc -o static/bundle.js",
    "build-js": "pipe browserify-js uglify-js",
    "build-css": "cat static/pages/*.css tabs/*/*.css",
    "build": "series build-js build-css",
    "watch-js": "watchify browser/main.js -o static/bundle.js -dv",
    "watch-css": "catw static/pages/*.css tabs/*/*.css -o static/bundle.css -v",
    "watch": "parallel watch-js watch-css",
    "start": "node server.js",
    "test": "tap test/*.js"
}
```

# todo

Actually test this on Windows. Its definitely doable, but it probably
has bugs as I don't have Windows on any on my machines.

# licence

MIT

[1]: http://substack.net/task_automation_with_npm_run