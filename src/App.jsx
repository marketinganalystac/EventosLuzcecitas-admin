import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  Package, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  AlertTriangle,
  Box,
  PartyPopper,
  Sparkles,
  Truck,
  Bell,
  Lock,
  Printer,
  ExternalLink,
  MessageCircle,
  CheckSquare,
  LogIn,
  UserPlus,
  Search,
  ArrowRightCircle,
  Briefcase,
  Layers,
  ShoppingBag,
  CreditCard
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithCustomToken, 
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  query,
  where,
  getDocs
} from "firebase/firestore";

// --- CONFIGURACIÓN FIREBASE (DINÁMICA) ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "AIzaSyCNGCfGuqiLI_EIoG98yguRZdbNcGyVDIw",
      authDomain: "eventosluzcecitas-9fd22.firebaseapp.com",
      projectId: "eventosluzcecitas-9fd22",
      storageBucket: "eventosluzcecitas-9fd22.firebasestorage.app",
      messagingSenderId: "41381954314",
      appId: "1:41381954314:web:515148719c1e6fa43eb0f3",
      measurementId: "G-2K5WD7P8CT"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'luzcecitas-app';

// --- LOGO CONFIG ---
const LOGO_URL = "Logo.png"; 

// --- HELPERS ---
const openWhatsApp = (phone) => {
  if (!phone) return;
  const cleanPhone = phone.replace(/\D/g, '');
  window.open(`https://wa.me/${cleanPhone}`, '_blank');
};

const openMaps = (address) => {
  if (!address) return;
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
};

const getLocalDate = (dateString) => {
  if (!dateString) return new Date();
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const getTodayString = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d.getTime() - offset);
    return localDate.toISOString().split('T')[0];
};

// --- UI COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-lg border-2 border-purple-50 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = "primary", className = "", type = "button", disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-95 shadow-md";
  const variants = {
    primary: "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-pink-200",
    secondary: "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    success: "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100",
    outline: "border-2 border-white text-white hover:bg-white/20"
  };
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, className = "", ...props }) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-bold text-purple-900 mb-1">{label}</label>
    <input
      className="w-full px-4 py-2 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-purple-50/30"
      {...props}
    />
  </div>
);

const Select = ({ label, options, className = "", ...props }) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-bold text-purple-900 mb-1">{label}</label>
    <select
      className="w-full px-4 py-2 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all"
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// --- COMPONENTE FONDO DE FUEGOS ARTIFICIALES ---
const FireworksBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    let animationId;

    const brandColors = [
      { h: 270, s: 100, l: 60 },
      { h: 330, s: 100, l: 60 },
      { h: 45, s: 100, l: 60 },
      { h: 190, s: 100, l: 60 }
    ];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;
        this.friction = 0.96;
        this.gravity = 0.05;
        const color = brandColors[Math.floor(Math.random() * brandColors.length)];
        this.hue = color.h + (Math.random() * 20 - 10);
        this.sat = color.s;
        this.light = color.l;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
        this.size = Math.random() * 3 + 1;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${this.alpha * 0.2})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${this.alpha})`;
        ctx.fill();
      }
    }

    const createExplosion = (x, y, isBig = false) => {
      let count = isBig ? 60 : 15;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y));
      }
    };

    const loop = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      let i = particles.length;
      while (i--) {
        const p = particles[i];
        p.update();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      animationId = requestAnimationFrame(loop);
    };

    const handleInteraction = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      createExplosion(x, y, e.type === 'mousedown' || e.type === 'touchstart');
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction, { passive: false });
    setTimeout(() => createExplosion(width/2, height/2, true), 500);

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-0 pointer-events-auto mix-blend-screen"
    />
  );
};

// --- LOGIN SCREEN COMPONENT ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Error login:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
         setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/too-many-requests') {
         setError('Demasiados intentos. Intenta más tarde.');
      } else {
         setError('Error al iniciar sesión. Verifica tu conexión.');
      }
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a103c] via-[#2e1a47] to-[#0a0514] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FireworksBackground />
      <div className="absolute top-8 left-8 z-10 pointer-events-none hidden md:block">
        <h1 className="m-0 font-light tracking-[4px] uppercase text-2xl text-white/90 drop-shadow-md">
          
        </h1>
        <p className="text-purple-200/60 text-sm mt-1"></p>
      </div>

      <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
          <div className="mb-6 relative text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-rose-400 to-purple-600 rounded-full flex items-center justify-center p-1 shadow-2xl mx-auto animate-bounce-slow mb-4">
               <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
                  <img src={LOGO_URL} alt="Logo" className="w-20 h-20 object-contain" />
               </div>
            </div>
            
            <h1 className="text-xl font-black text-white tracking-tight">
              Plataforma de Gestión<br/>
              <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-rose-300">
                Eventos Luzcecitas
              </span>
            </h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-purple-200 text-xs font-bold mb-1 ml-1">CORREO ELECTRÓNICO</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@luzcecitas.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-900/50 border border-purple-500/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                  required
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-purple-300" />
              </div>
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-bold mb-1 ml-1">CONTRASEÑA</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-900/50 border border-purple-500/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                  required
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-purple-300" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-200 flex-shrink-0" />
                <p className="text-xs text-red-100 font-medium">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full group relative px-8 py-3 bg-gradient-to-r from-rose-500 to-purple-600 rounded-xl font-bold text-white text-base shadow-lg shadow-purple-900/50 hover:shadow-rose-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <span className="relative flex items-center justify-center gap-2">
                {isLoggingIn ? (
                  <>Verificando... <Sparkles className="w-4 h-4 animate-pulse" /></>
                ) : (
                  <>
                    Iniciar Sesión <LogIn className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] text-purple-300/40">
             Acceso restringido • Sistema de Gestión V.1.0
          </p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data States
  const [clients, setClients] = useState([]);
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Modals & Alerts
  const [showEventModal, setShowEventModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false); 
  const [showLogisticsModal, setShowLogisticsModal] = useState(false);
  const [urgentAlerts, setUrgentAlerts] = useState([]); 
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  
  // Editing States
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingOrderEvent, setViewingOrderEvent] = useState(null); 

  useEffect(() => {
    const setFavicon = (url) => {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = url;
    };
    
    setFavicon(LOGO_URL);
    document.title = "Eventos Luzcecitas | Gestión";
  }, []);

  // --- AUTH & DATA SYNC ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (error) {
        console.error("Error en autenticación inicial:", error);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    const basePath = ['artifacts', appId, 'users', user.uid];
    
    const unsubClients = onSnapshot(collection(db, ...basePath, 'clients'), (snapshot) => {
      setClients(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => console.error("Error fetching clients:", error));

    const unsubEvents = onSnapshot(collection(db, ...basePath, 'events'), (snapshot) => {
      const eventsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setEvents(eventsData);
    }, (error) => console.error("Error fetching events:", error));

    const unsubTransactions = onSnapshot(collection(db, ...basePath, 'transactions'), (snapshot) => {
      setTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => console.error("Error fetching transactions:", error));

    const unsubInventory = onSnapshot(collection(db, ...basePath, 'inventory'), (snapshot) => {
      setInventory(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => console.error("Error fetching inventory:", error));

    return () => {
      unsubClients();
      unsubEvents();
      unsubTransactions();
      unsubInventory();
    };
  }, [user]);

  // --- URGENT ALERTS CHECKER ---
  useEffect(() => {
    if (events.length > 0 && user) {
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const inThreeDays = new Date();
      inThreeDays.setDate(today.getDate() + 3);
      inThreeDays.setHours(23,59,59,999);

      const imminentEvents = events.filter(e => {
        const localEventDate = getLocalDate(e.date);
        return localEventDate >= today && localEventDate <= inThreeDays && e.status !== 'completado' && e.status !== 'cancelado';
      });

      if (imminentEvents.length > 0) {
        setUrgentAlerts(imminentEvents);
        setShowUrgentModal(true);
      }
    }
  }, [events, user]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return events
      .filter(e => getLocalDate(e.date) >= today)
      .sort((a, b) => getLocalDate(a.date) - getLocalDate(b.date));
  }, [events]);

  const financialStats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let transportExpenses = 0;
    let receivables = 0; // Cuentas por cobrar

    transactions.forEach(t => {
      const amount = Number(t.amount);
      if (t.type === 'income') income += amount;
      if (t.type === 'expense') {
        expenses += amount;
        if (t.category === 'Transporte') {
          transportExpenses += amount;
        }
      }
    });

    events.forEach(e => {
      if (e.status !== 'cancelado') {
        const debt = (e.totalCost || 0) - (e.deposit || 0);
        if (debt > 0) receivables += debt;
      }
    });

    return { income, expenses, profit: income - expenses, transportExpenses, receivables };
  }, [transactions, events]);

  const getUsedQuantityOnDate = (date, itemId, excludeEventId = null) => {
    if (!date) return 0;
    const eventsOnDate = events.filter(e => e.date === date && e.id !== excludeEventId && e.status !== 'cancelado');
    
    let used = 0;
    eventsOnDate.forEach(e => {
      if (e.customItems && e.customItems[itemId]) used += e.customItems[itemId];
    });
    return used;
  };

  // --- HANDLERS ---

  const handleInitializeInventory = async () => {
    if (!user) return;
    const itemsToAdd = [
      { name: "Silla Plástica", type: "retornable", unit: "Unidades", totalQuantity: 50 },
      { name: "Mesa Rectangular", type: "retornable", unit: "Unidades", totalQuantity: 10 },
      { name: "Mesa Redonda", type: "retornable", unit: "Unidades", totalQuantity: 10 },
      { name: "Maíz Pira (Bolsa 1kg)", type: "consumible", unit: "Kg", totalQuantity: 20 },
      { name: "Aceite Cocina (Litro)", type: "consumible", unit: "L", totalQuantity: 10 },
      { name: "Sal de Millo", type: "consumible", unit: "Kg", totalQuantity: 5 },
      { name: "Bolsas de Papel Millos (Paq 50)", type: "consumible", unit: "Paq", totalQuantity: 30 },
      { name: "Azúcar (Kg)", type: "consumible", unit: "Kg", totalQuantity: 20 },
      { name: "Palitos Algodón (Paq 100)", type: "consumible", unit: "Paq", totalQuantity: 10 },
      { name: "Colorante Algodón", type: "consumible", unit: "Frasco", totalQuantity: 5 },
      { name: "Sirope (Sabor Variado)", type: "consumible", unit: "Litro", totalQuantity: 10 },
      { name: "Vasos Raspado (Paq 50)", type: "consumible", unit: "Paq", totalQuantity: 20 },
      { name: "Cucharas Plásticas", type: "consumible", unit: "Caja", totalQuantity: 5 },
      { name: "Leche Condensada", type: "consumible", unit: "Lata", totalQuantity: 10 },
      { name: "Hielo (Bolsa)", type: "consumible", unit: "Bolsa", totalQuantity: 0 }
    ];

    try {
      const batchPromises = itemsToAdd.map(async (item) => {
        // Simple check based on name to avoid duplicates
        const exists = inventory.some(inv => inv.name.toLowerCase() === item.name.toLowerCase());
        if (!exists) {
           await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'inventory'), {
             ...item,
             minStock: 5,
             updatedAt: serverTimestamp()
           });
        }
      });
      await Promise.all(batchPromises);
      alert("¡Inventario base cargado con éxito! Revisa las cantidades.");
    } catch (error) {
      console.error("Error initializing inventory:", error);
    }
  };

  const handleSaveInventory = async (e) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      totalQuantity: Number(formData.get('totalQuantity')),
      type: formData.get('type'),
      unit: formData.get('unit'),
      minStock: Number(formData.get('minStock') || 0),
      updatedAt: serverTimestamp()
    };

    try {
      if (editingItem) {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'inventory', editingItem.id), data);
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'inventory'), data);
      }
      setShowInventoryModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving inventory:", error);
    }
  };

  const handleSaveClient = async (e) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      status: formData.get('status'), // Nuevo campo status en lugar de type
      address: formData.get('address'),
      createdAt: serverTimestamp()
    };

    try {
      if (editingClient) {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'clients', editingClient.id), data);
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'clients'), data);
      }
      setShowClientModal(false);
      setEditingClient(null);
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target);
    
    let clientId = formData.get('clientId');
    let clientName = '';
    const isNewClientMode = formData.get('isNewClient') === 'on';

    try {
      if (isNewClientMode) {
        const newClientData = {
          name: formData.get('newClientName'),
          phone: formData.get('newClientPhone'),
          address: formData.get('address'),
          status: 'facturado', // Asumimos cliente nuevo como facturado si se crea desde evento
          createdAt: serverTimestamp()
        };
        const clientRef = await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'clients'), newClientData);
        clientId = clientRef.id;
        clientName = newClientData.name;
      } else {
        const selectedClient = clients.find(c => c.id === clientId);
        clientName = selectedClient?.name || 'Desconocido';
      }

      // Collect all inventory inputs dynamically
      const customItems = {};
      
      // Iterate over all form keys to find inventory items
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('inv_')) {
          const quantity = Number(value);
          if (quantity > 0) {
            const itemId = key.replace('inv_', '');
            customItems[itemId] = quantity;
          }
        }
      }

      const totalCost = Number(formData.get('totalCost') || 0);
      const deposit = Number(formData.get('deposit') || 0);

      const data = {
        title: formData.get('title'),
        date: formData.get('date'),
        time: formData.get('time'),
        clientId: clientId,
        clientName: clientName,
        address: formData.get('address'),
        status: formData.get('status'),
        // Services toggles
        services: {
          millos: formData.get('service_millos') === 'on',
          algodon: formData.get('service_algodon') === 'on',
          raspados: formData.get('service_raspados') === 'on',
          equipos: formData.get('service_equipos') === 'on', // Nuevo servicio opcional
        },
        customItems: customItems,
        totalCost: totalCost,
        deposit: deposit,
        balance: totalCost - deposit,
        logistics: {
          loaded: formData.get('logistics_loaded') === 'on',
          delivered: formData.get('logistics_delivered') === 'on',
          pickedUp: formData.get('logistics_pickedUp') === 'on',
        },
        createdAt: serverTimestamp()
      };

      if (editingEvent) {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'events', editingEvent.id), data);
      } else {
        const docRef = await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'events'), data);
        
        if (deposit > 0) {
           await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'), {
             type: 'income',
             amount: deposit,
             description: `Abono Evento: ${data.title}`,
             date: data.date,
             eventId: docRef.id,
             category: 'Servicios'
           });
        }
      }
      setShowEventModal(false);
      setEditingEvent(null);

    } catch (error) {
      console.error("Error saving event/client:", error);
    }
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target);
    const data = {
      type: formData.get('type'),
      amount: Number(formData.get('amount')),
      description: formData.get('description'),
      date: formData.get('date'),
      category: formData.get('category'),
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'), data);
      setShowTransactionModal(false);
    } catch (error) {
      console.error("Error saving transaction", error);
    }
  };

  const deleteItem = async (collectionName, id) => {
    if (!user) return;
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, collectionName, id));
    }
  };

  // --- VIEWS ---

  const InventoryView = () => {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-rose-500" /> Inventario de Fiesta
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleInitializeInventory} className="text-xs">
              ⚡ Cargar Insumos Base
            </Button>
            <Button onClick={() => { setEditingItem(null); setShowInventoryModal(true); }}>
              <Plus className="w-4 h-4" /> Nuevo Item
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-t-4 border-t-rose-400">
            <h4 className="font-bold text-purple-800 mb-4 flex items-center gap-2 text-lg">
              <Package className="w-5 h-5 text-rose-500" /> Equipos (Retornables)
            </h4>
            <div className="space-y-3">
              {inventory.filter(i => i.type === 'retornable').length === 0 && <p className="text-sm text-gray-500 italic">No hay equipos registrados (ej. Mesas, Sillas).</p>}
              {inventory.filter(i => i.type === 'retornable').map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
                  <div>
                    <div className="font-bold text-purple-900">{item.name}</div>
                    <div className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full inline-block mt-1">
                      Stock: {item.totalQuantity} {item.unit}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(item); setShowInventoryModal(true); }} className="text-purple-300 hover:text-purple-600"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => deleteItem('inventory', item.id)} className="text-purple-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-t-4 border-t-orange-400">
            <h4 className="font-bold text-purple-800 mb-4 flex items-center gap-2 text-lg">
              <Box className="w-5 h-5 text-orange-500" /> Materia Prima / Combos
            </h4>
            <div className="space-y-3">
              {inventory.filter(i => i.type === 'consumible' || i.type === 'combo').length === 0 && <p className="text-sm text-gray-500 italic">No hay materia prima registrada.</p>}
              {inventory.filter(i => i.type === 'consumible' || i.type === 'combo').map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-100 hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{item.name}</span>
                        {item.type === 'combo' && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1 rounded border border-indigo-200">COMBO</span>}
                    </div>
                    <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block font-bold ${item.totalQuantity <= item.minStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {item.totalQuantity} {item.unit}
                      {item.totalQuantity <= item.minStock && " (Bajo)"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(item); setShowInventoryModal(true); }} className="text-gray-400 hover:text-indigo-600"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => deleteItem('inventory', item.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold text-purple-900">Resumen General</h2>
        <div className="flex gap-2">
           <Button onClick={() => setShowLogisticsModal(true)} variant="secondary" className="shadow-sm">
              <Truck className="w-5 h-5"/> Logística Diaria
           </Button>
           <Button onClick={() => { setEditingEvent(null); setShowEventModal(true); }} className="shadow-rose-300">
              <Plus className="w-5 h-5"/> Crear Celebración
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Colorful Gradient Cards */}
        <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white border-none shadow-purple-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 mb-1 font-medium">Ingresos Totales</p>
              <h2 className="text-4xl font-extrabold text-white drop-shadow-sm">${financialStats.income.toFixed(2)}</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
               <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-pink-500 to-rose-500 text-white border-none shadow-pink-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-pink-100 mb-1 font-medium">Eventos por Realizar</p>
              <h2 className="text-4xl font-extrabold text-white drop-shadow-sm">
                {events.filter(e => e.status === 'pendiente' || e.status === 'confirmado').length}
              </h2>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <PartyPopper className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-none shadow-orange-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 mb-1 font-medium">Por Cobrar</p>
              <h2 className="text-4xl font-extrabold text-white drop-shadow-sm">
                ${financialStats.receivables.toFixed(2)}
              </h2>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
               <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" /> Próximas Celebraciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic">¡La agenda está libre! Es hora de buscar más fiestas.</p>
              <Button variant="secondary" onClick={() => setShowEventModal(true)} className="mt-4 mx-auto">
                <Plus className="w-4 h-4"/> Agendar Primera Fiesta
              </Button>
            </div>
          ) : (
            upcomingEvents.slice(0, 3).map(event => {
              const client = clients.find(c => c.id === event.clientId);
              const visualDate = getLocalDate(event.date);
              const pendingBalance = event.totalCost - (event.deposit || 0);

              return (
                <div key={event.id} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative group">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-purple-900 text-lg truncate pr-2">{event.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider flex-shrink-0 ${
                      event.status === 'confirmado' ? 'bg-green-100 text-green-700' : 
                      event.status === 'pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-rose-400" /> {visualDate.toLocaleDateString()}
                    <span className="text-gray-300">|</span> 
                    {event.time}
                  </p>
                  
                  <div className="mb-3">
                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                       <MapPin className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" /> 
                       <span className="leading-tight truncate">{event.address}</span>
                    </div>
                  </div>

                  {/* Payment Status Bar */}
                  <div className="mb-4 bg-gray-50 rounded-lg p-2 border border-gray-100">
                     <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold text-gray-500">Estado de Pago</span>
                        <span className={`text-xs font-bold ${pendingBalance > 0 ? 'text-rose-500' : 'text-green-600'}`}>
                           {pendingBalance > 0 ? `Deben: $${pendingBalance}` : '¡Pagado!'}
                        </span>
                     </div>
                     <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                           className={`h-full ${pendingBalance <= 0 ? 'bg-green-500' : 'bg-yellow-400'}`} 
                           style={{ width: `${Math.min(100, ((event.deposit || 0) / event.totalCost) * 100)}%` }}
                        ></div>
                     </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="border-t border-purple-50 pt-3 flex justify-between items-center opacity-100">
                    <button 
                      onClick={() => { setViewingOrderEvent(event); setShowOrderModal(true); }}
                      className="text-xs flex items-center gap-1 font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2 py-1.5 rounded-lg transition-colors"
                    >
                      <Printer className="w-3 h-3" /> Orden
                    </button>
                    <button 
                      onClick={() => { setEditingEvent(event); setShowEventModal(true); }}
                      className="text-xs flex items-center gap-1 font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-2 py-1.5 rounded-lg transition-colors"
                    >
                      <Edit className="w-3 h-3" /> Editar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    // Fix: Comparación de fechas segura con getLocalDate
    const monthEvents = events.filter(e => {
      const d = getLocalDate(e.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });

    const changeMonth = (delta) => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };

    const getDayEvents = (day) => {
      return monthEvents.filter(e => getLocalDate(e.date).getDate() === day);
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-4 bg-purple-50 border-b border-purple-100">
          <h2 className="text-xl font-bold text-purple-900 capitalize flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-rose-500"/>
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => changeMonth(-1)}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="secondary" onClick={() => changeMonth(1)}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 text-center bg-purple-50/50 border-b border-purple-100 text-xs font-bold text-purple-400 py-3 uppercase tracking-wider">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 auto-rows-fr bg-white">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-32 border-b border-r border-gray-50 bg-gray-50/30"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getDayEvents(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

            return (
              <div key={day} className={`h-32 border-b border-r border-gray-50 p-1 hover:bg-purple-50 transition-colors relative group ${isToday ? 'bg-purple-50/30' : ''}`}>
                <span className={`text-xs font-bold ml-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-rose-500 text-white' : 'text-gray-400'}`}>
                    {day}
                </span>
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[90px] px-1">
                  {dayEvents.map(e => (
                    <div 
                      key={e.id} 
                      onClick={() => { setEditingEvent(e); setShowEventModal(true); }}
                      className={`text-[10px] p-1.5 rounded-md truncate cursor-pointer font-medium border-l-2 shadow-sm ${
                        e.status === 'confirmado' ? 'bg-green-50 text-green-700 border-green-400' : 'bg-amber-50 text-amber-800 border-amber-400'
                      }`}
                    >
                      {e.time} {e.clientName}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => {
                     setEditingEvent(null);
                     // Hack para pre-llenar fecha en modal
                     setTimeout(() => {
                       const year = currentDate.getFullYear();
                       const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                       const dayStr = String(day).padStart(2, '0');
                       const dateStr = `${year}-${month}-${dayStr}`;
                       
                       const dateInput = document.querySelector('input[name="date"]');
                       if (dateInput) { 
                           dateInput.value = dateStr;
                           const event = new Event('input', { bubbles: true });
                           dateInput.dispatchEvent(event);
                       }
                     }, 100);
                     setShowEventModal(true);
                  }}
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-rose-500 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-600 transition-all hover:scale-110"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ClientsView = () => {
    const [filter, setFilter] = useState('todos');
    
    // Filtro simplificado: Todos, Cliente (Facturado), Solo Cotizando
    const filteredClients = clients.filter(c => {
      if (filter === 'todos') return true;
      if (filter === 'facturado') return c.status === 'facturado' || c.type === 'cliente'; // soporte legacy type
      if (filter === 'cotizando') return c.status === 'cotizando' || c.type === 'prospecto'; // soporte legacy type
      return true;
    });

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-purple-100 shadow-sm">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'facturado', label: 'Facturados' },
              { id: 'cotizando', label: 'Solo Cotizando' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  filter === f.id ? 'bg-purple-100 text-purple-700 shadow-sm' : 'text-gray-400 hover:text-purple-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Button onClick={() => { setEditingClient(null); setShowClientModal(true); }}>
            <Plus className="w-4 h-4" /> Nuevo Cliente
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-purple-50 border-b border-purple-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{client.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex flex-col gap-1">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-rose-400"/> {client.phone}</span>
                        {client.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-rose-400"/> {client.email}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                        client.status === 'facturado' || client.type === 'cliente' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {client.status === 'facturado' || client.type === 'cliente' ? 'Facturado' : 'Cotizando'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[200px]">
                      {client.address || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openWhatsApp(client.phone)}
                          className="p-1.5 rounded-lg text-green-500 hover:text-green-700 hover:bg-green-50 transition-all border border-transparent hover:border-green-200"
                          title="Abrir WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setEditingClient(client); setShowClientModal(true); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-100 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteItem('clients', client.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const AccountingView = () => {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-emerald-50 border-emerald-100">
            <p className="text-emerald-600 font-bold mb-1">Ingresos Reales</p>
            <h2 className="text-2xl font-extrabold text-emerald-700 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> ${financialStats.income.toFixed(2)}
            </h2>
          </Card>
          <Card className="bg-red-50 border-red-100">
            <p className="text-red-600 font-bold mb-1">Gastos Totales</p>
            <h2 className="text-2xl font-extrabold text-red-700 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" /> ${financialStats.expenses.toFixed(2)}
            </h2>
          </Card>
           <Card className="bg-orange-50 border-orange-100">
            <p className="text-orange-600 font-bold mb-1">Cuentas por Cobrar</p>
            <h2 className="text-2xl font-extrabold text-orange-700 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> ${financialStats.receivables.toFixed(2)}
            </h2>
          </Card>
          <Card className="bg-purple-50 border-purple-100">
            <p className="text-purple-600 font-bold mb-1">Ganancia Neta</p>
            <h2 className="text-2xl font-extrabold text-purple-700">
              ${financialStats.profit.toFixed(2)}
            </h2>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-purple-900">Historial de Transacciones</h3>
          <Button onClick={() => setShowTransactionModal(true)} variant="primary">
             <Plus className="w-4 h-4" /> Registrar Movimiento
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-purple-50 border-b border-purple-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider text-right">Monto</th>
                <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions
                .sort((a,b) => new Date(b.date) - new Date(a.date))
                .map(t => (
                <tr key={t.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{t.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">{t.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium border ${
                      t.category === 'Transporte' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                      'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-extrabold text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteItem('transactions', t.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --- MODALS ---

  const Modal = ({ isOpen, onClose, title, children, urgent = false }) => {
    if (!isOpen) return null;
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${urgent ? 'bg-red-900/60' : 'bg-purple-900/60'} backdrop-blur-sm`}>
        <div className={`bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 border ${urgent ? 'border-red-200 ring-4 ring-red-100' : 'border-purple-100'}`}>
          <div className={`p-5 border-b flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10 ${urgent ? 'border-red-100' : 'border-purple-50'}`}>
            <h3 className={`text-xl font-extrabold ${urgent ? 'text-red-600 flex items-center gap-2' : 'text-purple-900'}`}>
              {urgent && <AlertTriangle className="w-6 h-6" />}
              {title}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const LogisticsModalContent = () => {
    const [logisticsDate, setLogisticsDate] = useState(getTodayString());

    const eventsForDate = events.filter(e => e.date === logisticsDate && e.status !== 'cancelado');
    
    // Aggregate items
    const summary = {};
    eventsForDate.forEach(e => {
        if(e.customItems) {
            Object.entries(e.customItems).forEach(([itemId, qty]) => {
                const item = inventory.find(i => i.id === itemId);
                const itemName = item ? item.name : 'Item Desconocido';
                summary[itemName] = (summary[itemName] || 0) + qty;
            });
        }
        if(e.services?.millos) summary['Máq. Millos'] = (summary['Máq. Millos'] || 0) + 1;
        if(e.services?.algodon) summary['Máq. Algodón'] = (summary['Máq. Algodón'] || 0) + 1;
        if(e.services?.raspados) summary['Máq. Raspados'] = (summary['Máq. Raspados'] || 0) + 1;
    });

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <Input 
                   name="logisticsDate" 
                   label="Seleccionar Fecha de Ruta" 
                   type="date" 
                   value={logisticsDate} 
                   onChange={(e) => setLogisticsDate(e.target.value)} 
                />
                <p className="text-sm text-blue-600 text-center font-bold">
                    {eventsForDate.length} Eventos programados para este día.
                </p>
            </div>

            {eventsForDate.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Lista Agregada (Warehouse Pick List) */}
                    <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                        <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2 border-b pb-2">
                           <Layers className="w-4 h-4"/> Total Carga (Bodega)
                        </h4>
                        <ul className="space-y-2">
                            {Object.entries(summary).map(([name, qty]) => (
                                <li key={name} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{name}</span>
                                    <span className="font-bold text-purple-700 bg-purple-50 px-2 rounded-md">{qty}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Detalle por Evento */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        <h4 className="font-bold text-gray-700 mb-2 text-sm">Detalle de Ruta</h4>
                        {eventsForDate.map(e => (
                             <div key={e.id} className="bg-gray-50 p-3 rounded-lg text-xs border border-gray-100">
                                 <div className="font-bold text-purple-800">{e.time} - {e.title}</div>
                                 <div className="text-gray-500 mb-1">{e.address}</div>
                                 <div className="flex gap-1 flex-wrap">
                                     {e.logistics?.loaded ? <span className="bg-green-100 text-green-700 px-1 rounded">Cargado</span> : <span className="bg-red-100 text-red-700 px-1 rounded">Pendiente Carga</span>}
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400">
                    <p>No hay eventos registrados para esta fecha.</p>
                </div>
            )}
        </div>
    );
  };

  const EventFormContent = () => {
    // FIX: Estado para controlar modo de creación de cliente
    const [isNewClient, setIsNewClient] = useState(false);
    const [selectedDate, setSelectedDate] = useState(editingEvent?.date || getTodayString());
    const [selectedClientId, setSelectedClientId] = useState(editingEvent?.clientId || '');
    const [duplicateClient, setDuplicateClient] = useState(null);
    const [totalCost, setTotalCost] = useState(editingEvent?.totalCost || 0);
    const [deposit, setDeposit] = useState(editingEvent?.deposit || 0);
    
    // Service Toggles State
    const [showMillos, setShowMillos] = useState(editingEvent?.services?.millos || false);
    const [showAlgodon, setShowAlgodon] = useState(editingEvent?.services?.algodon || false);
    const [showRaspados, setShowRaspados] = useState(editingEvent?.services?.raspados || false);
    const [showEquipos, setShowEquipos] = useState(editingEvent?.services?.equipos || false);

    const balance = totalCost - deposit;

    const handleDateChange = (e) => setSelectedDate(e.target.value);
    
    const handlePhoneChange = (e) => {
        const val = e.target.value;
        if (val.length > 5) { 
             const cleanVal = val.replace(/\D/g, '');
             const match = clients.find(c => c.phone && c.phone.replace(/\D/g, '').includes(cleanVal));
             setDuplicateClient(match || null);
        } else {
             setDuplicateClient(null);
        }
    };

    const handleUseExisting = () => {
        if (duplicateClient) {
            setSelectedClientId(duplicateClient.id);
            setIsNewClient(false);
            setDuplicateClient(null);
        }
    };
    
    const client = clients.find(c => c.id === editingEvent?.clientId);

    // --- SUB-COMPONENT FOR RESOURCE SELECTION ---
    const ResourceSelector = ({ title, keywords, typeFilter }) => {
        const relevantItems = inventory.filter(item => {
            if (typeFilter && item.type !== typeFilter) return false;
            if (!keywords || keywords.length === 0) return true;
            const nameLower = item.name.toLowerCase();
            return keywords.some(k => nameLower.includes(k));
        });

        // Add a "Show All Consumables" fallback if strict keyword filtering yields nothing but we want to allow choices
        const displayItems = relevantItems.length > 0 ? relevantItems : inventory.filter(i => i.type === 'consumible');

        if (displayItems.length === 0) return <p className="text-xs text-gray-400 italic p-2">No hay insumos disponibles. Ve a inventario y carga insumos base.</p>;

        return (
            <div className="mt-2 bg-purple-50/50 p-3 rounded-lg border border-purple-100 animate-in fade-in slide-in-from-top-1">
                <p className="text-xs font-bold text-purple-800 mb-2 flex items-center gap-1">
                   <Box className="w-3 h-3"/> Materia Prima del Stock:
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {displayItems.map(item => {
                        const currentVal = editingEvent?.customItems?.[item.id] || 0;
                        const available = item.totalQuantity; // Simplified view
                        return (
                            <div key={item.id} className="flex justify-between items-center text-sm gap-2">
                                <span className="text-gray-600 truncate flex-1" title={item.name}>{item.name}</span>
                                <div className="flex items-center gap-1">
                                    <input 
                                        type="number" 
                                        name={`inv_${item.id}`} 
                                        defaultValue={currentVal} 
                                        min="0"
                                        className="w-16 p-1 border rounded text-right text-xs" 
                                        placeholder="0"
                                    />
                                    <span className="text-[10px] text-gray-400 w-8 text-right">{item.unit}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
      <form onSubmit={handleSaveEvent} className="space-y-4">
        {/* Actions Header in Edit Mode */}
        {editingEvent && (
           <div className="flex gap-2 mb-4">
              <button type="button" onClick={() => { setViewingOrderEvent(editingEvent); setShowOrderModal(true); }} className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-200">
                 <Printer className="w-4 h-4" /> Ver Orden de Servicio
              </button>
              {client && client.phone && (
                 <button type="button" onClick={() => openWhatsApp(client.phone)} className="flex-1 bg-green-100 text-green-700 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-200">
                    <MessageCircle className="w-4 h-4" /> Chat Cliente
                 </button>
              )}
           </div>
        )}

        <Input name="title" label="Título del Evento" placeholder="Ej. Cumpleaños Juan" defaultValue={editingEvent?.title} required />
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            name="date" 
            label="Fecha" 
            type="date" 
            value={selectedDate} 
            onChange={handleDateChange}
            required 
          />
          <Input name="time" label="Hora" type="time" defaultValue={editingEvent?.time} required />
        </div>
        
        {/* Cliente Selection Logic */}
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 mb-4 transition-all">
           <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-purple-900 flex items-center gap-2">
                 <Users className="w-4 h-4"/> Datos del Cliente
              </label>
              
              {!isNewClient ? (
                 <button 
                   type="button" 
                   onClick={() => setIsNewClient(true)}
                   className="text-xs bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg font-bold hover:bg-rose-200 flex items-center gap-1 transition-colors"
                 >
                    <UserPlus className="w-3 h-3"/> Crear Nuevo
                 </button>
              ) : (
                 <button 
                   type="button" 
                   onClick={() => { setIsNewClient(false); setDuplicateClient(null); }}
                   className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                 >
                    Cancelar
                 </button>
              )}
              
              <input type="hidden" name="isNewClient" value={isNewClient ? 'on' : 'off'} />
           </div>

           {isNewClient ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 bg-white p-3 rounded-lg border border-rose-100 shadow-inner">
                 <Input name="newClientName" label="Nombre Cliente Nuevo" placeholder="Nombre completo" required />
                 
                 <div className="relative">
                    <Input 
                        name="newClientPhone" 
                        label="Teléfono (Detecta Duplicados)" 
                        placeholder="Celular" 
                        onChange={handlePhoneChange}
                        required 
                    />
                    
                    {/* ALERT BOX FOR DUPLICATE */}
                    {duplicateClient && (
                        <div className="absolute top-16 left-0 right-0 z-10 animate-in zoom-in duration-200">
                             <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-lg flex items-center justify-between gap-3">
                                 <div>
                                     <p className="text-xs font-bold text-amber-800 flex items-center gap-1">
                                         <AlertTriangle className="w-3 h-3"/> ¡Cliente encontrado!
                                     </p>
                                     <p className="text-xs text-amber-700">
                                         {duplicateClient.name} ya está registrado con este número.
                                     </p>
                                 </div>
                                 <button 
                                    type="button"
                                    onClick={handleUseExisting}
                                    className="bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs px-3 py-2 rounded-lg font-bold flex-shrink-0 flex items-center gap-1"
                                 >
                                    Usar este <ArrowRightCircle className="w-3 h-3"/>
                                 </button>
                             </div>
                        </div>
                    )}
                 </div>
                 
                 <p className="text-xs text-gray-400 italic text-center pt-2">* Se guardará automáticamente en la lista de clientes</p>
              </div>
           ) : (
              <div className="animate-in fade-in">
                  <Select 
                    name="clientId" 
                    label="Seleccionar Cliente Existente" 
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    options={[
                      { value: '', label: 'Seleccionar Cliente...' },
                      ...clients.map(c => ({ value: c.id, label: c.name }))
                    ]} 
                    required={!isNewClient}
                  />
               </div>
           )}
        </div>

        <div className="relative">
           <Input name="address" label="Dirección del Evento" placeholder="Lugar de la fiesta" defaultValue={editingEvent?.address} required />
           {editingEvent?.address && (
              <button type="button" onClick={() => openMaps(editingEvent.address)} className="absolute top-8 right-2 p-1 bg-gray-100 rounded text-gray-500 hover:text-rose-500">
                 <MapPin className="w-4 h-4"/>
              </button>
           )}
        </div>

        {/* --- SERVICE SELECTION AREA --- */}
        <div className="p-5 bg-white rounded-2xl space-y-4 border border-purple-200 shadow-sm">
           <h4 className="font-bold text-purple-900 text-sm flex items-center gap-2 border-b border-purple-100 pb-2">
             <Sparkles className="w-4 h-4 text-rose-500"/> Servicios y Consumo
           </h4>
           
           {/* ALQUILER DE EQUIPOS */}
           <div className={`rounded-xl border transition-all duration-300 ${showEquipos ? 'bg-purple-50 border-purple-200 shadow-md' : 'bg-white border-gray-100'}`}>
               <label className="flex items-center justify-between p-3 cursor-pointer">
                   <div className="flex items-center gap-3">
                       <input 
                           name="service_equipos" 
                           type="checkbox" 
                           checked={showEquipos}
                           onChange={(e) => setShowEquipos(e.target.checked)}
                           className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" 
                        />
                       <span className="font-bold text-gray-700">🪑 Alquiler de Mobiliario/Equipos</span>
                   </div>
                   {showEquipos && <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">Activo</span>}
               </label>
               
               {showEquipos && (
                   <div className="px-3 pb-3 animate-in slide-in-from-top-2">
                       <ResourceSelector title="Mobiliario a Entregar" typeFilter="retornable" />
                   </div>
               )}
           </div>

           {/* MÁQUINA DE MILLOS */}
           <div className={`rounded-xl border transition-all duration-300 ${showMillos ? 'bg-yellow-50 border-yellow-200 shadow-md' : 'bg-white border-gray-100'}`}>
               <label className="flex items-center justify-between p-3 cursor-pointer">
                   <div className="flex items-center gap-3">
                       <input 
                           name="service_millos" 
                           type="checkbox" 
                           checked={showMillos}
                           onChange={(e) => setShowMillos(e.target.checked)}
                           className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500" 
                        />
                       <span className="font-bold text-gray-700">🍿 Máquina de Millos</span>
                   </div>
                   {showMillos && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-bold">Activo</span>}
               </label>
               
               {showMillos && (
                   <div className="px-3 pb-3 animate-in slide-in-from-top-2">
                       <div className="p-2 text-xs text-yellow-800 bg-yellow-100/50 rounded mb-2">
                           Selecciona la cantidad de insumos (bolsas, maíz, aceite) a descontar del stock.
                       </div>
                       <ResourceSelector title="Insumos Millos" keywords={['maiz', 'maíz', 'aceite', 'sal', 'bolsa', 'millos', 'caja']} typeFilter="consumible" />
                   </div>
               )}
           </div>

           {/* MÁQUINA DE ALGODÓN */}
           <div className={`rounded-xl border transition-all duration-300 ${showAlgodon ? 'bg-pink-50 border-pink-200 shadow-md' : 'bg-white border-gray-100'}`}>
               <label className="flex items-center justify-between p-3 cursor-pointer">
                   <div className="flex items-center gap-3">
                       <input 
                           name="service_algodon" 
                           type="checkbox" 
                           checked={showAlgodon}
                           onChange={(e) => setShowAlgodon(e.target.checked)}
                           className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500" 
                        />
                       <span className="font-bold text-gray-700">🍭 Máquina de Algodón</span>
                   </div>
                   {showAlgodon && <span className="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full font-bold">Activo</span>}
               </label>
               
               {showAlgodon && (
                   <div className="px-3 pb-3 animate-in slide-in-from-top-2">
                       <ResourceSelector title="Insumos Algodón" keywords={['azucar', 'azúcar', 'palo', 'cono', 'colorante']} typeFilter="consumible" />
                   </div>
               )}
           </div>

           {/* MÁQUINA DE RASPADOS */}
           <div className={`rounded-xl border transition-all duration-300 ${showRaspados ? 'bg-blue-50 border-blue-200 shadow-md' : 'bg-white border-gray-100'}`}>
               <label className="flex items-center justify-between p-3 cursor-pointer">
                   <div className="flex items-center gap-3">
                       <input 
                           name="service_raspados" 
                           type="checkbox" 
                           checked={showRaspados}
                           onChange={(e) => setShowRaspados(e.target.checked)}
                           className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
                        />
                       <span className="font-bold text-gray-700">🍧 Máquina de Raspados</span>
                   </div>
                   {showRaspados && <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">Activo</span>}
               </label>
               
               {showRaspados && (
                   <div className="px-3 pb-3 animate-in slide-in-from-top-2">
                       <ResourceSelector title="Insumos Raspados" keywords={['hielo', 'sirope', 'vaso', 'cuchara', 'leche']} typeFilter="consumible" />
                   </div>
               )}
           </div>
        </div>
        
        <div className="p-4 bg-gray-100 rounded-2xl border border-gray-200">
           <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2 mb-3">
             <CheckSquare className="w-4 h-4 text-gray-500"/> Logística y Entrega
           </h4>
           <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" name="logistics_loaded" defaultChecked={editingEvent?.logistics?.loaded} className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500" />
                 <span className="text-sm text-gray-700">🚚 Cargado en Transporte</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" name="logistics_delivered" defaultChecked={editingEvent?.logistics?.delivered} className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500" />
                 <span className="text-sm text-gray-700">✅ Entregado e Instalado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" name="logistics_pickedUp" defaultChecked={editingEvent?.logistics?.pickedUp} className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500" />
                 <span className="text-sm text-gray-700">🏠 Recogido (Evento Finalizado)</span>
              </label>
           </div>
        </div>

        <div className="bg-purple-900/5 p-4 rounded-xl border border-purple-200">
            <h4 className="font-bold text-purple-900 text-sm mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4"/> Gestión de Pagos
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                  name="totalCost" 
                  label="Costo Total ($)" 
                  type="number" 
                  step="0.01" 
                  value={totalCost}
                  onChange={(e) => setTotalCost(Number(e.target.value))}
                  required 
              />
              <Input 
                  name="deposit" 
                  label="Abono / Seña ($)" 
                  type="number" 
                  step="0.01" 
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
              />
            </div>
            
            <div className={`mt-2 p-3 rounded-lg text-center font-bold text-lg border-2 ${balance > 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                {balance > 0 ? `Saldo Pendiente: $${balance.toFixed(2)}` : '¡PAGADO COMPLETO!'}
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Select 
            name="status" 
            label="Estado del Evento" 
            options={[
              { value: 'pendiente', label: '🟡 Pendiente' },
              { value: 'confirmado', label: '🟢 Confirmado' },
              { value: 'completado', label: '⚪ Completado' }
            ]}
            defaultValue={editingEvent?.status || 'pendiente'}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full">Guardar Celebración</Button>
        </div>
      </form>
    );
  };

  const ServiceOrderContent = ({ event }) => {
    if (!event) return null;
    const client = clients.find(c => c.id === event.clientId);
    const balance = event.totalCost - (event.deposit || 0);

    return (
      <div className="bg-white p-6 border-2 border-gray-800 text-black max-w-md mx-auto">
         <div className="text-center border-b-2 border-black pb-4 mb-4">
            <h2 className="text-2xl font-black uppercase tracking-wider">Orden de Servicio</h2>
            <p className="text-sm font-bold mt-1">Luzcecitas Eventos</p>
         </div>
         
         <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
               <div>
                 <span className="font-bold block">Fecha:</span>
                 {event.date}
               </div>
               <div>
                 <span className="font-bold block">Hora:</span>
                 {event.time}
               </div>
            </div>
            
            <div>
              <span className="font-bold block">Cliente:</span>
              {client ? client.name : event.clientName}
            </div>
            
            <div>
               <span className="font-bold block">Teléfono:</span>
               {client?.phone || '-'}
            </div>

            <div className="bg-gray-100 p-2 border border-gray-300">
              <span className="font-bold block">Dirección:</span>
              <p className="whitespace-normal">{event.address}</p>
            </div>

            <div className="mt-4">
               <span className="font-bold block border-b border-black mb-2">EQUIPOS Y SERVICIOS:</span>
               <ul className="list-disc pl-5 space-y-1">
                  {event.services?.millos && <li>Máquina de Millos (Insumos incl.)</li>}
                  {event.services?.algodon && <li>Máquina de Algodón (Insumos incl.)</li>}
                  {event.services?.raspados && <li>Máquina de Raspados (Insumos incl.)</li>}
                  
                  {event.customItems && Object.entries(event.customItems).map(([id, qty]) => {
                     const item = inventory.find(i => i.id === id);
                     // Solo mostrar equipos retornables en la lista pública, los insumos son internos
                     return (item && item.type === 'retornable') ? <li key={id}>{qty} x {item.name}</li> : null;
                  })}
               </ul>
            </div>
            
            <div className="mt-6 border border-black p-3">
               <div className="flex justify-between mb-1">
                  <span>Total Evento:</span>
                  <span className="font-bold">${event.totalCost?.toFixed(2)}</span>
               </div>
               <div className="flex justify-between mb-1 text-gray-600">
                  <span>Abono Recibido:</span>
                  <span>-${event.deposit?.toFixed(2) || '0.00'}</span>
               </div>
               <div className="flex justify-between border-t border-black pt-1 mt-1 text-lg">
                  <span className="font-black">RESTA PAGAR:</span>
                  <span className="font-black">${balance?.toFixed(2)}</span>
               </div>
            </div>
            
            <div className="mt-8 border-t-2 border-dashed border-gray-400 pt-4">
               <div className="h-16 border border-gray-300 mb-1"></div>
               <p className="text-xs text-center text-gray-500">Firma de Recibido / Conformidad</p>
            </div>
         </div>
         
         <div className="mt-6 flex justify-center no-print">
            <p className="text-xs text-gray-400 italic text-center">Toma una captura de pantalla de esta orden para compartirla.</p>
         </div>
      </div>
    );
  };


  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-[#1a103c] text-white h-screen sticky top-0 shadow-2xl z-20">
        <div className="p-6 border-b border-purple-900/50 bg-[#150d33]">
          <div className="flex flex-col items-center gap-3 mb-2">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 overflow-hidden p-1">
                <img 
                  src= {LOGO_URL}
                  alt="Logo Luzcecitas" 
                  className="w-full h-full object-contain"
                />
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-rose-300 to-purple-300 text-center leading-tight">
               Eventos<br/>Luzcecitas
             </h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', icon: TrendingUp, label: 'Tablero Festivo' },
            { id: 'calendar', icon: CalendarIcon, label: 'Calendario' },
            { id: 'inventory', icon: ClipboardList, label: 'Inventario' },
            { id: 'clients', icon: Users, label: 'Clientes' },
            { id: 'accounting', icon: DollarSign, label: 'Contabilidad' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${
                activeTab === item.id 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50 translate-x-1' 
                  : 'text-purple-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-yellow-300' : 'text-purple-400'}`} /> 
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 bg-gradient-to-t from-purple-900/80 to-transparent">
           <button onClick={handleLogout} className="w-full py-2 flex items-center justify-center gap-2 text-purple-300 hover:text-white text-sm transition-colors">
              <Lock className="w-3 h-3"/> Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-[#f8f7fc]">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#1a103c] text-white p-4 flex justify-between items-center sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden p-0.5">
               <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain"/>
            </div>
            <span className="font-bold text-lg text-yellow-100">Luzcecitas</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1a103c] border-t border-purple-800 p-4 space-y-2 absolute w-full z-10 shadow-2xl">
            {['dashboard', 'calendar', 'inventory', 'clients', 'accounting'].map(tab => (
              <button 
                key={tab} 
                onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg capitalize font-medium ${activeTab === tab ? 'bg-rose-600 text-white' : 'text-purple-200'}`}
              >
                {tab === 'dashboard' ? 'Tablero' : tab}
              </button>
            ))}
             <button 
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg capitalize font-medium text-red-300 bg-red-900/20 mt-2"
              >
                Cerrar Sesión
              </button>
          </div>
        )}

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'clients' && <ClientsView />}
          {activeTab === 'accounting' && <AccountingView />}
        </div>
      </main>

      {/* --- MODAL FORMS --- */}
      <Modal 
        isOpen={showEventModal} 
        onClose={() => setShowEventModal(false)} 
        title={editingEvent ? "Editar Celebración" : "Nueva Celebración"}
      >
        <EventFormContent />
      </Modal>

      <Modal
        isOpen={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
        title={editingItem ? "Editar Item" : "Nuevo Item de Inventario"}
      >
        <form onSubmit={handleSaveInventory} className="space-y-4">
          <Input name="name" label="Nombre del Producto" placeholder="Ej. Silla Plástica, Maíz" defaultValue={editingItem?.name} required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="totalQuantity" label="Cantidad Total" type="number" defaultValue={editingItem?.totalQuantity || 0} required />
            <Input name="unit" label="Unidad" placeholder="Unidades, Kg, Bolsas" defaultValue={editingItem?.unit || 'Unidades'} required />
          </div>
          <Select 
            name="type" 
            label="Tipo de Recurso" 
            defaultValue={editingItem?.type || 'retornable'}
            options={[
              { value: 'retornable', label: 'Retornable (Equipos)' },
              { value: 'consumible', label: 'Consumible (Materia Prima)' },
              { value: 'combo', label: 'Combo / Paquete' }
            ]}
          />
          <Input name="minStock" label="Alerta de Stock Mínimo" type="number" defaultValue={editingItem?.minStock || 5} />
          <div className="pt-2">
            <Button type="submit" className="w-full">Guardar Item</Button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={showClientModal} 
        onClose={() => setShowClientModal(false)} 
        title={editingClient ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <form onSubmit={handleSaveClient} className="space-y-4">
          <Input name="name" label="Nombre Completo" placeholder="Nombre y Apellido" defaultValue={editingClient?.name} required />
          <Input name="phone" label="Teléfono" placeholder="6xxx-xxxx" defaultValue={editingClient?.phone} required />
          <Input name="email" label="Correo Electrónico" type="email" placeholder="cliente@email.com" defaultValue={editingClient?.email} />
          <Select 
            name="status" 
            label="Estado del Cliente" 
            options={[
              { value: 'cotizando', label: 'Solo Cotizando' },
              { value: 'facturado', label: 'Facturado / Cliente Formal' }
            ]}
            defaultValue={editingClient?.status || 'cotizando'}
          />
          <Input name="address" label="Dirección Principal" placeholder="Ciudad, Barrio..." defaultValue={editingClient?.address} />
          <div className="pt-2">
            <Button type="submit" className="w-full">Guardar Cliente</Button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={showTransactionModal} 
        onClose={() => setShowTransactionModal(false)} 
        title="Registrar Movimiento"
      >
        <form onSubmit={handleSaveTransaction} className="space-y-4">
          <Select 
            name="type" 
            label="Tipo de Movimiento" 
            options={[
              { value: 'income', label: 'Ingreso (+)' },
              { value: 'expense', label: 'Gasto (-)' }
            ]}
          />
          <Input name="amount" label="Monto ($)" type="number" step="0.01" required />
          <Input name="description" label="Descripción" placeholder="Ej. Compra de maíz, Mantenimiento..." required />
          <Input name="date" label="Fecha" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
          <Select 
            name="category" 
            label="Categoría" 
            options={[
              { value: 'Servicios', label: 'Servicios de Eventos' },
              { value: 'Mantenimiento', label: 'Mantenimiento Equipos' },
              { value: 'Insumos', label: 'Insumos (Maíz, Azúcar, Hielo)' },
              { value: 'Transporte', label: 'Transporte' },
              { value: 'Otro', label: 'Otro' }
            ]}
          />
          <div className="pt-2">
            <Button type="submit" className="w-full">Registrar</Button>
          </div>
        </form>
      </Modal>

      {/* NEW: LOGISTICS MODAL */}
      <Modal 
        isOpen={showLogisticsModal} 
        onClose={() => setShowLogisticsModal(false)} 
        title="Gestión de Ruta y Carga"
      >
         <LogisticsModalContent />
         <div className="mt-4 flex justify-center">
            <Button variant="secondary" onClick={() => setShowLogisticsModal(false)}>Cerrar</Button>
         </div>
      </Modal>

      {/* NEW: SERVICE ORDER MODAL */}
      <Modal 
        isOpen={showOrderModal} 
        onClose={() => setShowOrderModal(false)} 
        title="Vista de Impresión / Captura"
      >
         <ServiceOrderContent event={viewingOrderEvent} />
         <div className="mt-4 flex justify-center">
            <Button variant="secondary" onClick={() => setShowOrderModal(false)}>Cerrar</Button>
         </div>
      </Modal>
      
      {/* ALERT MODAL FOR IMMINENT EVENTS */}
      <Modal
        isOpen={showUrgentModal}
        onClose={() => setShowUrgentModal(false)}
        title="¡Atención! Eventos Próximos (3 días)"
        urgent={true}
      >
        <div className="space-y-4">
           <p className="text-gray-700 font-medium">Tienes los siguientes eventos programados para los próximos días. ¡Verifica el stock y transporte!</p>
           <div className="space-y-2">
              {urgentAlerts.map(event => (
                <div key={event.id} className="bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-3">
                   <div className="bg-white p-2 rounded-full shadow-sm text-red-500">
                     <Bell className="w-4 h-4" />
                   </div>
                   <div>
                     <h4 className="font-bold text-red-800 text-sm">{event.title}</h4>
                     <p className="text-xs text-red-600 flex gap-2 mt-1">
                       <CalendarIcon className="w-3 h-3"/> {getLocalDate(event.date).toLocaleDateString()}
                       <span className="font-bold">|</span> {event.time}
                     </p>
                     <p className="text-xs text-red-600 mt-1">{event.address}</p>
                   </div>
                </div>
              ))}
           </div>
           <Button onClick={() => setShowUrgentModal(false)} className="w-full bg-red-600 hover:bg-red-700 text-white border-none mt-2">
             Entendido
           </Button>
        </div>
      </Modal>

    </div>
  );
}
