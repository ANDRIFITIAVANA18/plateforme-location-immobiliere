pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "📦 Code récupéré avec succès"'
            }
        }
        
        stage('Build with Real Docker') {
            steps {
                script {
                    docker.image('node:18-alpine').inside {
                        sh '''
                            echo "🔧 Installation des dépendances NodeJS..."
                            node --version
                            npm --version
                            npm install
                            echo "🏗️ Construction du frontend..."
                            npm run build
                            echo "✅ Build RÉEL réussi !"
                            ls -la dist/
                        '''
                    }
                }
            }
        }
    }
    
    post {
        success {
            sh 'echo "🎉 SUCCÈS TOTAL ! Pipeline CI/CD AVEC DOCKER FONCTIONNEL !"'
        }
    }
}
