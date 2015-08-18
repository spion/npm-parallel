# npm-parallel

Run npm tasks in parallel, even on Windows!

Solves the biggest problem of [task automation with npm run][1]

# getting started

Install npm-parallel in your project as a dev dependency

    npm install --save-dev npm-parallel

Now you can use `parallel` in your project's scripts!

Example:

```json
{
    "scripts": {
        "test": "parallel echo-first echo-second",
        "echo-first": "echo First",
        "echo-second": "echo Second",
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


# todo

Actually test this on Windows.

# license

MIT

[1]: http://substack.net/task_automation_with_npm_run