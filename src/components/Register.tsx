import { useState } from 'react';
import { Eye, EyeOff, Mail, Phone, User as UserIcon, ArrowLeft } from 'lucide-react';
import { RegisterData, UserRole } from '../types';

interface RegisterProps {
  onRegister: (userData: RegisterData) => void;
  onBack: () => void;
  selectedRole: UserRole | null;
  isLoading: boolean;
}

export default function Register({ onRegister, onBack, selectedRole, isLoading }: RegisterProps) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      alert('Veuillez sélectionner un rôle');
      return;
    }

    if (formData.password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    onRegister({
      nom: formData.nom,
      email: formData.email,
      telephone: formData.telephone,
      password: formData.password,
      role: selectedRole
    });
  };

  const getRoleDisplayName = (role: UserRole | null) => {
    switch (role) {
      case 'proprietaire': return 'Propriétaire';
      case 'locataire': return 'Locataire';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* En-tête moderne avec bouton retour */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              disabled={isLoading}
              className="flex items-center space-x-3 text-gray-500 hover:text-[#ea80fc] transition-all duration-300 group bg-gray-100 hover:bg-[#f3e5f5] px-4 py-2 rounded-xl border border-gray-200 hover:border-[#ea80fc]"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Retour</span>
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-[#ea80fc] to-[#e040fb] rounded-xl flex items-center justify-center shadow-lg">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Titre principal */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
              Créer un compte
            </h1>
            <div className="inline-flex items-center space-x-2 bg-[#f3e5f5] px-4 py-2 rounded-full border border-[#ea80fc]">
              <div className="w-2 h-2 bg-[#ea80fc] rounded-full"></div>
              <p className="text-[#8e24aa] text-sm font-medium">
                {selectedRole ? `Inscription en tant que ${getRoleDisplayName(selectedRole)}` : 'Sélectionnez un rôle'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ligne 1 : Nom complet et Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nom complet
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#ea80fc] transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-[#ea80fc] transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="...."
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#ea80fc] transition-colors" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-[#ea80fc] transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="....@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Ligne 2 : Téléphone et Mot de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#ea80fc] transition-colors" />
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-[#ea80fc] transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="+33 6 12 34 56 78"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ea80fc] focus:border-[#ea80fc] transition-all duration-200 bg-white hover:border-gray-300"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#ea80fc] transition-colors p-1 rounded-lg hover:bg-[#f3e5f5]"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  🔒 Minimum 6 caractères
                </p>
              </div>
            </div>

            {/* Indicateur de rôle */}
            {selectedRole && (
              <div className="p-5 bg-gradient-to-r from-[#f3e5f5] to-white rounded-2xl border-2 border-[#ea80fc] shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#ea80fc] rounded-xl flex items-center justify-center shadow-md">
                    {selectedRole === 'proprietaire' ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-base">Inscription en tant que {getRoleDisplayName(selectedRole)}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedRole === 'proprietaire' 
                        ? 'Gérez et louez vos biens immobiliers en toute simplicité'
                        : 'Réservez les meilleurs hébergements pour vos voyages'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={isLoading || !selectedRole}
              className="w-full bg-gradient-to-r from-[#ea80fc] to-[#e040fb] text-white py-4 rounded-xl hover:from-[#e040fb] hover:to-[#d500f9] transition-all duration-300 font-bold text-base disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Création du compte...</span>
                </>
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
