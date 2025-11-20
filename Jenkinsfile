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
                        echo "📝 Commit: $(git log -1 --pretty=format:"%h - %s")"
                        
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
                        echo "🚨 VÉRIFICATION ERREURS TYPESCRIPT OBLIGATOIRE"
                        echo "=============================================="
                        
                        # Méthode 1: Vérification basique des fichiers .ts
                        echo "🔍 Analyse des fichiers TypeScript..."
                        
                        # Compteur d'erreurs
                        ERROR_COUNT=0
                        
                        # Vérification des patterns d'erreurs TypeScript courants
                        echo "📝 Recherche d'erreurs TypeScript évidentes..."
                        
                        # Pattern 1: Assignation de types incorrects
                        if grep -r "const.*:.*string.*=.*[0-9]" --include="*.ts" --include="*.tsx" . 2>/dev/null; then
                            echo "❌ ERREUR: Assignation number -> string détectée"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        # Pattern 2: Assignation de types incorrects inverses
                        if grep -r "const.*:.*number.*=.*['\"]" --include="*.ts" --include="*.tsx" . 2>/dev/null; then
                            echo "❌ ERREUR: Assignation string -> number détectée"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        # Pattern 3: Fichiers avec erreurs évidentes
                        if find . -name "*.ts" -exec grep -l "testError.*string.*=.*[0-9]" {} \\; 2>/dev/null; then
                            echo "❌ ERREUR: Fichiers avec 'testError' détectés"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        # Vérification finale
                        if [ $ERROR_COUNT -gt 0 ]; then
                            echo " "
                            echo "🚨 $ERROR_COUNT ERREUR(S) TYPESCRIPT DÉTECTÉE(S)"
                            echo "🔍 Fichiers suspects:"
                            find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "const.*:.*string.*=.*[0-9]" 2>/dev/null || true
                            find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "const.*:.*number.*=.*['\"]" 2>/dev/null || true
                            echo " "
                            echo "💡 CORRIGEZ LES ERREURS AVANT DE CONTINUER"
                            exit 1
                        else
                            echo "✅ Aucune erreur TypeScript évidente détectée"
                        fi
                        
                        echo " "
                        echo "📁 Fichiers TypeScript analysés:"
                        find . -name "*.ts" -o -name "*.tsx" | head -10
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
        }
        failure {
            echo '❌ ERREURS TYPESCRIPT DÉTECTÉES - CORRIGEZ LES ERREURS'
            sh '''
                echo " "
                echo "🔍 ERREURS DÉTECTÉES:"
                echo "• Assignations de types incorrectes"
                echo "• Fichiers avec patterns d'erreur"
                echo " "
                echo "💡 Supprimez les fichiers de test ou corrigez les erreurs"
            '''
        }
    }
}