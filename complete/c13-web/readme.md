
model class - data
view class - html, event

## user class
* attributes
* retrieve and update
* notify the app when some data changed
* presist data to an outside server and retrieve it


approach
1. make a mega user class
2. refactor to composite from three 
3. make it generic and reusable

```javascript
class User {
    private data: UserProps;

    // getter and setter for one property
    get(propName: string ) : (string|number)
    set(update: UserProps) : void

    // register event handler 
    on(eventName: string, callback :()=>{}  )
    // trigger an event to tell other parts that sth changed
    trigger(eventName: string) : void

    // fetch from server , save to the server
    fetch(): Promise
    save(): Promise
}

```


## json-server

```html
npm install -g json-server
npm install axios

json-server -w db.json

#http://localhost:3000/users

```

## rest convention

get /posts     - retrieve all
get /posts/:id - retrieve one 
post /posts    - create a new
put /posts/:id - update
delete /posts/:id - delete one 
