import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Instagram, Youtube, Calendar, BarChart3, Sparkles, Users } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Postly</span>
          </div>
          <Button onClick={onGetStarted} variant="outline">
            Se connecter
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Gérez vos réseaux sociaux en un seul endroit
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Planifiez, créez et analysez vos publications sur Instagram, TikTok, YouTube et plus encore. 
            Postly est l'outil tout-en-un pour les créateurs de contenu.
          </p>
          <Button onClick={onGetStarted} size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
            Commencer maintenant
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Tout ce dont vous avez besoin
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <Calendar className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Planification multi-plateformes</CardTitle>
              <CardDescription>
                Programmez vos publications sur Instagram, TikTok, YouTube et plus encore depuis un seul tableau de bord.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <Sparkles className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Rédaction assistée par IA</CardTitle>
              <CardDescription>
                Générez des légendes captivantes, des hashtags pertinents et des descriptions optimisées avec l'IA.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <Instagram className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Création de visuels</CardTitle>
              <CardDescription>
                Créez des visuels professionnels avec nos templates prêts à l'emploi et notre éditeur intuitif.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Suivi de statistiques</CardTitle>
              <CardDescription>
                Analysez l'engagement, les vues, les abonnés et optimisez votre stratégie de contenu.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Gestion multi-comptes</CardTitle>
              <CardDescription>
                Gérez plusieurs comptes et plateformes simultanément pour une efficacité maximale.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <Youtube className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Compatible toutes plateformes</CardTitle>
              <CardDescription>
                Support complet pour Instagram, TikTok, YouTube, Facebook, Twitter et LinkedIn.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Prêt à simplifier votre création de contenu ?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez des milliers de créateurs qui utilisent Postly pour gérer leurs réseaux sociaux.
          </p>
          <Button onClick={onGetStarted} size="lg" variant="secondary" className="text-lg px-8 py-6">
            Commencer gratuitement
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-slate-200">
        <div className="text-center text-slate-600">
          <p>&copy; 2025 Postly. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

