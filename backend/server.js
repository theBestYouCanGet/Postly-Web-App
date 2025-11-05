require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

app.use(cors());
app.use(express.json());

// Middleware pour vérifier le token JWT
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// Route de test
app.get('/', (req, res) => {
  res.send('Backend Postly est en marche !');
});

// ==================== AUTHENTIFICATION ====================

// Route pour l'authentification utilisateur (connexion)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Route pour l'inscription utilisateur
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== POSTS (PUBLICATIONS) ====================

// Récupérer tous les posts de l'utilisateur connecté
app.get('/api/posts', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer un post spécifique
app.get('/api/posts/:id', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: 'Post non trouvé' });
  }
});

// Créer un nouveau post
app.post('/api/posts', verifyToken, async (req, res) => {
  const { title, content, platform, status, scheduled_date } = req.body;

  if (!title || !platform) {
    return res.status(400).json({ error: 'Titre et plateforme sont requis' });
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: req.user.id,
          title,
          content,
          platform,
          status: status || 'draft',
          scheduled_date: scheduled_date || null,
        },
      ])
      .select();

    if (error) throw error;

    // Mettre à jour les statistiques
    await updateUserAnalytics(req.user.id);

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un post
app.put('/api/posts/:id', verifyToken, async (req, res) => {
  const { title, content, platform, status, scheduled_date } = req.body;

  try {
    const { data, error } = await supabase
      .from('posts')
      .update({
        title,
        content,
        platform,
        status,
        scheduled_date,
        updated_at: new Date(),
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select();

    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un post
app.delete('/api/posts/:id', verifyToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    // Mettre à jour les statistiques
    await updateUserAnalytics(req.user.id);

    res.status(200).json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ANALYTICS (STATISTIQUES) ====================

// Récupérer les statistiques de l'utilisateur
app.get('/api/analytics', verifyToken, async (req, res) => {
  try {
    let { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Pas de statistiques trouvées, créer une nouvelle entrée
      const { data: newData, error: insertError } = await supabase
        .from('analytics')
        .insert([{ user_id: req.user.id }])
        .select();

      if (insertError) throw insertError;
      data = newData[0];
    } else if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour les statistiques de l'utilisateur
app.put('/api/analytics', verifyToken, async (req, res) => {
  const { total_posts, total_engagement, total_views, total_followers } = req.body;

  try {
    const { data, error } = await supabase
      .from('analytics')
      .update({
        total_posts,
        total_engagement,
        total_views,
        total_followers,
        updated_at: new Date(),
      })
      .eq('user_id', req.user.id)
      .select();

    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PLATFORMS (COMPTES CONNECTÉS) ====================

// Récupérer les comptes connectés de l'utilisateur
app.get('/api/platforms', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('platforms')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ajouter un compte connecté
app.post('/api/platforms', verifyToken, async (req, res) => {
  const { platform_name, platform_username, access_token } = req.body;

  if (!platform_name) {
    return res.status(400).json({ error: 'Nom de la plateforme requis' });
  }

  try {
    const { data, error } = await supabase
      .from('platforms')
      .insert([
        {
          user_id: req.user.id,
          platform_name,
          platform_username,
          access_token,
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un compte connecté
app.delete('/api/platforms/:id', verifyToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('platforms')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.status(200).json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== FONCTIONS UTILITAIRES ====================

// Fonction pour mettre à jour les statistiques automatiquement
async function updateUserAnalytics(userId) {
  try {
    // Récupérer le nombre total de posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id')
      .eq('user_id', userId);

    if (postsError) throw postsError;

    const totalPosts = posts ? posts.length : 0;

    // Mettre à jour les statistiques
    const { error: updateError } = await supabase
      .from('analytics')
      .update({
        total_posts: totalPosts,
        updated_at: new Date(),
      })
      .eq('user_id', userId);

    if (updateError && updateError.code !== 'PGRST116') {
      console.error('Erreur lors de la mise à jour des statistiques:', updateError);
    }
  } catch (error) {
    console.error('Erreur dans updateUserAnalytics:', error);
  }
}

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend Postly écoutant sur le port ${port}`);
});
