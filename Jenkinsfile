pipeline {
    agent any
    triggers { pollSCM('H/5 * * * *') }
    environment { 
        APP_PORT = '3100'
        JENKINS_PORT = '9090'  // ✅ Ton port Jenkins
    }
    
    stages {
        stage('🔍 Détection Git') {
            when { changeset "**/*" }
            steps {
                echo "📦 Build #${BUILD_NUMBER} - Jenkins: ${JENKINS_PORT}"
                sh 'git log -1 --pretty=format:"📝 %h - %s"'
            }
        }
        
        stage('🐳 Build et Déploiement') {
            steps {
                sh '''
                    # Build
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                        npm install
                        npm run build
                    "
                    
                    # Création image
                    echo "FROM nginx:alpine" > Dockerfile
                    echo "COPY dist/ /usr/share/nginx/html" >> Dockerfile
                    docker build -t myapp:${BUILD_NUMBER} .
                    
                    # Déploiement
                    docker stop myapp-${APP_PORT} 2>/dev/null || true
                    docker rm myapp-${APP_PORT} 2>/dev/null || true
                    docker run -d -p ${APP_PORT}:80 --name myapp-${APP_PORT} myapp:${BUILD_NUMBER}
                    
                    echo "✅ Déployé: http://localhost:${APP_PORT}"
                    echo "⚙️ Jenkins: http://localhost:${JENKINS_PORT}"
                '''
            }
        }
    }
    
    post {
        success {
            echo "🎉 Succès! App: http://localhost:${APP_PORT} | Jenkins: http://localhost:${JENKINS_PORT}"
        }
    }
}