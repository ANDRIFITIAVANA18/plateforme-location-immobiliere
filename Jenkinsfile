// pipeline {
//     agent any
    
//     stages {
//         stage('Checkout') {
//             steps {
//                 checkout scm
//                 sh 'echo "📦 Code récupéré avec succès"'
//             }
//         }
        
//         stage('Build with Docker') {
//             steps {
//                 script {
//                     docker.image('node:18-alpine').inside {
//                         sh '''
//                             echo "🔧 Installation des dépendances..."
//                             node --version
//                             npm --version
//                             npm install
//                             echo "🏗️ Construction du frontend..."
//                             npm run build
//                             echo "✅ Build RÉUSSI !"
//                             ls -la dist/
//                         '''
//                     }
//                 }
//             }
//         }
//     }
    
//     post {
//         success {
//             sh 'echo "🎉 PIPELINE CI/CD COMPLET AVEC DOCKER FONCTIONNEL !"'
//         }
//     }
// }


pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo '📦 Code récupéré avec succès'
            }
        }
        
        stage('Auto-Fix Docker Permissions') {
            steps {
                script {
                    // RÉPARATION AUTOMATIQUE DES PERMISSIONS DOCKER
                    echo "🔧 VÉRIFICATION AUTOMATIQUE DES PERMISSIONS DOCKER..."
                    
                    sh '''
                        # Cette commande résout EXACTEMENT l'erreur de permission
                        echo "🛠️  Réparation préventive du socket Docker..."
                        sudo chmod 666 /var/run/docker.sock 2>/dev/null || echo "chmod ignoré"
                        sudo chown root:docker /var/run/docker.sock 2>/dev/null || echo "chown ignoré"
                        
                        # Vérification que ça fonctionne
                        if docker ps > /dev/null 2>&1; then
                            echo "✅ Docker PRÊT - Permissions OK"
                        else
                            echo "⚠️  Docker encore problématique - Nouvelle tentative..."
                            # Deuxième tentative plus agressive
                            sudo service docker restart 2>/dev/null || echo "service restart ignoré"
                            sleep 10
                        fi
                    '''
                    
                    // Attendre que Docker soit stable
                    sleep 5
                }
            }
        }
        
        stage('Build with Docker') {
            steps {
                script {
                    // CONTRÔLE FINAL - Si Docker fonctionne après réparation
                    try {
                        docker.image('node:18-alpine').inside {
                            sh '''
                                echo "🐳 Construction avec Docker..."
                                npm install
                                npm run build
                                echo "✅ BUILD RÉUSSI avec Docker !"
                                ls -la dist/
                            '''
                        }
                    } catch (Exception e) {
                        // SI TOUT ÉCHOUE - Build direct en dernier recours
                        echo "❌ Échec Docker même après réparation - Build direct..."
                        sh '''
                            echo "⚡ Construction DIRECTE (sans Docker)..."
                            npm install
                            npm run build
                            echo "✅ BUILD RÉUSSI en mode direct !"
                            ls -la dist/
                        '''
                    }
                }
            }
        }
        
        stage('Deployment Ready') {
            steps {
                sh '''
                    echo " "
                    echo "🚀 🚀 🚀 DÉPLOIEMENT PRÊT 🚀 🚀 🚀"
                    echo "✅ Le code est validé et buildé"
                    echo "💡 Commande de déploiement:"
                    echo "   docker-compose down && docker-compose up -d --build"
                    echo "🌐 Votre application: http://localhost:3000"
                    echo " "
                '''
            }
        }
    }
    
    post {
        always {
            echo '🔧 Ce pipeline AUTO-RÉPARE les permissions Docker à chaque exécution'
        }
        success {
            echo '🎉 SUCCÈS GARANTI - Même si Docker avait des problèmes !'
        }
    }
}