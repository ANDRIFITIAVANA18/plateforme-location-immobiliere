import { describe, it, expect } from 'vitest'
import { 
  calculateDistance, 
  formatDistance, 
  isValidCoordinates,
  getUrbanDensity,
  getBaseDistance 
} from '../geoUtils'

describe('geoUtils', () => {
  describe('isValidCoordinates', () => {
    it('valide des coordonnées correctes', () => {
      expect(isValidCoordinates(48.8566, 2.3522)).toBe(true) // Paris
      expect(isValidCoordinates(-33.8688, 151.2093)).toBe(true) // Sydney
      expect(isValidCoordinates(40.7128, -74.0060)).toBe(true) // New York
    })

    it('rejette des coordonnées invalides', () => {
      expect(isValidCoordinates(91, 0)).toBe(false) // Latitude trop haute
      expect(isValidCoordinates(-91, 0)).toBe(false) // Latitude trop basse
      expect(isValidCoordinates(0, 181)).toBe(false) // Longitude trop haute
      expect(isValidCoordinates(0, -181)).toBe(false) // Longitude trop basse
      expect(isValidCoordinates(NaN, 0)).toBe(false) // NaN
      expect(isValidCoordinates(0, NaN)).toBe(false) // NaN
    })
  })

  describe('calculateDistance', () => {
    it('calcule la distance entre Paris et Lyon', () => {
      // Paris à Lyon (environ 392 km)
      const distance = calculateDistance(48.8566, 2.3522, 45.7640, 4.8357)
      expect(distance).toBeGreaterThan(390000) // en mètres
      expect(distance).toBeLessThan(400000)
    })

    it('calcule la distance entre deux points proches', () => {
      // Deux points à 100m de distance
      const distance = calculateDistance(48.8566, 2.3522, 48.8575, 2.3522)
      expect(distance).toBeCloseTo(100, -2) // ≈100m
    })

    it('retourne 0 pour les mêmes coordonnées', () => {
      const distance = calculateDistance(48.8566, 2.3522, 48.8566, 2.3522)
      expect(distance).toBe(0)
    })
  })

  describe('formatDistance', () => {
    it('formate les distances en mètres', () => {
      expect(formatDistance(500)).toBe('500 m')
      expect(formatDistance(999)).toBe('999 m')
    })

    it('formate les distances en kilomètres', () => {
      expect(formatDistance(1000)).toBe('1.0 km')
      expect(formatDistance(2500)).toBe('2.5 km')
      expect(formatDistance(12345)).toBe('12.3 km')
    })

    it('gère les valeurs arrondies', () => {
      expect(formatDistance(999.9)).toBe('1000 m')
      expect(formatDistance(1000.1)).toBe('1.0 km')
    })
  })

  describe('getUrbanDensity', () => {
    it('identifie les villes à haute densité', () => {
      expect(getUrbanDensity('paris')).toBe('high')
      expect(getUrbanDensity('lyon')).toBe('high')
      expect(getUrbanDensity('london')).toBe('high')
    })

    it('identifie les villes à densité moyenne', () => {
      expect(getUrbanDensity('nantes')).toBe('medium')
      expect(getUrbanDensity('strasbourg')).toBe('medium')
      expect(getUrbanDensity('brussels')).toBe('medium')
    })

    it('identifie les villes à basse densité par défaut', () => {
      expect(getUrbanDensity('unknown-city')).toBe('low')
      expect(getUrbanDensity('village')).toBe('low')
    })

    it('est insensible à la casse', () => {
      expect(getUrbanDensity('PARIS')).toBe('high')
      expect(getUrbanDensity('Paris')).toBe('high')
    })
  })

  describe('getBaseDistance', () => {
    it('retourne les distances de base pour Paris (haute densité)', () => {
      expect(getBaseDistance('supermarket', 'high')).toBe(500)
      expect(getBaseDistance('restaurant', 'high')).toBe(300)
      expect(getBaseDistance('transport', 'high')).toBe(400)
    })

    it('retourne les distances de base pour une ville moyenne', () => {
      expect(getBaseDistance('supermarket', 'medium')).toBe(800)
      expect(getBaseDistance('park', 'medium')).toBe(900)
    })

    it('retourne les distances de base pour une campagne (basse densité)', () => {
      expect(getBaseDistance('hospital', 'low')).toBe(5000)
      expect(getBaseDistance('shopping', 'low')).toBe(3000)
    })

    it('retourne une valeur par défaut pour les types inconnus', () => {
      expect(getBaseDistance('unknown_type', 'high')).toBe(1000)
    })
  })
})
