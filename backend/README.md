# Flask Backend - Plateforme de Location Immobilière

## Installation

1. Installer les dépendances:
```bash
pip install -r requirements.txt
```

## Démarrage

```bash
python app.py
```

Le serveur démarre sur `http://localhost:5000`

## API Endpoints

- `GET /api/properties` - Liste des propriétés (avec filtres optionnels)
- `GET /api/properties/:id` - Détails d'une propriété
- `POST /api/bookings` - Créer une réservation
- `GET /api/bookings` - Liste des réservations
- `GET /api/bookings/:id` - Détails d'une réservation
- `POST /api/reviews` - Créer un avis
- `GET /api/cities` - Liste des villes disponibles
