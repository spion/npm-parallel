# npm-runtools

Run npm tasks in series, parallel or pipeline - even on Windows!

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

# todo

Actually test this on Windows. Its definitely doable, but it probably
has bugs as I don't have Windows on any on my machines.

# licence

MIT