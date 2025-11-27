pipeline {
    agent any
    
    environment {
        APP_PORT = '3100'
    }
    
    stages {
        stage('📥 Checkout') {
            steps {
                checkout scm
                sh 'echo "✅ Code récupéré" && ls -la package.json'
            }
        }
        
        stage('📦 Dépendances Simple') {
            steps {
                sh '''
                    echo "📥 Installation simple..."
                    # Utilise le chemin ABSOLU
                    docker run --rm \
                        -v "$(pwd)":/app \
                        -w /app \
                        node:18-alpine \
                        sh -c "npm install && npm run build"
                    
                    echo "✅ Build terminé"
                    ls -la dist/ 2>/dev/null && echo "📁 dist créé" || echo "❌ dist manquant"
                '''
            }
        }
        
        stage('🚀 Déploiement Rapide') {
            steps {
                sh """
                    # Nettoyage
                    docker stop myapp-${APP_PORT} 2>/dev/null || true
                    docker rm myapp-${APP_PORT} 2>/dev/null || true
                    
                    # Déploiement direct
                    docker run -d \
                        --name myapp-${APP_PORT} \
                        -p ${APP_PORT}:80 \
                        -v $(pwd)/dist:/usr/share/nginx/html \
                        nginx:alpine
                    
                    echo "✅ Déployé: http://localhost:${APP_PORT}"
                """
            }
        }
    }
}