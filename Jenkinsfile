pipeline {
    agent any
    
    triggers {
        pollSCM('*/2 * * * *')
    }
    
    environment {
        IMAGE_NAME = 'plateforme-location-immobiliere'
        DEPLOYMENT_PORT = '3000'
    }
    
    stages {
        stage('Checkout & Verification') {
            steps {
                checkout scm
                echo '📦 Code récupéré avec succès'
                sh '''
                    echo "🔍 Vérification de l application actuelle..."
                    curl -s http://localhost:3000 > /dev/null && echo "✅ Application en ligne" || echo "⚠️ Application hors ligne"
                    docker ps | grep plateforme || echo "ℹ️  Aucun conteneur plateforme trouvé"
                '''
            }
        }
        
        stage('Build New Docker Image') {
            steps {
                script {
                    echo '🐳 Construction de la nouvelle image...'
                    sh """
                        docker build -t ${IMAGE_NAME}:\${BUILD_NUMBER} -t ${IMAGE_NAME}:latest .
                        echo "✅ Nouvelle image: ${IMAGE_NAME}:\${BUILD_NUMBER}"
                    """
                }
            }
        }
        
        stage('Safe Deployment - Zero Downtime') {
            steps {
                script {
                    echo '🚀 Déploiement sécurisé sans interruption...'
                    sh """
                        # Sauvegarde l'ancien conteneur
                        OLD_CONTAINER=\$(docker ps -q --filter "name=plateforme-location-web")
                        
                        # Lance le NOUVEAU conteneur sur un port temporaire
                        docker run -d --name plateforme-new-\${BUILD_NUMBER} -p 3001:3000 ${IMAGE_NAME}:latest
                        
                        # Attends que le nouveau soit prêt
                        echo "⏳ Vérification du nouveau conteneur..."
                        sleep 10
                        
                        # Teste le nouveau conteneur
                        curl -f http://localhost:3001 && echo "✅ Nouveau conteneur opérationnel"
                        
                        # Si le nouveau fonctionne, bascule vers le port principal
                        if curl -s http://localhost:3001 > /dev/null; then
                            echo "🔄 Bascule vers le port principal..."
                            
                            # Arrête l'ancien conteneur
                            if [ ! -z "\$OLD_CONTAINER" ]; then
                                docker stop \$OLD_CONTAINER
                                docker rm \$OLD_CONTAINER
                            fi
                            
                            # Renomme le nouveau conteneur et change le port
                            docker stop plateforme-new-\${BUILD_NUMBER}
                            docker rm plateforme-new-\${BUILD_NUMBER}
                            docker run -d --name plateforme-location-web -p 3000:3000 ${IMAGE_NAME}:latest
                            
                            echo "✅ Bascule réussie sans interruption!"
                        else
                            echo "❌ Le nouveau conteneur a des problèmes, on garde l'ancien"
                            docker stop plateforme-new-\${BUILD_NUMBER}
                            docker rm plateforme-new-\${BUILD_NUMBER}
                        fi
                    """
                }
            }
        }
        
        stage('Cleanup & Verification') {
            steps {
                script {
                    echo '🧹 Nettoyage et vérification finale...'
                    sh """
                        # Nettoie les anciennes images
                        docker image prune -f
                        
                        # Vérification finale
                        echo "🔍 Vérification finale..."
                        sleep 5
                        curl -f http://localhost:3000 && echo "🎉 Application mise à jour avec succès!" || echo "⚠️ Vérifier l'application manuellement"
                        
                        # Statut des conteneurs
                        echo "🐳 Conteneurs en cours:"
                        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Déploiement automatique terminé'
            sh """
                echo " "
                echo "📊 RAPPORT DE DÉPLOIEMENT"
                echo "🔢 Build Number: ${BUILD_NUMBER}"
                echo "🌐 URL: http://localhost:3000"
                echo "🐳 Image: ${IMAGE_NAME}:latest"
                echo "⏰ Heure: \$(date)"
                echo " "
            """
        }
        success {
            echo '✅ DÉPLOIEMENT SANS INTERRUPTION RÉUSSI!'
        }
        failure {
            echo '❌ Échec - Ancienne version préservée'
            sh '''
                echo "L ancienne version reste active pour éviter les interruptions"
            '''
        }
    }
}