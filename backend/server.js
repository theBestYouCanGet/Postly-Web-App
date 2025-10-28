require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_JWT_SECRET; // Using JWT secret as service role key for backend

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Postly est en marche !');
});

// Exemple de route pour récupérer des données (nécessite une table 'posts' dans Supabase)
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// Route pour l'authentification utilisateur (exemple de connexion)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: error.message });
  res.status(200).json(data);
});

// Route pour l'inscription utilisateur
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.listen(port, () => {
  console.log(`Serveur backend Postly écoutant sur le port ${port}`);
});

