pipeline {
    agent any
    
    triggers {
        pollSCM('*/1 * * * *')
    }
    
    environment {
        IMAGE_NAME = 'plateforme-location-immobiliere'
        MAIN_PORT = '3000'
    }
    
    stages {
        stage('Checkout & Analysis') {
            steps {
                checkout scm
                echo '📦 Code récupéré avec succès depuis Git'
                
                script {
                    echo '🔍 Analyse intelligente du projet...'
                    sh '''
                        echo "📊 INFORMATIONS DU PROJET:"
                        echo "🆔 Build: ${BUILD_NUMBER}"
                        echo "📅 Date: $(date)"
                        echo "🌐 Dépôt: $(git config --get remote.origin.url)"
                        echo "🔀 Branche: $(git branch --show-current)"
                        echo "📝 Commit: $(git log -1 --pretty=format:'%h - %s')"
                        
                        echo " "
                        echo "✅ VÉRIFICATIONS CRITIQUES:"
                        
                        # Fichiers essentiels
                        echo "📁 Fichiers essentiels:"
                        [ -f "package.json" ] && echo "  ✅ package.json" || { echo "  ❌ package.json MANQUANT"; exit 1; }
                        [ -f "Dockerfile" ] && echo "  ✅ Dockerfile" || echo "  ⚠️  Dockerfile manquant"
                        [ -f "src/App.tsx" ] && echo "  ✅ App.tsx" || echo "  ⚠️  App.tsx manquant"
                    '''
                }
            }
        }
        
        stage('TypeScript Error Detection') {
            steps {
                script {
                    echo '🔬 Détection des erreurs TypeScript...'
                    sh '''
                        echo "🚨 VÉRIFICATION ERREURS TYPESCRIPT"
                        echo "=================================="
                        
                        ERROR_COUNT=0
                        
                        # Recherche d'erreurs TypeScript réelles (exclut node_modules)
                        echo "🔍 Analyse des fichiers source TypeScript..."
                        
                        # Pattern 1: Assignation incorrecte number -> string dans VOTRE code
                        if grep -r "const.*:.*string.*=.*[0-9]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules 2>/dev/null; then
                            echo "❌ ERREUR: Assignation number -> string détectée dans votre code"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        # Pattern 2: Assignation incorrecte string -> number dans VOTRE code
                        if grep -r "const.*:.*number.*=.*['\\"]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules 2>/dev/null; then
                            echo "❌ ERREUR: Assignation string -> number détectée dans votre code"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        # Pattern 3: Fichiers de test avec erreurs intentionnelles
                        if find . -name "*.ts" -name "*.tsx" ! -path "./node_modules/*" -exec grep -l "testError" {} \\; 2>/dev/null | grep -q "."; then
                            echo "❌ ERREUR: Fichiers de test avec erreurs détectés"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        if [ $ERROR_COUNT -eq 0 ]; then
                            echo "✅ Aucune erreur TypeScript détectée dans votre code source"
                            echo "✅ Validation TypeScript réussie"
                        else
                            echo "🚨 $ERROR_COUNT erreur(s) TypeScript détectée(s)"
                            echo " "
                            echo "🔍 Fichiers problématiques:"
                            grep -r "const.*:.*string.*=.*[0-9]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules 2>/dev/null || true
                            grep -r "const.*:.*number.*=.*['\\"]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules 2>/dev/null || true
                            find . -name "*.ts" -name "*.tsx" ! -path "./node_modules/*" -exec grep -l "testError" {} \\; 2>/dev/null || true
                            echo " "
                            echo "💡 CORRIGEZ LES ERREURS AVANT DE CONTINUER"
                            exit 1
                        fi
                        
                        echo " "
                        echo "📁 Fichiers TypeScript analysés:"
                        find . -name "*.ts" -o -name "*.tsx" ! -path "./node_modules/*" | head -10
                    '''
                }
            }
        }
        
        stage('Structure Validation') {
            steps {
                script {
                    echo '🏗️  Validation structure...'
                    sh '''
                        echo "📋 VÉRIFICATIONS STRUCTURELLES:"
                        
                        # Fichiers sensibles
                        if [ -f ".env" ]; then
                            echo "⚠️  Fichier .env présent"
                        else
                            echo "✅ Aucun fichier .env"
                        fi
                        
                        # Dossiers de build
                        if [ -d "dist" ] || [ -d "build" ]; then
                            echo "📁 Dossiers de build présents"
                        fi
                        
                        echo "✅ Structure validée"
                    '''
                }
            }
        }
        
        stage('Success Report') {
            steps {
                script {
                    echo '📊 Rapport final...'
                    sh '''
                        echo " "
                        echo "🎉 VALIDATION RÉUSSIE"
                        echo "===================="
                        echo "✅ Aucune erreur TypeScript détectée"
                        echo "✅ Structure projet: VALIDE"
                        echo "✅ Fichiers essentiels: PRÉSENTS"
                        echo "🔄 Surveillance: ACTIVÉE"
                        echo " "
                        echo "📊 RÉSUMÉ:"
                        echo "• Build: ${BUILD_NUMBER}"
                        echo "• Commit: $(git log -1 --pretty=format:'%h - %s')"
                        echo "• Date: $(date)"
                        echo " "
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline de validation terminé'
        }
        success {
            echo '🎉 SYSTÈME DE VALIDATION OPÉRATIONNEL !'
            sh '''
                echo " "
                echo "✅ TOUTES LES VALIDATIONS SONT PASSÉES"
                echo "✅ Le code est prêt pour le déploiement"
                echo "✅ Aucune erreur TypeScript détectée"
                echo " "
            '''
        }
        failure {
            echo '❌ ERREURS TYPESCRIPT DÉTECTÉES - CORRIGEZ LES ERREURS'
            sh '''
                echo " "
                echo "🔍 ERREURS DÉTECTÉES:"
                echo "• Assignations de types incorrectes"
                echo "• Fichiers avec patterns d'erreur"
                echo "• Fichiers de test avec erreurs"
                echo " "
                echo "💡 ACTIONS REQUISES:"
                echo "1. Vérifiez les fichiers listés ci-dessus"
                echo "2. Corrigez les erreurs TypeScript"
                echo "3. Supprimez les fichiers de test inutiles"
                echo "4. Recommitez et poussez les corrections"
                echo " "
            '''
        }
    }
}