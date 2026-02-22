'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
  List,
  Map,
  Eye,
  Crown,
  Heart,
  Mail,
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
  Pause,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Clock,
  Upload,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
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

// Dynamically import Leaflet components (no SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

import 'leaflet/dist/leaflet.css';

// Types
type PageView = 'home' | 'moteis' | 'sobre' | 'entrar' | 'dashboard' | 'admin' | 'motel-detail';
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
  image: string;
  images: string[];
  isPremium: boolean;
  phone: string;
  whatsapp: string;
  tripadvisor: string;
  features: string[];
  description: string;
  status: 'active' | 'paused' | 'pending';
  coordinates: { lat: number; lng: number };
  hours: string;
  periods: string[];
}

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    road?: string;
    suburb?: string;
  };
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
    tripadvisor: 'https://tripadvisor.com/motel-secretpalace',
    features: ['Estacionamento', 'Ar condicionado', 'Champanhe', 'Espelho no teto', 'Cadeira erótica'],
    description: 'Suítes temáticas exclusivas com equipamentos de alta qualidade. Ambiente sofisticado e discreto para realizar suas fantasias mais ousadas. Contamos com suítes BDSM completas com equipamentos profissionais, além de suítes temáticas para todos os gostos.',
    status: 'active',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    hours: '24 horas',
    periods: ['2 horas', '4 horas', '12 horas'],
  },
  {
    id: '2',
    name: 'Caverna do Prazer',
    location: 'Rio de Janeiro, RJ - Copacabana',
    state: 'Rio de Janeiro',
    city: 'Rio de Janeiro',
    distance: '5.1 km',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
    ],
    isPremium: false,
    phone: '(21) 99999-9999',
    whatsapp: '(21) 99999-9999',
    tripadvisor: '',
    features: ['Estacionamento', 'Ar condicionado'],
    description: 'Ambiente escuro e misterioso para suas fantasias. Perfeito para aqueles que buscam uma experiência mais intensa e imersiva.',
    status: 'active',
    coordinates: { lat: -22.9068, lng: -43.1729 },
    hours: '18h às 06h',
    periods: ['2 horas', '4 horas'],
  },
  {
    id: '3',
    name: 'Dungeon Motel',
    location: 'Belo Horizonte, MG - Centro',
    state: 'Minas Gerais',
    city: 'Belo Horizonte',
    distance: '2.8 km',
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
    tripadvisor: 'https://tripadvisor.com/dungeon-motel',
    features: ['Estacionamento', 'Ar condicionado', 'Champanhe', 'Espelho no teto', 'Cadeira erótica', 'Cruz de Santo André', 'Gaiola'],
    description: 'Experiência medieval completa com masmorra equipada. Entre em um mundo de fantasia e submissão em nossas suítes temáticas medievais.',
    status: 'active',
    coordinates: { lat: -19.9167, lng: -43.9345 },
    hours: '24 horas',
    periods: ['2 horas', '4 horas', '12 horas'],
  },
  {
    id: '4',
    name: 'Dominium Dark',
    location: 'Curitiba, PR - Batel',
    state: 'Paraná',
    city: 'Curitiba',
    distance: '4.5 km',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
    ],
    isPremium: true,
    phone: '(41) 99999-9999',
    whatsapp: '(41) 99999-9999',
    tripadvisor: 'https://tripadvisor.com/dominium-dark',
    features: ['Estacionamento', 'Ar condicionado', 'Champanhe', 'Equipamentos BDSM'],
    description: 'Ambiente completo para dominação e submissão. Equipamentos profissionais e ambiente seguro para práticas BDSM.',
    status: 'pending',
    coordinates: { lat: -25.4284, lng: -49.2733 },
    hours: '24 horas',
    periods: ['2 horas', '4 horas', '12 horas'],
  },
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
    href: 'https://bdsmbrazil.com.br/loja',
  },
  {
    icon: Crown,
    title: 'Portal das Dominatrix',
    description: 'Conecte-se com profissionais especializadas.',
    link: 'Ver Dominas',
    href: 'https://dominas.bdsmbrazil.com.br',
  },
  {
    icon: MessageCircle,
    title: 'Chatbot IA',
    description: 'Assistente virtual para suas dúvidas e fantasias.',
    link: 'Conversar',
    href: 'https://dominavirtual.bdsmbrazil.com.br',
  },
  {
    icon: Shield,
    title: 'Anúncios Anônimos',
    description: 'Classificados discretos para a comunidade.',
    link: 'Ver Anúncios',
    href: 'https://classificados.bdsmbrazil.com.br',
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

// Address Autocomplete Component
function AddressAutocomplete({ 
  value, 
  onChange, 
  onPlaceSelect,
  placeholder = "Buscar endereço..."
}: { 
  value: string; 
  onChange: (value: string) => void;
  onPlaceSelect: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
}) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=br`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    onChange(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    onPlaceSelect(suggestion);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="pl-10 bg-[#121212] border-[#333333] text-white placeholder:text-gray-500 focus:border-[#FF0033]"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#FF0033] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[#1E1E1E] border border-[#333333] rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-[#2A2A2A] transition-colors border-b border-[#333333] last:border-b-0"
            >
              <p className="text-white text-sm">{suggestion.display_name}</p>
              {suggestion.address?.city && (
                <p className="text-gray-500 text-xs mt-1">
                  {suggestion.address.city}{suggestion.address.state ? `, ${suggestion.address.state}` : ''}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Map Component with Leaflet
function MapComponent({ 
  motels, 
  userLocation,
  onSelectMotel 
}: { 
  motels: Motel[]; 
  userLocation: { lat: number; lng: number } | null;
  onSelectMotel: (motel: Motel) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then(leaflet => {
      setL(leaflet.default);
    });
  }, []);

  const center = userLocation 
    ? [userLocation.lat, userLocation.lng]
    : motels.length > 0 
      ? [motels[0].coordinates.lat, motels[0].coordinates.lng]
      : [-23.5505, -46.6333];

  if (!isMounted || !L) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#1E1E1E]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FF0033] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  const premiumIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background: linear-gradient(135deg, #FFD700, #FFA500); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #000;"><path d="M2 4v6"/><path d="M2 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10"/><path d="M2 10h16"/><path d="M18 10V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/></svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const standardIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background: #FF0033; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #fff;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });

  const userIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background: #3B82F6; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(59,130,246,0.5); animation: pulse 2s infinite;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });

  return (
    <>
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          background: #1E1E1E !important;
          color: white !important;
          border-radius: 12px !important;
          border: 1px solid #333 !important;
        }
        .leaflet-popup-tip {
          background: #1E1E1E !important;
        }
        .leaflet-popup-content {
          margin: 12px 16px !important;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
      <MapContainer
        center={center as [number, number]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-blue-400">Sua localização</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {motels.map((motel) => (
          <Marker 
            key={motel.id} 
            position={[motel.coordinates.lat, motel.coordinates.lng]}
            icon={motel.isPremium ? premiumIcon : standardIcon}
          >
            <Popup>
              <div className="min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  {motel.isPremium && (
                    <span className="text-yellow-500">👑</span>
                  )}
                  <span className="font-semibold">{motel.name}</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{motel.location}</p>
                <p className="text-gray-500 text-xs mb-3">{motel.hours}</p>
                <button 
                  onClick={() => onSelectMotel(motel)}
                  className="w-full bg-[#FF0033] hover:bg-[#CC0029] text-white text-sm py-1.5 px-3 rounded transition-colors"
                >
                  Ver detalhes
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

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

  const navLinks: { page: PageView; label: string }[] = [
    { page: 'home', label: 'Início' },
    { page: 'moteis', label: 'Motéis' },
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
            <img 
              src="https://i.ibb.co/NdHzfGQ6/symbolbdsmtransparent.png" 
              alt="BDSM Brazil Logo" 
              className="h-10 w-10 object-contain"
            />
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">BDSM</span>
              <span className="text-2xl font-bold text-[#FF0033] tracking-tight">BRAZIL</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              
              return (
                <button
                  key={link.page}
                  onClick={() => setCurrentPage(link.page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#FF0033] text-white'
                      : 'text-gray-300 hover:bg-[#1E1E1E] hover:text-white'
                  }`}
                >
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
                      : 'text-gray-300'
                  }`}
                >
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
              <img 
                src="https://i.ibb.co/NdHzfGQ6/symbolbdsmtransparent.png" 
                alt="BDSM Brazil Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-white">BDSM</span>
              <span className="text-xl font-bold text-[#FF0033]">BRAZIL</span>
            </button>
            <p className="text-gray-400 text-sm mb-4">
              O maior portal de motéis com suítes temáticas BDSM do Brasil. 
              Encontre o prazer mais próximo de você.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navegação</h3>
            <ul className="space-y-3">
              {[{ page: 'home' as PageView, label: 'Início' }, { page: 'moteis', label: 'Motéis' }, { page: 'sobre', label: 'Sobre' }].map((link) => (
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
            <h3 className="text-white font-semibold mb-4">Aviso</h3>
            <div className="bg-[#FF0033]/10 border border-[#FF0033]/30 rounded-lg px-4 py-3">
              <p className="text-[#FF0033] text-sm font-medium text-center">
                ⚠️ A entrada em motéis é proibida para menores de 18 anos
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#FF0033]" />
                <a href="mailto:moteis@bdsmbrazil.com.br" className="hover:text-white transition-colors">
                  moteis@bdsmbrazil.com.br
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MessageCircle className="w-4 h-4 text-[#FF0033]" />
                <a href="https://wa.me/5513955517904" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +55 (13) 95551-7904
                </a>
              </li>
            </ul>
            <div className="mt-4 text-gray-500 text-xs">
              <p>CNPJ: 64.465.357/0001-28</p>
            </div>
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
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const displayImages = motel.isPremium ? motel.images : motel.images.slice(0, 3);

  const cleanPhone = motel.phone.replace(/\D/g, '');
  const cleanWhatsapp = motel.whatsapp.replace(/\D/g, '');

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${motel.coordinates.lat},${motel.coordinates.lng}`;
    window.open(url, '_blank');
    setShowRouteOptions(false);
  };

  const openWaze = () => {
    const url = `https://waze.com/ul?ll=${motel.coordinates.lat},${motel.coordinates.lng}&navigate=yes`;
    window.open(url, '_blank');
    setShowRouteOptions(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: motel.name,
      text: `Confira ${motel.name} - ${motel.location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copiado para a área de transferência!');
      }
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setCurrentPage('moteis')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Motéis
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 group">
              <img
                src={displayImages[selectedImage]}
                alt={motel.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {motel.isPremium && (
                <Badge className="absolute top-4 left-4 bg-[#FFD700] text-black">
                  <Crown className="w-4 h-4 mr-1" />
                  Premium
                </Badge>
              )}
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {displayImages.length}
              </div>
              
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

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

            {!motel.isPremium && motel.images.length > 3 && (
              <p className="text-gray-500 text-sm mt-2">
                * Este motel possui mais fotos disponíveis no plano Premium
              </p>
            )}

            <Card className="bg-[#1E1E1E] border-[#333333] mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Descrição</h2>
                <p className="text-gray-300 leading-relaxed">{motel.description}</p>
              </CardContent>
            </Card>

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

          <div className="lg:col-span-1">
            <Card className="bg-[#1E1E1E] border-[#333333] sticky top-24">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-white mb-2">{motel.name}</h1>
                
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <MapPin className="w-4 h-4 text-[#FF0033]" />
                  <span>{motel.location}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-300 mb-4">
                  <Clock className="w-5 h-5 text-[#FF0033]" />
                  <div>
                    <p className="text-sm text-gray-400">Horário de funcionamento</p>
                    <p className="font-medium">{motel.hours}</p>
                  </div>
                </div>

                {motel.periods && motel.periods.length > 0 && (
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-sm text-gray-400">Períodos:</span>
                    <div className="flex gap-2">
                      {motel.periods.map((period) => (
                        <Badge key={period} className="bg-[#FF0033]/20 text-[#FF0033]">
                          {period}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    onClick={() => window.open(`tel:+55${cleanPhone}`, '_self')}
                    className="w-full bg-[#FF0033] hover:bg-[#CC0029] text-white"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar: {motel.phone}
                  </Button>
                  <Button 
                    onClick={() => window.open(`https://wa.me/55${cleanWhatsapp}`, '_blank')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button 
                    onClick={() => setShowRouteOptions(true)}
                    className="w-full bg-[#2A2A2A] hover:bg-[#333333] text-white border border-[#444444]"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Ver Rota
                  </Button>
                  {motel.tripadvisor && (
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(motel.tripadvisor, '_blank')}
                      className="w-full border-[#333333] text-green-600 hover:text-green-500 hover:border-green-500"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Ver no TripAdvisor
                    </Button>
                  )}
                </div>

                {showRouteOptions && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowRouteOptions(false)}>
                    <div 
                      className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-6 max-w-sm w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">Escolha o aplicativo</h3>
                      <p className="text-gray-400 text-sm mb-4">{motel.name}</p>
                      <div className="space-y-3">
                        <Button 
                          onClick={openGoogleMaps}
                          className="w-full bg-white hover:bg-gray-100 text-black"
                        >
                          <Map className="w-5 h-5 mr-3" />
                          Google Maps
                        </Button>
                        <Button 
                          onClick={openWaze}
                          className="w-full bg-[#33CCFF] hover:bg-[#2BB8E8] text-white"
                        >
                          <Navigation className="w-5 h-5 mr-3" />
                          Waze
                        </Button>
                        <Button 
                          onClick={() => setShowRouteOptions(false)}
                          variant="outline"
                          className="w-full border-[#333333] text-gray-400 hover:text-white"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-[#333333]">
                  <Button 
                    variant="ghost" 
                    onClick={handleShare}
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

// About Page
function AboutPage({ setCurrentPage }: { setCurrentPage: (page: PageView) => void }) {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          Sobre o <span className="text-[#FF0033]">BDSM Brazil</span>
        </h1>
        
        <Card className="bg-[#1E1E1E] border-[#333333] mb-8">
          <CardContent className="p-6">
            <p className="text-gray-300 leading-relaxed mb-4">
              O <span className="text-white font-semibold">BDSM Brazil</span> é o maior portal de motéis com suítes temáticas BDSM do Brasil. 
              Nossa missão é conectar pessoas que buscam experiências únicas e fantasias em ambientes seguros, 
              discretos e preparados para atender aos mais diversos desejos.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Trabalhamos com os melhores estabelecimentos do país, garantindo qualidade, 
              privacidade e uma experiência inesquecível para nossos usuários.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Seja você proprietário de um motel ou alguém em busca de novas experiências, 
              o BDSM Brazil é o lugar certo para você.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#FFD700]" />
                Para Proprietários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Cadastre seu motel e alcance milhares de clientes em busca de experiências únicas. 
                Oferecemos planos gratuitos e premium com destaque na plataforma.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#FF0033]" />
                Para Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Encontre o motel perfeito para realizar suas fantasias. 
                Busque por localização, recursos e muito mais. Totalmente gratuito.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white">Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="w-5 h-5 text-[#FF0033]" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <a href="mailto:moteis@bdsmbrazil.com.br" className="hover:text-white transition-colors">
                  moteis@bdsmbrazil.com.br
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <MessageCircle className="w-5 h-5 text-[#FF0033]" />
              <div>
                <p className="text-sm text-gray-400">WhatsApp</p>
                <a href="https://wa.me/5513955517904" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +55 (13) 95551-7904
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Shield className="w-5 h-5 text-[#FF0033]" />
              <div>
                <p className="text-sm text-gray-400">CNPJ</p>
                <p>64.465.357/0001-28</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.open('https://wa.me/5513955517904', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Fale Conosco no WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

// Login Page
function LoginPage({ setCurrentPage, onLogin }: { setCurrentPage: (page: PageView) => void; onLogin: (role: UserRole) => void }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-[#1E1E1E] border-[#333333]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://i.ibb.co/NdHzfGQ6/symbolbdsmtransparent.png" 
              alt="BDSM Brazil Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-white">Entrar</CardTitle>
          <CardDescription className="text-gray-400">
            Acesse sua conta para gerenciar seus motéis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Email</Label>
            <Input type="email" placeholder="seu@email.com" className="bg-[#121212] border-[#333333] text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Senha</Label>
            <Input type="password" placeholder="••••••••" className="bg-[#121212] border-[#333333] text-white" />
          </div>
          <Button 
            className="w-full bg-[#FF0033] hover:bg-[#CC0029] text-white"
            onClick={() => onLogin('owner')}
          >
            Entrar
          </Button>
          <div className="text-center text-sm text-gray-400">
            Não tem uma conta?{' '}
            <button className="text-[#FF0033] hover:underline">
              Cadastre-se
            </button>
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#333333]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1E1E1E] px-2 text-gray-400">ou</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-[#333333] text-gray-300 hover:text-white hover:bg-[#2A2A2A]"
            onClick={() => onLogin('admin')}
          >
            Entrar como Admin (Demo)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Dashboard Page
function DashboardPage({ setCurrentPage, setSelectedMotel }: { setCurrentPage: (page: PageView) => void; setSelectedMotel: (motel: Motel) => void }) {
  const [motels, setMotels] = useState(sampleMotels.slice(0, 2));
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMotelEdit, setSelectedMotelEdit] = useState<Motel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    whatsapp: '',
    tripadvisor: '',
    hours: '',
    periods: [] as string[],
    description: '',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    images: [] as string[],
  });

  const updateForm = (field: string, value: string | { lat: number; lng: number } | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePeriod = (period: string) => {
    setFormData(prev => ({
      ...prev,
      periods: prev.periods.includes(period)
        ? prev.periods.filter(p => p !== period)
        : [...prev.periods, period]
    }));
  };

  const handleView = (motel: Motel) => {
    setSelectedMotel(motel);
    setCurrentPage('motel-detail');
  };

  const handleEdit = (motel: Motel) => {
    setSelectedMotelEdit(motel);
    setFormData({
      name: motel.name,
      location: motel.location,
      phone: motel.phone,
      whatsapp: motel.whatsapp,
      tripadvisor: motel.tripadvisor,
      hours: motel.hours,
      periods: motel.periods,
      description: motel.description,
      coordinates: motel.coordinates,
      images: [...motel.images],
    });
    setIsEditDialogOpen(true);
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddImage = () => {
    const url = prompt('Cole a URL da imagem:');
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }));
    }
  };

  const handlePause = (id: string) => {
    setMotels(motels.map(m => m.id === id ? { ...m, status: 'paused' as const } : m));
  };

  const handleActivate = (id: string) => {
    setMotels(motels.map(m => m.id === id ? { ...m, status: 'active' as const } : m));
  };

  const handleSaveEdit = () => {
    if (selectedMotelEdit) {
      setMotels(motels.map(m => m.id === selectedMotelEdit.id ? {
        ...m,
        name: formData.name,
        location: formData.location,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        tripadvisor: formData.tripadvisor,
        hours: formData.hours,
        periods: formData.periods,
        description: formData.description,
        coordinates: formData.coordinates,
        images: formData.images,
        image: formData.images[0] || m.image,
      } : m));
      setIsEditDialogOpen(false);
      setSelectedMotelEdit(null);
    }
  };

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
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleView(motel)}
                        className="border-[#333333] text-gray-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(motel)}
                        className="border-[#333333] text-gray-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      {motel.status === 'active' ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handlePause(motel.id)}
                          className="border-[#333333] text-gray-400 hover:text-white"
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Pausar
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleActivate(motel.id)}
                          className="border-[#333333] text-gray-400 hover:text-white"
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          Ativar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-[#1E1E1E] border-[#333333] text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Motel</DialogTitle>
              <DialogDescription className="text-gray-400">
                Preencha as informações do seu motel.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label className="text-white">Nome do Motel</Label>
                <Input 
                  placeholder="Ex: Dungeon Motel" 
                  className="bg-[#121212] border-[#333333] text-white"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Localização</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <AddressAutocomplete
                      value={formData.location}
                      onChange={(value) => updateForm('location', value)}
                      onPlaceSelect={(suggestion) => {
                        updateForm('location', suggestion.display_name);
                        updateForm('coordinates', {
                          lat: parseFloat(suggestion.lat),
                          lng: parseFloat(suggestion.lon)
                        });
                      }}
                      placeholder="Digite o endereço do motel..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            updateForm('coordinates', {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                            });
                            updateForm('location', `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`);
                          },
                          (error) => {
                            alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
                          }
                        );
                      } else {
                        alert('Geolocalização não suportada pelo navegador.');
                      }
                    }}
                    className="border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033]/10 shrink-0"
                    title="Usar minha localização atual"
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Lat: {formData.coordinates.lat.toFixed(6)}, Lng: {formData.coordinates.lng.toFixed(6)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Telefone</Label>
                  <Input 
                    placeholder="(11) 99999-9999" 
                    className="bg-[#121212] border-[#333333] text-white"
                    value={formData.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">WhatsApp</Label>
                  <Input 
                    placeholder="(11) 99999-9999" 
                    className="bg-[#121212] border-[#333333] text-white"
                    value={formData.whatsapp}
                    onChange={(e) => updateForm('whatsapp', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Link TripAdvisor</Label>
                  <Input 
                    placeholder="https://tripadvisor.com/..." 
                    className="bg-[#121212] border-[#333333] text-white"
                    value={formData.tripadvisor}
                    onChange={(e) => updateForm('tripadvisor', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Horário de Funcionamento</Label>
                  <Input 
                    placeholder="Ex: 24 horas" 
                    className="bg-[#121212] border-[#333333] text-white"
                    value={formData.hours}
                    onChange={(e) => updateForm('hours', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Períodos Disponíveis</Label>
                <div className="flex gap-2">
                  {['2 horas', '4 horas', '12 horas'].map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => togglePeriod(period)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        formData.periods.includes(period)
                          ? 'bg-[#FF0033] border-[#FF0033] text-white'
                          : 'bg-[#121212] border-[#333333] text-gray-400 hover:border-[#FF0033]'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Descrição</Label>
                <Textarea 
                  placeholder="Descreva seu motel..." 
                  className="bg-[#121212] border-[#333333] text-white min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Fotos</Label>
                <div className="border-2 border-dashed border-[#333333] rounded-lg p-6 text-center hover:border-[#FF0033] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Clique ou arraste para fazer upload</p>
                  <p className="text-gray-500 text-xs mt-1">PNG, JPG até 5MB</p>
                </div>
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

        {/* Edit Motel Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#1E1E1E] border-[#333333] text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Motel</DialogTitle>
              <DialogDescription className="text-gray-400">
                Atualize as informações do seu motel.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label className="text-white">Nome do Motel</Label>
                <Input 
                  placeholder="Ex: Dungeon Motel" 
                  className="bg-[#121212] border-[#333333] text-white"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Localização</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <AddressAutocomplete
                      value={formData.location}
                      onChange={(value) => updateForm('location', value)}
                      onPlaceSelect={(suggestion) => {
                        updateForm('location', suggestion.display_name);
                        updateForm('coordinates', { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
                      }}
                      placeholder="Buscar endereço..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            updateForm('coordinates', {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                            });
                            updateForm('location', `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`);
                          },
                          (error) => {
                            alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
                          }
                        );
                      } else {
                        alert('Geolocalização não suportada pelo navegador.');
                      }
                    }}
                    className="border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033]/10 shrink-0"
                    title="Usar minha localização atual"
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Lat: {formData.coordinates.lat.toFixed(6)}, Lng: {formData.coordinates.lng.toFixed(6)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Telefone</Label>
                  <Input 
                    placeholder="(11) 99999-9999" 
                    className="bg-[#121212] border-[#333333] text-white"
                    value={formData.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">WhatsApp</Label>
                  <Input 
                    placeholder="(11) 99999-9999" 
                    className="bg-[#121212] border-[#333333] text-white"
                    value={formData.whatsapp}
                    onChange={(e) => updateForm('whatsapp', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">TripAdvisor (opcional)</Label>
                <Input 
                  placeholder="https://tripadvisor.com/..." 
                  className="bg-[#121212] border-[#333333] text-white"
                  value={formData.tripadvisor}
                  onChange={(e) => updateForm('tripadvisor', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Horário de Funcionamento</Label>
                <Input 
                  placeholder="Ex: 24 horas" 
                  className="bg-[#121212] border-[#333333] text-white"
                  value={formData.hours}
                  onChange={(e) => updateForm('hours', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Períodos</Label>
                <div className="flex flex-wrap gap-2">
                  {['2 horas', '4 horas', '12 horas'].map((period) => (
                    <button
                      key={period}
                      onClick={() => togglePeriod(period)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        formData.periods.includes(period)
                          ? 'bg-[#FF0033] text-white'
                          : 'bg-[#121212] text-gray-400 border border-[#333333]'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Descrição</Label>
                <Textarea
                  placeholder="Descreva seu motel..."
                  className="bg-[#121212] border-[#333333] text-white min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Fotos ({formData.images.length}/15)</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddImage}
                    disabled={formData.images.length >= 15}
                    className="border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033]/10"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-[#333333]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#FF0033] text-white text-[10px] px-1.5 py-0.5 rounded">
                            Capa
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#333333] rounded-lg p-6 text-center">
                    <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Nenhuma foto adicionada</p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="border-[#333333] text-gray-400"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveEdit}
                className="bg-[#FF0033] hover:bg-[#CC0029] text-white"
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Admin Page
function AdminPage({ setCurrentPage, setSelectedMotel }: { setCurrentPage: (page: PageView) => void; setSelectedMotel: (motel: Motel) => void }) {
  const [motels, setMotels] = useState(sampleMotels);
  const [users] = useState([
    { id: '1', name: 'João Silva', email: 'joao@email.com', role: 'owner' as UserRole, motels: 2, status: 'active' },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'owner' as UserRole, motels: 1, status: 'active' },
    { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', role: 'owner' as UserRole, motels: 1, status: 'pending' },
  ]);
  const [activeTab, setActiveTab] = useState('moteis');
  const [selectedMotelAdmin, setSelectedMotelAdmin] = useState<Motel | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    location: '',
    phone: '',
    whatsapp: '',
    tripadvisor: '',
    hours: '',
    periods: [] as string[],
    description: '',
    images: [] as string[],
    coordinates: { lat: -23.5505, lng: -46.6333 },
  });

  const stats = [
    { label: 'Total Motéis', value: motels.length, icon: Building2, color: 'text-[#FF0033]' },
    { label: 'Pendentes', value: motels.filter(m => m.status === 'pending').length, icon: AlertTriangle, color: 'text-yellow-500' },
    { label: 'Usuários', value: users.length, icon: Users, color: 'text-blue-500' },
    { label: 'Premium', value: motels.filter(m => m.isPremium).length, icon: Crown, color: 'text-[#FFD700]' },
  ];

  const handleApprove = (id: string) => {
    setMotels(motels.map(m => m.id === id ? { ...m, status: 'active' } : m));
  };

  const handlePause = (id: string) => {
    setMotels(motels.map(m => m.id === id ? { ...m, status: 'paused' } : m));
  };

  const handleActivate = (id: string) => {
    setMotels(motels.map(m => m.id === id ? { ...m, status: 'active' } : m));
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este motel?')) {
      setMotels(motels.filter(m => m.id !== id));
    }
  };

  const handleView = (motel: Motel) => {
    setSelectedMotelAdmin(motel);
    setShowViewDialog(true);
  };

  const handleEdit = (motel: Motel) => {
    setSelectedMotelAdmin(motel);
    setEditFormData({
      name: motel.name,
      location: motel.location,
      phone: motel.phone,
      whatsapp: motel.whatsapp,
      tripadvisor: motel.tripadvisor,
      hours: motel.hours,
      periods: motel.periods,
      description: motel.description,
      images: [...motel.images],
      coordinates: motel.coordinates,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (selectedMotelAdmin) {
      setMotels(motels.map(m => m.id === selectedMotelAdmin.id ? {
        ...m,
        name: editFormData.name,
        location: editFormData.location,
        phone: editFormData.phone,
        whatsapp: editFormData.whatsapp,
        tripadvisor: editFormData.tripadvisor,
        hours: editFormData.hours,
        periods: editFormData.periods,
        description: editFormData.description,
        images: editFormData.images,
        image: editFormData.images[0] || m.image,
        coordinates: editFormData.coordinates,
      } : m));
      setShowEditDialog(false);
      setSelectedMotelAdmin(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddImage = () => {
    const url = prompt('Cole a URL da imagem:');
    if (url && url.trim()) {
      setEditFormData(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }));
    }
  };

  const toggleEditPeriod = (period: string) => {
    setEditFormData(prev => ({
      ...prev,
      periods: prev.periods.includes(period)
        ? prev.periods.filter(p => p !== period)
        : [...prev.periods, period]
    }));
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
                              <p className="text-white font-medium">{motel.name}</p>
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
                                : motel.status === 'paused'
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-red-500/20 text-red-400'
                            }>
                              {motel.status === 'active' ? 'Ativo' : motel.status === 'pending' ? 'Pendente' : motel.status === 'paused' ? 'Pausado' : 'Rejeitado'}
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
                            <div className="flex justify-end gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleView(motel)}
                                className="text-gray-400 hover:text-white"
                                title="Ver detalhes"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleEdit(motel)}
                                className="text-gray-400 hover:text-white"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {motel.status === 'active' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handlePause(motel.id)}
                                  className="text-orange-400 hover:text-orange-300"
                                  title="Pausar"
                                >
                                  <Pause className="w-4 h-4" />
                                </Button>
                              )}
                              {(motel.status === 'paused' || motel.status === 'pending') && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleActivate(motel.id)}
                                  className="text-green-400 hover:text-green-300"
                                  title="Ativar"
                                >
                                  <Zap className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleDelete(motel.id)}
                                className="text-red-400 hover:text-red-300"
                                title="Excluir"
                              >
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
                              <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
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

      {/* View Motel Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="bg-[#1E1E1E] border-[#333333] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Motel</DialogTitle>
          </DialogHeader>
          {selectedMotelAdmin && (
            <div className="space-y-4">
              <img 
                src={selectedMotelAdmin.image} 
                alt={selectedMotelAdmin.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedMotelAdmin.name}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {selectedMotelAdmin.location}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs">Telefone</p>
                  <p className="text-white">{selectedMotelAdmin.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">WhatsApp</p>
                  <p className="text-white">{selectedMotelAdmin.whatsapp}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Horário</p>
                  <p className="text-white">{selectedMotelAdmin.hours}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Períodos</p>
                  <p className="text-white">{selectedMotelAdmin.periods.join(', ')}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-2">Comodidades</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMotelAdmin.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#2A2A2A] text-gray-300">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-2">Descrição</p>
                <p className="text-gray-300 text-sm">{selectedMotelAdmin.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowViewDialog(false)}
              className="border-[#333333] text-gray-400"
            >
              Fechar
            </Button>
            <Button 
              onClick={() => {
                setShowViewDialog(false);
                setSelectedMotel(selectedMotelAdmin);
                setCurrentPage('motel-detail');
              }}
              className="bg-[#FF0033] hover:bg-[#CC0029] text-white"
            >
              Ver Página Completa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Motel Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-[#1E1E1E] border-[#333333] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Motel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className="text-white">Nome do Motel</Label>
              <Input 
                className="bg-[#121212] border-[#333333] text-white"
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Localização</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <AddressAutocomplete
                    value={editFormData.location}
                    onChange={(value) => setEditFormData(prev => ({ ...prev, location: value }))}
                    onPlaceSelect={(suggestion) => {
                      setEditFormData(prev => ({
                        ...prev,
                        location: suggestion.display_name,
                        coordinates: { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) }
                      }));
                    }}
                    placeholder="Buscar endereço..."
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setEditFormData(prev => ({
                            ...prev,
                            coordinates: {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                            },
                            location: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`
                          }));
                        },
                        (error) => {
                          alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
                        }
                      );
                    } else {
                      alert('Geolocalização não suportada pelo navegador.');
                    }
                  }}
                  className="border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033]/10 shrink-0"
                  title="Usar minha localização atual"
                >
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Lat: {editFormData.coordinates.lat.toFixed(6)}, Lng: {editFormData.coordinates.lng.toFixed(6)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Telefone</Label>
                <Input 
                  className="bg-[#121212] border-[#333333] text-white"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">WhatsApp</Label>
                <Input 
                  className="bg-[#121212] border-[#333333] text-white"
                  value={editFormData.whatsapp}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">TripAdvisor</Label>
              <Input 
                className="bg-[#121212] border-[#333333] text-white"
                value={editFormData.tripadvisor}
                onChange={(e) => setEditFormData(prev => ({ ...prev, tripadvisor: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Horário</Label>
              <Input 
                className="bg-[#121212] border-[#333333] text-white"
                value={editFormData.hours}
                onChange={(e) => setEditFormData(prev => ({ ...prev, hours: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Períodos</Label>
              <div className="flex flex-wrap gap-2">
                {['2 horas', '4 horas', '12 horas'].map((period) => (
                  <button
                    key={period}
                    onClick={() => toggleEditPeriod(period)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      editFormData.periods.includes(period)
                        ? 'bg-[#FF0033] text-white'
                        : 'bg-[#121212] text-gray-400 border border-[#333333]'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Descrição</Label>
              <Textarea
                className="bg-[#121212] border-[#333333] text-white min-h-[100px]"
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white">Fotos ({editFormData.images.length}/15)</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddImage}
                  disabled={editFormData.images.length >= 15}
                  className="border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033]/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              {editFormData.images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {editFormData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-[#333333]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-[#FF0033] text-white text-[10px] px-1.5 py-0.5 rounded">
                          Capa
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#333333] rounded-lg p-6 text-center">
                  <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Nenhuma foto adicionada</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditDialog(false)}
              className="border-[#333333] text-gray-400"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveEdit}
              className="bg-[#FF0033] hover:bg-[#CC0029] text-white"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Home Page Component
function HomePage({ setCurrentPage, setSelectedMotel }: { setCurrentPage: (page: PageView) => void; setSelectedMotel: (motel: Motel) => void }) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('Todos os Estados');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [routeMotel, setRouteMotel] = useState<Motel | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const openGoogleMaps = (motel: Motel) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${motel.coordinates.lat},${motel.coordinates.lng}`;
    window.open(url, '_blank');
    setRouteMotel(null);
  };

  const openWaze = (motel: Motel) => {
    const url = `https://waze.com/ul?ll=${motel.coordinates.lat},${motel.coordinates.lng}&navigate=yes`;
    window.open(url, '_blank');
    setRouteMotel(null);
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getUserLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocalização não suportada pelo navegador');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        setHasSearched(true);
      },
      (error) => {
        setLocationError('Não foi possível obter sua localização');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);
    
    // If there's a search query but no location yet, try to geocode it
    if (searchQuery && searchQuery.length >= 3 && !userLocation) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=br`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setUserLocation({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          });
        }
      } catch (error) {
        console.error('Error geocoding search query:', error);
      }
    }
    
    setIsSearching(false);
  };

  // Filter motels by state
  const filteredByState = selectedState === 'Todos os Estados'
    ? sampleMotels.filter(m => m.status === 'active')
    : sampleMotels.filter(m => m.status === 'active' && m.state === selectedState);

  // Sort motels by distance if user location is available
  const sortedMotels = userLocation 
    ? [...filteredByState].sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
        
        // Premium motels within 20km get priority
        if (distA <= 20 && distB <= 20) {
          if (a.isPremium && !b.isPremium) return -1;
          if (!a.isPremium && b.isPremium) return 1;
          return distA - distB;
        }
        
        if (distA <= 20 && distB > 20) return -1;
        if (distA > 20 && distB <= 20) return 1;
        
        // Premium motels always get some priority
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        
        return distA - distB;
      })
    : filteredByState;

  const getDistanceString = (motel: Motel): string => {
    if (!userLocation) return motel.distance;
    const dist = calculateDistance(userLocation.lat, userLocation.lng, motel.coordinates.lat, motel.coordinates.lng);
    if (dist < 1) return `${Math.round(dist * 1000)} m`;
    return `${dist.toFixed(1)} km`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://i.ibb.co/jFjp6nh/grok-image-28e567e3-b224-45cb-aa3c-3d11b5bda95f-1.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/60 via-[#121212]/70 to-[#121212]" />
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
                <div className="flex-1">
                  <AddressAutocomplete
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onPlaceSelect={(suggestion) => {
                      setSearchQuery(suggestion.display_name);
                      setUserLocation({
                        lat: parseFloat(suggestion.lat),
                        lng: parseFloat(suggestion.lon)
                      });
                      setHasSearched(true);
                    }}
                    placeholder="Buscar motel, cidade ou endereço..."
                  />
                </div>
                <Select value={selectedState} onValueChange={(value) => {
                  setSelectedState(value);
                  setHasSearched(true);
                }}>
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
                <Button 
                  onClick={getUserLocation}
                  disabled={isLocating}
                  variant="outline"
                  className="border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033]/10"
                >
                  {isLocating ? (
                    <div className="w-4 h-4 border-2 border-[#FF0033] border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Navigation className="w-4 h-4 mr-2" />
                  )}
                  {userLocation ? 'Localizado' : 'Localizar'}
                </Button>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-[#FF0033] hover:bg-[#CC0029] text-white px-8"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Buscar
                </Button>
              </div>
              {locationError && (
                <p className="text-yellow-500 text-sm mt-2">{locationError}</p>
              )}
              {userLocation && (
                <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Localização ativada - motéis ordenados por distância
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* View Toggle & Results */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {hasSearched 
                  ? (userLocation ? 'Motéis Mais Próximos' : `Motéis ${selectedState !== 'Todos os Estados' ? `em ${selectedState}` : ''}`)
                  : 'Todos os Motéis'}
              </h2>
              {hasSearched && (
                <p className="text-gray-400 text-sm mt-1">
                  {sortedMotels.length} motel{sortedMotels.length !== 1 ? 's' : ''} encontrado{sortedMotels.length !== 1 ? 's' : ''}
                  {userLocation && ' - ordenado por distância'}
                </p>
              )}
            </div>
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
            sortedMotels.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum motel encontrado</h3>
                <p className="text-gray-400 mb-4">
                  Não há motéis cadastrados {selectedState !== 'Todos os Estados' ? `em ${selectedState}` : 'com os filtros selecionados'}.
                </p>
                <Button
                  onClick={() => {
                    setSelectedState('Todos os Estados');
                    setSearchQuery('');
                    setUserLocation(null);
                    setHasSearched(false);
                  }}
                  variant="outline"
                  className="border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033]/10"
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMotels.map((motel) => (
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
                    <Badge className="absolute top-3 right-3 bg-black/70 text-white flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      {getDistanceString(motel)}
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
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 text-sm">{motel.hours}</span>
                      {motel.periods.length > 0 && (
                        <span className="text-gray-500 text-xs">• {motel.periods.join(', ')}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-[#333333] text-gray-400 hover:text-white hover:border-[#FF0033]"
                        onClick={(e) => {
                          e.stopPropagation();
                          const cleanPhone = motel.phone.replace(/\D/g, '');
                          window.open(`tel:+55${cleanPhone}`, '_self');
                        }}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-[#333333] text-green-500 hover:text-green-400 hover:border-green-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          const cleanWhatsapp = motel.whatsapp.replace(/\D/g, '');
                          window.open(`https://wa.me/55${cleanWhatsapp}`, '_blank');
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-[#333333] text-gray-400 hover:text-white hover:border-[#FF0033]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRouteMotel(motel);
                        }}
                      >
                        <Navigation className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={`border-[#333333] ${motel.tripadvisor ? 'text-green-600 hover:text-green-500' : 'text-gray-600'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (motel.tripadvisor) window.open(motel.tripadvisor, '_blank');
                        }}
                        disabled={!motel.tripadvisor}
                      >
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )
          ) : (
            <div className="bg-[#1E1E1E] rounded-xl border border-[#333333] overflow-hidden">
              <div className="h-[500px] relative rounded-xl overflow-hidden">
                <MapComponent 
                  motels={sortedMotels} 
                  userLocation={userLocation}
                  onSelectMotel={(motel) => {
                    setSelectedMotel(motel);
                    setCurrentPage('motel-detail');
                  }}
                />
                {!userLocation && (
                  <div className="absolute top-4 left-4 z-[1000] bg-[#1E1E1E]/95 border border-[#333333] rounded-lg p-3">
                    <p className="text-gray-300 text-sm mb-2">Ative sua localização para ver os motéis mais próximos</p>
                    <Button 
                      onClick={getUserLocation}
                      disabled={isLocating}
                      size="sm"
                      className="bg-[#FF0033] hover:bg-[#CC0029] text-white"
                    >
                      {isLocating ? 'Localizando...' : 'Ativar Localização'}
                    </Button>
                  </div>
                )}
                {userLocation && (
                  <div className="absolute top-4 left-4 z-[1000] bg-green-600/95 border border-green-500 rounded-lg px-3 py-2">
                    <p className="text-white text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Localização ativada
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Route Selection Dialog */}
      {routeMotel && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setRouteMotel(null)}>
          <div 
            className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Escolha o aplicativo</h3>
            <p className="text-gray-400 text-sm mb-4">{routeMotel.name}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => openGoogleMaps(routeMotel)}
                className="w-full bg-white hover:bg-gray-100 text-black"
              >
                <Map className="w-5 h-5 mr-3" />
                Google Maps
              </Button>
              <Button 
                onClick={() => openWaze(routeMotel)}
                className="w-full bg-[#33CCFF] hover:bg-[#2BB8E8] text-white"
              >
                <Navigation className="w-5 h-5 mr-3" />
                Waze
              </Button>
              <Button 
                onClick={() => setRouteMotel(null)}
                variant="outline"
                className="w-full border-[#333333] text-gray-400 hover:text-white"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Nossos <span className="text-[#FF0033]">Serviços</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="bg-[#121212] border-[#333333] hover:border-[#FF0033] transition-colors group">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-lg bg-[#FF0033]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FF0033]/30 transition-colors">
                      <Icon className="w-7 h-7 text-[#FF0033]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                    <a 
                      href={service.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF0033] text-sm font-medium hover:underline inline-flex items-center gap-1"
                    >
                      {service.link}
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
          <Button 
            onClick={() => setCurrentPage('entrar')}
            className="bg-[#FF0033] hover:bg-[#CC0029] text-white px-8 py-3 text-lg"
          >
            Cadastrar Meu Motel
          </Button>
        </div>
      </section>
    </>
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
      case 'sobre':
        return <AboutPage setCurrentPage={setCurrentPage} />;
      case 'entrar':
        return <LoginPage setCurrentPage={setCurrentPage} onLogin={handleLogin} />;
      case 'dashboard':
        return isAuthenticated ? <DashboardPage setCurrentPage={setCurrentPage} setSelectedMotel={setSelectedMotel} /> : <LoginPage setCurrentPage={setCurrentPage} onLogin={handleLogin} />;
      case 'admin':
        return isAuthenticated && user?.role === 'admin' ? <AdminPage setCurrentPage={setCurrentPage} setSelectedMotel={setSelectedMotel} /> : <LoginPage setCurrentPage={setCurrentPage} onLogin={handleLogin} />;
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
