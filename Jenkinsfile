pipeline {
    agent any
    
    stages {
        stage('📦 Installation Dépendances') {
            steps {
                sh '''
                    echo "📥 INSTALLATION DES DÉPENDANCES..."
                    # Utilisez une image Docker externe
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine \
                    sh -c "npm install --silent --no-progress --no-audit --no-fund"
                    echo "✅ DÉPENDANCES INSTALLÉES"
                '''
            }
        }
        
        stage('🏗️ Build Application') {
            steps {
                sh '''
                    echo "🏗️ CONSTRUCTION DE L'APPLICATION..."
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine \
                    sh -c "npm run build"
                    echo "✅ APPLICATION CONSTRUITE"
                    ls -la dist/
                '''
            }
        }
    }
}
