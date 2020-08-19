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
  
  let like = repositoryLike.likes + 1 

  repositoryLike.likes = like



  return response.json(repositoryLike)
  
}


app.get("/repositories", (request, response) => response.json(repositories) )

app.post("/repositories", (request, response) => {
  
  const {title, url, techs} = request.body

  const repositoryValues = {id:uuid(),title, url, techs, likes: 0}

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


   const NewValuesOfRepository = {
     id,
     title,
     url,
     techs,
     
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

app.post("/repositories/:id/like",IncrementLike, (request, response) => {

});

module.exports = app;
