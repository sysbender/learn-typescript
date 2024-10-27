## setup

install pnpm
total script vscode extension - error translation

install typescript `npm install --global typescript`

```shell
tsc --init
tsc --watch
```

tsconfig.json

```
"outdir": ""
```

### vite app

```
"noemit" : true
```

npm-run-all - run muiltiple script
for example :

- vite - to build and run
- tsc - to check the error

* get args `const [, , ...args] = process.argv;`
