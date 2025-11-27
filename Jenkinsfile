pipeline {
    agent any
    
    environment {
        APP_PORT = '3100'
    }
    
    stages {
        stage('📥 Checkout Code') {
            steps {
                checkout scm
                sh 'echo "✅ Code récupéré depuis GitHub"'
            }
        }
        
        stage('🐳 Vérification Docker') {
            steps {
                sh '''
                    echo "🔧 Vérification de Docker..."
                    docker --version && echo "✅ Docker est disponible"
                '''
            }
        }
        
        stage('📦 Installation Dépendances') {
            steps {
                sh '''
                    echo "📥 Installation des dépendances..."
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                        npm install
                        echo '✅ Dépendances installées'
                    "
                '''
            }
        }
        
        stage('🏗️ Build Application') {
            steps {
                sh '''
                    echo "🔨 Construction de l'application..."
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                        npm run build
                        echo '✅ Build réussi'
                    "
                    
                    # Vérification
                    if [ -d "dist" ]; then
                        echo "📁 Dossier dist créé:"
                        ls -la dist/
                    else
                        echo "❌ Build échoué"
                        exit 1
                    fi
                '''
            }
        }
        
        stage('🚀 Déploiement') {
            steps {
                sh """
                    echo "🚀 Déploiement sur le port ${APP_PORT}"
                    
                    # Nettoyage
                    docker stop myapp-${APP_PORT} 2>/dev/null || echo "ℹ️ Aucun conteneur à arrêter"
                    docker rm myapp-${APP_PORT} 2>/dev/null || echo "ℹ️ Aucun conteneur à supprimer"
                    
                    # Création du Dockerfile
                    echo "FROM nginx:alpine" > Dockerfile
                    echo "COPY dist/ /usr/share/nginx/html" >> Dockerfile
                    echo "EXPOSE 80" >> Dockerfile
                    echo 'CMD ["nginx", "-g", "daemon off;"]' >> Dockerfile
                    
                    # Construction de l'image
                    docker build -t myapp:${BUILD_NUMBER} .
                    
                    # Déploiement
                    docker run -d \\
                        --name myapp-${APP_PORT} \\
                        -p ${APP_PORT}:80 \\
                        myapp:${BUILD_NUMBER}
                    
                    echo "✅ Application déployée!"
                    echo "🌐 Accédez à: http://localhost:${APP_PORT}"
                """
            }
        }
    }
    
    post {
        always {
            echo "🏁 Pipeline terminé - Build #${BUILD_NUMBER}"
        }
        success {
            echo "🎉 SUCCÈS! Votre application est en ligne 🚀"
        }
        failure {
            echo "❌ Échec - Consultez les logs ci-dessus"
        }
    }
}