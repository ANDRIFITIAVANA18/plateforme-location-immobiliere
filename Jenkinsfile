pipeline {
    agent {
        docker {
            image 'node:18-alpine'  // Image avec NodeJS préinstallé
            args '--privileged'     // Donne les permissions
        }
    }
    
    // SUPPRIME la section tools et l'étape Setup System Dependencies
    // tools {
    //     nodejs 'nodejs'
    // }
    
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
                docker-compose down || true
                docker-compose up --build -d
                echo "🚀 Application déployée sur http://localhost"
                '''
            }
        }
    }
    
    post {
        success {
            sh 'echo "🎉 SUCCÈS ! Vérifiez http://localhost"'
        }
        failure {
            sh 'echo "❌ ÉCHEC - Vérifiez les logs"'
        }
    }
}
