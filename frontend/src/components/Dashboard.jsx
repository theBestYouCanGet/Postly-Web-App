import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
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
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const stats = [
    { title: 'Total Publications', value: '24', change: '+12%', icon: FileText, color: 'text-blue-600' },
    { title: 'Engagement', value: '3.2K', change: '+8%', icon: Heart, color: 'text-pink-600' },
    { title: 'Vues totales', value: '15.4K', change: '+23%', icon: Eye, color: 'text-purple-600' },
    { title: 'Abonnés', value: '1.2K', change: '+5%', icon: Users, color: 'text-green-600' },
  ];

  const recentPosts = [
    { id: 1, platform: 'Instagram', title: 'Nouveau produit lancé', date: '2025-04-10', status: 'Publié' },
    { id: 2, platform: 'TikTok', title: 'Tutoriel rapide', date: '2025-04-12', status: 'Programmé' },
    { id: 3, platform: 'YouTube', title: 'Vlog de la semaine', date: '2025-04-15', status: 'Brouillon' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">Postly</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Tableau de bord</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'calendar'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Calendrier</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'posts'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Publications</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'media'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Image className="w-5 h-5" />
            <span>Médias</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Statistiques</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Paramètres</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-200">
          <div className="mb-4 text-sm text-slate-600">
            <p className="font-medium">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
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
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-slate-900">{post.title}</h3>
                      <p className="text-sm text-slate-600">
                        {post.platform} • {post.date}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === 'Publié'
                          ? 'bg-green-100 text-green-700'
                          : post.status === 'Programmé'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Créer une nouvelle publication
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

