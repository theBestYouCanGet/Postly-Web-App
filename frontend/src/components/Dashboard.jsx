import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Image, 
  BarChart3, 
  Settings, 
  LogOut,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: 'Instagram',
    status: 'draft',
    scheduled_date: '',
  });

  // Récupérer le token JWT
  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  // Récupérer les posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques
  const fetchAnalytics = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  // Créer ou mettre à jour un post
  const handleSavePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getAuthToken();
      const method = editingPost ? 'PUT' : 'POST';
      const url = editingPost 
        ? `${API_BASE_URL}/posts/${editingPost.id}` 
        : `${API_BASE_URL}/posts`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPosts();
        await fetchAnalytics();
        setFormData({ title: '', content: '', platform: 'Instagram', status: 'draft', scheduled_date: '' });
        setEditingPost(null);
        setShowPostForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du post:', error);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un post
  const handleDeletePost = async (postId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return;

    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchPosts();
        await fetchAnalytics();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du post:', error);
    }
  };

  // Éditer un post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content || '',
      platform: post.platform,
      status: post.status,
      scheduled_date: post.scheduled_date ? post.scheduled_date.split('T')[0] : '',
    });
    setShowPostForm(true);
  };

  // Charger les données au montage et quand l'onglet change
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'posts' || activeTab === 'analytics') {
      fetchPosts();
      fetchAnalytics();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const stats = analytics ? [
    { title: 'Total Publications', value: analytics.total_posts || 0, change: '+12%', icon: FileText, color: 'text-blue-600' },
    { title: 'Engagement', value: analytics.total_engagement || 0, change: '+8%', icon: Heart, color: 'text-pink-600' },
    { title: 'Vues totales', value: analytics.total_views || 0, change: '+23%', icon: Eye, color: 'text-purple-600' },
    { title: 'Abonnés', value: analytics.total_followers || 0, change: '+5%', icon: Users, color: 'text-green-600' },
  ] : [];

  // Rendu conditionnel du contenu principal
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
              <p className="text-slate-600">Bienvenue sur votre espace de gestion de contenu</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change} ce mois
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Publications récentes</CardTitle>
                <CardDescription>Vos dernières publications et brouillons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-slate-900">{post.title}</h3>
                        <p className="text-sm text-slate-600">
                          {post.platform} • {new Date(post.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : post.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {post.status === 'published' ? 'Publié' : post.status === 'scheduled' ? 'Programmé' : 'Brouillon'}
                      </span>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => setShowPostForm(true)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une nouvelle publication
                </Button>
              </CardContent>
            </Card>
          </>
        );

      case 'calendar':
        return (
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Calendrier</h1>
            <p className="text-slate-600 mb-8">Planifiez vos publications sur un calendrier interactif</p>
            <Card>
              <CardHeader>
                <CardTitle>Calendrier de publications</CardTitle>
                <CardDescription>Fonctionnalité en développement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Le calendrier interactif sera bientôt disponible pour planifier vos publications.</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'posts':
        return (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Publications</h1>
                <p className="text-slate-600">Gérez toutes vos publications</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingPost(null);
                  setFormData({ title: '', content: '', platform: 'Instagram', status: 'draft', scheduled_date: '' });
                  setShowPostForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau post
              </Button>
            </div>

            {showPostForm && (
              <Card className="mb-8 border-blue-300 bg-blue-50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{editingPost ? 'Modifier le post' : 'Créer un nouveau post'}</CardTitle>
                    <button onClick={() => setShowPostForm(false)}>
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePost} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">Titre</label>
                      <Input
                        type="text"
                        placeholder="Titre du post"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">Contenu</label>
                      <textarea
                        placeholder="Contenu du post"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        rows="4"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">Plateforme</label>
                        <select
                          value={formData.platform}
                          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option>Instagram</option>
                          <option>TikTok</option>
                          <option>YouTube</option>
                          <option>Twitter</option>
                          <option>LinkedIn</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">Statut</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="draft">Brouillon</option>
                          <option value="scheduled">Programmé</option>
                          <option value="published">Publié</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">Date de programmation (optionnel)</label>
                      <Input
                        type="datetime-local"
                        value={formData.scheduled_date}
                        onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                        {loading ? 'Enregistrement...' : editingPost ? 'Mettre à jour' : 'Créer'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowPostForm(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Vos publications</CardTitle>
                <CardDescription>Tous vos posts, brouillons et programmés ({posts.length})</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-600">Chargement...</p>
                ) : posts.length === 0 ? (
                  <p className="text-slate-600">Aucun post pour le moment. Créez votre premier post !</p>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900">{post.title}</h3>
                          <p className="text-sm text-slate-600">
                            {post.platform} • {new Date(post.created_at).toLocaleDateString('fr-FR')}
                          </p>
                          {post.content && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{post.content}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              post.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : post.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {post.status === 'published' ? 'Publié' : post.status === 'scheduled' ? 'programmé' : 'Brouillon'}
