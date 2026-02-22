import { useEffect, useState } from 'react';

// Convex configuration
export const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';

// Check if Convex is configured
export const isConvexConfigured = !!convexUrl;

// Placeholder types for development
export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name?: string;
  image?: string;
  role: 'user' | 'owner' | 'admin';
  createdAt: number;
  updatedAt: number;
}

export interface Motel {
  _id: string;
  ownerId: string;
  name: string;
  description?: string;
  location: string;
  state: string;
  city: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  mainImage?: string;
  images?: string[];
  themes: string[];
  features?: string[];
  priceFrom?: number;
  priceTo?: number;
  rating?: number;
  reviewCount?: number;
  viewCount?: number;
  contactCount?: number;
  isPremium: boolean;
  premiumExpiresAt?: number;
  status: 'pending' | 'active' | 'paused' | 'rejected';
  createdAt: number;
  updatedAt: number;
  approvedAt?: number;
  approvedBy?: string;
}

// Sample data for demo mode
export const sampleMotels: Motel[] = [
  {
    _id: '1',
    ownerId: 'user1',
    name: 'Motel Secret Palace',
    description: 'Suítes temáticas exclusivas com equipamentos de alta qualidade.',
    location: 'São Paulo, SP - Zona Sul',
    state: 'São Paulo',
    city: 'São Paulo',
    phone: '(11) 99999-9999',
    whatsapp: '(11) 99999-9999',
    website: 'www.motelsecretpalace.com.br',
    mainImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    themes: ['BDSM', 'Fantasia', 'Luxo'],
    priceFrom: 180,
    rating: 4.8,
    reviewCount: 234,
    viewCount: 1200,
    contactCount: 45,
    isPremium: true,
    status: 'active',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now(),
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    _id: '2',
    ownerId: 'user2',
    name: 'Caverna do Prazer',
    description: 'Ambiente escuro e misterioso para suas fantasias.',
    location: 'Rio de Janeiro, RJ - Copacabana',
    state: 'Rio de Janeiro',
    city: 'Rio de Janeiro',
    phone: '(21) 99999-9999',
    whatsapp: '(21) 99999-9999',
    website: 'www.cavernadoprazer.com.br',
    mainImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
    themes: ['BDSM', 'Escuridão'],
    priceFrom: 150,
    rating: 4.6,
    reviewCount: 189,
    viewCount: 980,
    contactCount: 32,
    isPremium: false,
    status: 'active',
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now(),
    latitude: -22.9068,
    longitude: -43.1729,
  },
  {
    _id: '3',
    ownerId: 'user1',
    name: 'Dungeon Motel',
    description: 'Experiência medieval completa com masmorra equipada.',
    location: 'Belo Horizonte, MG - Centro',
    state: 'Minas Gerais',
    city: 'Belo Horizonte',
    phone: '(31) 99999-9999',
    whatsapp: '(31) 99999-9999',
    website: 'www.dungeonmotel.com.br',
    mainImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
    themes: ['BDSM', 'Medieval', 'Fantasia'],
    priceFrom: 200,
    rating: 4.9,
    reviewCount: 312,
    viewCount: 1500,
    contactCount: 67,
    isPremium: true,
    status: 'active',
    createdAt: Date.now() - 86400000 * 45,
    updatedAt: Date.now(),
    latitude: -19.9167,
    longitude: -43.9345,
  },
  {
    _id: '4',
    ownerId: 'user3',
    name: 'Dominium Dark',
    description: 'Ambiente completo para dominacao e submissao.',
    location: 'Curitiba, PR - Batel',
    state: 'Paraná',
    city: 'Curitiba',
    phone: '(41) 99999-9999',
    whatsapp: '(41) 99999-9999',
    website: 'www.dominiumdark.com.br',
    mainImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
    themes: ['BDSM', 'Dominação', 'Submissão'],
    priceFrom: 220,
    rating: 4.7,
    reviewCount: 156,
    viewCount: 890,
    contactCount: 28,
    isPremium: true,
    status: 'pending',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now(),
    latitude: -25.4284,
    longitude: -49.2733,
  },
];

export const sampleUsers: User[] = [
  {
    _id: 'user1',
    clerkId: 'clerk_user1',
    email: 'proprietario@motel.com.br',
    name: 'João Silva',
    role: 'owner',
    createdAt: Date.now() - 86400000 * 90,
    updatedAt: Date.now(),
  },
  {
    _id: 'user2',
    clerkId: 'clerk_user2',
    email: 'maria@email.com',
    name: 'Maria Santos',
    role: 'owner',
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now(),
  },
  {
    _id: 'admin1',
    clerkId: 'clerk_admin',
    email: 'admin@bdsmbrazil.com.br',
    name: 'Admin',
    role: 'admin',
    createdAt: Date.now() - 86400000 * 365,
    updatedAt: Date.now(),
  },
];

// Demo hook for motels
export function useMotels(filters?: {
  status?: Motel['status'];
  state?: string;
  isPremium?: boolean;
  searchQuery?: string;
}) {
  const [motels, setMotels] = useState<Motel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      let result = [...sampleMotels];

      if (filters?.status) {
        result = result.filter(m => m.status === filters.status);
      }
      if (filters?.state) {
        result = result.filter(m => m.state === filters.state);
      }
      if (filters?.isPremium !== undefined) {
        result = result.filter(m => m.isPremium === filters.isPremium);
      }
      if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        result = result.filter(m =>
          m.name.toLowerCase().includes(query) ||
          m.location.toLowerCase().includes(query) ||
          m.themes.some(t => t.toLowerCase().includes(query))
        );
      }

      setMotels(result);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters?.status, filters?.state, filters?.isPremium, filters?.searchQuery]);

  return { motels, loading };
}

// Demo hook for user motels
export function useUserMotels(ownerId: string) {
  const [motels, setMotels] = useState<Motel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMotels(sampleMotels.filter(m => m.ownerId === ownerId));
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [ownerId]);

  return { motels, loading };
}

// Demo hook for admin stats
export function useAdminStats() {
  const [stats, setStats] = useState({
    totalMotels: 0,
    activeMotels: 0,
    pendingMotels: 0,
    premiumMotels: 0,
    totalUsers: 0,
    owners: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalMotels: sampleMotels.length,
        activeMotels: sampleMotels.filter(m => m.status === 'active').length,
        pendingMotels: sampleMotels.filter(m => m.status === 'pending').length,
        premiumMotels: sampleMotels.filter(m => m.isPremium).length,
        totalUsers: sampleUsers.length,
        owners: sampleUsers.filter(u => u.role === 'owner').length,
      });
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return { stats, loading };
}

// Demo hook for owner stats
export function useOwnerStats(ownerId: string) {
  const [stats, setStats] = useState({
    motelCount: 0,
    totalViews: 0,
    totalContacts: 0,
    activeMotels: 0,
    pendingMotels: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const ownerMotels = sampleMotels.filter(m => m.ownerId === ownerId);
      setStats({
        motelCount: ownerMotels.length,
        totalViews: ownerMotels.reduce((sum, m) => sum + (m.viewCount || 0), 0),
        totalContacts: ownerMotels.reduce((sum, m) => sum + (m.contactCount || 0), 0),
        activeMotels: ownerMotels.filter(m => m.status === 'active').length,
        pendingMotels: ownerMotels.filter(m => m.status === 'pending').length,
      });
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [ownerId]);

  return { stats, loading };
}
