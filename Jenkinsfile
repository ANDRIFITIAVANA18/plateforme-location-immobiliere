pipeline {
    agent any
    
    stages {
        stage('🔍 Analyse') {
            steps {
                sh '''
                    echo "🔍 Détection projet..."
                    if [ -f "package.json" ]; then
                        echo "📦 $(grep '"name"' package.json | head -1)"
                    fi
                '''
            }
        }
        
        stage('🏗️ Build') {
            steps {
                sh '''
                    echo "🔨 Construction..."
                    docker run --rm -v `pwd`:/app -w /app node:18-alpine sh -c "
                        npm install
                        npm run build
                        echo '✅ Build réussi!'
                    "
                '''
            }
        }
        
        stage('🐳 Docker') {
            steps {
                sh '''
                    echo "📦 Création image..."
                    echo "FROM nginx:alpine" > Dockerfile
                    echo "COPY dist/ /usr/share/nginx/html" >> Dockerfile
                    echo "EXPOSE 80" >> Dockerfile
                    docker build -t app:${BUILD_NUMBER} .
                    echo "✅ Image: app:${BUILD_NUMBER}"
                '''
            }
        }
    }
    
    post {
        success {
            echo "🎉 RÉUSSI !"
        }
    }
}