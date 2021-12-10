/**const express = require('express');
const cors = require('cors');

// const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

// const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

app.post('/users', (request, response) => {
  // Complete aqui
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;*/

// My Code
const fs = require('fs')
const express = require('express')
const app = express()
const { v4:uuidv4 } = require('uuid')

app.use(express.json())

const dir = './tmp'
if(!fs.existsSync(dir)){
  fs.mkdirSync(dir)
}

const customers = []

function verifyUsernameExists(request, response, next){
  const { userName } = request.headers;

  const verifyUserName = customers.find(user => user.userName === userName)
  if(!verifyUserName){
    return response.status(400).json({error: "UserName not found"})
  }
  if(verifyUserName){
    request.user = user
    return next()
    
  }


}
//Make Users
app.post('/account', (request, response)=>{
  const { name, userName } = request.body
  const userExists = customers.find(user => user.userName === userName)

  if(userExists){
    const error = "UserName already exists"
    return response.status(400).json({error: `${error}`})
  }

  if(verifyUser){
    const error = "Customer already exists"
    return response.status(401).send(`${error}`)
  }

  const customer = ({
    name, 
    userName, 
    id: uuidv4(),
    todos: [],
  })
  
  customers.push(customer)
  return response.status(201).json(customer)
})

//Take Users by your UserName
app.get('/todos', verifyUsernameExists, (request, response)=>{
  const { userName } = request;
  return response.status(201).json(userName.todos)
  
})

//Make TODOS 
app.post('/todos', verifyUsernameExists,(request, response)=>{

  const { userName } = request;
  const { title, deadline } = request.body;

  const todo = {
    title,
    id: uuidv4(),
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }


  userName.todos.push(todo) 
  return response.status(201).json(todo)

})

//Att for UNIC task
app.put('/todos/:id', verifyUsernameExists, (request, response)=>{
 
  const { title, deadline } = request.body;
  const { userName } = request;
  const { id } = request.params

  const todo = userName.todos.find(todoId => todoId.id === id)

  if(!todo){
    return response.status(404).json({error: "Todo not found"})
  }

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json(todo)
})

//Método PATCH Att ALL Tasks
//Incompleto --- Método PATCH
app.patch('/todos/:id/done', verifyUsernameExists,(request, response)=>{

  const { userName } = request;
  const { id } = request.params;
  const todo = userName.todos.find(todoId => todoId.id === id)

  if(!todo){
    return response.status(404).json({error: "Todo not founded"})
  }

  todo.done = true
  return response.json(todo)
})

app.delete('/todos/:id', verifyUsernameExists,(request, response)=>{
  
  const { userName } = request;
  const { id } = request.params;

  const todoIndex = userName.todos.findIndex(todoId => todoId.id === id)
  if(todoIndex === -1){
    return response.status(404).json({error: "Todo not found for delete"})
  }

  userName.todos.splice(todoIndex, 1);
  
  return response.status(204).json();
})

app.listen(1800)
