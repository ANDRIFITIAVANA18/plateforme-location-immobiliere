print("🧪 Test d'installation Firebase...")

try:
    import firebase_admin
    from firebase_admin import credentials, storage
    print("✅ Firebase Admin installé avec succès")
    
    # Tester l'initialisation
    try:
        cred = credentials.Certificate("firebase-service-account.json")
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'location-e0c6d.appspot.com'
        })
        print("✅ Firebase initialisé avec succès")
        
        # Tester l'accès au stockage
        bucket = storage.bucket()
        print(f"✅ Bucket accessible: {bucket.name}")
        
        print("🎉 Tous les tests Firebase sont réussis!")
        
    except FileNotFoundError:
        print("❌ Fichier firebase-service-account.json non trouvé")
    except Exception as e:
        print(f"❌ Erreur initialisation Firebase: {e}")
        
except ImportError as e:
    print("❌ Firebase Admin non installé")
    print("💡 Solution: exécutez 'pip install firebase-admin'")
except Exception as e:
    print(f"❌ Erreur inattendue: {e}")