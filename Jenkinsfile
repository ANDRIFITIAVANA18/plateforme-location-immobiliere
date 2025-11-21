pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-u root'
        }
    }
    
    stages {
        stage('Install') {
            steps {
                sh '''
                    echo "📦 Installation..."
                    npm install
                '''
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    echo "🏗️ Construction..."
                    npm run build
                    ls -la dist/ || ls -la build/
                '''
            }
        }
        
        stage('Docker') {
            steps {
                sh '''
                    echo "🐳 Création image..."
                    echo "FROM nginx:alpine" > Dockerfile
                    echo "COPY dist/ /usr/share/nginx/html" >> Dockerfile
                    echo "EXPOSE 80" >> Dockerfile
                    docker build -t app:${BUILD_NUMBER} .
                '''
            }
        }
    }
    
    post {
        success {
            echo "✅ Réussi !"
        }
    }
}