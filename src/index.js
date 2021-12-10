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

  const verifyUserName = customers.some(user => user.userName === userName)

  if(!verifyUserName){
    return response.status(400).json({error: "UserName not found"})
  }
  

  return next();


}
//Make Users
app.post('/user', (request, response)=>{
  const { name, userName }  = request.body

  const userExists = customers.find(user => user.userName === userName)

  if(userExists){
    const error = "UserName already exists"
    return response.status(400).json({error: `${error}`})
  }
  const customer = ({
    name, 
    userName, 
    id: uuidv4(),
    todos: [],
  })
  
  customers.push(customer)
  return response.status(201).send(customers)
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
