pipeline {
    agent any
    environment { 
        APP_PORT = '3100'
        JENKINS_PORT = '9090'
    }
    
    stages {
        stage('🚀 Tout-en-un') {
            steps {
                sh """
                    echo "🎯 Build #${BUILD_NUMBER} - Jenkins: ${JENKINS_PORT}"
                    
                    # Construction et déploiement en une commande
                    docker build -t myapp:${BUILD_NUMBER} - << 'EOF'
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
                    
                    # Déploiement
                    docker stop myapp-${APP_PORT} 2>/dev/null || true
                    docker rm myapp-${APP_PORT} 2>/dev/null || true
                    docker run -d -p ${APP_PORT}:80 --name myapp-${APP_PORT} myapp:${BUILD_NUMBER}
                    
                    echo "✅ Terminé! http://localhost:${APP_PORT}"
                """
            }
        }
    }
    
    post {
        success {
            echo "🎉 Succès! App: http://localhost:${APP_PORT} | Jenkins: http://localhost:${JENKINS_PORT}"
        }
    }
}