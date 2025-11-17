

// // src/components/RoleSelection.tsx
// import { Building, User, ArrowLeft } from 'lucide-react';
// import { UserRole } from '../types';

// interface RoleSelectionProps {
//   onRoleSelect: (role: UserRole) => void;
//   onBack: () => void;
// }

// export default function RoleSelection({ onRoleSelect, onBack }: RoleSelectionProps) {
//   const roles = [
//     {
//       id: 'proprietaire' as UserRole,
//       title: 'Propriétaire',
//       description: 'Je souhaite louer mes biens immobiliers',
//       icon: Building,
//       color: 'red',
//       features: [
//         'Gérer mes propriétés',
//         'Recevoir des réservations',
//         'Visualiser mes revenus'
//       ]
//     },
//     {
//       id: 'locataire' as UserRole,
//       title: 'Locataire',
//       description: 'Je cherche à réserver un hébergement',
//       icon: User,
//       color: 'red',
//       features: [
//         'Rechercher des hébergements',
//         'Faire des réservations',
//         'Gérer mes voyages'
//       ]
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center p-4">
//       <div className="max-w-3xl w-full">
//         <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
//           {/* En-tête moderne avec bouton retour */}
//           <div className="flex items-center justify-between mb-8">
//             <button
//               onClick={onBack}
//               className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-all duration-300 group bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-red-200"
//             >
//               <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
//               <span className="text-xs font-semibold">Retour</span>
//             </button>
//             <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
//               <Building className="w-4 h-4 text-white" />
//             </div>
//           </div>

//           {/* Titre principal élégant */}
//           <div className="text-center mb-10">
           
          
//               <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
//            Choisir vos rôle
//             </h1>
//             <div className="inline-flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
//               <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//               <p className="text-red-700 text-sm font-medium">
//             Sélectionnez un rôle
//               </p>
//             </div>
            
//           </div>

//           {/* Cartes de rôle modernes */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             {roles.map((role) => (
//               <button
//                 key={role.id}
//                 onClick={() => onRoleSelect(role.id)}
//                 className="group relative bg-white rounded-2xl border border-gray-200 p-5 transition-all duration-300 hover:border-red-300 hover:shadow-lg hover:scale-102 text-left overflow-hidden"
//               >
//                 {/* Effet de gradient au survol */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
//                 <div className="relative z-10">
//                   {/* En-tête de carte */}
//                   <div className="flex items-start space-x-4 mb-4">
//                     <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shadow-md">
//                       <role.icon className="w-4 h-4 text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-lg text-gray-900 mb-1">
//                         {role.title}
//                       </h3>
//                       <p className="text-gray-600 text-xs">
//                         {role.description}
//                       </p>
//                     </div>
//                   </div>
                  
//                   {/* Liste des fonctionnalités */}
//                   <ul className="space-y-2 mt-4 mb-4">
//                     {role.features.map((feature, index) => (
//                       <li key={index} className="flex items-center space-x-3 text-gray-700 group-hover:text-gray-900 transition-colors">
//                         <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 group-hover:scale-110 group-hover:bg-red-500 transition-all duration-200" />
//                         <span className="text-sm font-medium">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
                  
//                   {/* Footer de carte */}
//                   <div className="pt-4 border-t border-gray-200 group-hover:border-red-200 transition-colors">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
//                         Commencer
//                       </span>
//                       <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:translate-x-1 group-hover:scale-105 transition-transform duration-200 shadow-md">
//                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>

//           {/* Section information moderne */}
//           <div className="p-5 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl border border-gray-200">
//             <div className="flex items-start space-x-3">
//               <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
//                 <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="flex-1">
//                 <h4 className="font-semibold text-gray-900 mb-1 text-sm">À savoir</h4>
//                 <p className="text-gray-600 text-xs leading-relaxed">
//                   Votre choix déterminera l'interface et les fonctionnalités disponibles. 
//                   <span className="font-medium text-red-600"> Modifiable via le support.</span>
//                 </p>
//               </div>
//             </div>
//           </div>

         
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/RoleSelection.tsx
import { Building, User, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
  onBack: () => void;
}

export default function RoleSelection({ onRoleSelect, onBack }: RoleSelectionProps) {
  const roles = [
    {
      id: 'proprietaire' as UserRole,
      title: 'Propriétaire',
      description: 'Je souhaite louer mes biens immobiliers',
      icon: Building,
      color: '[#ea80fc]',
      features: [
        'Gérer mes propriétés',
        'Recevoir des réservations',
        'Visualiser mes revenus'
      ]
    },
    {
      id: 'locataire' as UserRole,
      title: 'Locataire',
      description: 'Je cherche à réserver un hébergement',
      icon: User,
      color: '[#ea80fc]',
      features: [
        'Rechercher des hébergements',
        'Faire des réservations',
        'Gérer mes voyages'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
          {/* En-tête moderne avec bouton retour */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-500 hover:text-[#ea80fc] transition-all duration-300 group bg-gray-100 hover:bg-[#f3e5f5] px-3 py-2 rounded-lg border border-gray-200 hover:border-[#ea80fc]"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-semibold">Retour</span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-[#ea80fc] to-[#e040fb] rounded-xl flex items-center justify-center shadow-md">
              <Building className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Titre principal élégant */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
              Choisir votre rôle
            </h1>
            <div className="inline-flex items-center space-x-2 bg-[#f3e5f5] px-4 py-2 rounded-full border border-[#ea80fc]">
              <div className="w-2 h-2 bg-[#ea80fc] rounded-full"></div>
              <p className="text-[#8e24aa] text-sm font-medium">
                Sélectionnez un rôle
              </p>
            </div>
          </div>

          {/* Cartes de rôle modernes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => onRoleSelect(role.id)}
                className="group relative bg-white rounded-2xl border border-gray-200 p-5 transition-all duration-300 hover:border-[#ea80fc] hover:shadow-lg hover:scale-102 text-left overflow-hidden"
              >
                {/* Effet de gradient au survol */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f3e5f5] to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  {/* En-tête de carte */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#ea80fc] to-[#e040fb] rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shadow-md">
                      <role.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {role.title}
                      </h3>
                      <p className="text-gray-600 text-xs">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Liste des fonctionnalités */}
                  <ul className="space-y-2 mt-4 mb-4">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                        <div className="w-1.5 h-1.5 bg-[#ea80fc] rounded-full flex-shrink-0 group-hover:scale-110 group-hover:bg-[#e040fb] transition-all duration-200" />
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Footer de carte */}
                  <div className="pt-4 border-t border-gray-200 group-hover:border-[#ea80fc] transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-[#ea80fc] transition-colors">
                        Commencer
                      </span>
                      <div className="w-8 h-8 bg-gradient-to-br from-[#ea80fc] to-[#e040fb] rounded-lg flex items-center justify-center group-hover:translate-x-1 group-hover:scale-105 transition-transform duration-200 shadow-md">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Section information moderne */}
          <div className="p-5 bg-gradient-to-r from-gray-50 to-[#f3e5f5] rounded-xl border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-3 h-3 text-[#ea80fc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">À savoir</h4>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Votre choix déterminera l'interface et les fonctionnalités disponibles. 
                  <span className="font-medium text-[#ea80fc]"> Modifiable via le support.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}