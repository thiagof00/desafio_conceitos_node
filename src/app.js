const express = require("express");
const cors = require("cors");

 const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function IncrementLike(request, response, next){

  const {id} = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)


  if(repositoryIndex < 0 ){
    return response.status(400).json({message:"Error: id not found"})
  }

  let repositoryLike = repositories[repositoryIndex]
  
  let like = repositoryLike.like + 1 

  repositoryLike.like = like



  response.json(repositoryLike)
  
}


app.get("/repositories", (request, response) => {

  let {title} = request.query

  let filter = title
     ? repositories.filter(repo => repo.title.includes(title))
    : repositories
  
  return response.json(filter)
  
});

app.post("/repositories", (request, response) => {
  
  const {title, url, techs} = request.body

  const repositoryValues = {id:uuid(),title, url, techs, like: 0}

  repositories.push(repositoryValues)

  return response.json(repositoryValues)
});


app.put("/repositories/:id", (request, response) => {

  const {id} = request.params
  const {title, url, techs} = request.body
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0){
    return response.status(400).json({message: "Error: not found"})

  }

 const repository = repositories[repositoryIndex]


   const NewValuesOfRepository = {
     id,
     title,
     url,
     techs,
     like: repository.like
   }

   repositories[repositoryIndex] = NewValuesOfRepository

   return response.json(NewValuesOfRepository)

});

app.delete("/repositories/:id", (request, response) => {
  
  const {id} = request.params


  const repositoryIndex = repositories.findIndex(repository => repository.id === id)


  if(repositoryIndex < 0){
    return response.status(400).json({message: "Repository not found"})
  }



  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", IncrementLike, (request, response) => {
  
});

module.exports = app;
