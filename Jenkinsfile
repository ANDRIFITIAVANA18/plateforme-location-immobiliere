pipeline {
    agent any
    
    tools {
        nodejs 'nodejs'  // Jenkins l'installera automatiquement
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "📦 Code récupéré avec succès"'
            }
        }
        
        // AJOUTE CETTE NOUVELLE ÉTAPE
        stage('Setup System Dependencies') {
            steps {
                sh '''
                    apt-get update
                    apt-get install -y libatomic1 build-essential
                    echo "✅ Dépendances système installées"
                '''
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
