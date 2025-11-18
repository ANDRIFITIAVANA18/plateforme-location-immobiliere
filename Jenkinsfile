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
                    // Utilise Docker pour un build réel
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
        
        stage('Deploy Simulation') {
            steps {
                sh '''
                    echo "🚀 Simulation de déploiement Docker..."
                    docker --version
                    echo "✅ Docker opérationnel dans Jenkins !"
                '''
            }
        }
    }
    
    post {
        success {
            sh 'echo "🎉 SUCCÈS TOTAL ! Pipeline CI/CD AVEC DOCKER FONCTIONNEL !"'
        }
        failure {
            sh 'echo "❌ ÉCHEC - Vérifiez les logs"'
        }
    }
}
