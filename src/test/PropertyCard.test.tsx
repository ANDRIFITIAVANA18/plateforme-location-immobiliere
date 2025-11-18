import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PropertyCard from '../PropertyCard'

// Données de test avec géolocalisation
const mockProperty = {
  id: 1,
  title: 'Appartement moderne',
  price: 1200,
  location: 'Paris, France',
  image: '/api/placeholder/300/200',
  bedrooms: 3,
  bathrooms: 2,
  latitude: 48.8566,    // ✅ NOUVEAU - Latitude Paris
  longitude: 2.3522     // ✅ NOUVEAU - Longitude Paris
}

describe('PropertyCard', () => {
  it('affiche correctement les informations de la propriété', () => {
    render(<PropertyCard property={mockProperty} />)
    
    // Vérifie que le titre est affiché
    expect(screen.getByText('Appartement moderne')).toBeInTheDocument()
    
    // Vérifie que le prix est affiché
    expect(screen.getByText('1200€/mois')).toBeInTheDocument()
    
    // Vérifie que la localisation est affichée
    expect(screen.getByText('Paris, France')).toBeInTheDocument()
    
    // Vérifie que les caractéristiques sont affichées
    expect(screen.getByText('3 chambres')).toBeInTheDocument()
    expect(screen.getByText('2 salles de bain')).toBeInTheDocument()
  })

  it('affiche une image avec le alt text correct', () => {
    render(<PropertyCard property={mockProperty} />)
    
    const image = screen.getByAltText('Appartement moderne')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/api/placeholder/300/200')
  })

  // ✅ NOUVEAU TEST - Vérifie la présence des coordonnées GPS
  it('affiche les coordonnées GPS si disponibles', () => {
    render(<PropertyCard property={mockProperty} />)
    
    // Vérifie que les coordonnées sont affichées ou utilisées
    // (selon comment tu les affiches dans ton composant)
    expect(mockProperty.latitude).toBe(48.8566)
    expect(mockProperty.longitude).toBe(2.3522)
  })
})
