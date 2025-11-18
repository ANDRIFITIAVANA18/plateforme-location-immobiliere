// Fonction pour calculer la distance entre deux points (formule haversine)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000 // Rayon de la Terre en mètres
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Fonction pour formater la distance
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  } else {
    return `${(meters / 1000).toFixed(1)} km`
  }
}

// Fonction pour valider les coordonnées GPS
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return !isNaN(lat) && !isNaN(lng) && 
         lat >= -90 && lat <= 90 && 
         lng >= -180 && lng <= 180
}

// Fonction pour déterminer la densité urbaine
export const getUrbanDensity = (city: string): 'high' | 'medium' | 'low' => {
  const highDensityCities = ['paris', 'lyon', 'marseille', 'lille', 'toulouse', 'bordeaux', 'london', 'berlin', 'madrid', 'rome']
  const mediumDensityCities = ['nantes', 'strasbourg', 'montpellier', 'nice', 'rennes', 'brussels', 'amsterdam', 'vienna', 'prague']
  
  const normalizedCity = city.toLowerCase()
  
  if (highDensityCities.includes(normalizedCity)) return 'high'
  if (mediumDensityCities.includes(normalizedCity)) return 'medium'
  return 'low'
}

// Fonction pour obtenir les distances de base selon le type et la densité
export const getBaseDistance = (poiType: string, density: 'high' | 'medium' | 'low'): number => {
  const baseDistances = {
    supermarket: { high: 500, medium: 800, low: 1500 },
    restaurant: { high: 300, medium: 500, low: 1000 },
    transport: { high: 400, medium: 600, low: 1200 },
    park: { high: 600, medium: 900, low: 2000 },
    school: { high: 800, medium: 1200, low: 2500 },
    pharmacy: { high: 400, medium: 600, low: 1500 },
    hospital: { high: 1500, medium: 2500, low: 5000 },
    bank: { high: 500, medium: 800, low: 2000 },
    shopping: { high: 1000, medium: 1500, low: 3000 },
    church: { high: 700, medium: 1000, low: 2000 }
  }

  const key = poiType.toLowerCase().replace(' ', '_') as keyof typeof baseDistances
  return baseDistances[key]?.[density] || 1000
}
