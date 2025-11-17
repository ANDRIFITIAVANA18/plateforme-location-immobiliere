
# # backend/app.py
# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from datetime import datetime
# import uuid
# from dotenv import load_dotenv
# import os
# import requests 

# # Importe les fonctions de la base de données
# from models import (
#     init_db, get_all_properties, get_property_by_id, create_property, 
#     get_properties_by_owner, create_booking, get_all_bookings, get_user_bookings,
#     create_user, verify_user_credentials, get_user_by_email, get_user_by_id,
#     update_property, delete_property, update_booking_status, get_booking_by_id,
#     delete_booking, get_properties_with_bookings
# )

# load_dotenv()
# app = Flask(__name__)
# CORS(app)

# print("🖼️  Configuration IMGbb chargée")

# # Crée les tables au démarrage
# print("🔄 Initialisation de la base de données...")
# init_db()
# print("✅ Base de données initialisée avec succès")

# # === Routes d'authentification ===

# @app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
# def register():
#     if request.method == 'OPTIONS':
#         return '', 200
        
#     data = request.json
    
#     # Validation des données
#     required_fields = ['nom', 'email', 'telephone', 'password', 'role']
#     for field in required_fields:
#         if not data.get(field):
#             return jsonify({'error': f'Le champ {field} est requis'}), 400
    
#     # Vérifier le rôle
#     if data['role'] not in ['admin', 'proprietaire', 'locataire']:
#         return jsonify({'error': 'Rôle invalide'}), 400
    
#     try:
#         # Créer l'utilisateur
#         user = create_user(
#             nom=data['nom'],
#             email=data['email'],
#             telephone=data['telephone'],
#             password=data['password'],
#             role=data['role']
#         )
        
#         return jsonify(user), 201
        
#     except Exception as e:
#         if 'unique constraint' in str(e).lower():
#             return jsonify({'error': 'Un utilisateur avec cet email existe déjà'}), 400
#         print(f"Erreur lors de l'inscription: {e}")
#         return jsonify({'error': 'Erreur lors de la création du compte'}), 500

# @app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
# def login():
#     if request.method == 'OPTIONS':
#         return '', 200
        
#     data = request.json
    
#     if not data.get('email') or not data.get('password'):
#         return jsonify({'error': 'Email et mot de passe requis'}), 400
    
#     try:
#         user = verify_user_credentials(data['email'], data['password'])
#         if user:
#             return jsonify(user)
#         else:
#             return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
            
#     except Exception as e:
#         print(f"Erreur lors de la connexion: {e}")
#         return jsonify({'error': 'Erreur lors de la connexion'}), 500

# @app.route('/api/auth/me', methods=['GET'])
# def get_current_user():
#     user_email = request.args.get('email')
#     if not user_email:
#         return jsonify({'error': 'Email requis'}), 400
    
#     try:
#         user = get_user_by_email(user_email)
#         if user:
#             user_response = {k: v for k, v in user.items() if k != 'password_hash'}
#             return jsonify(user_response)
#         return jsonify({'error': 'Utilisateur non trouvé'}), 404
#     except Exception as e:
#         print(f"Erreur récupération utilisateur: {e}")
#         return jsonify({'error': 'Erreur serveur'}), 500

# # === Routes propriétés avec support des coordonnées ===

# @app.route('/api/properties', methods=['GET'])
# def get_properties():
#     city = request.args.get('city', '').lower()
#     property_type = request.args.get('type', '')
#     min_price = request.args.get('min_price', type=float)
#     max_price = request.args.get('max_price', type=float)
#     guests = request.args.get('guests', type=int)

#     all_props = get_all_properties()

#     filtered = all_props
#     if city:
#         filtered = [p for p in filtered if city in p['city'].lower()]
#     if property_type:
#         filtered = [p for p in filtered if p['property_type'] == property_type]
#     if min_price is not None:
#         filtered = [p for p in filtered if p['price_per_night'] >= min_price]
#     if max_price is not None:
#         filtered = [p for p in filtered if p['price_per_night'] <= max_price]
#     if guests is not None:
#         filtered = [p for p in filtered if p['max_guests'] >= guests]

#     return jsonify(filtered)

# @app.route('/api/properties/<property_id>', methods=['GET'])
# def get_property(property_id):
#     prop = get_property_by_id(property_id)
#     if not prop:
#         return jsonify({'error': 'Property not found'}), 404
#     return jsonify(prop)

# @app.route('/api/cities', methods=['GET'])
# def get_cities():
#     props = get_all_properties()
#     cities = list(set(p['city'] for p in props))
#     return jsonify(sorted(cities))

# @app.route('/api/properties', methods=['POST'])
# def add_property():
#     data = request.json
#     if not data or not data.get('owner_id'):
#         return jsonify({'error': 'owner_id and property data are required'}), 400

#     # Validation des champs requis pour la carte
#     if data.get('latitude') is None or data.get('longitude') is None:
#         return jsonify({'error': 'Les coordonnées latitude et longitude sont requises'}), 400

#     try:
#         new_prop = create_property(data)
#         return jsonify(new_prop), 201
#     except Exception as e:
#         print("Erreur DB:", e)
#         return jsonify({'error': 'Failed to save property'}), 500

# @app.route('/api/properties/<property_id>', methods=['PUT'])
# def update_property_route(property_id):
#     data = request.json
#     if not data:
#         return jsonify({'error': 'No data provided'}), 400

#     try:
#         existing_property = get_property_by_id(property_id)
#         if not existing_property:
#             return jsonify({'error': 'Property not found'}), 404

#         updated_property = update_property(property_id, data)
#         return jsonify(updated_property)
#     except Exception as e:
#         print(f"Erreur mise à jour propriété: {e}")
#         return jsonify({'error': 'Failed to update property'}), 500

# @app.route('/api/properties/<property_id>', methods=['DELETE'])
# def delete_property_route(property_id):
#     try:
#         existing_property = get_property_by_id(property_id)
#         if not existing_property:
#             return jsonify({'error': 'Property not found'}), 404

#         # Pas besoin de supprimer les images d'IMGbb car elles sont hébergées chez eux
#         delete_property(property_id)
#         return jsonify({'message': 'Property deleted successfully'})
#     except Exception as e:
#         print(f"Erreur suppression propriété: {e}")
#         return jsonify({'error': 'Failed to delete property'}), 500

# @app.route('/api/owners/<owner_id>/properties', methods=['GET'])
# def owner_properties(owner_id):
#     props = get_properties_by_owner(owner_id)
#     return jsonify(props)

# @app.route('/api/owners/<owner_id>/properties-with-bookings', methods=['GET'])
# def owner_properties_with_bookings(owner_id):
#     try:
#         props = get_properties_with_bookings(owner_id)
#         return jsonify(props)
#     except Exception as e:
#         print(f"Erreur récupération propriétés avec réservations: {e}")
#         return jsonify({'error': 'Failed to fetch properties with bookings'}), 500

# # === Routes réservations ===

# @app.route('/api/bookings', methods=['POST'])
# def create_booking_route():
#     data = request.json
    
#     required_fields = ['property_id', 'guest_name', 'guest_email', 'guest_phone', 'check_in', 'check_out', 'guests_count', 'total_price']
#     for field in required_fields:
#         if not data.get(field):
#             return jsonify({'error': f'Le champ {field} est requis'}), 400

#     try:
#         property = get_property_by_id(data['property_id'])
#         if not property:
#             return jsonify({'error': 'Property not found'}), 404

#         if not property.get('is_available', True):
#             return jsonify({'error': 'Property is not available'}), 400

#         booking = create_booking(data)
#         return jsonify(booking), 201
#     except Exception as e:
#         print(f"Erreur création réservation: {e}")
#         return jsonify({'error': 'Erreur lors de la création de la réservation'}), 500

# @app.route('/api/bookings', methods=['GET'])
# def get_bookings():
#     user_email = request.args.get('user_email')
#     property_id = request.args.get('property_id')
    
#     if user_email:
#         bookings = get_user_bookings(user_email)
#     elif property_id:
#         all_bookings = get_all_bookings()
#         bookings = [b for b in all_bookings if b['property_id'] == property_id]
#     else:
#         bookings = get_all_bookings()
    
#     return jsonify(bookings)

# @app.route('/api/bookings/<booking_id>', methods=['GET'])
# def get_booking(booking_id):
#     booking = get_booking_by_id(booking_id)
#     if not booking:
#         return jsonify({'error': 'Booking not found'}), 404
#     return jsonify(booking)

# @app.route('/api/bookings/<booking_id>', methods=['PATCH'])
# def update_booking_status_route(booking_id):
#     data = request.json
#     new_status = data.get('status')
    
#     if new_status not in ['pending', 'confirmed', 'cancelled', 'completed']:
#         return jsonify({'error': 'Statut invalide'}), 400
    
#     try:
#         existing_booking = get_booking_by_id(booking_id)
#         if not existing_booking:
#             return jsonify({'error': 'Booking not found'}), 404

#         updated_booking = update_booking_status(booking_id, new_status)
#         return jsonify(updated_booking)
#     except Exception as e:
#         print(f"Erreur mise à jour réservation: {e}")
#         return jsonify({'error': 'Erreur lors de la mise à jour de la réservation'}), 500

# @app.route('/api/bookings/<booking_id>', methods=['PUT'])
# def update_booking_route(booking_id):
#     data = request.json
#     if not data:
#         return jsonify({'error': 'No data provided'}), 400

#     try:
#         existing_booking = get_booking_by_id(booking_id)
#         if not existing_booking:
#             return jsonify({'error': 'Booking not found'}), 404

#         allowed_fields = ['guest_name', 'guest_email', 'guest_phone', 'check_in', 'check_out', 'guests_count', 'total_price']
#         update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
#         if not update_data:
#             return jsonify({'error': 'No valid fields to update'}), 400

#         with get_db_connection() as conn:
#             with conn.cursor() as cur:
#                 set_clause = ", ".join([f"{field} = %s" for field in update_data.keys()])
#                 values = list(update_data.values()) + [booking_id]
#                 cur.execute(f"UPDATE bookings SET {set_clause} WHERE id = %s", values)
#                 conn.commit()

#         updated_booking = get_booking_by_id(booking_id)
#         return jsonify(updated_booking)
#     except Exception as e:
#         print(f"Erreur mise à jour réservation: {e}")
#         return jsonify({'error': 'Erreur lors de la mise à jour de la réservation'}), 500

# @app.route('/api/bookings/<booking_id>', methods=['DELETE'])
# def delete_booking_route(booking_id):
#     try:
#         existing_booking = get_booking_by_id(booking_id)
#         if not existing_booking:
#             return jsonify({'error': 'Booking not found'}), 404

#         delete_booking(booking_id)
#         return jsonify({'message': 'Booking deleted successfully'})
#     except Exception as e:
#         print(f"Erreur suppression réservation: {e}")
#         return jsonify({'error': 'Failed to delete booking'}), 500

# # === ROUTES UPLOAD AVEC IMGBB ===

# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# def allowed_file(filename):
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @app.route('/api/upload', methods=['POST'])
# def upload_images():
#     print("📤 Upload avec IMGbb")
    
#     if 'images' not in request.files:
#         return jsonify({'error': 'Aucune image fournie'}), 400
    
#     files = request.files.getlist('images')
#     uploaded_urls = []
    
#     for file in files:
#         if file and allowed_file(file.filename):
#             try:
#                 # IMGbb API
#                 response = requests.post(
#                     'https://api.imgbb.com/1/upload?key=ebd5c0e3afd3a5f8db71587bcc4841ed',
#                     files={'image': file}
#                 )
                
#                 if response.status_code == 200:
#                     data = response.json()
#                     image_url = data['data']['url']
#                     uploaded_urls.append(image_url)
#                     print(f"✅ Image uploadée: {image_url}")
#                 else:
#                     print(f"❌ Erreur IMGbb: {response.text}")
#                     return jsonify({'error': f'Erreur IMGbb: {response.status_code}'}), 500
                    
#             except Exception as e:
#                 print(f"❌ Erreur: {e}")
#                 return jsonify({'error': f'Erreur lors de l\'upload: {str(e)}'}), 500
    
#     if uploaded_urls:
#         return jsonify({'imageUrls': uploaded_urls})
#     else:
#         return jsonify({'error': 'Aucune image n\'a pu être uploadée'}), 400

# # === Routes utilisateurs ===

# @app.route('/api/users', methods=['GET'])
# def get_users():
#     try:
#         with get_db_connection() as conn:
#             with conn.cursor(cursor_factory=RealDictCursor) as cur:
#                 cur.execute("SELECT id, nom, email, telephone, role, created_at FROM users")
#                 users = [dict(row) for row in cur.fetchall()]
#         return jsonify(users)
#     except Exception as e:
#         print(f"Erreur récupération utilisateurs: {e}")
#         return jsonify({'error': 'Failed to fetch users'}), 500

# @app.route('/api/users/<user_id>', methods=['GET'])
# def get_user(user_id):
#     try:
#         user = get_user_by_id(user_id)
#         if not user:
#             return jsonify({'error': 'User not found'}), 404
#         return jsonify(user)
#     except Exception as e:
#         print(f"Erreur récupération utilisateur: {e}")
#         return jsonify({'error': 'Failed to fetch user'}), 500

# @app.route('/api/users/<user_id>', methods=['PUT'])
# def update_user_route(user_id):
#     data = request.json
#     if not data:
#         return jsonify({'error': 'No data provided'}), 400

#     try:
#         existing_user = get_user_by_id(user_id)
#         if not existing_user:
#             return jsonify({'error': 'User not found'}), 404

#         allowed_fields = ['nom', 'telephone']
#         update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
#         if not update_data:
#             return jsonify({'error': 'No valid fields to update'}), 400

#         with get_db_connection() as conn:
#             with conn.cursor() as cur:
#                 set_clause = ", ".join([f"{field} = %s" for field in update_data.keys()])
#                 values = list(update_data.values()) + [user_id]
#                 cur.execute(f"UPDATE users SET {set_clause} WHERE id = %s", values)
#                 conn.commit()

#         updated_user = get_user_by_id(user_id)
#         return jsonify(updated_user)
#     except Exception as e:
#         print(f"Erreur mise à jour utilisateur: {e}")
#         return jsonify({'error': 'Failed to update user'}), 500

# # === Routes statistiques ===

# @app.route('/api/stats/owner/<owner_id>', methods=['GET'])
# def get_owner_stats(owner_id):
#     try:
#         with get_db_connection() as conn:
#             with conn.cursor(cursor_factory=RealDictCursor) as cur:
#                 cur.execute("SELECT COUNT(*) as property_count FROM properties WHERE owner_id = %s", (owner_id,))
#                 property_count = cur.fetchone()['property_count']

#                 cur.execute("""
#                     SELECT COUNT(*) as booking_count 
#                     FROM bookings b 
#                     JOIN properties p ON b.property_id = p.id 
#                     WHERE p.owner_id = %s
#                 """, (owner_id,))
#                 booking_count = cur.fetchone()['booking_count']

#                 cur.execute("""
#                     SELECT COALESCE(SUM(b.total_price), 0) as total_revenue 
#                     FROM bookings b 
#                     JOIN properties p ON b.property_id = p.id 
#                     WHERE p.owner_id = %s AND b.status = 'confirmed'
#                 """, (owner_id,))
#                 total_revenue = cur.fetchone()['total_revenue']

#                 cur.execute("""
#                     SELECT b.status, COUNT(*) as count 
#                     FROM bookings b 
#                     JOIN properties p ON b.property_id = p.id 
#                     WHERE p.owner_id = %s 
#                     GROUP BY b.status
#                 """, (owner_id,))
#                 status_counts = {row['status']: row['count'] for row in cur.fetchall()}

#         stats = {
#             'property_count': property_count,
#             'booking_count': booking_count,
#             'total_revenue': float(total_revenue),
#             'status_counts': status_counts
#         }

#         return jsonify(stats)
#     except Exception as e:
#         print(f"Erreur récupération statistiques: {e}")
#         return jsonify({'error': 'Failed to fetch statistics'}), 500

# # Route de santé
# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({
#         'status': 'OK', 
#         'message': 'Backend is running',
#         'image_service': 'IMGbb',
#         'features': ['coordinates_support', 'image_upload', 'booking_system']
#     })

# # Gestion des erreurs
# @app.errorhandler(404)
# def not_found(error):
#     return jsonify({'error': 'Endpoint not found'}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     return jsonify({'error': 'Internal server error'}), 500

# # === DÉMARRAGE DU SERVEUR ===
# if __name__ == '__main__':
#     print("🚀 Démarrage du serveur Flask avec support des coordonnées GPS...")
#     print("📡 Serveur backend accessible sur: http://0.0.0.0:5000")
#     print("🔍 Health check: http://0.0.0.0:5000/api/health")
#     print("🖼️  IMGbb configuré pour le stockage des images")
#     print("🗺️  Support des coordonnées GPS activé")
#     app.run(host='0.0.0.0', debug=True, port=5000)


# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import uuid
from dotenv import load_dotenv
import os
import requests 

# Importe les fonctions de la base de données
from models import (
    init_db, get_all_properties, get_property_by_id, create_property, 
    get_properties_by_owner, create_booking, get_all_bookings, get_user_bookings,
    create_user, verify_user_credentials, get_user_by_email, get_user_by_id,
    update_property, delete_property, update_booking_status, get_booking_by_id,
    delete_booking, get_properties_with_bookings,
    # NOUVEAUX IMPORTS
    create_visit_request, get_visit_request_by_id, get_visit_requests_by_property,
    get_visit_requests_by_user, get_visit_requests_for_owner, update_visit_request_status,
    delete_visit_request, create_message, get_message_by_id, get_messages_by_property,
    get_conversation, mark_message_as_read, get_unread_messages_count, delete_message
)

load_dotenv()
app = Flask(__name__)
CORS(app)

print("🖼️  Configuration IMGbb chargée")

# Crée les tables au démarrage
print("🔄 Initialisation de la base de données...")
init_db()
print("✅ Base de données initialisée avec succès")

# === Routes d'authentification ===

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.json
    
    # Validation des données
    required_fields = ['nom', 'email', 'telephone', 'password', 'role']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Le champ {field} est requis'}), 400
    
    # Vérifier le rôle
    if data['role'] not in ['admin', 'proprietaire', 'locataire']:
        return jsonify({'error': 'Rôle invalide'}), 400
    
    try:
        # Créer l'utilisateur
        user = create_user(
            nom=data['nom'],
            email=data['email'],
            telephone=data['telephone'],
            password=data['password'],
            role=data['role']
        )
        
        return jsonify(user), 201
        
    except Exception as e:
        if 'unique constraint' in str(e).lower():
            return jsonify({'error': 'Un utilisateur avec cet email existe déjà'}), 400
        print(f"Erreur lors de l'inscription: {e}")
        return jsonify({'error': 'Erreur lors de la création du compte'}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.json
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email et mot de passe requis'}), 400
    
    try:
        user = verify_user_credentials(data['email'], data['password'])
        if user:
            return jsonify(user)
        else:
            return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
            
    except Exception as e:
        print(f"Erreur lors de la connexion: {e}")
        return jsonify({'error': 'Erreur lors de la connexion'}), 500

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    user_email = request.args.get('email')
    if not user_email:
        return jsonify({'error': 'Email requis'}), 400
    
    try:
        user = get_user_by_email(user_email)
        if user:
            user_response = {k: v for k, v in user.items() if k != 'password_hash'}
            return jsonify(user_response)
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    except Exception as e:
        print(f"Erreur récupération utilisateur: {e}")
        return jsonify({'error': 'Erreur serveur'}), 500

# === Routes propriétés avec support des coordonnées ===

@app.route('/api/properties', methods=['GET'])
def get_properties():
    city = request.args.get('city', '').lower()
    property_type = request.args.get('type', '')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    guests = request.args.get('guests', type=int)

    all_props = get_all_properties()

    filtered = all_props
    if city:
        filtered = [p for p in filtered if city in p['city'].lower()]
    if property_type:
        filtered = [p for p in filtered if p['property_type'] == property_type]
    if min_price is not None:
        filtered = [p for p in filtered if p['price_per_night'] >= min_price]
    if max_price is not None:
        filtered = [p for p in filtered if p['price_per_night'] <= max_price]
    if guests is not None:
        filtered = [p for p in filtered if p['max_guests'] >= guests]

    return jsonify(filtered)

@app.route('/api/properties/<property_id>', methods=['GET'])
def get_property(property_id):
    prop = get_property_by_id(property_id)
    if not prop:
        return jsonify({'error': 'Property not found'}), 404
    return jsonify(prop)

@app.route('/api/cities', methods=['GET'])
def get_cities():
    props = get_all_properties()
    cities = list(set(p['city'] for p in props))
    return jsonify(sorted(cities))

@app.route('/api/properties', methods=['POST'])
def add_property():
    data = request.json
    if not data or not data.get('owner_id'):
        return jsonify({'error': 'owner_id and property data are required'}), 400

    # Validation des champs requis pour la carte
    if data.get('latitude') is None or data.get('longitude') is None:
        return jsonify({'error': 'Les coordonnées latitude et longitude sont requises'}), 400

    try:
        new_prop = create_property(data)
        return jsonify(new_prop), 201
    except Exception as e:
        print("Erreur DB:", e)
        return jsonify({'error': 'Failed to save property'}), 500

@app.route('/api/properties/<property_id>', methods=['PUT'])
def update_property_route(property_id):
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        existing_property = get_property_by_id(property_id)
        if not existing_property:
            return jsonify({'error': 'Property not found'}), 404

        updated_property = update_property(property_id, data)
        return jsonify(updated_property)
    except Exception as e:
        print(f"Erreur mise à jour propriété: {e}")
        return jsonify({'error': 'Failed to update property'}), 500

@app.route('/api/properties/<property_id>', methods=['DELETE'])
def delete_property_route(property_id):
    try:
        existing_property = get_property_by_id(property_id)
        if not existing_property:
            return jsonify({'error': 'Property not found'}), 404

        # Pas besoin de supprimer les images d'IMGbb car elles sont hébergées chez eux
        delete_property(property_id)
        return jsonify({'message': 'Property deleted successfully'})
    except Exception as e:
        print(f"Erreur suppression propriété: {e}")
        return jsonify({'error': 'Failed to delete property'}), 500

@app.route('/api/owners/<owner_id>/properties', methods=['GET'])
def owner_properties(owner_id):
    props = get_properties_by_owner(owner_id)
    return jsonify(props)

@app.route('/api/owners/<owner_id>/properties-with-bookings', methods=['GET'])
def owner_properties_with_bookings(owner_id):
    try:
        props = get_properties_with_bookings(owner_id)
        return jsonify(props)
    except Exception as e:
        print(f"Erreur récupération propriétés avec réservations: {e}")
        return jsonify({'error': 'Failed to fetch properties with bookings'}), 500

# === Routes réservations ===

@app.route('/api/bookings', methods=['POST'])
def create_booking_route():
    data = request.json
    
    required_fields = ['property_id', 'guest_name', 'guest_email', 'guest_phone', 'check_in', 'check_out', 'guests_count', 'total_price']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Le champ {field} est requis'}), 400

    try:
        property = get_property_by_id(data['property_id'])
        if not property:
            return jsonify({'error': 'Property not found'}), 404

        if not property.get('is_available', True):
            return jsonify({'error': 'Property is not available'}), 400

        booking = create_booking(data)
        return jsonify(booking), 201
    except Exception as e:
        print(f"Erreur création réservation: {e}")
        return jsonify({'error': 'Erreur lors de la création de la réservation'}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    user_email = request.args.get('user_email')
    property_id = request.args.get('property_id')
    
    if user_email:
        bookings = get_user_bookings(user_email)
    elif property_id:
        all_bookings = get_all_bookings()
        bookings = [b for b in all_bookings if b['property_id'] == property_id]
    else:
        bookings = get_all_bookings()
    
    return jsonify(bookings)

@app.route('/api/bookings/<booking_id>', methods=['GET'])
def get_booking(booking_id):
    booking = get_booking_by_id(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    return jsonify(booking)

@app.route('/api/bookings/<booking_id>', methods=['PATCH'])
def update_booking_status_route(booking_id):
    data = request.json
    new_status = data.get('status')
    
    if new_status not in ['pending', 'confirmed', 'cancelled', 'completed']:
        return jsonify({'error': 'Statut invalide'}), 400
    
    try:
        existing_booking = get_booking_by_id(booking_id)
        if not existing_booking:
            return jsonify({'error': 'Booking not found'}), 404

        updated_booking = update_booking_status(booking_id, new_status)
        return jsonify(updated_booking)
    except Exception as e:
        print(f"Erreur mise à jour réservation: {e}")
        return jsonify({'error': 'Erreur lors de la mise à jour de la réservation'}), 500

@app.route('/api/bookings/<booking_id>', methods=['PUT'])
def update_booking_route(booking_id):
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        existing_booking = get_booking_by_id(booking_id)
        if not existing_booking:
            return jsonify({'error': 'Booking not found'}), 404

        allowed_fields = ['guest_name', 'guest_email', 'guest_phone', 'check_in', 'check_out', 'guests_count', 'total_price']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                set_clause = ", ".join([f"{field} = %s" for field in update_data.keys()])
                values = list(update_data.values()) + [booking_id]
                cur.execute(f"UPDATE bookings SET {set_clause} WHERE id = %s", values)
                conn.commit()

        updated_booking = get_booking_by_id(booking_id)
        return jsonify(updated_booking)
    except Exception as e:
        print(f"Erreur mise à jour réservation: {e}")
        return jsonify({'error': 'Erreur lors de la mise à jour de la réservation'}), 500

@app.route('/api/bookings/<booking_id>', methods=['DELETE'])
def delete_booking_route(booking_id):
    try:
        existing_booking = get_booking_by_id(booking_id)
        if not existing_booking:
            return jsonify({'error': 'Booking not found'}), 404

        delete_booking(booking_id)
        return jsonify({'message': 'Booking deleted successfully'})
    except Exception as e:
        print(f"Erreur suppression réservation: {e}")
        return jsonify({'error': 'Failed to delete booking'}), 500

# === NOUVELLES ROUTES : Demandes de visite ===

@app.route('/api/visit-requests', methods=['POST'])
def create_visit_request_route():
    data = request.json
    
    required_fields = ['property_id', 'user_id', 'requested_date', 'requested_time']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Le champ {field} est requis'}), 400

    try:
        property = get_property_by_id(data['property_id'])
        if not property:
            return jsonify({'error': 'Property not found'}), 404

        visit_request = create_visit_request(
            property_id=data['property_id'],
            user_id=data['user_id'],
            requested_date=data['requested_date'],
            requested_time=data['requested_time'],
            message=data.get('message')
        )
        
        return jsonify(visit_request), 201
    except Exception as e:
        print(f"Erreur création demande de visite: {e}")
        return jsonify({'error': 'Erreur lors de la création de la demande de visite'}), 500

@app.route('/api/visit-requests', methods=['GET'])
def get_visit_requests():
    property_id = request.args.get('property_id')
    user_id = request.args.get('user_id')
    owner_id = request.args.get('owner_id')
    
    try:
        if property_id:
            visit_requests = get_visit_requests_by_property(property_id)
        elif user_id:
            visit_requests = get_visit_requests_by_user(user_id)
        elif owner_id:
            visit_requests = get_visit_requests_for_owner(owner_id)
        else:
            return jsonify({'error': 'property_id, user_id ou owner_id requis'}), 400
        
        return jsonify(visit_requests)
    except Exception as e:
        print(f"Erreur récupération demandes de visite: {e}")
        return jsonify({'error': 'Erreur lors de la récupération des demandes de visite'}), 500

@app.route('/api/visit-requests/<visit_id>', methods=['GET'])
def get_visit_request(visit_id):
    try:
        visit_request = get_visit_request_by_id(visit_id)
        if not visit_request:
            return jsonify({'error': 'Demande de visite non trouvée'}), 404
        return jsonify(visit_request)
    except Exception as e:
        print(f"Erreur récupération demande de visite: {e}")
        return jsonify({'error': 'Erreur lors de la récupération de la demande de visite'}), 500

@app.route('/api/visit-requests/<visit_id>', methods=['PATCH'])
def update_visit_request_status_route(visit_id):
    data = request.json
    new_status = data.get('status')
    
    if new_status not in ['pending', 'confirmed', 'rejected', 'cancelled']:
        return jsonify({'error': 'Statut invalide'}), 400
    
    try:
        existing_visit_request = get_visit_request_by_id(visit_id)
        if not existing_visit_request:
            return jsonify({'error': 'Demande de visite non trouvée'}), 404

        updated_visit_request = update_visit_request_status(visit_id, new_status)
        return jsonify(updated_visit_request)
    except Exception as e:
        print(f"Erreur mise à jour demande de visite: {e}")
        return jsonify({'error': 'Erreur lors de la mise à jour de la demande de visite'}), 500

@app.route('/api/visit-requests/<visit_id>', methods=['DELETE'])
def delete_visit_request_route(visit_id):
    try:
        existing_visit_request = get_visit_request_by_id(visit_id)
        if not existing_visit_request:
            return jsonify({'error': 'Demande de visite non trouvée'}), 404

        delete_visit_request(visit_id)
        return jsonify({'message': 'Demande de visite supprimée avec succès'})
    except Exception as e:
        print(f"Erreur suppression demande de visite: {e}")
        return jsonify({'error': 'Erreur lors de la suppression de la demande de visite'}), 500

# === NOUVELLES ROUTES : Messagerie ===

@app.route('/api/messages', methods=['POST'])
def create_message_route():
    data = request.json
    
    required_fields = ['property_id', 'from_user_id', 'to_user_id', 'message']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Le champ {field} est requis'}), 400

    try:
        property = get_property_by_id(data['property_id'])
        if not property:
            return jsonify({'error': 'Property not found'}), 404

        new_message = create_message(
            property_id=data['property_id'],
            from_user_id=data['from_user_id'],
            to_user_id=data['to_user_id'],
            message=data['message']
        )
        
        return jsonify(new_message), 201
    except Exception as e:
        print(f"Erreur création message: {e}")
        return jsonify({'error': 'Erreur lors de la création du message'}), 500

@app.route('/api/messages', methods=['GET'])
def get_messages():
    property_id = request.args.get('property_id')
    user1_id = request.args.get('user1_id')
    user2_id = request.args.get('user2_id')
    
    try:
        if property_id and user1_id and user2_id:
            messages = get_conversation(property_id, user1_id, user2_id)
        elif property_id:
            messages = get_messages_by_property(property_id)
        else:
            return jsonify({'error': 'property_id requis'}), 400
        
        return jsonify(messages)
    except Exception as e:
        print(f"Erreur récupération messages: {e}")
        return jsonify({'error': 'Erreur lors de la récupération des messages'}), 500

@app.route('/api/messages/<message_id>', methods=['GET'])
def get_message(message_id):
    try:
        message = get_message_by_id(message_id)
        if not message:
            return jsonify({'error': 'Message non trouvé'}), 404
        return jsonify(message)
    except Exception as e:
        print(f"Erreur récupération message: {e}")
        return jsonify({'error': 'Erreur lors de la récupération du message'}), 500

@app.route('/api/messages/<message_id>/read', methods=['PATCH'])
def mark_message_as_read_route(message_id):
    try:
        existing_message = get_message_by_id(message_id)
        if not existing_message:
            return jsonify({'error': 'Message non trouvé'}), 404

        mark_message_as_read(message_id)
        return jsonify({'message': 'Message marqué comme lu'})
    except Exception as e:
        print(f"Erreur marquage message comme lu: {e}")
        return jsonify({'error': 'Erreur lors du marquage du message comme lu'}), 500

@app.route('/api/users/<user_id>/unread-messages', methods=['GET'])
def get_unread_messages_count_route(user_id):
    try:
        unread_count = get_unread_messages_count(user_id)
        return jsonify({'unread_count': unread_count})
    except Exception as e:
        print(f"Erreur récupération messages non lus: {e}")
        return jsonify({'error': 'Erreur lors de la récupération des messages non lus'}), 500

@app.route('/api/messages/<message_id>', methods=['DELETE'])
def delete_message_route(message_id):
    try:
        existing_message = get_message_by_id(message_id)
        if not existing_message:
            return jsonify({'error': 'Message non trouvé'}), 404

        delete_message(message_id)
        return jsonify({'message': 'Message supprimé avec succès'})
    except Exception as e:
        print(f"Erreur suppression message: {e}")
        return jsonify({'error': 'Erreur lors de la suppression du message'}), 500

# === ROUTES UPLOAD AVEC IMGBB ===

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_images():
    print("📤 Upload avec IMGbb")
    
    if 'images' not in request.files:
        return jsonify({'error': 'Aucune image fournie'}), 400
    
    files = request.files.getlist('images')
    uploaded_urls = []
    
    for file in files:
        if file and allowed_file(file.filename):
            try:
                # IMGbb API
                response = requests.post(
                    'https://api.imgbb.com/1/upload?key=ebd5c0e3afd3a5f8db71587bcc4841ed',
                    files={'image': file}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    image_url = data['data']['url']
                    uploaded_urls.append(image_url)
                    print(f"✅ Image uploadée: {image_url}")
                else:
                    print(f"❌ Erreur IMGbb: {response.text}")
                    return jsonify({'error': f'Erreur IMGbb: {response.status_code}'}), 500
                    
            except Exception as e:
                print(f"❌ Erreur: {e}")
                return jsonify({'error': f'Erreur lors de l\'upload: {str(e)}'}), 500
    
    if uploaded_urls:
        return jsonify({'imageUrls': uploaded_urls})
    else:
        return jsonify({'error': 'Aucune image n\'a pu être uploadée'}), 400

# === Routes utilisateurs ===

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id, nom, email, telephone, role, created_at FROM users")
                users = [dict(row) for row in cur.fetchall()]
        return jsonify(users)
    except Exception as e:
        print(f"Erreur récupération utilisateurs: {e}")
        return jsonify({'error': 'Failed to fetch users'}), 500

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify(user)
    except Exception as e:
        print(f"Erreur récupération utilisateur: {e}")
        return jsonify({'error': 'Failed to fetch user'}), 500

@app.route('/api/users/<user_id>', methods=['PUT'])
def update_user_route(user_id):
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        existing_user = get_user_by_id(user_id)
        if not existing_user:
            return jsonify({'error': 'User not found'}), 404

        allowed_fields = ['nom', 'telephone']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                set_clause = ", ".join([f"{field} = %s" for field in update_data.keys()])
                values = list(update_data.values()) + [user_id]
                cur.execute(f"UPDATE users SET {set_clause} WHERE id = %s", values)
                conn.commit()

        updated_user = get_user_by_id(user_id)
        return jsonify(updated_user)
    except Exception as e:
        print(f"Erreur mise à jour utilisateur: {e}")
        return jsonify({'error': 'Failed to update user'}), 500

# === Routes statistiques ===

@app.route('/api/stats/owner/<owner_id>', methods=['GET'])
def get_owner_stats(owner_id):
    try:
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT COUNT(*) as property_count FROM properties WHERE owner_id = %s", (owner_id,))
                property_count = cur.fetchone()['property_count']

                cur.execute("""
                    SELECT COUNT(*) as booking_count 
                    FROM bookings b 
                    JOIN properties p ON b.property_id = p.id 
                    WHERE p.owner_id = %s
                """, (owner_id,))
                booking_count = cur.fetchone()['booking_count']

                cur.execute("""
                    SELECT COALESCE(SUM(b.total_price), 0) as total_revenue 
                    FROM bookings b 
                    JOIN properties p ON b.property_id = p.id 
                    WHERE p.owner_id = %s AND b.status = 'confirmed'
                """, (owner_id,))
                total_revenue = cur.fetchone()['total_revenue']

                cur.execute("""
                    SELECT b.status, COUNT(*) as count 
                    FROM bookings b 
                    JOIN properties p ON b.property_id = p.id 
                    WHERE p.owner_id = %s 
                    GROUP BY b.status
                """, (owner_id,))
                status_counts = {row['status']: row['count'] for row in cur.fetchall()}

        stats = {
            'property_count': property_count,
            'booking_count': booking_count,
            'total_revenue': float(total_revenue),
            'status_counts': status_counts
        }

        return jsonify(stats)
    except Exception as e:
        print(f"Erreur récupération statistiques: {e}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500

# Route de santé
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK', 
        'message': 'Backend is running',
        'image_service': 'IMGbb',
        'features': ['coordinates_support', 'image_upload', 'booking_system', 'visit_requests', 'messaging']
    })

# Gestion des erreurs
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# === DÉMARRAGE DU SERVEUR ===
if __name__ == '__main__':
    print("🚀 Démarrage du serveur Flask avec support des coordonnées GPS...")
    print("📡 Serveur backend accessible sur: http://0.0.0.0:5000")
    print("🔍 Health check: http://0.0.0.0:5000/api/health")
    print("🖼️  IMGbb configuré pour le stockage des images")
    print("🗺️  Support des coordonnées GPS activé")
    print("📅 Système de demandes de visite activé")
    print("💬 Système de messagerie activé")
    app.run(host='0.0.0.0', debug=True, port=5000)