import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AddPropertyForm from '../AddPropertyForm'

// Mock pour react-leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer">TileLayer</div>,
  Marker: () => <div data-testid="marker">Marker</div>,
  useMapEvents: () => ({
    on: vi.fn(),
    off: vi.fn(),
  }),
}))

// Mock pour lucide-react
vi.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon">X</div>,
}))

// Mock pour leaflet
vi.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: vi.fn(),
    },
  },
}))

// Mock pour fetch global
global.fetch = vi.fn()

const mockProps = {
  ownerId: 'owner-123',
  onPropertyAdded: vi.fn(),
  onCancel: vi.fn(),
}

describe('AddPropertyForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche le formulaire d ajout de propriété', () => {
    render(<AddPropertyForm {...mockProps} />)
    
    // Vérifie que le titre est affiché
    expect(screen.getByText('Publier un nouveau bien')).toBeInTheDocument()
    
    // Vérifie que la carte est présente
    expect(screen.getByTestId('map-container')).toBeInTheDocument()
    
    // Vérifie les sections principales
    expect(screen.getByText('Informations principales')).toBeInTheDocument()
    expect(screen.getByText('Localisation')).toBeInTheDocument()
    expect(screen.getByText('Détails du bien')).toBeInTheDocument()
    expect(screen.getByText('Galerie photos')).toBeInTheDocument()
  })

  it('permet de saisir les informations de base', () => {
    render(<AddPropertyForm {...mockProps} />)
    
    // Test de saisie du titre
    const titleInput = screen.getByPlaceholderText('Ex: Magnifique appartement avec vue sur la mer')
    fireEvent.change(titleInput, { target: { value: 'Mon super appartement' } })
    expect(titleInput).toHaveValue('Mon super appartement')
    
    // Test de saisie de la description
    const descriptionInput = screen.getByPlaceholderText('Décrivez votre bien en détail...')
    fireEvent.change(descriptionInput, { target: { value: 'Très bel appartement' } })
    expect(descriptionInput).toHaveValue('Très bel appartement')
  })

  it('affiche les erreurs de validation', async () => {
    render(<AddPropertyForm {...mockProps} />)
    
    // Essaye de soumettre sans remplir les champs obligatoires
    const submitButton = screen.getByText('Publier le bien')
    fireEvent.click(submitButton)
    
    // Vérifie que le bouton est désactivé (car pas de localisation)
    expect(submitButton).toBeDisabled()
  })

  it('gère la sélection de localisation sur la carte', async () => {
    render(<AddPropertyForm {...mockProps} />)
    
    // Simule un clic sur la carte (coordonnées de Paris)
    const mapContainer = screen.getByTestId('map-container')
    fireEvent.click(mapContainer)
    
    // Vérifie que le message d'emplacement requis disparaît après sélection
    await waitFor(() => {
      expect(screen.queryByText('Veuillez sélectionner un emplacement sur la carte')).not.toBeInTheDocument()
    })
  })

  it('permet de changer le type de propriété', () => {
    render(<AddPropertyForm {...mockProps} />)
    
    const typeSelect = screen.getByDisplayValue('🏢 Appartement')
    fireEvent.change(typeSelect, { target: { value: 'house' } })
    expect(typeSelect).toHaveValue('house')
  })

  it('gère l upload d images', () => {
    render(<AddPropertyForm {...mockProps} />)
    
    // Vérifie que la zone de drop est présente
    const dropZone = screen.getByText('Ajoutez vos photos')
    expect(dropZone).toBeInTheDocument()
    
    // Vérifie le texte d'instructions
    expect(screen.getByText('Glissez-déposez vos images ou')).toBeInTheDocument()
  })
})
