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
                    echo "📁 Contenu du workspace:"
                    ls -la
                    echo "📋 package.json trouvé:"
                    cat package.json | head -10
                '''
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
        
        stage('📦 Installation Dépendances - CORRIGÉ') {
            steps {
                sh '''
                    echo "📥 Installation des dépendances - Méthode corrigée..."
                    
                    # Vérification que les fichiers sont bien là
                    echo "🔍 Vérification avant Docker:"
                    pwd
                    ls -la package.json package-lock.json 2>/dev/null && echo "✅ Fichiers présents" || echo "❌ Fichiers manquants"
                    
                    # Installation avec le bon montage de volume
                    docker run --rm \
                        -v /var/jenkins_home/workspace/pipeline_localisation:/app \
                        -w /app \
                        node:18-alpine sh -c "
                            echo '📊 Dans le conteneur Docker:'
                            pwd
                            echo '📋 Fichiers visibles:'
                            ls -la | head -15
                            echo '🔧 Installation npm...'
                            npm install --verbose
                            echo '✅ Dépendances installées avec succès'
                        "
                '''
            }
        }
        
        stage('🏗️ Build Application') {
            steps {
                sh '''
                    echo "🔨 Construction de l'application..."
                    
                    docker run --rm \
                        -v /var/jenkins_home/workspace/pipeline_localisation:/app \
                        -w /app \
                        node:18-alpine sh -c "
                            echo '🏗️ Build en cours...'
                            npm run build
                            echo '✅ Build terminé'
                        "
                    
                    # Vérification
                    echo "📊 Vérification du build:"
                    if [ -d "dist" ]; then
                        echo "📁 Dossier dist créé:"
                        ls -la dist/
                        echo "📏 Taille: $(du -sh dist | cut -f1)"
                    else
                        echo "❌ Build échoué - dossier dist manquant"
                        echo "📋 Contenu actuel:"
                        ls -la | head -20
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
                    echo "🧹 Nettoyage des anciens conteneurs..."
                    docker stop myapp-${APP_PORT} 2>/dev/null || echo "ℹ️ Aucun conteneur à arrêter"
                    docker rm myapp-${APP_PORT} 2>/dev/null || echo "ℹ️ Aucun conteneur à supprimer"
                    
                    # Création Dockerfile
                    echo "📋 Création du Dockerfile..."
                    cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
                    
                    # Construction image
                    echo "🐳 Construction de l'image Docker..."
                    docker build -t myapp:${BUILD_NUMBER} .
                    
                    # Déploiement
                    echo "🎯 Démarrage du conteneur..."
                    docker run -d \\
                        --name myapp-${APP_PORT} \\
                        -p ${APP_PORT}:80 \\
                        myapp:${BUILD_NUMBER}
                    
                    # Vérification
                    echo "⏳ Attente du démarrage..."
                    sleep 8
                    
                    echo "📊 Statut final:"
                    docker ps --filter name=myapp-${APP_PORT}
                    
                    echo "🎉 SUCCÈS COMPLET!"
                    echo "🌐 Votre application est disponible sur: http://localhost:${APP_PORT}"
                """
            }
        }
    }
    
    post {
        always {
            echo "🏁 Pipeline terminé - Build #${BUILD_NUMBER}"
        }
        success {
            echo "✅ FÉLICITATIONS! Pipeline réussi 🚀"
            echo "📍 Accédez à: http://localhost:3100"
        }
        failure {
            echo "❌ Échec - Diagnostic avancé"
            sh '''
                echo "🔧 Informations détaillées:"
                echo "Workspace: $(pwd)"
                echo "Fichiers:"
                ls -la | head -15
                echo "Docker:"
                docker ps -a
            '''
        }
    }
}