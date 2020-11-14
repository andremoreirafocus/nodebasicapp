const express = require("express");
const cors = require("cors");
// const { uuid, isUuid } = require("uuidv4")
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repositoryId"});
  }
  next();
}

function logRequests(request, response, next) {
  const { method, url } = request;

  const consoleMessage = `${method} - ${url}`;

  console.time(consoleMessage);
  next();
  console.timeEnd(consoleMessage);  
}

app.use(logRequests);

app.get("/repositories", (request, response) => {
  // TODO
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const likes = 0;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes,
  }
  
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository mot found!"})
  }
  
  const { likes } = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository mot found!"})
  }
    
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository mot found!"})
  }

  repositories[repositoryIndex].likes++;

  return response.status(201).json(repositories[repositoryIndex]);

});

module.exports = app;
