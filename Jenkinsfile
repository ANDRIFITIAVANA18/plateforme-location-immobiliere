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
                    echo "📁 Vérification des fichiers:"
                    ls -la package.json src/ | head -10
                '''
            }
        }
        
        stage('🐳 Création Image Node.js Personnalisée') {
            steps {
                sh '''
                    echo "🔨 Création d'une image Docker personnalisée..."
                    
                    # Création d'un Dockerfile pour builder l'application
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
                    echo "✅ Image complète créée"
                '''
            }
        }
        
        stage('🚀 Déploiement Immédiat') {
            steps {
                sh """
                    echo "🚀 Déploiement de l'application..."
                    
                    # Arrêt des anciens conteneurs
                    docker stop myapp-${APP_PORT} 2>/dev/null || echo "ℹ️ Aucun conteneur à arrêter"
                    docker rm myapp-${APP_PORT} 2>/dev/null || echo "ℹ️ Aucun conteneur à supprimer"
                    
                    # Démarrage du nouveau conteneur
                    docker run -d \\
                        --name myapp-${APP_PORT} \\
                        -p ${APP_PORT}:80 \\
                        myapp-complete:${BUILD_NUMBER}
                    
                    # Vérification
                    echo "⏳ Attente du démarrage..."
                    sleep 10
                    
                    echo "📊 Statut:"
                    docker ps --filter name=myapp-${APP_PORT}
                    
                    echo "🎉 SUCCÈS COMPLET!"
                    echo "🌐 Application disponible sur: http://localhost:${APP_PORT}"
                """
            }
        }
    }
    
    post {
        always {
            echo "🏁 Pipeline terminé - Build #${BUILD_NUMBER}"
        }
        success {
            echo "✅ FÉLICITATIONS! Votre application est EN LIGNE! 🚀"
            echo "📍 URL: http://localhost:3100"
        }
        failure {
            echo "❌ Échec"
            sh '''
                echo "🔧 Diagnostic:"
                docker images | head -5
                docker ps -a | head -5
            '''
        }
    }
}