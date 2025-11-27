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
                    echo "📁 Contenu:"
                    ls -la
                    echo "🔍 package.json:"
                    find . -name "package.json" | head -5
                '''
            }
        }
        
        stage('🐳 Vérification Docker') {
            steps {
                sh '''
                    echo "🔧 Vérification de Docker..."
                    docker --version && echo "✅ Docker est disponible"
                    docker ps && echo "✅ Docker fonctionne"
                '''
            }
        }
        
        stage('🔍 Recherche Projet') {
            steps {
                sh '''
                    echo "🔍 Recherche du projet React..."
                    # Cherche le dossier avec package.json
                    PROJECT_DIR=$(find . -name "package.json" -type f | head -1 | xargs dirname)
                    if [ -n "$PROJECT_DIR" ]; then
                        echo "✅ Projet trouvé dans: $PROJECT_DIR"
                        cd "$PROJECT_DIR"
                        pwd
                        ls -la
                    else
                        echo "❌ Aucun projet React trouvé"
                        echo "📋 Dossiers disponibles:"
                        find . -type d | head -20
                        exit 1
                    fi
                '''
            }
        }
        
        stage('📦 Installation Dépendances') {
            steps {
                sh '''
                    echo "📥 Installation des dépendances..."
                    # Utilise le chemin absolu pour être sûr
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                        echo '📊 Répertoire de travail:'
                        pwd
                        echo '📋 Fichiers:'
                        ls -la
                        echo '🔧 Installation...'
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
                        echo "📊 Taille: $(du -sh dist | cut -f1)"
                    else
                        echo "❌ Build échoué - dossier dist manquant"
                        echo "📋 Contenu actuel:"
                        ls -la
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
                    
                    # Création Dockerfile
                    cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
                    
                    # Construction image
                    docker build -t myapp:${BUILD_NUMBER} .
                    
                    # Déploiement
                    docker run -d \\
                        --name myapp-${APP_PORT} \\
                        -p ${APP_PORT}:80 \\
                        myapp:${BUILD_NUMBER}
                    
                    # Vérification
                    sleep 5
                    echo "📊 Statut:"
                    docker ps --filter name=myapp-${APP_PORT}
                    
                    echo "🎉 SUCCÈS!"
                    echo "🌐 http://localhost:${APP_PORT}"
                """
            }
        }
    }
    
    post {
        always {
            echo "🏁 Pipeline terminé - Build #${BUILD_NUMBER}"
        }
        success {
            echo "✅ DÉPLOIEMENT RÉUSSI! 🚀"
        }
        failure {
            echo "❌ Échec"
            sh '''
                echo "🔧 Diagnostic:"
                pwd
                ls -la
                find . -name "package.json" 2>/dev/null || echo "Aucun package.json trouvé"
            '''
        }
    }
}