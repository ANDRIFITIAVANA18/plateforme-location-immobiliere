pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '--privileged -u root'
        }
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
        APP_NAME = 'plateforme-location-immobiliere'
    }
    
    stages {
        stage('🔧 Préparation') {
            steps {
                sh '''
                    echo "🔧 Installation des outils nécessaires..."
                    apk update && apk add --no-cache git jq
                    echo "✅ Outils installés"
                    
                    echo "📦 Informations du projet:"
                    if [ -f "package.json" ]; then
                        echo "Projet: $(cat package.json | grep '"name"' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')"
                        echo "Version: $(cat package.json | grep '"version"' | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')"
                    fi
                    
                    echo "📁 Structure:"
                    find . -name "*.tsx" -o -name "*.jsx" | head -5 | wc -l | xargs echo "Composants React:"
                    find . -name "*.test.*" -o -name "*.spec.*" | wc -l | xargs echo "Fichiers de test:"
                '''
            }
        }
        
        stage('📥 Installation') {
            steps {
                sh '''
                    echo "📦 Installation des dépendances..."
                    if [ -f "package-lock.json" ]; then
                        npm ci --silent --no-audit
                    else
                        npm install --silent --no-audit
                    fi
                    echo "✅ Dépendances installées"
                '''
            }
        }
        
        stage('✅ Validation') {
            steps {
                sh '''
                    echo "📘 Validation TypeScript..."
                    if [ -f "tsconfig.json" ]; then
                        npx tsc --noEmit --skipLibCheck
                        echo "✅ TypeScript validé"
                    else
                        echo "⚠️ TypeScript non configuré"
                    fi
                '''
            }
        }
        
        stage('🧪 Tests') {
            steps {
                sh '''
                    echo "🔬 Exécution des tests..."
                    npm test -- --watchAll=false --passWithNoTests --silent
                    echo "✅ Tests terminés"
                '''
            }
        }
        
        stage('🏗️ Build') {
            steps {
                sh '''
                    echo "🔨 Construction de l'application..."
                    npm run build
                    echo "✅ Build réussi"
                    
                    if [ -d "build" ]; then
                        echo "📊 Taille du build: $(du -sh build | cut -f1)"
                    elif [ -d "dist" ]; then
                        echo "📊 Taille du build: $(du -sh dist | cut -f1)"
                    fi
                '''
            }
        }
        
        stage('🐳 Docker') {
            steps {
                sh '''
                    echo "📦 Création de l'image Docker..."
                    
                    # Créer un Dockerfile simple si absent
                    if [ ! -f "Dockerfile" ]; then
                        cat > Dockerfile << 'DOCKERFILE'
FROM nginx:alpine
COPY build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
DOCKERFILE
                        echo "📝 Dockerfile généré automatiquement"
                    fi
                    
                    # Construire l'image
                    docker build -t ${APP_NAME}:${BUILD_NUMBER} .
                    echo "✅ Image Docker créée: ${APP_NAME}:${BUILD_NUMBER}"
                '''
            }
        }
    }
    
    post {
        always {
            echo "🏁 Pipeline terminé - Build #${BUILD_NUMBER}"
        }
        success {
            echo "🎉 SUCCÈS - Application prête pour la production"
            echo "🐳 Image Docker: ${APP_NAME}:${BUILD_NUMBER}"
            echo "🚀 Pour déployer: docker run -p 3000:80 ${APP_NAME}:${BUILD_NUMBER}"
        }
        failure {
            echo "❌ ÉCHEC - Vérifiez les logs ci-dessus"
        }
    }
}