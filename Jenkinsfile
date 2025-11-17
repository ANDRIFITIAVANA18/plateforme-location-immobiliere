// pipeline {
//     agent any
    
//     environment {
//         DOCKER_REGISTRY = 'docker.io'
//         FRONTEND_IMAGE_NAME = 'andrifi/plateformeimmobilier-frontend'
//         BACKEND_IMAGE_NAME = 'andrifi/plateformeimmobilier-backend'
//         DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
//     }
    
//     stages {
//         stage('Checkout Code') {
//             steps {
//                 checkout scm
//                 sh 'echo "📦 Code récupéré avec succès"'
//             }
//         }
        
//         stage('Install Frontend Dependencies') {
//             steps {
//                 sh 'npm ci'
//                 sh 'echo "✅ Dépendances frontend installées"'
//             }
//         }
        
//         stage('Install Backend Dependencies') {
//             steps {
//                 dir('backend') {
//                     sh 'npm ci'
//                     sh 'echo "✅ Dépendances backend installées"'
//                 }
//             }
//         }
        
//         stage('Build Frontend') {
//             steps {
//                 sh 'npm run build'
//                 sh 'echo "🏗️ Frontend construit"'
//             }
//         }
        
//         stage('Build Docker Images') {
//             steps {
//                 script {
//                     // Build frontend image
//                     docker.build("${FRONTEND_IMAGE_NAME}:${env.BUILD_ID}")
//                     sh 'echo "🐳 Image frontend construite"'
                    
//                     // Build backend image
//                     dir('backend') {
//                         docker.build("${BACKEND_IMAGE_NAME}:${env.BUILD_ID}")
//                     }
//                     sh 'echo "🐳 Image backend construite"'
//                 }
//             }
//         }
        
//         stage('Deploy') {
//             steps {
//                 sh 'docker-compose down || true'
//                 sh 'docker-compose up -d'
//                 sh 'echo "🚀 Application déployée!"'
//             }
//         }
//     }
    
//     post {
//         always {
//             sh 'echo "🧹 Nettoyage..."'
//             cleanWs()
//         }
//         success {
//             sh 'echo "✅ SUCCÈS: Pipeline terminé! Accédez à http://localhost"'
//         }
//         failure {
//             sh 'echo "❌ ÉCHEC: Vérifiez les logs ci-dessus"'
//         }
//     }
// }

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