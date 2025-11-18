pipeline {
    agent {
        docker {
            image 'node:18-alpine'
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
                echo "🚀 Déploiement Docker simulé"
                echo "Pour déployer vraiment, utilisez:"
                echo "docker-compose down && docker-compose up --build -d"
                '''
            }
        }
    }
    
    post {
        success {
            sh 'echo "🎉 SUCCÈS ! Pipeline CI/CD COMPLETEMENT FONCTIONNEL !"'
        }
        failure {
            sh 'echo "❌ ÉCHEC - Vérifiez les logs"'
        }
    }
}
