pipeline {
    agent any
    
    environment {
        NODE_ENV = 'production'
        APP_PORT = '3100'
    }
    
    stages {
        stage('🔍 Vérification Docker-in-Docker') {
            steps {
                sh '''
                    echo "🐳 VÉRIFICATION DOCKER-IN-DOCKER"
                    echo "Docker version:"
                    docker --version
                    echo "Test de fonctionnement:"
                    docker ps
                    echo "✅ Docker accessible depuis Jenkins"
                '''
            }
        }
        
        stage('📦 Build avec Node.js Docker') {
            steps {
                sh '''
                    echo "🚀 CONSTRUCTION DE L'APPLICATION"
                    
                    # Utiliser un conteneur Node.js pour le build
                    docker run --rm \
                        -v $(pwd):/app \
                        -w /app \
                        node:18-alpine \
                        sh -c "
                            npm ci --silent --no-audit &&
                            npm run build &&
                            echo '✅ Build réussi' &&
                            ls -la dist/ || ls -la build/
                        "
                '''
            }
        }
        
        stage('🐳 Création Image de Production') {
            steps {
                sh '''
                    echo "📦 CRÉATION IMAGE DOCKER"
                    
                    # Vérifier le dossier de build
                    if [ -d "dist" ]; then
                        BUILD_DIR="dist"
                    elif [ -d "build" ]; then
                        BUILD_DIR="build"
                    else
                        echo "❌ Aucun build détecté"
                        exit 1
                    fi
                    
                    # Créer le Dockerfile
                    cat > Dockerfile << EOF
FROM nginx:alpine
COPY $BUILD_DIR/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
                    
                    # Construire l'image
                    docker build -t plateforme-location:${BUILD_NUMBER} .
                    echo "✅ Image créée: plateforme-location:${BUILD_NUMBER}"
                '''
            }
        }
        
        stage('🚀 Déploiement') {
            steps {
                sh """
                    echo "🚀 DÉPLOIEMENT SUR PORT ${APP_PORT}"
                    
                    # Arrêter l'ancien conteneur
                    docker stop plateforme-${APP_PORT} 2>/dev/null || true
                    docker rm plateforme-${APP_PORT} 2>/dev/null || true
                    
                    # Démarrer le nouveau
                    docker run -d \\
                        --name plateforme-${APP_PORT} \\
                        -p ${APP_PORT}:80 \\
                        plateforme-location:${BUILD_NUMBER}
                    
                    echo "✅ Application déployée sur http://localhost:${APP_PORT}"
                    
                    # Vérification
                    sleep 3
                    echo "🔍 Statut:"
                    docker ps | grep plateforme-${APP_PORT}
                """
            }
        }
    }
    
    post {
        success {
            echo "🎉 SUCCÈS! Application déployée"
            echo "🌐 URL: http://localhost:${APP_PORT}"
        }
    }
}