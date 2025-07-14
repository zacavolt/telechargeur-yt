const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/telecharger', (req, res) => {
  const { url, format, filename } = req.body;
  const safeName = filename.replace(/[^a-z0-9_\-]/gi, '_');
  const output = path.join(__dirname, 'videos', `${safeName}.%(ext)s`);

  const command = `yt-dlp -f ${format} -o "${output}" ${url}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur : ${stderr}`);
      return res.status(500).send('Erreur de téléchargement');
    }
    console.log(`Succès : ${stdout}`);
    res.send(`Téléchargement terminé : <a href="/videos/${safeName}.mp4" download>Télécharger la vidéo</a>`);
  });
});

app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});