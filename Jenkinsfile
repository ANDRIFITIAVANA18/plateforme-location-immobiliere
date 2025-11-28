pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-v /var/jenkins_home:/workspace -u root'
        }
    }
    
    environment {
        APP_PORT = '3101'
        BUILD_TIMESTAMP = new Date().format('yyyyMMdd-HHmmss')
    }
    
    stages {
        stage('📦 Installation Dépendances') {
            steps {
                sh '''
                    echo "📥 INSTALLATION DES DÉPENDANCES..."
                    npm install --silent --no-progress --no-audit --no-fund
                    echo "✅ DÉPENDANCES INSTALLÉES"
                '''
            }
        }
        
        stage('🏗️ Build Application') {
            steps {
                sh '''
                    echo "🏗️ CONSTRUCTION DE L'APPLICATION..."
                    npm run build
                    echo "✅ APPLICATION CONSTRUITE"
                    echo "📁 Contenu du dossier dist:"
                    ls -la dist/ 2>/dev/null && echo "Fichiers: $(find dist/ -type f 2>/dev/null | wc -l)" || echo "Dossier dist non trouvé"
                '''
            }
        }
    }
    
    post {
        success {
            echo "🎉 SUCCÈS! Application construite dans dist/"
        }
        failure {
            echo "❌ ÉCHEC - Vérifiez les logs"
        }
    }
}
