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
                    echo "✅ Build réussi !"
                    ls -la dist/
                '''
            }
        }
        
        stage('Préparation Docker') {
            steps {
                sh '''
                    echo "🐳 Installation de Docker dans le conteneur..."
                    apk update && apk add --no-cache docker
                    echo "✅ Docker installé"
                '''
            }
        }
        
        stage('Docker Build') {
            steps {
                sh '''
                    echo "📦 Création image Docker..."
                    echo "FROM nginx:alpine" > Dockerfile
                    echo "COPY dist/ /usr/share/nginx/html" >> Dockerfile
                    echo "EXPOSE 80" >> Dockerfile
                    echo "CMD [\"nginx\", \"-g\", \"daemon off;\"]" >> Dockerfile
                    
                    docker build -t app:${BUILD_NUMBER} .
                    echo "✅ Image Docker créée: app:${BUILD_NUMBER}"
                '''
            }
        }
    }
    
    post {
        success {
            echo "🎉 SUCCÈS COMPLET !"
            echo "🐳 Image: app:${BUILD_NUMBER}"
            echo "🚀 Pour déployer: docker run -p 3000:80 app:${BUILD_NUMBER}"
        }
    }
}