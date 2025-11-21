pipeline {
    agent any
    
    environment {
        NODE_ENV = 'test'
        CI = 'true'
    }
    
    stages {
        stage('Vérification Docker') {
            steps {
                script {
                    echo '🐳 Vérification de Docker Desktop...'
                    bat '''
                        echo Vérification de l environnement Docker...
                        docker --version
                        echo Si Docker Desktop n est pas démarré, ceci échouera.
                    '''
                }
            }
        }
        
        stage('Setup Environment') {
            steps {
                checkout scm
                script {
                    echo '🚀 Configuration de l environnement...'
                    bat '''
                        echo ==========================================
                        echo 🔧 ENVIRONNEMENT WINDOWS/JENKINS
                        echo ==========================================
                        node --version
                        npm --version
                        echo Répertoire: %CD%
                        echo ==========================================
                    '''
                }
            }
        }
        
        stage('Installation Dépendances') {
            steps {
                script {
                    echo '📦 Installation des dépendances npm...'
                    bat '''
                        npm install
                        if %ERRORLEVEL% neq 0 exit /b 1
                        echo ✅ Dépendances installées avec succès
                    '''
                }
            }
        }
        
        stage('Validation TypeScript') {
            steps {
                script {
                    echo '🔬 Validation TypeScript...'
                    bat '''
                        npx tsc --noEmit --skipLibCheck
                        if %ERRORLEVEL% equ 0 (
                            echo ✅ Aucune erreur TypeScript
                        ) else (
                            echo ❌ Erreurs TypeScript détectées
                            exit /b 1
                        )
                    '''
                }
            }
        }
        
        stage('Tests Unitaires') {
            steps {
                script {
                    echo '🧪 Exécution des tests...'
                    bat '''
                        npm test -- --watchAll=false --passWithNoTests
                        if %ERRORLEVEL% equ 0 (
                            echo ✅ Tests passés avec succès
                        ) else (
                            echo ❌ Tests échoués
                            exit /b 1
                        )
                    '''
                }
            }
        }
        
        stage('Build Production') {
            steps {
                script {
                    echo '🏗️ Construction de l application...'
                    bat '''
                        npm run build
                        if %ERRORLEVEL% equ 0 (
                            echo ✅ Build réussi
                            if exist build\\index.html (
                                echo ✅ Fichiers de build générés
                            ) else (
                                echo ❌ Fichiers de build manquants
                                exit /b 1
                            )
                        ) else (
                            echo ❌ Échec du build
                            exit /b 1
                        )
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline terminé'
        }
        success {
            echo '🎉 SUCCÈS - Application prête pour la production'
            bat '''
                echo.
                echo ✅ VALIDATION COMPLÈTE
                echo 📊 Résumé:
                echo • Build: %BUILD_NUMBER%
                echo • Date: %DATE%
                echo • Statut: PRÊT
                echo.
            '''
        }
        failure {
            echo '❌ ÉCHEC - Correction nécessaire'
            bat '''
                echo.
                echo 🔧 Actions requises:
                echo 1. Vérifier les erreurs ci-dessus
                echo 2. Tester localement: npm run build
                echo 3. Corriger les problèmes
                echo 4. Relancer le pipeline
                echo.
            '''
        }
    }
}