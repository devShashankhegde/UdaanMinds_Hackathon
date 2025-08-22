export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'seller' | 'buyer' | 'both';
  location: {
    state: string;
    district: string;
    village: string;
  };
  profileImage?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  _id: string;
  userId: {
    _id: string;
    name: string;
    location: {
      state: string;
      district: string;
      village: string;
    };
  };
  title: string;
  question: string;
  category: 'farming' | 'pricing' | 'tools' | 'weather' | 'other';
  tags: string[];
  answers: Answer[];
  views: number;
  votes: number;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  answer: string;
  isAccepted: boolean;
  votes: number;
  createdAt: string;
}

export interface Listing {
  _id: string;
  sellerId: {
    _id: string;
    name: string;
    phone: string;
    location: {
      state: string;
      district: string;
      village: string;
    };
  };
  cropType: string;
  variety?: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton';
  quality: 'Grade A' | 'Grade B' | 'Grade C';
  expectedPrice: number;
  negotiable: boolean;
  images: string[];
  description?: string;
  harvestDate?: string;
  location: {
    state: string;
    district: string;
    village: string;
  };
  status: 'active' | 'sold' | 'expired' | 'removed';
  views: number;
  contactCount: number;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tool {
  _id: string;
  ownerId: {
    _id: string;
    name: string;
    phone: string;
    location: {
      state: string;
      district: string;
      village: string;
    };
  };
  toolName: string;
  category: 'tractor' | 'harvester' | 'plough' | 'sprayer' | 'other';
  toolType: 'rent' | 'sale';
  price: number;
  priceUnit: 'per_hour' | 'per_day' | 'total';
  description?: string;
  images: string[];
  condition: 'new' | 'good' | 'fair' | 'poor';
  availability: boolean;
  location: {
    state: string;
    district: string;
    village: string;
  };
  specifications: {
    brand?: string;
    model?: string;
    year?: number;
    power?: string;
  };
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  userType: 'seller' | 'buyer' | 'both';
  location: {
    state: string;
    district: string;
    village: string;
  };
}
