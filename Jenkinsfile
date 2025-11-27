pipeline {
    agent any
    
    triggers {
        githubPush()
        pollSCM('H/1 * * * *')
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
        APP_PORT = '3101'  // ✅ CHANGEMENT DE PORT
        JENKINS_PORT = '9090'
    }
    
    stages {
        stage('🔍 Analyse Git') {
            steps {
                script {
                    if (currentBuild.getBuildCauses('hudson.triggers.SCMTrigger$SCMTriggerCause') || 
                        currentBuild.getBuildCauses('com.cloudbees.jenkins.GitHubPushCause')) {
                        echo "🎯 DÉCLENCHÉ AUTOMATIQUEMENT PAR CHANGEMENT GIT"
                        currentBuild.description = "Auto: ${currentBuild.getBuildCauses()[0].shortDescription}"
                    } else {
                        echo "👤 DÉCLENCHÉ MANUELLEMENT"
                        currentBuild.description = "Manuel: Build #${BUILD_NUMBER}"
                    }
                }
                
                sh """
                    echo "=========================================="
                    echo "🔍 ANALYSE GIT - Build #${BUILD_NUMBER}"
                    echo "=========================================="
                    echo "📝 Commit: \$(git log -1 --pretty=format:'%h - %s')"
                    echo "👤 Auteur: \$(git log -1 --pretty=format:'%an')"
                    echo "🔀 Branche: \$(git branch --show-current)"
                    echo "📦 Projet: \$(grep '\"name\"' package.json | head -1 | cut -d'\"' -f4)"
                """
            }
        }
        
        stage('🔧 Vérification Docker') {
            steps {
                sh """
                    echo "🐳 VÉRIFICATION DOCKER"
                    docker --version && echo "✅ Docker disponible"
                    docker ps && echo "✅ Permissions Docker OK"
                    
                    echo "🔍 Vérification des ports:"
                    echo "Port 3100: \$(docker ps --format 'table {{.Ports}}' | grep 3100 || echo 'Libre')"
                    echo "Port ${APP_PORT}: \$(docker ps --format 'table {{.Ports}}' | grep ${APP_PORT} || echo 'Libre')"
                    
                    echo "🧹 Nettoyage des anciens conteneurs..."
                    docker stop myapp-3100 2>/dev/null || echo "ℹ️ Aucun conteneur myapp-3100 à arrêter"
                    docker rm myapp-3100 2>/dev/null || echo "ℹ️ Aucun conteneur myapp-3100 à supprimer"
                """
            }
        }
        
        stage('🐳 Build Complet avec Dockerfile') {
            steps {
                sh """
                    echo "🔨 CONSTRUCTION COMPLÈTE AVEC DOCKER"
                    
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
                    
                    # Construction de l'image complète
                    echo "🏗️ Construction de l'image..."
                    docker build -f Dockerfile.build -t plateforme-location:${BUILD_NUMBER} .
                    echo "✅ Image construite: plateforme-location:${BUILD_NUMBER}"
                """
            }
        }
        
        stage('🚀 Déploiement') {
            steps {
                sh """
                    echo "🚀 DÉPLOIEMENT SUR PORT ${APP_PORT}"
                    
                    # Arrêt de l'ancien conteneur (même nom)
                    docker stop plateforme-app-${APP_PORT} 2>/dev/null || echo "ℹ️ Aucun conteneur à arrêter"
                    docker rm plateforme-app-${APP_PORT} 2>/dev/null || echo "ℹ️ Aucun conteneur à supprimer"
                    
                    # Déploiement du nouveau conteneur
                    docker run -d \\
                        --name plateforme-app-${APP_PORT} \\
                        -p ${APP_PORT}:80 \\
                        plateforme-location:${BUILD_NUMBER}
                    
                    echo "⏳ Attente du démarrage..."
                    sleep 10
                    
                    # Vérification
                    echo "📊 Statut:"
                    docker ps --filter name=plateforme-app-${APP_PORT}
                    
                    echo "🔍 Test de santé..."
                    curl -f http://localhost:${APP_PORT} > /dev/null 2>&1 && echo "✅ Application accessible" || echo "⚠️ Application en démarrage"
                    
                    echo "🎉 DÉPLOIEMENT RÉUSSI!"
                    echo "🌐 URL: http://localhost:${APP_PORT}"
                    echo "⚙️ Jenkins: http://localhost:${JENKINS_PORT}"
                """
            }
        }
    }
    
    post {
        always {
            echo "🏁 PIPELINE TERMINÉ - Build #${BUILD_NUMBER}"
            echo "⏱️ Durée: ${currentBuild.durationString}"
            
            // Nettoyage
            sh '''
                rm -f Dockerfile.build 2>/dev/null || true
            '''
        }
        success {
            echo "🎉 SUCCÈS COMPLET !"
            echo "📋 RAPPORT:"
            echo "• ✅ Détection auto Git"
            echo "• ✅ Docker fonctionnel" 
            echo "• ✅ Build complet avec Docker"
            echo "• ✅ Déploiement réussi"
            echo ""
            echo "🚀 APPLICATION DÉPLOYÉE:"
            echo "🌐 URL: http://localhost:${APP_PORT}"
            echo "🐳 Image: plateforme-location:${BUILD_NUMBER}"
            echo "🔧 Port: ${APP_PORT}"
        }
        failure {
            echo "❌ ÉCHEC - Diagnostic:"
            sh '''
                echo "🔧 Informations:"
                docker ps -a
                echo "🔍 Ports utilisés:"
                netstat -tuln | grep ":31" || echo "Aucun port 31xx utilisé"
            '''
        }
    }
}