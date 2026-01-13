import React, { useState, useEffect, useMemo } from 'react';
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
  LogIn // Icono nuevo para login
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, // IMPORTANTE: Nueva importación
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
  serverTimestamp 
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
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3132/3132693.png"; 

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

const Input = ({ label, value, onChange, type = "text", placeholder, required = false, name, min, max, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-bold text-purple-900 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      max={max}
      placeholder={placeholder}
      className="w-full px-4 py-2 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-purple-50/30"
    />
  </div>
);

const Select = ({ label, value, onChange, options, name }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-purple-900 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// --- LOGIN SCREEN COMPONENT (MODIFICADO PARA EMAIL/PASS) ---
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
      // El onAuthStateChanged en App se encargará de redirigir
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
    <div className="min-h-screen bg-[#1a103c] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-rose-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>
        <div className="absolute -bottom-10 left-1/2 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
          <div className="mb-6 relative text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-rose-400 to-purple-600 rounded-full flex items-center justify-center p-1 shadow-2xl mx-auto animate-bounce-slow mb-4">
               <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
                 <img src={LOGO_URL} alt="Luzcecitas Logo" className="w-16 h-16 object-contain" />
               </div>
            </div>
            
            <h1 className="text-2xl font-black text-white tracking-tight">
              Bienvenido a <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-rose-300">Luzcecitas</span>
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
             Acceso restringido • Sistema de Gestión V.1.3
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
  const [urgentAlerts, setUrgentAlerts] = useState([]); 
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  
  // Editing States
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingOrderEvent, setViewingOrderEvent] = useState(null); 

  // --- AUTH & DATA SYNC ---

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Solo intentamos custom token si el entorno lo provee, NO anónimo
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
      // user state will be set to null by onAuthStateChanged
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Use dynamic appId for paths
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
        const eventDate = new Date(e.date);
        const [y, m, d] = e.date.split('-').map(Number);
        const localEventDate = new Date(y, m - 1, d);
        
        return localEventDate >= today && localEventDate <= inThreeDays && e.status !== 'completado' && e.status !== 'cancelado';
      });

      if (imminentEvents.length > 0) {
        setUrgentAlerts(imminentEvents);
        setShowUrgentModal(true);
      }
    }
  }, [events, user]);


  // --- DERIVED DATA ---

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return events
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);

  const financialStats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let transportExpenses = 0;

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
    return { income, expenses, profit: income - expenses, transportExpenses };
  }, [transactions]);

  // --- HELPERS FOR AVAILABILITY ---

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
      type: formData.get('type'),
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
    const clientId = formData.get('clientId');
    const selectedClient = clients.find(c => c.id === clientId);

    const customItems = {};
    inventory.filter(i => i.type === 'retornable').forEach(item => {
      const val = Number(formData.get(`inv_${item.id}`));
      if (val > 0) customItems[item.id] = val;
    });

    const data = {
      title: formData.get('title'),
      date: formData.get('date'),
      time: formData.get('time'),
      clientId: clientId,
      clientName: selectedClient?.name || 'Desconocido',
      address: formData.get('address'),
      status: formData.get('status'),
      items: {
        millos: formData.get('millos') === 'on',
        algodon: formData.get('algodon') === 'on',
        raspados: formData.get('raspados') === 'on',
      },
      customItems: customItems,
      totalCost: Number(formData.get('totalCost') || 0),
      notes: formData.get('notes'),
      // New Logistics Fields
      logistics: {
        loaded: formData.get('logistics_loaded') === 'on',
        delivered: formData.get('logistics_delivered') === 'on',
        pickedUp: formData.get('logistics_pickedUp') === 'on',
      },
      createdAt: serverTimestamp()
    };

    try {
      if (editingEvent) {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'events', editingEvent.id), data);
      } else {
        const docRef = await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'events'), data);
        if (data.status === 'confirmado' && data.totalCost > 0) {
           await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'), {
             type: 'income',
             amount: data.totalCost,
             description: `Evento: ${data.title}`,
             date: data.date,
             eventId: docRef.id,
             category: 'Servicios'
           });
        }
      }
      setShowEventModal(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error saving event:", error);
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-rose-500" /> Inventario de Fiesta
          </h3>
          <Button onClick={() => { setEditingItem(null); setShowInventoryModal(true); }}>
            <Plus className="w-4 h-4" /> Nuevo Item
          </Button>
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
              <Box className="w-5 h-5 text-orange-500" /> Materia Prima (Consumibles)
            </h4>
            <div className="space-y-3">
              {inventory.filter(i => i.type === 'consumible').length === 0 && <p className="text-sm text-gray-500 italic">No hay materia prima registrada (ej. Maíz, Azúcar).</p>}
              {inventory.filter(i => i.type === 'consumible').map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-100 hover:shadow-md transition-shadow">
                  <div>
                    <div className="font-bold text-gray-800">{item.name}</div>
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
              <p className="text-orange-100 mb-1 font-medium">Alertas de Stock</p>
              <h2 className="text-4xl font-extrabold text-white drop-shadow-sm">
                {inventory.filter(i => i.type === 'consumible' && i.totalQuantity <= i.minStock).length}
              </h2>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
               <AlertTriangle className="w-8 h-8 text-white" />
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
            </div>
          ) : (
            upcomingEvents.slice(0, 3).map(event => {
              const client = clients.find(c => c.id === event.clientId);
              return (
                <div key={event.id} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-purple-900 text-lg">{event.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                      event.status === 'confirmado' ? 'bg-green-100 text-green-700' : 
                      event.status === 'pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-rose-400" /> {new Date(event.date).toLocaleDateString()}
                    <span className="text-gray-300">|</span> 
                    {event.time}
                  </p>
                  
                  {/* GPS Link */}
                  <div className="text-sm text-gray-600 mb-2 flex items-start gap-2 group cursor-pointer" onClick={() => openMaps(event.address)}>
                    <MapPin className="w-4 h-4 text-rose-400 mt-0.5 group-hover:text-rose-600" /> 
                    <span className="group-hover:text-rose-600 group-hover:underline">{event.address}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 mb-4">
                    {event.customItems && Object.entries(event.customItems).map(([id, qty]) => {
                      const item = inventory.find(i => i.id === id);
                      return item ? <span key={id} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-medium border border-purple-100">{qty} {item.name}</span> : null;
                    })}
                  </div>

                  {/* Actions Bar */}
                  <div className="border-t border-purple-50 pt-3 flex justify-between items-center">
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
    
    const monthEvents = events.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });

    const changeMonth = (delta) => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };

    const getDayEvents = (day) => {
      return monthEvents.filter(e => new Date(e.date).getDate() === day);
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
                     setTimeout(() => {
                       const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                       const dateInput = document.querySelector('input[name="date"]');
                       if (dateInput) { 
                           dateInput.value = dateStr;
                           const event = new Event('change', { bubbles: true });
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
    
    const filteredClients = clients.filter(c => 
      filter === 'todos' ? true : c.type === filter
    );

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-purple-100 shadow-sm">
            {['todos', 'cliente', 'prospecto'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  filter === f ? 'bg-purple-100 text-purple-700 shadow-sm' : 'text-gray-400 hover:text-purple-600'
                }`}
              >
                {f}s
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
                  <th className="px-6 py-4 text-xs font-bold text-purple-400 uppercase tracking-wider">Tipo</th>
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
                        client.type === 'cliente' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {client.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[200px]">
                      {client.address || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         {/* WhatsApp Button */}
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
            <p className="text-emerald-600 font-bold mb-1">Ingresos</p>
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
           {/* Nueva Card para Transporte */}
           <Card className="bg-blue-50 border-blue-100">
            <p className="text-blue-600 font-bold mb-1">Transporte</p>
            <h2 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2">
              <Truck className="w-5 h-5" /> ${financialStats.transportExpenses.toFixed(2)}
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

  const EventFormContent = () => {
    const [selectedDate, setSelectedDate] = useState(editingEvent?.date || new Date().toISOString().split('T')[0]);
    const handleDateChange = (e) => setSelectedDate(e.target.value);
    const client = clients.find(c => c.id === editingEvent?.clientId);

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
        
        <Select 
          name="clientId" 
          label="Cliente" 
          value={editingEvent?.clientId} 
          options={[
            { value: '', label: 'Seleccionar Cliente...' },
            ...clients.map(c => ({ value: c.id, label: c.name }))
          ]} 
          required
        />

        <div className="relative">
           <Input name="address" label="Dirección del Evento" placeholder="Lugar de la fiesta" defaultValue={editingEvent?.address} required />
           {editingEvent?.address && (
              <button type="button" onClick={() => openMaps(editingEvent.address)} className="absolute top-8 right-2 p-1 bg-gray-100 rounded text-gray-500 hover:text-rose-500">
                 <MapPin className="w-4 h-4"/>
              </button>
           )}
        </div>

        {/* Dynamic Inventory Section */}
        <div className="p-5 bg-purple-50 rounded-2xl space-y-4 border border-purple-100">
           <h4 className="font-bold text-purple-900 text-sm flex items-center gap-2">
             <ClipboardList className="w-4 h-4 text-rose-500"/> Alquiler de Equipos y Stock
           </h4>
           
           {inventory.filter(i => i.type === 'retornable').length > 0 ? (
             <div className="grid grid-cols-1 gap-3">
               {inventory.filter(i => i.type === 'retornable').map(item => {
                 const used = getUsedQuantityOnDate(selectedDate, item.id, editingEvent?.id);
                 const available = item.totalQuantity - used;
                 const currentVal = editingEvent?.customItems?.[item.id] || 0;
                 
                 return (
                   <div key={item.id} className="bg-white p-3 rounded-xl border border-purple-100 shadow-sm">
                     <div className="flex justify-between mb-2">
                       <label className="text-sm font-bold text-gray-700">{item.name}</label>
                       <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${available <= 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                         Disp: {available} / {item.totalQuantity}
                       </span>
                     </div>
                     <input 
                       name={`inv_${item.id}`} 
                       type="number" 
                       min="0" 
                       max={available + currentVal}
                       defaultValue={currentVal}
                       className="w-full border-2 border-purple-100 rounded-lg p-2 focus:border-rose-400 focus:outline-none"
                     />
                     {available <= 0 && <p className="text-xs text-red-500 mt-1 font-medium">¡Sin disponibilidad para esta fecha!</p>}
                   </div>
                 );
               })}
             </div>
           ) : (
             <p className="text-xs text-gray-500 text-center py-2">Agrega sillas y mesas en la pestaña "Inventario" para verlos aquí.</p>
           )}

           <div className="border-t border-purple-200 pt-3">
             <p className="text-xs text-purple-900 mb-3 font-bold uppercase tracking-wide">Máquinas Festivas</p>
             <div className="space-y-2">
                <label className="flex items-center gap-3 p-2 bg-white rounded-lg border border-purple-100 cursor-pointer hover:bg-yellow-50 transition-colors">
                   <input name="millos" type="checkbox" defaultChecked={editingEvent?.items?.millos} className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500" />
                   <span className="text-sm font-medium text-gray-700">🍿 Máquina de Millos</span>
                </label>
                <label className="flex items-center gap-3 p-2 bg-white rounded-lg border border-purple-100 cursor-pointer hover:bg-pink-50 transition-colors">
                   <input name="algodon" type="checkbox" defaultChecked={editingEvent?.items?.algodon} className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500" />
                   <span className="text-sm font-medium text-gray-700">🍭 Máquina de Algodón</span>
                </label>
                <label className="flex items-center gap-3 p-2 bg-white rounded-lg border border-purple-100 cursor-pointer hover:bg-blue-50 transition-colors">
                   <input name="raspados" type="checkbox" defaultChecked={editingEvent?.items?.raspados} className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500" />
                   <span className="text-sm font-medium text-gray-700">🍧 Máquina de Raspados</span>
                </label>
             </div>
           </div>
        </div>
        
        {/* Logistics Section */}
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

        <div className="grid grid-cols-2 gap-4">
          <Select 
            name="status" 
            label="Estado" 
            options={[
              { value: 'pendiente', label: 'Pendiente' },
              { value: 'confirmado', label: 'Confirmado' },
              { value: 'completado', label: 'Completado' }
            ]}
            defaultValue={editingEvent?.status || 'pendiente'}
          />
          <Input name="totalCost" label="Costo Total ($)" type="number" step="0.01" defaultValue={editingEvent?.totalCost} required />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full">Guardar Celebración</Button>
        </div>
      </form>
    );
  };

  // --- SERVICE ORDER CONTENT (For Modal) ---
  const ServiceOrderContent = ({ event }) => {
    if (!event) return null;
    const client = clients.find(c => c.id === event.clientId);
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
               <span className="font-bold block border-b border-black mb-2">EQUIPOS Y MOBILIARIO:</span>
               <ul className="list-disc pl-5 space-y-1">
                  {/* Custom Items */}
                  {event.customItems && Object.entries(event.customItems).map(([id, qty]) => {
                     const item = inventory.find(i => i.id === id);
                     return item ? <li key={id}>{qty} x {item.name}</li> : null;
                  })}
                  {/* Machines */}
                  {event.items?.millos && <li>1 x Máquina de Millos</li>}
                  {event.items?.algodon && <li>1 x Máquina de Algodón</li>}
                  {event.items?.raspados && <li>1 x Máquina de Raspados</li>}
               </ul>
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
                  src={LOGO_URL}
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
              { value: 'retornable', label: 'Retornable (Sillas, Mesas)' },
              { value: 'consumible', label: 'Consumible (Maíz, Azúcar)' }
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
            name="type" 
            label="Tipo" 
            options={[
              { value: 'cliente', label: 'Cliente (Ya compró)' },
              { value: 'prospecto', label: 'Prospecto (Interesado)' }
            ]}
            defaultValue={editingClient?.type || 'prospecto'}
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
                       <CalendarIcon className="w-3 h-3"/> {new Date(event.date).toLocaleDateString()}
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
