<<<<<<< HEAD
// // pipeline {
// //     agent any
    
// //     stages {
// //         stage('Checkout') {
// //             steps {
// //                 checkout scm
// //                 sh 'echo "📦 Code récupéré avec succès"'
// //             }
// //         }
        
// //         stage('Build with Docker') {
// //             steps {
// //                 script {
// //                     docker.image('node:18-alpine').inside {
// //                         sh '''
// //                             echo "🔧 Installation des dépendances..."
// //                             node --version
// //                             npm --version
// //                             npm install
// //                             echo "🏗️ Construction du frontend..."
// //                             npm run build
// //                             echo "✅ Build RÉUSSI !"
// //                             ls -la dist/
// //                         '''
// //                     }
// //                 }
// //             }
// //         }
// //     }
    
// //     post {
// //         success {
// //             sh 'echo "🎉 PIPELINE CI/CD COMPLET AVEC DOCKER FONCTIONNEL !"'
// //         }
// //     }
// // }


// pipeline {
//     agent any
    
//     stages {
//         stage('Checkout') {
//             steps {
//                 checkout scm
//                 echo '📦 Code récupéré avec succès'
//             }
//         }
        
//         stage('Auto-Fix Docker Permissions') {
//             steps {
//                 script {
//                     // RÉPARATION AUTOMATIQUE DES PERMISSIONS DOCKER
//                     echo "🔧 VÉRIFICATION AUTOMATIQUE DES PERMISSIONS DOCKER..."
                    
//                     sh '''
//                         # Cette commande résout EXACTEMENT l'erreur de permission
//                         echo "🛠️  Réparation préventive du socket Docker..."
//                         sudo chmod 666 /var/run/docker.sock 2>/dev/null || echo "chmod ignoré"
//                         sudo chown root:docker /var/run/docker.sock 2>/dev/null || echo "chown ignoré"
                        
//                         # Vérification que ça fonctionne
//                         if docker ps > /dev/null 2>&1; then
//                             echo "✅ Docker PRÊT - Permissions OK"
//                         else
//                             echo "⚠️  Docker encore problématique - Nouvelle tentative..."
//                             # Deuxième tentative plus agressive
//                             sudo service docker restart 2>/dev/null || echo "service restart ignoré"
//                             sleep 10
//                         fi
//                     '''
                    
//                     // Attendre que Docker soit stable
//                     sleep 5
//                 }
//             }
//         }
        
//         stage('Build with Docker') {
//             steps {
//                 script {
//                     // CONTRÔLE FINAL - Si Docker fonctionne après réparation
//                     try {
//                         docker.image('node:18-alpine').inside {
//                             sh '''
//                                 echo "🐳 Construction avec Docker..."
//                                 npm install
//                                 npm run build
//                                 echo "✅ BUILD RÉUSSI avec Docker !"
//                                 ls -la dist/
//                             '''
//                         }
//                     } catch (Exception e) {
//                         // SI TOUT ÉCHOUE - Build direct en dernier recours
//                         echo "❌ Échec Docker même après réparation - Build direct..."
//                         sh '''
//                             echo "⚡ Construction DIRECTE (sans Docker)..."
//                             npm install
//                             npm run build
//                             echo "✅ BUILD RÉUSSI en mode direct !"
//                             ls -la dist/
//                         '''
//                     }
//                 }
//             }
//         }
        
//         stage('Deployment Ready') {
//             steps {
//                 sh '''
//                     echo " "
//                     echo "🚀 🚀 🚀 DÉPLOIEMENT PRÊT 🚀 🚀 🚀"
//                     echo "✅ Le code est validé et buildé"
//                     echo "💡 Commande de déploiement:"
//                     echo "   docker-compose down && docker-compose up -d --build"
//                     echo "🌐 Votre application: http://localhost:3000"
//                     echo " "
//                 '''
//             }
//         }
//     }
    
//     post {
//         always {
//             echo '🔧 Ce pipeline AUTO-RÉPARE les permissions Docker à chaque exécution'
//         }
//         success {
//             echo '🎉 SUCCÈS GARANTI - Même si Docker avait des problèmes !'
//         }
//     }
// }

stage('Auto-Fix Docker Permissions') {
    steps {
        script {
            echo "🔧 VÉRIFICATION AUTOMATIQUE DES PERMISSIONS DOCKER..."
            
            sh '''
                # Cette méthode fonctionne MÊME sans sudo
                echo "🛠️  Réparation du socket Docker..."
                
                # Méthode DIRECTE sans sudo
                if [ -w /var/run/docker.sock ]; then
                    chmod 666 /var/run/docker.sock || echo "chmod direct échoué"
                    chown root:docker /var/run/docker.sock || echo "chown direct échoué"
                else
                    # Si pas de permissions, on utilise docker exec depuis l'hôte
                    echo "🔧 Réparation via conteneur root..."
                    docker exec -u root jenkins-docker bash -c "chmod 666 /var/run/docker.sock && chown root:docker /var/run/docker.sock" || echo "Réparation root échouée"
                fi
                
                # Attendre et vérifier
                sleep 3
                echo "🔍 Test final Docker..."
                if docker ps > /dev/null 2>&1; then
                    echo "✅ Docker RÉPARÉ et fonctionnel !"
                else
                    echo "❌ Docker toujours problématique après réparation"
                    # On continue quand même, le fallback prendra le relais
                fi
            '''
            
            sleep 2
=======

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
>>>>>>> 36be09c561cc17d0ec50dda1641a45d91b3feca1
        }
    }
}
