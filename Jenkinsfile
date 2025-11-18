pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock'  // Monte le socket Docker
        }
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "📦 Code récupéré avec succès"'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'echo "✅ Dépendances installées"'
            }
        }
        
        stage('Build Frontend') {
            steps {
                sh 'npm run build'
                sh 'echo "🏗️ Application construite"'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                echo "🚀 Build réussi !"
                echo "Pour déployer manuellement: docker-compose down && docker-compose up --build -d"
                '''
            }
        }
    }
    
    post {
        success {
            sh 'echo "🎉 SUCCÈS ! Pipeline CI/CD FONCTIONNEL !"'
        }
        failure {
            sh 'echo "❌ ÉCHEC - Vérifiez les logs"'
        }
    }
}
