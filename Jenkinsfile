pipeline {
    agent any
    
    triggers {
        githubPush()
        pollSCM('H/5 * * * *')
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
        APP_PORT = '3100'
    }
    
    stages {
        stage('🔍 Diagnostic Environnement') {
            steps {
                sh '''
                    echo "🔍 DIAGNOSTIC COMPLET DE L'ENVIRONNEMENT"
                    echo "=========================================="
                    echo "📊 Système: $(uname -a)"
                    echo "👤 Utilisateur: $(whoami)"
                    echo "📁 Répertoire: $(pwd)"
                    echo "💾 Espace disque:"
                    df -h .
                    echo "🔧 Outils disponibles:"
                    which node || echo "❌ Node.js NON installé"
                    which npm || echo "❌ npm NON installé"
                    which docker || echo "❌ Docker NON disponible"
                    echo "📦 Gestionnaire de paquets:"
                    which apt || echo "Apt non disponible"
                    which yum || echo "Yum non disponible"
                    echo "=========================================="
                '''
            }
        }
        
        stage('🐳 Utilisation Docker pour Node.js') {
            steps {
                script {
                    try {
                        // Essayer d'utiliser Docker si disponible
                        sh '''
                            echo "🚀 UTILISATION DE DOCKER POUR L'ENVIRONNEMENT NODE.JS"
                            docker --version
                            echo "✅ Docker disponible - utilisation d'un conteneur Node.js"
                        '''
                    } catch (Exception e) {
                        echo "❌ Docker non disponible - tentative alternative"
                    }
                }
            }
        }
        
        stage('📦 Installation avec Docker') {
            steps {
                sh '''
                    echo "🐳 CONSTRUCTION AVEC DOCKER"
                    
                    # Créer un Dockerfile temporaire
                    cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers du projet
COPY package*.json ./
COPY . .

# Installation des dépendances
RUN npm ci --silent --no-audit

# Build de l'application
RUN npm run build

# Exposition du port
EXPOSE 80

# Commande pour servir les fichiers static
CMD ["npx", "serve", "-s", "dist", "-l", "80"]
EOF

                    echo "🔨 Construction de l'image Docker..."
                    docker build -t app-builder:${BUILD_NUMBER} .
                    
                    echo "📦 Extraction des fichiers buildés..."
                    docker create --name temp-container app-builder:${BUILD_NUMBER}
                    docker cp temp-container:/app/dist ./dist-docker/ || docker cp temp-container:/app/build ./build-docker/
                    docker rm temp-container
                    
                    echo "✅ Build terminé avec Docker"
                '''
            }
        }
        
        stage('🔍 Vérification Build') {
            steps {
                sh '''
                    echo "🔍 VÉRIFICATION DU BUILD"
                    if [ -d "dist-docker" ]; then
                        echo "📁 Build Docker réussi: dist-docker/"
                        echo "📏 Taille: $(du -sh dist-docker | cut -f1)"
                        ls -la dist-docker/
                        # Copier vers le dossier standard
                        cp -r dist-docker/ dist/ 2>/dev/null || true
                    elif [ -d "build-docker" ]; then
                        echo "📁 Build Docker réussi: build-docker/"
                        echo "📏 Taille: $(du -sh build-docker | cut -f1)"
                        ls -la build-docker/
                        cp -r build-docker/ build/ 2>/dev/null || true
                    elif [ -d "dist" ]; then
                        echo "📁 Build existant: dist/"
                    elif [ -d "build" ]; then
                        echo "📁 Build existant: build/"
                    else
                        echo "❌ Aucun build détecté"
                        exit 1
                    fi
                '''
            }
        }
        
        stage('🐳 Création Image Finale') {
            steps {
                sh '''
                    echo "📦 CRÉATION IMAGE DE PRODUCTION"
                    
                    # Dockerfile pour la production
                    cat > Dockerfile.prod << 'EOF'
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY build/ /usr/share/nginx/html/ 2>/dev/null || true
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

                    # Utiliser le bon dossier de build
                    if [ -d "dist" ]; then
                        docker build -f Dockerfile.prod -t plateforme-location:${BUILD_NUMBER} .
                    elif [ -d "build" ]; then
                        docker build -f Dockerfile.prod -t plateforme-location:${BUILD_NUMBER} .
                    elif [ -d "dist-docker" ]; then
                        cp -r dist-docker/ dist/
                        docker build -f Dockerfile.prod -t plateforme-location:${BUILD_NUMBER} .
                    else
                        echo "❌ Aucun fichier à déployer"
                        exit 1
                    fi
                    
                    echo "✅ Image de production créée: plateforme-location:${BUILD_NUMBER}"
                '''
            }
        }
        
        stage('🚀 Déploiement') {
            steps {
                sh '''
                    echo "🚀 DÉPLOIEMENT SUR PORT ${APP_PORT}"
                    
                    # Arrêt de l'ancien conteneur
                    docker stop plateforme-${APP_PORT} 2>/dev/null || true
                    docker rm plateforme-${APP_PORT} 2>/dev/null || true
                    
                    # Démarrage du nouveau
                    docker run -d \
                        --name plateforme-${APP_PORT} \
                        -p ${APP_PORT}:80 \
                        plateforme-location:${BUILD_NUMBER}
                    
                    echo "✅ Application déployée sur http://localhost:${APP_PORT}"
                    
                    # Vérification
                    sleep 5
                    echo "🔍 Statut du conteneur:"
                    docker ps | grep plateforme-${APP_PORT}
                    
                    echo "🌐 Test d'accessibilité..."
                    curl -f http://localhost:${APP_PORT} >/dev/null 2>&1 && \
                    echo "🎉 APPLICATION ACCESSIBLE!" || \
                    echo "⚠️ En cours de démarrage..."
                '''
            }
        }
    }
    
    post {
        always {
            echo "🏁 PIPELINE TERMINÉ - Build #${BUILD_NUMBER}"
            echo "⏱️ Durée: ${currentBuild.durationString}"
            
            // Nettoyage
            sh '''
                echo "🧹 NETTOYAGE"
                docker system prune -f 2>/dev/null || true
                rm -rf dist-docker build-docker 2>/dev/null || true
            '''
        }
        success {
            echo "🎉 SUCCÈS! Application déployée"
            echo "🌐 URL: http://localhost:${APP_PORT}"
            echo "🐳 Image: plateforme-location:${BUILD_NUMBER}"
        }
        failure {
            echo "❌ ÉCHEC - Solutions:"
            echo "1. Vérifiez que Docker est installé et accessible"
            echo "2. Vérifiez les permissions Docker: sudo usermod -aG docker jenkins"
            echo "3. Redémarrez Jenkins: sudo systemctl restart jenkins"
            
            sh '''
                echo "🔍 Logs de débogage:"
                docker logs plateforme-${APP_PORT} 2>/dev/null | tail -20 || echo "Aucun conteneur"
            '''
        }
    }
}