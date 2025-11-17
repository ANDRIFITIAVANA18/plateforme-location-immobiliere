

# backend/models.py
import os
import sys
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from uuid import uuid4
import hashlib

print("✅ models.py chargé avec succès")

# Récupère DATABASE_URL depuis les variables d'environnement
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ ERREUR : La variable d'environnement DATABASE_URL n'est pas définie.", file=sys.stderr)
    sys.exit(1)

print(f"ℹ️  Connexion à la base de données : {DATABASE_URL.replace('://postgres:', '://postgres:***')}")

@contextmanager
def get_db_connection():
    """Gère proprement la connexion à PostgreSQL."""
    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        yield conn
    except psycopg2.OperationalError as e:
        print(f"❌ Erreur de connexion à la base de données : {e}", file=sys.stderr)
        raise
    finally:
        if conn:
            conn.close()

def hash_password(password):
    """Hash un mot de passe avec SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def init_db():
    """Crée les tables si elles n'existent pas."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Table des utilisateurs
            cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    nom TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    telephone TEXT,
                    password_hash TEXT NOT NULL,
                    role TEXT NOT NULL CHECK (role IN ('admin', 'proprietaire', 'locataire')),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Table des propriétés - AJOUT DES CHAMPS LATITUDE ET LONGITUDE
            cur.execute('''
                CREATE TABLE IF NOT EXISTS properties (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    description TEXT,
                    address TEXT,
                    city TEXT,
                    country TEXT,
                    latitude FLOAT,
                    longitude FLOAT,
                    price_per_night FLOAT,
                    price_type TEXT DEFAULT 'night' CHECK (price_type IN ('night', 'month')),
                    bedrooms INTEGER,
                    bathrooms INTEGER,
                    max_guests INTEGER,
                    property_type TEXT,
                    amenities TEXT[],
                    images TEXT[],
                    is_available BOOLEAN DEFAULT TRUE,
                    owner_id TEXT NOT NULL REFERENCES users(id),
                    rating FLOAT DEFAULT 0,
                    reviews_count INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Table des réservations
            cur.execute('''
                CREATE TABLE IF NOT EXISTS bookings (
                    id TEXT PRIMARY KEY,
                    property_id TEXT NOT NULL REFERENCES properties(id),
                    guest_name TEXT NOT NULL,
                    guest_email TEXT NOT NULL,
                    guest_phone TEXT NOT NULL,
                    check_in DATE NOT NULL,
                    check_out DATE NOT NULL,
                    guests_count INTEGER NOT NULL,
                    total_price FLOAT NOT NULL,
                    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # NOUVELLE TABLE : Demandes de visite
            cur.execute('''
                CREATE TABLE IF NOT EXISTS visit_requests (
                    id TEXT PRIMARY KEY,
                    property_id TEXT NOT NULL REFERENCES properties(id),
                    user_id TEXT NOT NULL REFERENCES users(id),
                    requested_date DATE NOT NULL,
                    requested_time TEXT NOT NULL,
                    message TEXT,
                    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled')),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # NOUVELLE TABLE : Messages
            cur.execute('''
                CREATE TABLE IF NOT EXISTS messages (
                    id TEXT PRIMARY KEY,
                    property_id TEXT NOT NULL REFERENCES properties(id),
                    from_user_id TEXT NOT NULL REFERENCES users(id),
                    to_user_id TEXT NOT NULL REFERENCES users(id),
                    message TEXT NOT NULL,
                    is_read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
    print("✅ Tables créées ou déjà existantes.")

# === Fonctions pour les utilisateurs ===

def create_user(nom, email, telephone, password, role):
    """Crée un nouvel utilisateur"""
    user_id = str(uuid4())
    password_hash = hash_password(password)
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute('''
                INSERT INTO users (id, nom, email, telephone, password_hash, role)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (user_id, nom, email, telephone, password_hash, role))
            conn.commit()
    
    return get_user_by_id(user_id)

def get_user_by_id(user_id):
    """Récupère un utilisateur par son ID"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id, nom, email, telephone, role, created_at FROM users WHERE id = %s", (user_id,))
            row = cur.fetchone()
            return dict(row) if row else None

def get_user_by_email(email):
    """Récupère un utilisateur par son email"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            row = cur.fetchone()
            return dict(row) if row else None

def verify_user_credentials(email, password):
    """Vérifie les identifiants de connexion"""
    user = get_user_by_email(email)
    if user and user['password_hash'] == hash_password(password):
        # Retourne l'utilisateur sans le mot de passe
        return {k: v for k, v in user.items() if k != 'password_hash'}
    return None

# === Fonctions pour les propriétés ===

def get_all_properties():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM properties ORDER BY created_at DESC")
            return [dict(row) for row in cur.fetchall()]

def get_property_by_id(property_id):
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM properties WHERE id = %s", (property_id,))
            row = cur.fetchone()
            return dict(row) if row else None

def create_property(data):
    prop_id = str(uuid4())
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute('''
                INSERT INTO properties (
                    id, title, description, address, city, country,
                    latitude, longitude, price_per_night, price_type, 
                    bedrooms, bathrooms, max_guests, property_type, 
                    amenities, images, owner_id, is_available
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                prop_id,
                data['title'],
                data.get('description', ''),
                data.get('address', ''),
                data['city'],
                data.get('country', 'France'),
                data.get('latitude'),  # NOUVEAU CHAMP
                data.get('longitude'), # NOUVEAU CHAMP
                data['price_per_night'],
                data.get('price_type', 'night'),
                data['bedrooms'],
                data['bathrooms'],
                data['max_guests'],
                data['property_type'],
                data.get('amenities', []),
                data.get('images', []),
                data['owner_id'],
                data.get('is_available', True)
            ))
            conn.commit()
    return get_property_by_id(prop_id)

def update_property(property_id, data):
    """Met à jour une propriété"""
    allowed_fields = [
        'title', 'description', 'address', 'city', 'country',
        'latitude', 'longitude', 'price_per_night', 'price_type', 
        'bedrooms', 'bathrooms', 'max_guests', 'property_type', 
        'amenities', 'images', 'is_available'
    ]
    
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    if not update_data:
        raise ValueError("No valid fields to update")
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            set_clause = ", ".join([f"{field} = %s" for field in update_data.keys()])
            values = list(update_data.values()) + [property_id]
            cur.execute(f"UPDATE properties SET {set_clause} WHERE id = %s", values)
            conn.commit()
    
    return get_property_by_id(property_id)

def delete_property(property_id):
    """Supprime une propriété"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Supprimer d'abord les réservations associées
            cur.execute("DELETE FROM bookings WHERE property_id = %s", (property_id,))
            # Supprimer les demandes de visite associées
            cur.execute("DELETE FROM visit_requests WHERE property_id = %s", (property_id,))
            # Supprimer les messages associés
            cur.execute("DELETE FROM messages WHERE property_id = %s", (property_id,))
            # Puis supprimer la propriété
            cur.execute("DELETE FROM properties WHERE id = %s", (property_id,))
            conn.commit()

def get_properties_by_owner(owner_id):
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM properties WHERE owner_id = %s ORDER BY created_at DESC", (owner_id,))
            return [dict(row) for row in cur.fetchall()]

def get_properties_with_bookings(owner_id):
    """Récupère les propriétés avec leurs réservations"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Récupérer les propriétés
            cur.execute("SELECT * FROM properties WHERE owner_id = %s ORDER BY created_at DESC", (owner_id,))
            properties = [dict(row) for row in cur.fetchall()]
            
            # Pour chaque propriété, récupérer les réservations
            for property in properties:
                cur.execute("SELECT * FROM bookings WHERE property_id = %s ORDER BY created_at DESC", (property['id'],))
                property['bookings'] = [dict(row) for row in cur.fetchall()]
            
            return properties

# === Fonctions pour les réservations ===

def create_booking(booking_data):
    """Crée une nouvelle réservation"""
    booking_id = str(uuid4())
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute('''
                INSERT INTO bookings (
                    id, property_id, guest_name, guest_email, guest_phone,
                    check_in, check_out, guests_count, total_price, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                booking_id,
                booking_data['property_id'],
                booking_data['guest_name'],
                booking_data['guest_email'],
                booking_data['guest_phone'],
                booking_data['check_in'],
                booking_data['check_out'],
                booking_data['guests_count'],
                booking_data['total_price'],
                booking_data.get('status', 'pending')
            ))
            conn.commit()
    
    return get_booking_by_id(booking_id)

def get_booking_by_id(booking_id):
    """Récupère une réservation par son ID"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM bookings WHERE id = %s", (booking_id,))
            row = cur.fetchone()
            return dict(row) if row else None

def get_all_bookings():
    """Récupère toutes les réservations"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT b.*, p.title as property_title, p.city as property_city, p.images as property_images 
                FROM bookings b 
                LEFT JOIN properties p ON b.property_id = p.id 
                ORDER BY b.created_at DESC
            """)
            return [dict(row) for row in cur.fetchall()]

def get_user_bookings(user_email):
    """Récupère les réservations d'un utilisateur par son email"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT b.*, p.title, p.city, p.images 
                FROM bookings b 
                JOIN properties p ON b.property_id = p.id 
                WHERE b.guest_email = %s
                ORDER BY b.created_at DESC
            ''', (user_email,))
            return [dict(row) for row in cur.fetchall()]

def update_booking_status(booking_id, new_status):
    """Met à jour le statut d'une réservation"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Récupérer l'ancien statut et le property_id
            cur.execute("SELECT status, property_id FROM bookings WHERE id = %s", (booking_id,))
            result = cur.fetchone()
            if not result:
                raise ValueError("Réservation non trouvée")
            
            old_status, property_id = result
            
            # Mettre à jour le statut
            cur.execute(
                "UPDATE bookings SET status = %s WHERE id = %s",
                (new_status, booking_id)
            )
            
            # CORRECTION : Gérer la disponibilité de manière plus intelligente
            if new_status == 'confirmed':
                # Si confirmée, rendre le bien indisponible
                cur.execute(
                    "UPDATE properties SET is_available = FALSE WHERE id = %s",
                    (property_id,)
                )
            elif old_status == 'confirmed' and new_status == 'cancelled':
                # Si on annule une réservation confirmée, rendre le bien disponible
                cur.execute(
                    "UPDATE properties SET is_available = TRUE WHERE id = %s",
                    (property_id,)
                )
            # Note: La suppression d'une réservation (delete_booking) ne touche PAS à la disponibilité
            
            conn.commit()
    
    return get_booking_by_id(booking_id)

def delete_booking(booking_id):
    """Supprime une réservation - NE CHANGE PAS la disponibilité du bien"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # CORRECTION : Récupérer le statut avant suppression pour log
            cur.execute("SELECT status, property_id FROM bookings WHERE id = %s", (booking_id,))
            result = cur.fetchone()
            
            if result:
                status, property_id = result
                print(f"🔍 Suppression réservation - Statut: {status}, Property: {property_id}")
                # IMPORTANT : On ne change PAS is_available ici
            
            cur.execute("DELETE FROM bookings WHERE id = %s", (booking_id,))
            conn.commit()

# === NOUVELLES FONCTIONS : Demandes de visite ===

def create_visit_request(property_id, user_id, requested_date, requested_time, message=None):
    """Crée une nouvelle demande de visite"""
    visit_id = str(uuid4())
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute('''
                INSERT INTO visit_requests (
                    id, property_id, user_id, requested_date, requested_time, message
                ) VALUES (%s, %s, %s, %s, %s, %s)
            ''', (visit_id, property_id, user_id, requested_date, requested_time, message))
            conn.commit()
    
    return get_visit_request_by_id(visit_id)

def get_visit_request_by_id(visit_id):
    """Récupère une demande de visite par son ID"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT vr.*, u.nom as user_name, u.email as user_email,
                       p.title as property_title, p.owner_id as property_owner_id
                FROM visit_requests vr
                JOIN users u ON vr.user_id = u.id
                JOIN properties p ON vr.property_id = p.id
                WHERE vr.id = %s
            ''', (visit_id,))
            row = cur.fetchone()
            return dict(row) if row else None

def get_visit_requests_by_property(property_id):
    """Récupère toutes les demandes de visite pour une propriété"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT vr.*, u.nom as user_name, u.email as user_email
                FROM visit_requests vr
                JOIN users u ON vr.user_id = u.id
                WHERE vr.property_id = %s
                ORDER BY vr.created_at DESC
            ''', (property_id,))
            return [dict(row) for row in cur.fetchall()]

def get_visit_requests_by_user(user_id):
    """Récupère toutes les demandes de visite d'un utilisateur"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT vr.*, p.title as property_title, p.city as property_city,
                       p.images as property_images, u.nom as owner_name
                FROM visit_requests vr
                JOIN properties p ON vr.property_id = p.id
                JOIN users u ON p.owner_id = u.id
                WHERE vr.user_id = %s
                ORDER BY vr.created_at DESC
            ''', (user_id,))
            return [dict(row) for row in cur.fetchall()]

def get_visit_requests_for_owner(owner_id):
    """Récupère toutes les demandes de visite pour les propriétés d'un propriétaire"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT vr.*, p.title as property_title, p.city as property_city,
                       u.nom as user_name, u.email as user_email
                FROM visit_requests vr
                JOIN properties p ON vr.property_id = p.id
                JOIN users u ON vr.user_id = u.id
                WHERE p.owner_id = %s
                ORDER BY vr.created_at DESC
            ''', (owner_id,))
            return [dict(row) for row in cur.fetchall()]

def update_visit_request_status(visit_id, new_status):
    """Met à jour le statut d'une demande de visite"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute('''
                UPDATE visit_requests 
                SET status = %s, updated_at = CURRENT_TIMESTAMP 
                WHERE id = %s
            ''', (new_status, visit_id))
            conn.commit()
    
    return get_visit_request_by_id(visit_id)

def delete_visit_request(visit_id):
    """Supprime une demande de visite"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM visit_requests WHERE id = %s", (visit_id,))
            conn.commit()

# === NOUVELLES FONCTIONS : Messagerie ===

def create_message(property_id, from_user_id, to_user_id, message):
    """Crée un nouveau message"""
    message_id = str(uuid4())
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute('''
                INSERT INTO messages (
                    id, property_id, from_user_id, to_user_id, message
                ) VALUES (%s, %s, %s, %s, %s)
            ''', (message_id, property_id, from_user_id, to_user_id, message))
            conn.commit()
    
    return get_message_by_id(message_id)

def get_message_by_id(message_id):
    """Récupère un message par son ID"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT m.*, 
                       u1.nom as from_user_name,
                       u2.nom as to_user_name,
                       p.title as property_title
                FROM messages m
                JOIN users u1 ON m.from_user_id = u1.id
                JOIN users u2 ON m.to_user_id = u2.id
                JOIN properties p ON m.property_id = p.id
                WHERE m.id = %s
            ''', (message_id,))
            row = cur.fetchone()
            return dict(row) if row else None

def get_messages_by_property(property_id):
    """Récupère tous les messages pour une propriété"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT m.*, 
                       u1.nom as from_user_name,
                       u2.nom as to_user_name
                FROM messages m
                JOIN users u1 ON m.from_user_id = u1.id
                JOIN users u2 ON m.to_user_id = u2.id
                WHERE m.property_id = %s
                ORDER BY m.created_at ASC
            ''', (property_id,))
            return [dict(row) for row in cur.fetchall()]

def get_conversation(property_id, user1_id, user2_id):
    """Récupère la conversation entre deux utilisateurs pour une propriété"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT m.*, 
                       u1.nom as from_user_name,
                       u2.nom as to_user_name
                FROM messages m
                JOIN users u1 ON m.from_user_id = u1.id
                JOIN users u2 ON m.to_user_id = u2.id
                WHERE m.property_id = %s 
                AND ((m.from_user_id = %s AND m.to_user_id = %s) 
                     OR (m.from_user_id = %s AND m.to_user_id = %s))
                ORDER BY m.created_at ASC
            ''', (property_id, user1_id, user2_id, user2_id, user1_id))
            return [dict(row) for row in cur.fetchall()]

def mark_message_as_read(message_id):
    """Marque un message comme lu"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute('''
                UPDATE messages 
                SET is_read = TRUE 
                WHERE id = %s
            ''', (message_id,))
            conn.commit()

def get_unread_messages_count(user_id):
    """Récupère le nombre de messages non lus pour un utilisateur"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT COUNT(*) as unread_count
                FROM messages 
                WHERE to_user_id = %s AND is_read = FALSE
            ''', (user_id,))
            row = cur.fetchone()
            return row['unread_count'] if row else 0

def delete_message(message_id):
    """Supprime un message"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM messages WHERE id = %s", (message_id,))
            conn.commit()

print("✅ Toutes les fonctions models.py sont chargées")