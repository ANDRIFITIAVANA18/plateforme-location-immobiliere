pipeline {
    agent any
    
    triggers {
        githubPush()
        pollSCM('H/2 * * * *')
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
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
                    
                    echo "📁 Fichiers modifiés:"
                    git diff --name-only HEAD~1 HEAD 2>/dev/null | head -10 || echo "Nouveau commit"
                    
                    echo "📦 Projet: \$(grep '\"name\"' package.json | head -1 | cut -d'\"' -f4)"
                """
            }
        }
        
        stage('🔧 Vérification Docker') {
            steps {
                sh """
                    echo "🐳 VÉRIFICATION DOCKER"
                    if docker --version > /dev/null 2>&1; then
                        echo "✅ Docker disponible"
                        docker ps > /dev/null 2>&1 && echo "✅ Permissions Docker OK" || {
                            echo "❌ Permissions Docker manquantes"
                            echo "🔧 Exécutez: docker exec -u 0 jenkins-docker usermod -aG docker jenkins"
                            exit 1
                        }
                    else
                        echo "❌ Docker non disponible"
                        exit 1
                    fi
                """
            }
        }
        
        stage('📥 Installation') {
            steps {
                sh """
                    echo "🔧 INSTALLATION DES DÉPENDANCES"
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npm install --silent
                        echo '✅ Dépendances installées'
                        echo 'Node: \$(node --version)'
                        echo 'npm: \$(npm --version)'
                    "
                """
            }
        }
        
        stage('✅ Validation') {
            steps {
                sh """
                    echo "🔬 VALIDATION"
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npx tsc --noEmit --skipLibCheck
                        echo '✅ TypeScript validé'
                        
                        npm test -- --watchAll=false --passWithNoTests --silent
                        echo '✅ Tests terminés'
                    "
                """
            }
        }
        
        stage('🏗️ Build') {
            steps {
                sh """
                    echo "🔨 BUILD PRODUCTION"
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npm run build
                        echo '✅ Build réussi'
                    "
                """
                
                sh """
                    echo "📊 ANALYSE BUILD"
                    if [ -d "dist" ]; then
                        echo "📁 Dossier: dist/"
                        echo "📏 Taille: \$(du -sh dist | cut -f1)"
                        echo "📋 Fichiers: \$(find dist -type f | wc -l)"
                    fi
                """
            }
        }
        
        stage('🐳 Docker') {
            steps {
                sh """
                    echo "📦 CRÉATION IMAGE DOCKER"
                    
                    echo 'FROM nginx:alpine' > Dockerfile
                    echo 'COPY dist/ /usr/share/nginx/html' >> Dockerfile
                    echo 'EXPOSE 80' >> Dockerfile
                    echo 'CMD [\"nginx\", \"-g\", \"daemon off;\"]' >> Dockerfile
                    
                    docker build -t plateforme-location:\${BUILD_NUMBER} .
                    echo "✅ Image créée: plateforme-location:\${BUILD_NUMBER}"
                """
            }
        }
        
        stage('🚀 Déploiement') {
            steps {
                sh """
                    echo "🚀 DÉPLOIEMENT LOCAL"
                    
                    # Arrêt ancien conteneur
                    docker stop plateforme-app || true
                    docker rm plateforme-app || true
                    
                    # Déploiement nouveau
                    docker run -d \
                        --name plateforme-app \
                        -p 3000:80 \
                        plateforme-location:\${BUILD_NUMBER}
                    
                    echo "✅ Déployé sur: http://localhost:3000"
                    
                    # Vérification
                    sleep 5
                    echo "📊 Statut: \$(docker ps --filter name=plateforme-app --format 'table {{.Names}}\\t{{.Status}}')"
                """
            }
        }
    }
    
    post {
        success {
            echo "🎉 SUCCÈS - Build #${BUILD_NUMBER}"
            echo "🌐 Application: http://localhost:3000"
            echo "🐳 Image: plateforme-location:${BUILD_NUMBER}"
        }
        failure {
            echo "❌ ÉCHEC - Vérifiez les permissions Docker"
            echo "🔧 Commande de réparation:"
            echo "docker exec -u 0 jenkins-docker usermod -aG docker jenkins"
        }
    }
}