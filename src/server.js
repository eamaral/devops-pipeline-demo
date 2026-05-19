const { createApp } = require('./app');

const port = process.env.PORT || 3000;
const app = createApp();

app.listen(port, () => {
  console.log(`devops-pipeline-demo rodando em http://localhost:${port}`);
});
