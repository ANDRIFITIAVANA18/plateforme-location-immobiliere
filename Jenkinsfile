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
        
        stage('Verify Docker') {
            steps {
                sh '''
                    echo "🚀 Vérification Docker..."
                    docker --version
                    docker ps
                    echo "✅ Docker pleinement opérationnel dans Jenkins !"
                '''
            }
        }
    }
    
    post {
        success {
            sh 'echo "🎉 SUCCÈS TOTAL ! Pipeline CI/CD COMPLET AVEC DOCKER FONCTIONNEL !"'
        }
        failure {
            sh 'echo "❌ ÉCHEC - Vérifiez les logs"'
        }
    }
}
