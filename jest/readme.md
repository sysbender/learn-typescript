linting, formating, typechecking 


```shell


npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save-dev  eslint

npx eslint .
touch .eslintrc  # new one is eslint.config.js
npx eslint .

# auto fix
npx eslint . --fix
```