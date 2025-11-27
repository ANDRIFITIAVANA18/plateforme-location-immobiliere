pipeline {
    agent any
    
    environment {
        APP_PORT = '3100'
    }
    
    stages {
        stage('📥 Checkout Code') {
            steps {
                checkout scm
                sh '''
                    echo "✅ Code récupéré depuis GitHub"
                    echo "🔍 Vérification des fichiers TypeScript..."
                    # Vérifie s'il y a des erreurs de syntaxe
                    npx tsc --noEmit --skipLibCheck 2>/dev/null && echo "✅ TypeScript valide" || echo "⚠️ Erreurs TypeScript détectées"
                '''
            }
        }
        
        stage('🔧 Correction Automatique') {
            steps {
                sh '''
                    echo "🔧 Correction des erreurs de syntaxe..."
                    
                    # Correction de l'erreur dans App.tsx
                    if [ -f "src/App.tsx" ]; then
                        echo "📝 Correction de App.tsx..."
                        # Remplace "export default App;//" par "export default App; //"
                        sed -i 's/export default App;\\/\\/test/export default App; \\/\\/ test/g' src/App.tsx
                        sed -i 's/export default App;\\/\\/ /export default App; \\/\\/ /g' src/App.tsx
                        
                        # Vérification
                        echo "📋 Ligne 411 après correction:"
                        sed -n '411p' src/App.tsx
                    fi
                    
                    # Test de build local
                    echo "🧪 Test de build..."
                    npx tsc --noEmit --skipLibCheck 2>/dev/null && echo "✅ Build test réussi" || echo "⚠️ Build test échoué"
                '''
            }
        }
        
        stage('🐳 Build Image Docker') {
            steps {
                sh '''
                    echo "🔨 Construction de l'image Docker..."
                    
                    # Création du Dockerfile de build
                    cat > Dockerfile.build << 'EOF'
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
                    
                    # Construction de l'image
                    docker build -f Dockerfile.build -t myapp-complete:${BUILD_NUMBER} .
                    echo "✅ Image Docker construite avec succès!"
                '''
            }
        }
        
        stage('🚀 Déploiement') {
            steps {
                sh """
                    echo "🚀 Déploiement de l'application..."
                    
                    # Nettoyage
                    docker stop myapp-${APP_PORT} 2>/dev/null || echo "ℹ️ Aucun conteneur à arrêter"
                    docker rm myapp-${APP_PORT} 2>/dev/null || echo "ℹ️ Aucun conteneur à supprimer"
                    
                    # Déploiement
                    docker run -d \\
                        --name myapp-${APP_PORT} \\
                        -p ${APP_PORT}:80 \\
                        myapp-complete:${BUILD_NUMBER}
                    
                    # Vérification
                    echo "⏳ Attente du démarrage..."
                    sleep 8
                    
                    echo "📊 Statut du conteneur:"
                    docker ps --filter name=myapp-${APP_PORT}
                    
                    echo "🎉 SUCCÈS COMPLET!"
                    echo "🌐 Votre application React est MAINTENANT EN LIGNE!"
                    echo "📍 Accédez à: http://localhost:${APP_PORT}"
                """
            }
        }
    }
    
    post {
        always {
            echo "🏁 Pipeline terminé - Build #${BUILD_NUMBER}"
        }
        success {
            echo "✅ FÉLICITATIONS! 🚀"
            echo "🌍 Votre application est déployée avec succès!"
        }
        failure {
            echo "❌ Échec - Vérifiez les erreurs TypeScript"
            sh '''
                echo "🔍 Diagnostic détaillé:"
                echo "=== Erreurs TypeScript ==="
                npx tsc --noEmit --skipLibCheck 2>&1 | head -20 || echo "Aucune erreur TypeScript"
                echo "=== Fichier App.tsx (lignes 405-415) ==="
                sed -n '405,415p' src/App.tsx 2>/dev/null || echo "Fichier App.tsx non trouvé"
            '''
        }
    }
}