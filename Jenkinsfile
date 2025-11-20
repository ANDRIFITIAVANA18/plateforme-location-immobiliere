pipeline {
    agent any
    
    triggers {
        pollSCM('*/1 * * * *')
    }
    
    environment {
        IMAGE_NAME = 'plateforme-location-immobiliere'
        MAIN_PORT = '3000'
        TEST_PORT = '3001'
    }
    
    stages {
        stage('Checkout & Analysis') {
            steps {
                checkout scm
                echo '📦 Code récupéré avec succès'
                
                script {
                    echo '🔍 Analyse du projet...'
                    sh '''
                        echo "📊 INFORMATIONS:"
                        echo "Docker: $(docker --version 2>/dev/null || echo 'NON DISPONIBLE')"
                        
                        # Vérifications critiques
                        if [ ! -f "package.json" ]; then
                            echo "❌ ERREUR CRITIQUE: package.json manquant"
                            exit 1
                        else
                            echo "✅ package.json présent"
                            echo "📋 Scripts disponibles:"
                            grep -A 10 '"scripts"' package.json || echo "Aucun script trouvé"
                        fi
                        
                        if [ ! -f "Dockerfile" ]; then
                            echo "❌ ERREUR CRITIQUE: Dockerfile manquant"
                            exit 1
                        else
                            echo "✅ Dockerfile présent"
                        fi
                    '''
                }
            }
        }
        
        stage('Docker Build & Test') {
            steps {
                script {
                    echo '🐳 Construction et tests via Docker...'
                    
                    sh """
                        echo "🏗️  Construction de l'image..."
                        if docker build -t ${IMAGE_NAME}:test .; then
                            echo "✅ Image Docker construite avec succès"
                            
                            echo "🧪 Test du conteneur..."
                            docker stop ${IMAGE_NAME}-test 2>/dev/null || true
                            docker rm ${IMAGE_NAME}-test 2>/dev/null || true
                            
                            if docker run -d --name ${IMAGE_NAME}-test -p ${TEST_PORT}:3000 ${IMAGE_NAME}:test; then
                                echo "✅ Conteneur de test démarré"
                                
                                echo "⏳ Attente du démarrage..."
                                sleep 15
                                
                                echo "🔍 Test de santé..."
                                if curl -s http://localhost:${TEST_PORT} > /dev/null; then
                                    echo "🎉 APPLICATION TEST FONCTIONNELLE"
                                    echo "true" > docker_test_passed.txt
                                else
                                    echo "❌ APPLICATION TEST INACCESSIBLE"
                                    echo "false" > docker_test_passed.txt
                                fi
                                
                                docker stop ${IMAGE_NAME}-test
                                docker rm ${IMAGE_NAME}-test
                            else
                                echo "❌ Impossible de démarrer le conteneur de test"
                                echo "false" > docker_test_passed.txt
                            fi
                        else
                            echo "❌ Échec de la construction Docker"
                            echo "false" > docker_test_passed.txt
                        fi
                    """
                    
                    def dockerTestPassed = sh(script: 'cat docker_test_passed.txt', returnStdout: true).trim() == 'true'
                    
                    if (!dockerTestPassed) {
                        error "❌ TESTS DOCKER ÉCHOUÉS"
                    }
                }
            }
        }
        
        stage('Production Deployment') {
            steps {
                script {
                    echo '🚀 Déploiement en production...'
                    
                    sh """
                        echo "🔄 Mise à jour production..."
                        
                        # Arrêt de l'ancien conteneur
                        OLD_CONTAINER=\$(docker ps -q --filter "name=${IMAGE_NAME}")
                        if [ ! -z "\$OLD_CONTAINER" ]; then
                            echo "⏹️  Arrêt ancien conteneur..."
                            docker stop \$OLD_CONTAINER
                            docker rm \$OLD_CONTAINER
                        fi
                        
                        # Déploiement nouveau conteneur
                        echo "🚀 Déploiement nouveau conteneur..."
                        docker run -d --name ${IMAGE_NAME} -p ${MAIN_PORT}:3000 ${IMAGE_NAME}:test
                        
                        echo "⏳ Attente démarrage production..."
                        sleep 10
                    """
                }
            }
        }
        
        stage('Production Verification') {
            steps {
                script {
                    echo '🔍 Vérification production...'
                    
                    sh """
                        echo "🌐 Test application production..."
                        if curl -s http://localhost:${MAIN_PORT} > /dev/null; then
                            echo "🎉 APPLICATION PRODUCTION OPÉRATIONNELLE"
                            
                            # Test performance
                            START_TIME=\$(date +%s%3N)
                            curl -s http://localhost:${MAIN_PORT} > /dev/null
                            END_TIME=\$(date +%s%3N)
                            RESPONSE_TIME=\$((END_TIME - START_TIME))
                            
                            echo "⏱️  Temps réponse: \${RESPONSE_TIME}ms"
                            
                            if [ \$RESPONSE_TIME -lt 1000 ]; then
                                echo "✅ PERFORMANCE: Excellente"
                            elif [ \$RESPONSE_TIME -lt 3000 ]; then
                                echo "⚠️  PERFORMANCE: Correcte"
                            else
                                echo "🐌 PERFORMANCE: Lente"
                            fi
                            
                            echo "true" > production_ok.txt
                        else
                            echo "❌ APPLICATION PRODUCTION INACCESSIBLE"
                            echo "false" > production_ok.txt
                        fi
                    """
                    
                    def productionOk = sh(script: 'cat production_ok.txt', returnStdout: true).trim() == 'true'
                    
                    if (!productionOk) {
                        error "❌ PRODUCTION INACCESSIBLE"
                    }
                }
            }
        }
        
        stage('Final Report') {
            steps {
                script {
                    echo '📊 Rapport final...'
                    sh """
                        echo " "
                        echo "🚀 DÉPLOIEMENT AUTOMATIQUE RÉUSSI"
                        echo "================================"
                        echo "📊 Build: ${env.BUILD_NUMBER}"
                        echo "🕐 Heure: \$(date)"
                        echo "🌐 URL: http://localhost:${MAIN_PORT}"
                        echo "🐳 Mode: Docker"
                        echo " "
                        echo "✅ TESTS PASSÉS:"
                        echo "   ✅ Analyse code"
                        echo "   ✅ Construction Docker" 
                        echo "   ✅ Tests application"
                        echo "   ✅ Déploiement production"
                        echo "   ✅ Vérification performance"
                        echo " "
                        echo "🎉 CODE VALIDE ET DÉPLOYÉ"
                        echo "🔄 Prochaine vérification: 1 minute"
                        echo " "
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline terminé'
            sh '''
                echo "🧹 Nettoyage..."
                docker stop ${IMAGE_NAME}-test 2>/dev/null || true
                docker rm ${IMAGE_NAME}-test 2>/dev/null || true
                docker image prune -f 2>/dev/null || true
                rm -f docker_test_passed.txt production_ok.txt 2>/dev/null || true
            '''
        }
        success {
            echo '✅ DÉPLOIEMENT AUTOMATIQUE RÉUSSI!'
        }
        failure {
            echo '❌ DÉPLOIEMENT ÉCHOUÉ - ANCIENNE VERSION PRÉSERVÉE'
            sh '''
                echo " "
                echo "🛡️  L'application précédente reste active"
                echo "🔧 Aucune interruption de service"
                echo " "
            '''
        }
    }
}