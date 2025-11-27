

// src/App.tsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import BookingsList from './pages/BookingsList';
import OwnerProperties from './pages/OwnerProperties';
import BookingForm from './components/BookingForm';
import Login from './components/Login';
import Register from './components/Register';
import RoleSelection from './components/RoleSelection';
import { ViewType, User, UserRole, LoginData, RegisterData } from './types';
import { api } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home'); // Changé à 'home' par défaut
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          // Vérifier que l'utilisateur existe toujours en base
          try {
            const currentUserData = await api.getCurrentUser(user.email);
            setCurrentUser(currentUserData);
          } catch (error) {
            console.error('Utilisateur non trouvé en base, déconnexion:', error);
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Erreur de vérification auth:', error);
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async (credentials: LoginData) => {
    try {
      setIsLoading(true);
      const user = await api.login(credentials);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentView('home');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const user = await api.register(userData);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentView('home');
      alert('Inscription réussie ! Bienvenue sur RésidenceÉlégante.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('home'); // Rediriger vers home après déconnexion
  };

  const handleStartReservation = (propertyId: string) => {
    if (!currentUser) {
      // Rediriger vers la connexion si l'utilisateur n'est pas connecté
      setCurrentView('login');
      return;
    }
    setSelectedPropertyId(propertyId);
    setCurrentView('booking-form');
  };

  const handleNavigate = (view: ViewType) => {
    // Vérifier l'accès aux pages protégées
    if ((view === 'bookings' || view === 'owner' || view === 'booking-form') && !currentUser) {
      setCurrentView('login');
      return;
    }
    setCurrentView(view);
  };

  const handleNavigateToRegister = () => {
    setCurrentView('role-selection');
  };

  const handleNavigateToLogin = () => {
    setCurrentView('login');
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentView('register');
  };

  const handleBackFromRole = () => {
    setCurrentView('home'); // Retour à l'accueil plutôt qu'au login
  };

  const handleBackFromRegister = () => {
    setCurrentView('role-selection');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea80fc] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre expérience...</p>
        </div>
      </div>
    );
  }

  // Rendu conditionnel basé sur la vue actuelle
  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login 
            onLogin={handleLogin} 
            onNavigateToRegister={handleNavigateToRegister}
            onBackToHome={handleBackToHome}
            isLoading={isLoading} 
          />
        );
      
      case 'role-selection':
        return (
          <RoleSelection 
            onRoleSelect={handleRoleSelect} 
            onBack={handleBackFromRole} 
          />
        );
      
      case 'register':
        return (
          <Register 
            onRegister={handleRegister} 
            onBack={handleBackFromRegister}
            selectedRole={selectedRole}
            isLoading={isLoading}
          />
        );
      
      case 'home':
        return (
          <HomePage 
            onNavigate={handleNavigate} 
            onStartReservation={handleStartReservation}
            currentUser={currentUser}
          />
        );
      
      case 'bookings':
        return <BookingsList currentUser={currentUser} />;
      
      case 'owner':
        return <OwnerProperties ownerId={currentUser?.id || ''} />;
      
      case 'booking-form':
        return (
          <BookingForm 
            propertyId={selectedPropertyId} 
            onNavigate={handleNavigate} 
            currentUser={currentUser}
          />
        );
      
      default:
        return (
          <HomePage 
            onNavigate={handleNavigate} 
            onStartReservation={handleStartReservation}
            currentUser={currentUser}
          />
        );
    }
  };

  // Afficher la navbar seulement pour les vues principales (pas pour login/register)
  const showNavbar = !['login', 'register', 'role-selection'].includes(currentView);

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && (
        <Navbar 
          currentView={currentView} 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLogin={handleNavigateToLogin}
        />
      )}
      
      {renderCurrentView()}
    </div>
  );
}
  
export default App;