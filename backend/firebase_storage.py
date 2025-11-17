import firebase_admin
from firebase_admin import credentials, storage
import os
from datetime import datetime
import uuid

def init_firebase():
    """
    Initialise Firebase avec le fichier service account
    """
    try:
        # Vérifier si Firebase est déjà initialisé
        if firebase_admin._apps:
            print("✅ Firebase déjà initialisé")
            return True
            
        # Chemin vers le fichier service account
        service_account_path = "firebase-service-account.json"
        
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            print("✅ Firebase initialisé avec le fichier service account")
        else:
            print("❌ Fichier firebase-service-account.json non trouvé")
            return False
        
        # Initialiser Firebase avec votre project_id
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'location-e0c6d.appspot.com'  # Votre project_id + .appspot.com
        })
        
        print("🚀 Firebase Storage prêt à être utilisé")
        return True
        
    except Exception as e:
        print(f"❌ Erreur initialisation Firebase: {e}")
        return False

def upload_property_image(file, property_id=None):
    """
    Upload une image vers Firebase Storage
    """
    try:
        # S'assurer que Firebase est initialisé
        if not firebase_admin._apps:
            if not init_firebase():
                return None
            
        bucket = storage.bucket()
        
        # Générer un nom de fichier unique
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        safe_filename = file.filename.replace(" ", "_").lower()
        
        # Déterminer le dossier
        folder = "properties"
        if property_id:
            folder = f"properties/{property_id}"
        
        filename = f"{folder}/{timestamp}_{unique_id}_{safe_filename}"
        
        print(f"📤 Upload de l'image: {filename}")
        
        # Upload vers Firebase Storage
        blob = bucket.blob(filename)
        blob.upload_from_string(
            file.read(),
            content_type=file.content_type
        )
        
        # Rendre le fichier public
        blob.make_public()
        
        print(f"✅ Image uploadée avec succès: {blob.public_url}")
        return blob.public_url
        
    except Exception as e:
        print(f"❌ Erreur lors de l'upload Firebase: {e}")
        return None

def delete_property_image(image_url):
    """
    Supprime une image de Firebase Storage
    """
    try:
        if not firebase_admin._apps:
            if not init_firebase():
                return False
            
        bucket = storage.bucket()
        
        # Extraire le chemin du fichier depuis l'URL Firebase
        if 'firebasestorage.googleapis.com' in image_url:
            # Extraire le nom du fichier
            start_index = image_url.find('/o/') + 3
            end_index = image_url.find('?')
            if end_index == -1:
                end_index = len(image_url)
            
            file_path = image_url[start_index:end_index]
            # Décoder les caractères spéciaux
            import urllib.parse
            file_path = urllib.parse.unquote(file_path)
            
            # Supprimer le fichier
            blob = bucket.blob(file_path)
            blob.delete()
            
            print(f"🗑️ Image supprimée: {file_path}")
            return True
            
        return False
            
    except Exception as e:
        print(f"❌ Erreur suppression image: {e}")
        return False