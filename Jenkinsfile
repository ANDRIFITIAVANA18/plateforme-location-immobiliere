pipeline {
    agent any
    
    stages {
        stage('Test Docker') {
            steps {
                sh '''
                    echo "🔧 Test Docker final..."
                    docker --version
                    echo "📋 Containers en cours:"
                    docker ps
                    echo "🐳 Téléchargement NodeJS..."
                    docker pull node:18-alpine
                    echo "✅ DOCKER FONCTIONNE PARFAITEMENT !"
                '''
            }
        }
    }
    
    post {
        success {
            sh 'echo "🎉 DOCKER OPÉRATIONNEL DANS JENKINS !"'
        }
    }
}
