pipeline {
    agent any

    environment {
        APP_PORT = '3100'
    }

    stages {
        stage('📥 Checkout') {
            steps {
                checkout scm
            }
        }

        stage('🐳 Build et Déploiement') {
            steps {
                sh '''
                    echo "🔨 Installation et build..."
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                        npm install
                        npm run build
                    "

                    echo "🐳 Création image Docker..."
                    echo "FROM nginx:alpine" > Dockerfile
                    echo "COPY dist/ /usr/share/nginx/html" >> Dockerfile
                    echo "EXPOSE 80" >> Dockerfile
                    echo 'CMD ["nginx", "-g", "daemon off;"]' >> Dockerfile
                    
                    docker build -t myapp:${BUILD_NUMBER} .

                    echo "🚀 Déploiement..."
                    docker stop myapp-${APP_PORT} 2>/dev/null || true
                    docker rm myapp-${APP_PORT} 2>/dev/null || true
                    docker run -d --name myapp-${APP_PORT} -p ${APP_PORT}:80 myapp:${BUILD_NUMBER}

                    echo "✅ Terminé! Accédez à: http://localhost:${APP_PORT}"
                '''
            }
        }
    }
}