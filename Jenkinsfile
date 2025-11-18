pipeline {
    agent any
    
    stages {
        stage('Test Docker') {
            steps {
                sh '''
                    echo "🔧 Test des permissions Docker..."
                    docker --version
                    docker ps
                    echo "✅ Docker fonctionne !"
                '''
            }
        }
    }
}
