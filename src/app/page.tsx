'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Globe,
  List,
  Map,
  Eye,
  Crown,
  Heart,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Plus,
  Edit,
  Trash2,
  Check,
  XCircle,
  ShoppingBag,
  Shield,
  Zap,
  Users,
  Building2,
  FileText,
  Pause,
  Play,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  Share2,
  Clock,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Types
type PageView = 'home' | 'moteis' | 'premium' | 'sobre' | 'entrar' | 'dashboard' | 'admin' | 'motel-detail';
type UserRole = 'user' | 'owner' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
}

interface Motel {
  id: string;
  name: string;
  location: string;
  state: string;
  city: string;
  distance: string;
  price: string;
  priceFrom: number;
  priceTo: number;
  image: string;
  images: string[];
  isPremium: boolean;
  phone: string;
  whatsapp: string;
  website: string;
  themes: string[];
  features: string[];
  description: string;
  status: 'active' | 'paused' | 'pending';
  coordinates: { lat: number; lng: number };
  hours: string;
}

// Sample Data
const sampleMotels: Motel[] = [
  {
    id: '1',
    name: 'Motel Secret Palace',
    location: 'São Paulo, SP - Zona Sul',
    state: 'São Paulo',
    city: 'São Paulo',
    distance: '3.2 km',
    price: 'A partir de R$ 180',
    priceFrom: 180,
    priceTo: 350,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
    ],
    isPremium: true,
    phone: '(11) 99999-9999',
    whatsapp: '(11) 99999-9999',
    website: 'www.motelsecretpalace.com.br',
    themes: ['BDSM', 'Fantasia', 'Luxo'],
    features: ['Estacionamento', 'Ar condicionado', 'Champanhe', 'Espelho no teto', 'Cadeira erótica'],
    description: 'Suítes temáticas exclusivas com equipamentos de alta qualidade. Ambiente sofisticado e discreto para realizar suas fantasias mais ousadas. Contamos com suítes BDSM completas com equipamentos profissionais, além de suítes temáticas para todos os gostos.',
    status: 'active',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    hours: '24 horas',
  },
  {
    id: '2',
    name: 'Caverna do Prazer',
    location: 'Rio de Janeiro, RJ - Copacabana',
    state: 'Rio de Janeiro',
    city: 'Rio de Janeiro',
    distance: '5.1 km',
    price: 'A partir de R$ 150',
    priceFrom: 150,
    priceTo: 280,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
    ],
    isPremium: false,
    phone: '(21) 99999-9999',
    whatsapp: '(21) 99999-9999',
    website: 'www.cavernadoprazer.com.br',
    themes: ['BDSM', 'Escuridão'],
    features: ['Estacionamento', 'Ar condicionado'],
    description: 'Ambiente escuro e misterioso para suas fantasias. Perfeito para aqueles que buscam uma experiência mais intensa e imersiva.',
    status: 'active',
    coordinates: { lat: -22.9068, lng: -43.1729 },
    hours: '18h às 06h',
  },
  {
    id: '3',
    name: 'Dungeon Motel',
    location: 'Belo Horizonte, MG - Centro',
    state: 'Minas Gerais',
    city: 'Belo Horizonte',
    distance: '2.8 km',
    price: 'A partir de R$ 200',
    priceFrom: 200,
    priceTo: 400,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
    ],
    isPremium: true,
    phone: '(31) 99999-9999',
    whatsapp: '(31) 99999-9999',
    website: 'www.dungeonmotel.com.br',
    themes: ['BDSM', 'Medieval', 'Fantasia'],
    features: ['Estacionamento', 'Ar condicionado', 'Champanhe', 'Espelho no teto', 'Cadeira erótica', 'Cruz de Santo André', 'Gaiola'],
    description: 'Experiência medieval completa com masmorra equipada. Entre em um mundo de fantasia e submissão em nossas suítes temáticas medievais.',
    status: 'active',
    coordinates: { lat: -19.9167, lng: -43.9345 },
    hours: '24 horas',
  },
  {
    id: '4',
    name: 'Dominium Dark',
    location: 'Curitiba, PR - Batel',
    state: 'Paraná',
    city: 'Curitiba',
    distance: '4.5 km',
    price: 'A partir de R$ 220',
    priceFrom: 220,
    priceTo: 420,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
    ],
    isPremium: true,
    phone: '(41) 99999-9999',
    whatsapp: '(41) 99999-9999',
    website: 'www.dominiumdark.com.br',
    themes: ['BDSM', 'Dominação', 'Submissão'],
    features: ['Estacionamento', 'Ar condicionado', 'Champanhe', 'Equipamentos BDSM'],
    description: 'Ambiente completo para dominação e submissão. Equipamentos profissionais e ambiente seguro para práticas BDSM.',
    status: 'pending',
    coordinates: { lat: -25.4284, lng: -49.2733 },
    hours: '24 horas',
  },
];

const stats = [
  { number: '150+', label: 'Motéis Cadastrados' },
  { number: '50k+', label: 'Usuários Ativos' },
  { number: '25+', label: 'Cidades Atendidas' },
];

const estados = [
  'Todos os Estados',
  'São Paulo',
  'Rio de Janeiro',
  'Minas Gerais',
  'Paraná',
  'Santa Catarina',
  'Rio Grande do Sul',
  'Bahia',
  'Pernambuco',
  'Ceará',
];

const services = [
  {
    icon: ShoppingBag,
    title: 'Loja Online',
    description: 'Produtos e acessórios para suas fantasias.',
    link: 'Visitar Loja',
    href: 'https://loja.bdsmbrazil.com.br',
  },
  {
    icon: Crown,
    title: 'Portal das Dominatrix',
    description: 'Conecte-se com profissionais especializadas.',
    link: 'Ver Dominas',
    href: '/dominatrix',
  },
  {
    icon: Building2,
    title: 'Motéis Parceiros',
    description: 'Rede de motéis com suítes temáticas.',
    link: 'Ver Motéis',
    href: '/moteis',
  },
  {
    icon: Shield,
    title: 'Comunidade VIP',
    description: 'Acesso exclusivo a eventos e conteúdo.',
    link: 'Participar',
    href: '/comunidade',
  },
];

const premiumFeatures = {
  free: [
    { text: '1 motel cadastrado', included: true },
    { text: 'Até 3 fotos', included: true },
    { text: 'Informações básicas', included: true },
    { text: 'Listagem padrão', included: true },
    { text: 'Sem destaque', included: false },
    { text: 'Sem badge Premium', included: false },
    { text: 'Suporte por email', included: false },
    { text: 'Estatísticas básicas', included: false },
  ],
  premium: [
    { text: '1 motel cadastrado', included: true },
    { text: 'Até 15 fotos', included: true },
    { text: 'Informações completas', included: true },
    { text: 'Destaque na busca', included: true },
    { text: 'Badge Premium', included: true },
    { text: 'Prioridade no mapa', included: true },
    { text: 'Suporte prioritário', included: true },
    { text: 'Estatísticas detalhadas', included: true },
  ],
};

// Navbar Component
function Navbar({ 
  currentPage, 
  setCurrentPage, 
  user, 
  isAuthenticated 
}: { 
  currentPage: PageView; 
  setCurrentPage: (page: PageView) => void;
  user: User | null;
  isAuthenticated: boolean;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: { page: PageView; label: string; icon?: React.ElementType; isGold?: boolean }[] = [
    { page: 'home', label: 'Início' },
    { page: 'moteis', label: 'Motéis' },
    { page: 'premium', label: 'Premium', icon: Crown, isGold: true },
    { page: 'sobre', label: 'Sobre' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-sm border-b border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">BDSM</span>
              <span className="text-2xl font-bold text-[#FF0033] tracking-tight">BRAZIL</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              const Icon = link.icon;
              
              return (
                <button
                  key={link.page}
                  onClick={() => setCurrentPage(link.page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#FF0033] text-white'
                      : link.isGold
                      ? 'text-[#FFD700] hover:bg-[#1E1E1E] hover:text-[#FFD700]'
                      : 'text-gray-300 hover:bg-[#1E1E1E] hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-[#FF0033]">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-[#1E1E1E] text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1E1E1E] border-[#333333] text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <Badge className="w-fit mt-1 bg-[#FF0033] text-white text-xs">
                        {user.role === 'admin' ? 'Administrador' : user.role === 'owner' ? 'Proprietário' : 'Usuário'}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#333333]" />
                  <DropdownMenuItem 
                    onClick={() => setCurrentPage('dashboard')}
                    className="focus:bg-[#2A2A2A] cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem 
                      onClick={() => setCurrentPage('admin')}
                      className="focus:bg-[#2A2A2A] cursor-pointer"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[#333333]" />
                  <DropdownMenuItem className="focus:bg-[#2A2A2A] cursor-pointer text-[#FF0033]">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setCurrentPage('entrar')}
                className="bg-transparent border border-white/30 text-white hover:bg-white/10"
              >
                <User className="w-4 h-4 mr-2" />
                Minha Conta
              </Button>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-[#1E1E1E] rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-t border-[#333333]">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              const Icon = link.icon;
              
              return (
                <button
                  key={link.page}
                  onClick={() => {
                    setCurrentPage(link.page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#FF0033] text-white'
                      : link.isGold
                      ? 'text-[#FFD700]'
                      : 'text-gray-300'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.label}
                </button>
              );
            })}
            <div className="pt-4 border-t border-[#333333]">
              {isAuthenticated ? (
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#1E1E1E]"
                >
                  Dashboard
                </button>
              ) : (
                <Button
                  onClick={() => {
                    setCurrentPage('entrar');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-transparent border border-white/30 text-white hover:bg-white/10"
                >
                  <User className="w-4 h-4 mr-2" />
                  Minha Conta
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Footer Component
function Footer({ setCurrentPage }: { setCurrentPage: (page: PageView) => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121212] border-t border-[#333333] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <button 
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 mb-4 cursor-pointer"
            >
              <span className="text-xl font-bold text-white">BDSM</span>
              <span className="text-xl font-bold text-[#FF0033]">BRAZIL</span>
            </button>
            <p className="text-gray-400 text-sm mb-4">
              O maior portal de motéis com suítes temáticas BDSM do Brasil. 
              Encontre o prazer mais próximo de você.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-gray-400 hover:text-[#FF0033] hover:bg-[#2A2A2A] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-gray-400 hover:text-[#FF0033] hover:bg-[#2A2A2A] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-gray-400 hover:text-[#FF0033] hover:bg-[#2A2A2A] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navegação</h3>
            <ul className="space-y-3">
              {[{ page: 'home' as PageView, label: 'Início' }, { page: 'moteis', label: 'Motéis' }, { page: 'premium', label: 'Premium' }, { page: 'sobre', label: 'Sobre' }].map((link) => (
                <li key={link.page}>
                  <button 
                    onClick={() => setCurrentPage(link.page)}
                    className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {['Termos de Uso', 'Política de Privacidade', 'Cookies'].map((label) => (
                <li key={label}>
                  <button className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#FF0033]" />
                <a href="mailto:contato@bdsmbrazil.com.br" className="hover:text-white transition-colors">
                  contato@bdsmbrazil.com.br
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-[#FF0033]" />
                <a href="tel:+5511999999999" className="hover:text-white transition-colors">
                  +55 (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-[#FF0033]" />
                <span>São Paulo, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#333333] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} BDSM Brazil. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-[#FF0033] fill-[#FF0033]" /> no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}

// Motel Detail Page Component
function MotelDetailPage({ 
  motel, 
  setCurrentPage 
}: { 
  motel: Motel; 
  setCurrentPage: (page: PageView) => void;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const displayImages = motel.isPremium ? motel.images : motel.images.slice(0, 3);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('moteis')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Motéis
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
              <img
                src={displayImages[selectedImage]}
                alt={motel.name}
                className="w-full h-full object-cover"
              />
              {motel.isPremium && (
                <Badge className="absolute top-4 left-4 bg-[#FFD700] text-black">
                  <Crown className="w-4 h-4 mr-1" />
                  Premium
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-[#FF0033]' 
                      : 'border-[#333333] hover:border-gray-500'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Photo limit notice for free users */}
            {!motel.isPremium && motel.images.length > 3 && (
              <p className="text-gray-500 text-sm mt-2">
                * Este motel possui mais fotos disponíveis no plano Premium
              </p>
            )}

            {/* Description */}
            <Card className="bg-[#1E1E1E] border-[#333333] mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Descrição</h2>
                <p className="text-gray-300 leading-relaxed">{motel.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-[#1E1E1E] border-[#333333] mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Comodidades</h2>
                <div className="flex flex-wrap gap-2">
                  {motel.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#2A2A2A] text-gray-300 px-3 py-1">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Info & Contact */}
          <div className="lg:col-span-1">
            <Card className="bg-[#1E1E1E] border-[#333333] sticky top-24">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-white mb-2">{motel.name}</h1>
                
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <MapPin className="w-4 h-4 text-[#FF0033]" />
                  <span>{motel.location}</span>
                </div>

                {/* Themes */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {motel.themes.map((theme) => (
                    <Badge key={theme} className="bg-[#FF0033]/20 text-[#FF0033]">
                      {theme}
                    </Badge>
                  ))}
                </div>

                {/* Price */}
                <div className="bg-[#121212] rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Valor da diária</span>
                  </div>
                  <p className="text-2xl font-bold text-[#FF0033]">{motel.price}</p>
                  <p className="text-gray-500 text-sm">R$ {motel.priceFrom} - R$ {motel.priceTo}</p>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-3 text-gray-300 mb-6">
                  <Clock className="w-5 h-5 text-[#FF0033]" />
                  <div>
                    <p className="text-sm text-gray-400">Horário de funcionamento</p>
                    <p className="font-medium">{motel.hours}</p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-[#FF0033] hover:bg-[#CC0029] text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar: {motel.phone}
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button className="w-full bg-[#2A2A2A] hover:bg-[#333333] text-white border border-[#444444]">
                    <Navigation className="w-4 h-4 mr-2" />
                    Ver Rota
                  </Button>
                  {motel.website && (
                    <Button 
                      variant="outline" 
                      className="w-full border-[#333333] text-gray-300 hover:text-white hover:border-[#FF0033]"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Visitar Site
                    </Button>
                  )}
                </div>

                {/* Share */}
                <div className="mt-6 pt-6 border-t border-[#333333]">
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-400 hover:text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Home Page Component
function HomePage({ setCurrentPage, setSelectedMotel }: { setCurrentPage: (page: PageView) => void; setSelectedMotel: (motel: Motel) => void }) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('Todos os Estados');

  const filteredMotels = sampleMotels.filter(m => m.status === 'active');

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/70 via-[#121212]/80 to-[#121212]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            Descubra o{' '}
            <span className="text-[#FF0033]">Prazer</span>{' '}
            Mais Próximo
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            O maior portal de motéis com suítes temáticas BDSM do Brasil. 
            Encontre o lugar perfeito para suas fantasias.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-[#1E1E1E] border-[#333333] shadow-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Buscar motel, cidade ou tema..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#121212] border-[#333333] text-white placeholder:text-gray-500 focus:border-[#FF0033]"
                  />
                </div>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-full md:w-48 bg-[#121212] border-[#333333] text-white">
                    <MapPin className="w-4 h-4 mr-2 text-[#FF0033]" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E1E1E] border-[#333333] text-white">
                    {estados.map((estado) => (
                      <SelectItem 
                        key={estado} 
                        value={estado}
                        className="focus:bg-[#2A2A2A]"
                      >
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="bg-[#FF0033] hover:bg-[#CC0029] text-white px-8">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-[#FF0033] mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* View Toggle & Results */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Todos os Motéis</h2>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' 
                  ? 'bg-[#FF0033] hover:bg-[#CC0029] text-white' 
                  : 'bg-transparent border-[#333333] text-gray-400 hover:text-white hover:border-[#FF0033]'
                }
              >
                <List className="w-4 h-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' 
                  ? 'bg-[#FF0033] hover:bg-[#CC0029] text-white' 
                  : 'bg-transparent border-[#333333] text-gray-400 hover:text-white hover:border-[#FF0033]'
                }
              >
                <Map className="w-4 h-4 mr-2" />
                Mapa
              </Button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMotels.map((motel) => (
                <Card 
                  key={motel.id} 
                  className="bg-[#1E1E1E] border-[#333333] overflow-hidden card-hover group cursor-pointer"
                  onClick={() => {
                    setSelectedMotel(motel);
                    setCurrentPage('motel-detail');
                  }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={motel.image}
                      alt={motel.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {motel.isPremium && (
                      <Badge className="absolute top-3 left-3 bg-[#FFD700] text-black hover:bg-[#FFD700]">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    <Badge className="absolute top-3 right-3 bg-black/70 text-white">
                      {motel.isPremium ? `${motel.images.length} fotos` : `${Math.min(motel.images.length, 3)} fotos`}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#FF0033] transition-colors">
                      {motel.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#FF0033]" />
                      {motel.location}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {motel.themes.map((theme) => (
                        <Badge key={theme} variant="secondary" className="bg-[#2A2A2A] text-gray-300 text-xs">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#FF0033] font-bold">{motel.price}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-[#333333] text-gray-400 hover:text-white hover:border-[#FF0033]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-[#333333] text-green-500 hover:text-green-400 hover:border-green-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-[#333333] text-gray-400 hover:text-white hover:border-[#FF0033]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Navigation className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-[#333333] text-gray-400 hover:text-white hover:border-[#FF0033]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-[#1E1E1E] rounded-xl border border-[#333333] overflow-hidden">
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-[#FF0033] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Mapa Interativo</h3>
                  <p className="text-gray-400 max-w-md">
                    Visualize todos os motéis cadastrados em tempo real. 
                    Ative sua localização para ver os mais próximos.
                  </p>
                  <Button className="mt-4 bg-[#FF0033] hover:bg-[#CC0029] text-white">
                    Ativar Localização
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#121212] to-[#1E1E1E]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            É proprietário de um <span className="text-[#FF0033]">Motel</span>?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Cadastre seu estabelecimento e faça parte do maior portal de motéis temáticos do Brasil. 
            Atraia novos clientes e aumente sua visibilidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setCurrentPage('entrar')}
              size="lg" 
              className="bg-[#FF0033] hover:bg-[#CC0029] text-white"
            >
              Cadastrar Agora
            </Button>
            <Button 
              onClick={() => setCurrentPage('premium')}
              size="lg" 
              variant="outline" 
              className="border-[#333333] text-white hover:bg-[#1E1E1E]"
            >
              Conhecer Premium
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

// About Page Component
function AboutPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-[#FF0033]">Sobre</span> Nós
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            O portal de motéis BDSM faz parte do grupo BDSMBRAZIL, a maior comunidade de BDSM do Brasil. 
            Nossa missão é conectar pessoas a experiências únicas e seguras.
          </p>
          <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Fale Conosco no WhatsApp
          </Button>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Nossos Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="bg-[#1E1E1E] border-[#333333] card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#FF0033]/20 flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-6 h-6 text-[#FF0033]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{service.description}</p>
                      <a 
                        href={service.href}
                        className="text-[#FF0033] text-sm font-medium hover:underline inline-flex items-center"
                      >
                        {service.link}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-[#1E1E1E] border-[#333333] mb-16">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Informações da Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-400">
                <FileText className="w-5 h-5 text-[#FF0033]" />
                <span>CNPJ: 00.000.000/0001-00</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-[#FF0033]" />
                <span>São Paulo, SP - Brasil</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-[#FF0033]" />
                <a href="mailto:contato@bdsmbrazil.com.br" className="hover:text-white">
                  contato@bdsmbrazil.com.br
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MessageCircle className="w-5 h-5 text-[#FF0033]" />
                <a href="https://wa.me/5511999999999" className="hover:text-white">
                  +55 (11) 99999-9999
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Heart className="w-12 h-12 text-[#FF0033] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            <span className="text-[#FF0033]">Nossa</span> Missão
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Promover um ambiente seguro e acolhedor para a comunidade BDSM brasileira, 
            conectando pessoas a experiências autênticas e profissionais qualificados.
          </p>
        </div>
      </div>
    </div>
  );
}

// Premium Page Component
function PremiumPage({ setCurrentPage }: { setCurrentPage: (page: PageView) => void }) {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Planos e <span className="text-[#FFD700]">Preços</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Escolha o plano ideal para o seu estabelecimento. 
            Destaque-se da concorrência e atraia mais clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-white">Gratuito</CardTitle>
              <CardDescription className="text-gray-400">Para começar</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">R$ 0</span>
                <span className="text-gray-400">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {premiumFeatures.free.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-600" />
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => setCurrentPage('entrar')}
                className="w-full mt-6 bg-[#FF0033] hover:bg-[#CC0029] text-white"
              >
                Começar Grátis
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] border-[#FFD700] relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFD700] text-black">
              Mais Popular
            </Badge>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-[#FFD700] flex items-center justify-center gap-2">
                <Crown className="w-6 h-6" />
                Premium
              </CardTitle>
              <CardDescription className="text-gray-400">Para crescer</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#FFD700]">R$ 99</span>
                <span className="text-gray-400">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {premiumFeatures.premium.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-gray-300">{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => setCurrentPage('entrar')}
                className="w-full mt-6 bg-[#FFD700] hover:bg-[#E6C200] text-black"
              >
                Assinar Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Por que escolher <span className="text-[#FFD700]">Premium</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Maior Visibilidade', desc: 'Apareça no topo das buscas e no mapa com destaque.' },
              { icon: Users, title: 'Mais Clientes', desc: 'Atraia clientes qualificados com informações completas.' },
              { icon: Shield, title: 'Badge de Confiança', desc: 'O selo Premium transmite seriedade e qualidade.' },
            ].map((item, index) => (
              <Card key={index} className="bg-[#1E1E1E] border-[#333333] text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-[#FFD700]/20 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-[#FFD700]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Como Funciona</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {[
              { step: 1, title: 'Cadastre-se', desc: 'Crie sua conta gratuitamente' },
              { step: 2, title: 'Adicione seu Motel', desc: 'Preencha as informações' },
              { step: 3, title: 'Escolha seu Plano', desc: 'Gratuito ou Premium' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FF0033] flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Login Page Component
function LoginPage({ setCurrentPage, onLogin }: { setCurrentPage: (page: PageView) => void; onLogin: (role: UserRole) => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('owner');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-[#1E1E1E] border-[#333333]">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-white">BDSM</span>
            <span className="text-2xl font-bold text-[#FF0033]">BRAZIL</span>
          </div>
          <CardTitle className="text-2xl text-white">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isSignUp 
              ? 'Cadastre-se para gerenciar seu motel' 
              : 'Entre na sua conta para continuar'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#121212] border-[#333333] text-white"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#121212] border-[#333333] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#121212] border-[#333333] text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-[#FF0033] hover:bg-[#CC0029] text-white">
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#FF0033] hover:underline ml-1"
              >
                {isSignUp ? 'Entrar' : 'Criar conta'}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#333333]">
            <p className="text-gray-500 text-xs text-center mb-3">Demo (clique para testar):</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onLogin('owner')}
                className="flex-1 border-[#333333] text-gray-400 hover:text-white"
              >
                Proprietário
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onLogin('admin')}
                className="flex-1 border-[#333333] text-gray-400 hover:text-white"
              >
                Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Dashboard Page Component (for motel owners)
function DashboardPage({ setCurrentPage }: { setCurrentPage: (page: PageView) => void }) {
  const [motels] = useState(sampleMotels.slice(0, 2));
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const stats = [
    { label: 'Meus Motéis', value: motels.length, icon: Building2 },
    { label: 'Visualizações', value: '1.2k', icon: Eye },
    { label: 'Contatos', value: '45', icon: Phone },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Gerencie seus motéis</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#FF0033] hover:bg-[#CC0029] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Motel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-[#1E1E1E] border-[#333333]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-[#FF0033]/20 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-[#FF0033]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white">Meus Motéis</CardTitle>
          </CardHeader>
          <CardContent>
            {motels.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Você ainda não cadastrou nenhum motel.</p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#FF0033] hover:bg-[#CC0029] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Primeiro Motel
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {motels.map((motel) => (
                  <div 
                    key={motel.id}
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg bg-[#121212] border border-[#333333]"
                  >
                    <img 
                      src={motel.image} 
                      alt={motel.name}
                      className="w-full md:w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{motel.name}</h3>
                        {motel.isPremium && (
                          <Badge className="bg-[#FFD700] text-black">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        <Badge 
                          className={
                            motel.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : motel.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }
                        >
                          {motel.status === 'active' ? 'Ativo' : motel.status === 'pending' ? 'Pendente' : 'Pausado'}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {motel.location}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {motel.images.length} fotos • {motel.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-[#333333] text-gray-400 hover:text-white">
                        <Pause className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#333333] text-gray-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#333333] text-[#FF0033] hover:bg-[#FF0033]/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8 bg-gradient-to-r from-[#1E1E1E] to-[#2A2A2A] border-[#FFD700]/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#FFD700]" />
                  Upgrade para Premium
                </h3>
                <p className="text-gray-400">Destaque seu motel e atraia mais clientes com até 15 fotos.</p>
              </div>
              <Button 
                onClick={() => setCurrentPage('premium')}
                className="bg-[#FFD700] hover:bg-[#E6C200] text-black"
              >
                Ver Planos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-[#1E1E1E] border-[#333333] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Motel</DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha as informações do seu motel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Nome do Motel</Label>
              <Input placeholder="Ex: Dungeon Motel" className="bg-[#121212] border-[#333333] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Localização</Label>
              <Input placeholder="Ex: São Paulo, SP - Zona Sul" className="bg-[#121212] border-[#333333] text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Telefone</Label>
                <Input placeholder="(11) 99999-9999" className="bg-[#121212] border-[#333333] text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">WhatsApp</Label>
                <Input placeholder="(11) 99999-9999" className="bg-[#121212] border-[#333333] text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Website</Label>
              <Input placeholder="www.seumotel.com.br" className="bg-[#121212] border-[#333333] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Descrição</Label>
              <Textarea placeholder="Descreva seu motel..." className="bg-[#121212] border-[#333333] text-white min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Temas (separados por vírgula)</Label>
              <Input placeholder="Ex: BDSM, Fantasia, Luxo" className="bg-[#121212] border-[#333333] text-white" />
            </div>
            <div className="bg-[#121212] rounded-lg p-3 border border-[#333333]">
              <p className="text-sm text-gray-400">
                <span className="text-white font-medium">Plano Gratuito:</span> Até 3 fotos
              </p>
              <p className="text-sm text-gray-400">
                <span className="text-[#FFD700] font-medium">Plano Premium:</span> Até 15 fotos + destaque
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="border-[#333333] text-gray-400"
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => setIsAddDialogOpen(false)}
              className="bg-[#FF0033] hover:bg-[#CC0029] text-white"
            >
              Adicionar Motel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Admin Page Component
function AdminPage() {
  const [motels, setMotels] = useState(sampleMotels);
  const [users] = useState([
    { id: '1', name: 'João Silva', email: 'joao@email.com', role: 'owner' as UserRole, motels: 2, status: 'active' },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'owner' as UserRole, motels: 1, status: 'active' },
    { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', role: 'owner' as UserRole, motels: 1, status: 'pending' },
  ]);
  const [activeTab, setActiveTab] = useState('moteis');

  const stats = [
    { label: 'Total Motéis', value: motels.length, icon: Building2, color: 'text-[#FF0033]' },
    { label: 'Pendentes', value: motels.filter(m => m.status === 'pending').length, icon: AlertTriangle, color: 'text-yellow-500' },
    { label: 'Usuários', value: users.length, icon: Users, color: 'text-blue-500' },
    { label: 'Premium', value: motels.filter(m => m.isPremium).length, icon: Crown, color: 'text-[#FFD700]' },
  ];

  const handleApprove = (id: string) => {
    setMotels(motels.map(m => m.id === id ? { ...m, status: 'active' } : m));
  };

  const handleDelete = (id: string) => {
    setMotels(motels.filter(m => m.id !== id));
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#FF0033]" />
            Painel Administrativo
          </h1>
          <p className="text-gray-400">Gerencie motéis, usuários e configurações do sistema.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-[#1E1E1E] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#121212] flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#1E1E1E] border border-[#333333]">
            <TabsTrigger 
              value="moteis" 
              className="data-[state=active]:bg-[#FF0033] data-[state=active]:text-white text-gray-400"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Motéis
            </TabsTrigger>
            <TabsTrigger 
              value="usuarios"
              className="data-[state=active]:bg-[#FF0033] data-[state=active]:text-white text-gray-400"
            >
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger 
              value="pendentes"
              className="data-[state=active]:bg-[#FF0033] data-[state=active]:text-white text-gray-400"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Pendentes
              {motels.filter(m => m.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-yellow-500 text-black">
                  {motels.filter(m => m.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="moteis">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">Todos os Motéis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#333333]">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Motel</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Localização</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Fotos</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Plano</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {motels.map((motel) => (
                        <tr key={motel.id} className="border-b border-[#333333] hover:bg-[#121212]">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={motel.image} alt={motel.name} className="w-10 h-10 rounded object-cover" />
                              <div>
                                <p className="text-white font-medium">{motel.name}</p>
                                <p className="text-gray-500 text-sm">{motel.price}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{motel.location}</td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{motel.images.length}</td>
                          <td className="py-3 px-4">
                            <Badge className={
                              motel.status === 'active' 
                                ? 'bg-green-500/20 text-green-400' 
                                : motel.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }>
                              {motel.status === 'active' ? 'Ativo' : motel.status === 'pending' ? 'Pendente' : 'Pausado'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {motel.isPremium ? (
                              <Badge className="bg-[#FFD700]/20 text-[#FFD700]">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-500/20 text-gray-400">Gratuito</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-[#FF0033]">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">Usuários Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#333333]">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Usuário</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Tipo</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Motéis</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-[#333333] hover:bg-[#121212]">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-[#FF0033] text-white text-sm">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge className="bg-[#FF0033]/20 text-[#FF0033]">
                              {user.role === 'owner' ? 'Proprietário' : 'Usuário'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{user.motels}</td>
                          <td className="py-3 px-4">
                            <Badge className={
                              user.status === 'active' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }>
                              {user.status === 'active' ? 'Ativo' : 'Pendente'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-[#FF0033]">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pendentes">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">Aprovações Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                {motels.filter(m => m.status === 'pending').length === 0 ? (
                  <div className="text-center py-12">
                    <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhum motel aguardando aprovação.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {motels.filter(m => m.status === 'pending').map((motel) => (
                      <div 
                        key={motel.id}
                        className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg bg-[#121212] border border-yellow-500/30"
                      >
                        <img 
                          src={motel.image} 
                          alt={motel.name}
                          className="w-full md:w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white">{motel.name}</h3>
                            <Badge className="bg-yellow-500/20 text-yellow-400">Aguardando Aprovação</Badge>
                          </div>
                          <p className="text-gray-400 text-sm flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {motel.location}
                          </p>
                          <p className="text-gray-500 text-sm mt-2">{motel.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleApprove(motel.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDelete(motel.id)}
                            className="border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033]/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Main App Component
export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedMotel, setSelectedMotel] = useState<Motel | null>(null);

  const handleLogin = (role: UserRole) => {
    setIsAuthenticated(true);
    setUser({
      id: '1',
      name: role === 'admin' ? 'Admin' : 'Proprietário',
      email: role === 'admin' ? 'admin@bdsmbrazil.com.br' : 'proprietario@motel.com.br',
      role,
    });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} setSelectedMotel={setSelectedMotel} />;
      case 'moteis':
        return <HomePage setCurrentPage={setCurrentPage} setSelectedMotel={setSelectedMotel} />;
      case 'motel-detail':
        return selectedMotel ? <MotelDetailPage motel={selectedMotel} setCurrentPage={setCurrentPage} /> : <HomePage setCurrentPage={setCurrentPage} setSelectedMotel={setSelectedMotel} />;
      case 'premium':
        return <PremiumPage setCurrentPage={setCurrentPage} />;
      case 'sobre':
        return <AboutPage />;
      case 'entrar':
        return <LoginPage setCurrentPage={setCurrentPage} onLogin={handleLogin} />;
      case 'dashboard':
        return isAuthenticated ? <DashboardPage setCurrentPage={setCurrentPage} /> : <LoginPage setCurrentPage={setCurrentPage} onLogin={handleLogin} />;
      case 'admin':
        return isAuthenticated && user?.role === 'admin' ? <AdminPage /> : <LoginPage setCurrentPage={setCurrentPage} onLogin={handleLogin} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} setSelectedMotel={setSelectedMotel} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121212]">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
        isAuthenticated={isAuthenticated}
      />
      <main className="flex-1 pt-16">
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
