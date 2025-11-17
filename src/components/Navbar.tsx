
// // src/components/Navbar.tsx
// import { Home, BookOpen, Building, User, Sparkles, LogOut, ChevronDown, Menu, X } from 'lucide-react';
// import { ViewType, User as UserType } from '../types';
// import { useState, useEffect } from 'react';

// interface NavbarProps {
//   currentView: ViewType;
//   onNavigate: (view: ViewType) => void;
//   currentUser: UserType | null;
//   onLogout: () => void;
// }

// export default function Navbar({ currentView, onNavigate, currentUser, onLogout }: NavbarProps) {
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const showOwnerButton = currentUser?.role === 'proprietaire' || currentUser?.role === 'admin';
//   const showBookingsButton = currentUser?.role === 'locataire' || currentUser?.role === 'admin';

//   const handleLogout = () => {
//     setShowLogoutConfirm(true);
//     setIsProfileOpen(false);
//   };

//   const confirmLogout = () => {
//     onLogout();
//     setShowLogoutConfirm(false);
//   };

//   const getRoleDisplayName = (role: string) => {
//     const roles: { [key: string]: string } = {
//       proprietaire: 'Propriétaire',
//       locataire: 'Locataire',
//       admin: 'Administrateur'
//     };
//     return roles[role] || role;
//   };

//   const getInitials = (name: string) => {
//     return name.split(' ').map(n => n[0]).join('').toUpperCase();
//   };

//   const navItems = [
//     { id: 'home' as ViewType, label: 'Accueil', icon: Home, show: true },
//     { id: 'owner' as ViewType, label: 'Mes Biens', icon: Building, show: showOwnerButton },
//     { id: 'bookings' as ViewType, label: 'Réservations', icon: BookOpen, show: showBookingsButton },
//   ];

//   return (
//     <>
//       <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         scrolled 
//           ? 'bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-gray-200' 
//           : 'bg-white/90 backdrop-blur-2xl border-b border-gray-100'
//       }`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-20">
//             {/* Logo Élégant */}
//             <div 
//               className="flex items-center space-x-4 cursor-pointer group"
//               onClick={() => onNavigate('home')}
//             >
//               <div className="relative">
//                 <div className="w-12 h-12 bg-gradient-to-br from-[#ea80fc] to-purple-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
//                   <Sparkles className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="absolute -inset-1 bg-[#ea80fc] rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
//               </div>
//               <div className="flex flex-col">
//                 <h1 className="text-2xl font-black bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent tracking-tight">
//                 RésidenceÉlégante
//                 </h1>
//                 <p className="text-xs text-gray-500 font-medium tracking-wide">EXCELLENCE IMMOBILIÈRE</p>
//               </div>
//             </div>

//             {/* Navigation Centrale - Desktop */}
//             <div className="hidden md:flex items-center space-x-1 bg-gray-50/80 backdrop-blur-lg rounded-2xl p-2 shadow-inner border border-gray-200">
//               {navItems.map((item) => 
//                 item.show && (
//                   <button
//                     key={item.id}
//                     onClick={() => onNavigate(item.id)}
//                     className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 group relative overflow-hidden ${
//                       currentView === item.id
//                         ? 'bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white shadow-lg'
//                         : 'text-gray-600 hover:text-black hover:bg-white/80'
//                     }`}
//                   >
//                     <item.icon className={`w-4 h-4 relative ${
//                       currentView === item.id ? 'text-white' : 'text-gray-500 group-hover:text-[#ea80fc]'
//                     }`} />
//                     <span className="relative font-medium text-sm tracking-wide">{item.label}</span>
//                     {currentView === item.id && (
//                       <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
//                     )}
//                   </button>
//                 )
//               )}
//             </div>

//             {/* Profile Utilisateur */}
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <button
//                   onClick={() => setIsProfileOpen(!isProfileOpen)}
//                   className="flex items-center space-x-3 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
//                 >
//                   <div className="w-10 h-10 bg-gradient-to-br from-[#ea80fc] to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-md">
//                     {currentUser?.nom ? getInitials(currentUser.nom) : <User className="w-5 h-5" />}
//                   </div>
//                   <div className="hidden lg:block text-left">
//                     <p className="font-semibold text-gray-900 text-sm">
//                       {currentUser?.nom || 'Utilisateur'}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {currentUser?.role ? getRoleDisplayName(currentUser.role) : 'Non connecté'}
//                     </p>
//                   </div>
//                   <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
//                 </button>

//                 {/* Menu Déroulant */}
//                 {isProfileOpen && (
//                   <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-2xl animate-in fade-in-0 zoom-in-95">
//                     {/* En-tête du profil */}
//                     <div className="p-6 bg-gradient-to-br from-white to-gray-50 border-b border-gray-200">
//                       <div className="flex items-center space-x-4">
//                         <div className="w-16 h-16 bg-gradient-to-br from-[#ea80fc] to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
//                           {currentUser?.nom ? getInitials(currentUser.nom) : <User className="w-8 h-8" />}
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="font-bold text-gray-900 text-lg">{currentUser?.nom || 'Utilisateur'}</h3>
//                           <p className="text-gray-600 text-sm">{currentUser?.email}</p>
//                           <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#ea80fc]/10 to-purple-500/10 px-3 py-1 rounded-full mt-2 border border-[#ea80fc]/20">
//                             <div className="w-2 h-2 bg-[#ea80fc] rounded-full animate-pulse"></div>
//                             <span className="text-xs font-semibold text-gray-700 capitalize">
//                               {currentUser?.role ? getRoleDisplayName(currentUser.role) : 'Non connecté'}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Actions du menu */}
//                     <div className="p-4">
//                       <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center space-x-4 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-100"
//                       >
//                         <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
//                           <LogOut className="w-5 h-5 text-red-500" />
//                         </div>
//                         <div className="text-left">
//                           <p className="font-semibold text-sm">Se déconnecter</p>
//                           <p className="text-xs text-gray-500">Quitter la session en cours</p>
//                         </div>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Bouton Menu Mobile */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-5 h-5 text-gray-700" />
//                 ) : (
//                   <Menu className="w-5 h-5 text-gray-700" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Ligne de séparation élégante */}
//         <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
//       </nav>

//       {/* Menu Mobile */}
//       {isMobileMenuOpen && (
//         <div className="fixed top-20 inset-x-0 z-40 md:hidden animate-in slide-in-from-top-5 duration-300">
//           <div className="bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-gray-200 mx-4 rounded-2xl overflow-hidden">
//             <div className="p-4 space-y-2">
//               {navItems.map((item) =>
//                 item.show && (
//                   <button
//                     key={item.id}
//                     onClick={() => {
//                       onNavigate(item.id);
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
//                       currentView === item.id
//                         ? 'bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white shadow-lg'
//                         : 'text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     <item.icon className={`w-5 h-5 ${
//                       currentView === item.id ? 'text-white' : 'text-gray-500'
//                     }`} />
//                     <span className="font-medium">{item.label}</span>
//                   </button>
//                 )
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Overlay pour menu mobile */}
//       {isMobileMenuOpen && (
//         <div 
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Modal de Confirmation de Déconnexion */}
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in-0">
//           <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-200 animate-in zoom-in-95">
//             <div className="text-center mb-6">
//               <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
//                 <LogOut className="w-10 h-10 text-red-500" />
//               </div>
//               <h3 className="text-2xl font-black text-gray-900 mb-2">Se déconnecter ?</h3>
//               <p className="text-gray-600">
//                 Êtes-vous sûr de vouloir vous déconnecter de votre compte {currentUser?.nom} ?
//               </p>
//             </div>
            
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 border border-gray-300"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={confirmLogout}
//                 className="flex-1 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-md"
//               >
//                 Se déconnecter
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Espace pour la hauteur fixe de la navbar */}
//       <div className="h-20"></div>
//     </>
//   );
// }

// src/components/Navbar.tsx
import { Home, BookOpen, Building, User, Sparkles, LogOut, LogIn, ChevronDown, Menu, X } from 'lucide-react';
import { ViewType, User as UserType } from '../types';
import { useState, useEffect } from 'react';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  onLogin: () => void; // Ajout de cette prop pour gérer la connexion
}

export default function Navbar({ currentView, onNavigate, currentUser, onLogout, onLogin }: NavbarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showOwnerButton = currentUser?.role === 'proprietaire' || currentUser?.role === 'admin';
  const showBookingsButton = currentUser?.role === 'locataire' || currentUser?.role === 'admin';

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setIsProfileOpen(false);
  };

  const confirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  const handleLogin = () => {
    onLogin();
    setIsProfileOpen(false);
  };

  const getRoleDisplayName = (role: string) => {
    const roles: { [key: string]: string } = {
      proprietaire: 'Propriétaire',
      locataire: 'Locataire',
      admin: 'Administrateur'
    };
    return roles[role] || role;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const navItems = [
    { id: 'home' as ViewType, label: 'Accueil', icon: Home, show: true },
    { id: 'owner' as ViewType, label: 'Mes Biens', icon: Building, show: showOwnerButton },
    { id: 'bookings' as ViewType, label: 'Réservations', icon: BookOpen, show: showBookingsButton },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-gray-200' 
          : 'bg-white/90 backdrop-blur-2xl border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Élégant */}
            <div 
              className="flex items-center space-x-4 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ea80fc] to-purple-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-[#ea80fc] rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent tracking-tight">
                RésidenceÉlégante
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">EXCELLENCE IMMOBILIÈRE</p>
              </div>
            </div>

            {/* Navigation Centrale - Desktop */}
            <div className="hidden md:flex items-center space-x-1 bg-gray-50/80 backdrop-blur-lg rounded-2xl p-2 shadow-inner border border-gray-200">
              {navItems.map((item) => 
                item.show && (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 group relative overflow-hidden ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-black hover:bg-white/80'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 relative ${
                      currentView === item.id ? 'text-white' : 'text-gray-500 group-hover:text-[#ea80fc]'
                    }`} />
                    <span className="relative font-medium text-sm tracking-wide">{item.label}</span>
                    {currentView === item.id && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </button>
                )
              )}
            </div>

            {/* Profile Utilisateur */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#ea80fc] to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-md">
                    {currentUser?.nom ? getInitials(currentUser.nom) : <User className="w-5 h-5" />}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="font-semibold text-gray-900 text-sm">
                      {currentUser?.nom || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.role ? getRoleDisplayName(currentUser.role) : 'Non connecté'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Menu Déroulant */}
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-2xl animate-in fade-in-0 zoom-in-95">
                    {/* En-tête du profil */}
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50 border-b border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#ea80fc] to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {currentUser?.nom ? getInitials(currentUser.nom) : <User className="w-8 h-8" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{currentUser?.nom || 'Utilisateur'}</h3>
                          <p className="text-gray-600 text-sm">{currentUser?.email || 'Non connecté'}</p>
                          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#ea80fc]/10 to-purple-500/10 px-3 py-1 rounded-full mt-2 border border-[#ea80fc]/20">
                            <div className="w-2 h-2 bg-[#ea80fc] rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-gray-700 capitalize">
                              {currentUser?.role ? getRoleDisplayName(currentUser.role) : 'Non connecté'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions du menu */}
                    <div className="p-4">
                      {currentUser ? (
                        // Utilisateur connecté - Afficher "Se déconnecter"
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-4 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-100"
                        >
                          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <LogOut className="w-5 h-5 text-red-500" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-sm">Se déconnecter</p>
                            <p className="text-xs text-gray-500">Quitter la session en cours</p>
                          </div>
                        </button>
                      ) : (
                        // Utilisateur non connecté - Afficher "Se connecter"
                        <button
                          onClick={handleLogin}
                          className="w-full flex items-center space-x-4 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-all duration-300 group border border-transparent hover:border-green-100"
                        >
                          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                            <LogIn className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-sm">Se connecter</p>
                            <p className="text-xs text-gray-500">Accéder à votre compte</p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton Menu Mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ligne de séparation élégante */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </nav>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 inset-x-0 z-40 md:hidden animate-in slide-in-from-top-5 duration-300">
          <div className="bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-gray-200 mx-4 rounded-2xl overflow-hidden">
            <div className="p-4 space-y-2">
              {navItems.map((item) =>
                item.show && (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${
                      currentView === item.id ? 'text-white' : 'text-gray-500'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour menu mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Modal de Confirmation de Déconnexion */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in-0">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-200 animate-in zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
                <LogOut className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Se déconnecter ?</h3>
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir vous déconnecter de votre compte {currentUser?.nom} ?
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 border border-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-gradient-to-r from-[#ea80fc] to-purple-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-md"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Espace pour la hauteur fixe de la navbar */}
      <div className="h-20"></div>
    </>
  );
}