pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-u root'  // Exécuter en root pour éviter les problèmes de permissions
        }
    }
    
    stages {
        stage('Build et Test') {
            steps {
                checkout scm
                sh '''
                    echo "🔧 Installation des dépendances..."
                    npm install
                    
                    echo "🔬 Validation TypeScript..."
                    npx tsc --noEmit
                    
                    echo "🧪 Exécution des tests..."
                    npm test -- --watchAll=false
                    
                    echo "🏗️ Construction..."
                    npm run build
                    
                    echo "✅ Toutes les étapes réussies"
                '''
            }
        }
    }
}