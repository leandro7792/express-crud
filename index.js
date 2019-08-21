const express = require("express");

const server = express();

server.use(express.json());

let contador = 0;

server.use((req, res, next) => {
  contador++;
  console.log(contador);

  return next();
});

const projetos = [
  {
    id: "1",
    title: "Novo Projeto",
    tasks: []
  }
];

const getIndexProjetoByID = id =>
  projetos.findIndex(projeto => {
    return projeto.id === id;
  });

function checkValidID(req, res, next) {
  const { id } = req.params;
  if (getIndexProjetoByID(id) >= 0) return next();

  return res.status(400).json({ erro: "O ID informando não é válido" });
}

server.get("/projects", (req, res) => {
  return res.json(projetos);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projetos.push({ id, title, tasks: [] });
  return res.json(projetos);
});

server.put("/projects/:id", checkValidID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = getIndexProjetoByID(id);
  projetos[index].title = title;
  return res.json(projetos[index]);
});

server.delete("/projects/:id", checkValidID, (req, res) => {
  const { id } = req.params;
  const index = getIndexProjetoByID(id);
  projetos.splice(index, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkValidID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = getIndexProjetoByID(id);

  projetos[index].tasks.push(title);
  return res.json(projetos[index]);
});

server.listen(3000);
