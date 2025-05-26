// Used for testing da project build
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory storage
let projects = [];
let projectIdCounter = 1;

// ---- PROJECTS ----
app.get('/projects', (req, res) => {
  res.json(projects);
});

app.post('/projects', (req, res) => {
  const newProject = { id: projectIdCounter++, ...req.body };
  projects.push(newProject);
  res.status(201).json(newProject);
});

app.delete('/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  projects = projects.filter(project => project.id !== id);
  res.sendStatus(204);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
