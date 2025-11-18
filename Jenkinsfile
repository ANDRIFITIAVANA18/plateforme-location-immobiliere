pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "📦 Code récupéré avec succès"'
            }
        }
        
        stage('Build with Docker') {
            steps {
                script {
                    docker.image('node:18-alpine').inside {
                        sh '''
                            echo "🔧 Installation des dépendances..."
                            node --version
                            npm --version
                            npm install
                            echo "🏗️ Construction du frontend..."
                            npm run build
                            echo "✅ Build RÉUSSI !"
                            ls -la dist/
                        '''
                    }
                }
            }
        }
    }
    
    post {
        success {
            sh 'echo "🎉 PIPELINE CI/CD COMPLET AVEC DOCKER FONCTIONNEL !"'
        }
    }
}
