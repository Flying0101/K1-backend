 

const http = require("http");
const fs = require('fs');

let todoData = require('./list.json');

const app = http.createServer((req, res) => {

   
  const routes = req.url.split("/")
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Credentials", "true");
 
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PATCH, DELETE, OPTIONS, POST, PUT"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );



  if (req.method === "GET" && routes[1] === "todos" && routes.length === 2) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify(todoData));


  } else if(req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end(); 


  }
  
  else if (req.method === "POST" && routes[1] === "todos") {
    req.on("data", (chunk) => {
      todoData.push(JSON.parse(chunk));
      fs.writeFile("./list.json", JSON.stringify(todoData), (err) => {
        if (err)
          console.log(err);
        else {
          console.log("file added successfully");
        }
      }); //func slut

    });
    res.statusCode = 200;
    res.end();


  } else if (req.method === "GET" && routes[1] === "todos" && routes.length === 3) {

    const requestedId = parseInt(routes[2]);
    const requestedTodo = todoData.find((todoData) => todoData.id === requestedId);

    if (requestedTodo) {
      res.statusCode = 200;
      res.end(JSON.stringify(requestedTodo))
    } else {
      res.statusCode = 404;
      res.end();
    }
  } else if (req.method === "DELETE" && routes[1] === "todos" && routes.length === 3) {
    
    const requestedId = parseInt(routes[2]);
    todoData = todoData.filter(todo => todo.id !== requestedId);
    console.log("test12345");

    fs.writeFile("./list.json", JSON.stringify(todoData), (err) => {
      if (err){
        console.log(err);
      }else {
        console.log("The server has been updated");
      }
    });

    res.statusCode = 200;
    console.log(routes[2]);
    res.end();

  } else if (req.method === "PATCH" && routes[1] === "todos" && routes.length === 3) {
    res.setHeader("Content-Type", "application/json");
    const requestedId = parseInt(routes[2]);
    const findId = todoData.findIndex(todo => todo.id === requestedId);
    req.on("data", (chunk) => {
      const data = JSON.parse(chunk);

      if (typeof data.complete === "boolean") {
        todoData[findId].complete = data.complete;
        console.log(todoData[findId].complete);
      }
      fs.writeFile("./list.json", JSON.stringify(todoData), (err) => {
        if (err){
          console.log(err);
        } else {
          console.log("file changed successfully");
        }
      });
    })
    res.statusCode = 200;
    res.end();

  } else if (req.method === "PUT" && routes[1] === "todos" && routes.length === 3) {
    const requestedId = parseInt(routes[2]);
    const findId = todoData.findIndex(todo => todo.id === requestedId);

    req.on("data", (chunk) => {
      todoData[findId] = JSON.parse(chunk);

      fs.writeFile("./list.json", JSON.stringify(todoData), (err) => {
        if (err){
          console.log(err);
        } else {
          console.log(" 'PUT' change successful. ");
        }
      });
    });

    res.statusCode = 200;
    console.log("put change successful");
    res.end();
  };
});

app.listen(4000, () => {
  console.log(`Servern lyssnar på port 4000`);
});





