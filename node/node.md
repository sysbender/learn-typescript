module

##

- commonJS
- ES modules

in package.json:
type : commonJS or Module

##

modules - http, req/res, routing, serviing json/html
core - fs, path, url, events, process, os

##

global vs window
process vs document


## curl

```shell
curl -X POST http://localhost:8888/api/v1/user \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "johndoe@example.com"}'


```