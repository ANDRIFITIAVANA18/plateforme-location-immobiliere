

// // src/components/Login.tsx
// import { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import { LoginData } from '../types';

// interface LoginProps {
//   onLogin: (credentials: LoginData) => void;
//   onNavigateToRegister: () => void;
//   isLoading: boolean;
// }

// export default function Login({ onLogin, onNavigateToRegister, isLoading }: LoginProps) {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onLogin(formData);
//   };

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
//           {/* Logo et titre */}
//           <div className="text-center mb-8">
//             <div className="flex justify-center mb-4">
//               <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                 </svg>
//               </div>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">
//               LocaPlace
//             </h1>
//             <p className="text-gray-600 text-sm">
//               Connectez-vous à votre compte
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                   placeholder="...@email.com"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             {/* Mot de passe */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mot de passe
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
//                   placeholder="••••••••"
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
//                   disabled={isLoading}
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>

//             {/* Bouton de connexion */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-all duration-300 font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>Connexion...</span>
//                 </>
//               ) : (
//                 <span>Se connecter</span>
//               )}
//             </button>
//           </form>

//           {/* Lien vers l'inscription */}
//           <div className="mt-6 text-center">
//             <p className="text-gray-600 text-sm">
//               Pas encore de compte ?{' '}
//               <button
//                 onClick={onNavigateToRegister}
//                 disabled={isLoading}
//                 className="text-red-500 hover:text-red-600 font-semibold transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
//               >
//                 S'inscrire
//               </button>
//             </p>
//           </div>

//           {/* Informations de démo */}
//           {/* <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
//             <h3 className="text-xs font-semibold text-gray-900 mb-2">Comptes de démonstration :</h3>
//             <div className="text-xs text-gray-600 space-y-1">
//               <p><strong>Propriétaire:</strong> proprietaire@test.com / password</p>
//               <p><strong>Locataire:</strong> locataire@test.com / password</p>
//               <p><strong>Admin:</strong> admin@locaplace.com / password</p>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }
// src/components/Login.tsx
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { LoginData } from '../types';

// Icône personnalisée pour RésidenceÉlégante
const ResidenceEleganteIcon = ({ className = "w-8 h-8" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M12 2L15 5H9L12 2z" 
      fill="currentColor"
    />
    <rect x="8" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
    <rect x="14" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
    <rect x="10" y="15" width="4" height="4" rx="1" fill="currentColor"/>
  </svg>
);

interface LoginProps {
  onLogin: (credentials: LoginData) => void;
  onNavigateToRegister: () => void;
  isLoading: boolean;
}

export default function Login({ onLogin, onNavigateToRegister, isLoading }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Logo et titre AVEC NOUVEAU NOM ET ICÔNE */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#ea80fc] rounded-2xl flex items-center justify-center shadow-lg">
                <ResidenceEleganteIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              RésidenceÉlégante
            </h1>
            <p className="text-gray-600 text-sm">
              L'art de bien habiter
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-200"
                  placeholder="votre@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#ea80fc] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ea80fc] text-white py-3 rounded-xl hover:bg-[#e040fb] transition-all duration-300 font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connexion...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>

          {/* Lien vers l'inscription */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Pas encore de compte ?{' '}
              <button
                onClick={onNavigateToRegister}
                disabled={isLoading}
                className="text-[#ea80fc] hover:text-[#e040fb] font-semibold transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}