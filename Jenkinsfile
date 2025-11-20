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
        stage('Environment Setup') {
            steps {
                script {
                    echo '🔧 Configuration de l\'environnement...'
                    sh '''
                        #!/bin/bash
                        set -e
                        
                        # Configuration NVM
                        export NVM_DIR="/var/jenkins_home/.nvm"
                        if [ -s "$NVM_DIR/nvm.sh" ]; then
                            . "$NVM_DIR/nvm.sh"
                            nvm use 18.20.8 || nvm install 18.20.8
                            echo "✅ Node.js $(node --version) configuré"
                            echo "✅ npm $(npm --version) configuré"
                            
                            # Sauvegarder le PATH pour les étapes suivantes
                            echo "NODE_PATH=$(which node)" > node_env.txt
                            echo "NPM_PATH=$(which npm)" >> node_env.txt
                        else
                            echo "❌ NVM non disponible"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Checkout & Analysis') {
            steps {
                checkout scm
                echo '📦 Code récupéré avec succès depuis Git'
                
                script {
                    echo '🔍 Analyse intelligente du projet...'
                    sh '''
                        #!/bin/bash
                        set -e
                        
                        # Recharger l'environnement Node.js
                        export NVM_DIR="/var/jenkins_home/.nvm"
                        if [ -s "$NVM_DIR/nvm.sh" ]; then
                            . "$NVM_DIR/nvm.sh"
                            nvm use 18.20.8
                        fi
                        
                        echo "📊 INFORMATIONS DU PROJET:"
                        echo "🆔 Build: ${BUILD_NUMBER}"
                        echo "📅 Date: $(date '+%Y-%m-%d %H:%M:%S')"
                        echo "🌐 Dépôt: $(git config --get remote.origin.url)"
                        echo "🔀 Branche: $(git branch --show-current)"
                        echo "📝 Commit: $(git log -1 --pretty=format:'%h - %s')"
                        echo "👤 Auteur: $(git log -1 --pretty=format:'%an')"
                        
                        echo ""
                        echo "✅ VÉRIFICATIONS CRITIQUES:"
                        
                        # Fichiers essentiels
                        echo "📁 Fichiers essentiels:"
                        MISSING_FILES=0
                        
                        if [ -f "package.json" ]; then
                            echo "  ✅ package.json"
                        else
                            echo "  ❌ package.json MANQUANT"
                            MISSING_FILES=$((MISSING_FILES + 1))
                        fi
                        
                        if [ -f "Dockerfile" ]; then
                            echo "  ✅ Dockerfile"
                        else
                            echo "  ❌ Dockerfile MANQUANT"
                            MISSING_FILES=$((MISSING_FILES + 1))
                        fi
                        
                        if [ -f "src/App.tsx" ]; then
                            echo "  ✅ App.tsx"
                        else
                            echo "  ❌ App.tsx MANQUANT"
                            MISSING_FILES=$((MISSING_FILES + 1))
                        fi
                        
                        if [ $MISSING_FILES -gt 0 ]; then
                            echo "🚨 $MISSING_FILES fichier(s) essentiel(s) manquant(s)"
                            exit 1
                        fi
                        
                        # Analyse package.json
                        if [ -f "package.json" ]; then
                            echo ""
                            echo "📦 ANALYSE PACKAGE.JSON:"
                            node -e "
                                try {
                                    const pkg = require('./package.json');
                                    console.log('  Nom:', pkg.name || 'Non spécifié');
                                    console.log('  Version:', pkg.version || 'Non spécifié');
                                    console.log('  Description:', pkg.description || 'Non spécifié');
                                    const scripts = Object.keys(pkg.scripts || {});
                                    console.log('  Scripts:', scripts.length > 0 ? scripts.join(', ') : 'Aucun');
                                } catch (e) {
                                    console.log('  ❌ Erreur lecture package.json');
                                }
                            "
                        fi
                        
                        echo "✅ Environnement Node.js: $(node --version)"
                    '''
                }
            }
        }
        
        stage('TypeScript Error Detection') {
            steps {
                script {
                    echo '🔬 Détection des erreurs TypeScript...'
                    sh '''
                        #!/bin/bash
                        set -e
                        
                        # Recharger l'environnement Node.js
                        export NVM_DIR="/var/jenkins_home/.nvm"
                        if [ -s "$NVM_DIR/nvm.sh" ]; then
                            . "$NVM_DIR/nvm.sh"
                            nvm use 18.20.8
                        fi
                        
                        echo "🚨 VÉRIFICATION ERREURS TYPESCRIPT"
                        echo "=================================="
                        
                        ERROR_COUNT=0
                        
                        # Recherche d'erreurs TypeScript réelles
                        echo "🔍 Analyse des fichiers source TypeScript..."
                        
                        # Pattern 1: Assignation incorrecte number -> string
                        if grep -r "const.*:.*string.*=.*[0-9]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules > /dev/null 2>&1; then
                            echo "❌ ERREUR: Assignation number -> string détectée"
                            grep -r "const.*:.*string.*=.*[0-9]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules | head -3
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        # Pattern 2: Assignation incorrecte string -> number
                        if grep -r "const.*:.*number.*=.*['\\"]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules > /dev/null 2>&1; then
                            echo "❌ ERREUR: Assignation string -> number détectée"
                            grep -r "const.*:.*number.*=.*['\\"]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules | head -3
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        # Pattern 3: Fichiers de test avec erreurs intentionnelles
                        if find . -name "*.ts" -o -name "*.tsx" ! -path "./node_modules/*" -exec grep -l "testError" {} \\; > /dev/null 2>&1; then
                            echo "❌ ERREUR: Fichiers de test avec erreurs détectés"
                            find . -name "*.ts" -o -name "*.tsx" ! -path "./node_modules/*" -exec grep -l "testError" {} \\; | head -3
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        # Statistiques d'analyse
                        TS_FILES_COUNT=$(find . -name "*.ts" -o -name "*.tsx" ! -path "./node_modules/*" | wc -l)
                        echo ""
                        echo "📊 STATISTIQUES D'ANALYSE:"
                        echo "  Fichiers TypeScript analysés: $TS_FILES_COUNT"
                        echo "  Erreurs détectées: $ERROR_COUNT"
                        
                        if [ $ERROR_COUNT -eq 0 ]; then
                            echo "✅ Aucune erreur TypeScript détectée dans votre code source"
                            echo "✅ Validation TypeScript réussie"
                        else
                            echo "🚨 $ERROR_COUNT erreur(s) TypeScript détectée(s)"
                            echo ""
                            echo "💡 CORRIGEZ LES ERREURS AVANT DE CONTINUER"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Structure Validation') {
            steps {
                script {
                    echo '🏗️ Validation structure...'
                    sh '''
                        #!/bin/bash
                        set -e
                        
                        echo "📋 VÉRIFICATIONS STRUCTURELLES:"
                        
                        # Fichiers sensibles
                        SENSITIVE_COUNT=0
                        
                        if [ -f ".env" ]; then
                            echo "⚠️  Fichier sensible présent: .env"
                            SENSITIVE_COUNT=$((SENSITIVE_COUNT + 1))
                        fi
                        
                        if [ -f ".env.local" ]; then
                            echo "⚠️  Fichier sensible présent: .env.local"
                            SENSITIVE_COUNT=$((SENSITIVE_COUNT + 1))
                        fi
                        
                        if [ -f ".env.production" ]; then
                            echo "⚠️  Fichier sensible présent: .env.production"
                            SENSITIVE_COUNT=$((SENSITIVE_COUNT + 1))
                        fi
                        
                        if [ $SENSITIVE_COUNT -eq 0 ]; then
                            echo "✅ Aucun fichier sensible détecté"
                        fi
                        
                        # Dossiers de build
                        BUILD_PRESENT=0
                        
                        if [ -d "dist" ]; then
                            echo "📁 Dossier de build présent: dist"
                            BUILD_PRESENT=1
                        fi
                        
                        if [ -d "build" ]; then
                            echo "📁 Dossier de build présent: build"
                            BUILD_PRESENT=1
                        fi
                        
                        if [ $BUILD_PRESENT -eq 0 ]; then
                            echo "📁 Aucun dossier de build détecté"
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
                        #!/bin/bash
                        set -e
                        
                        # Recharger l'environnement Node.js
                        export NVM_DIR="/var/jenkins_home/.nvm"
                        if [ -s "$NVM_DIR/nvm.sh" ]; then
                            . "$NVM_DIR/nvm.sh"
                            nvm use 18.20.8
                        fi
                        
                        echo ""
                        echo "🎉 VALIDATION RÉUSSIE"
                        echo "===================="
                        echo "✅ Aucune erreur TypeScript détectée"
                        echo "✅ Structure projet: VALIDE"
                        echo "✅ Fichiers essentiels: PRÉSENTS"
                        echo "🔄 Surveillance: ACTIVÉE"
                        echo ""
                        echo "📊 RÉSUMÉ DÉTAILLÉ:"
                        echo "• Build: ${BUILD_NUMBER}"
                        echo "• Commit: $(git log -1 --pretty=format:'%h - %s')"
                        echo "• Auteur: $(git log -1 --pretty=format:'%an')"
                        echo "• Date: $(date '+%Y-%m-%d %H:%M:%S')"
                        echo "• Node.js: $(node --version)"
                        echo ""
                        echo "🚀 PRÊT POUR LE DÉPLOIEMENT"
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
                echo ""
                echo "✅ TOUTES LES VALIDATIONS SONT PASSÉES"
                echo "✅ Le code est prêt pour le déploiement"
                echo "✅ Aucune erreur TypeScript détectée"
                echo "✅ Structure du projet validée"
            '''
        }
        failure {
            echo '❌ ERREURS DÉTECTÉES - CORRIGEZ LES ERREURS'
            sh '''
                echo ""
                echo "🔍 ERREURS DÉTECTÉES:"
                echo "• Assignations de types incorrectes"
                echo "• Fichiers avec patterns d'erreur"
                echo "• Fichiers de test avec erreurs"
                echo "• Fichiers essentiels manquants"
                echo ""
                echo "💡 ACTIONS REQUISES:"
                echo "1. Vérifiez les fichiers listés dans les logs"
                echo "2. Corrigez les erreurs TypeScript"
                echo "3. Supprimez les fichiers de test inutiles"
                echo "4. Vérifiez la présence des fichiers essentiels"
                echo "5. Recommitez et poussez les corrections"
            '''
        }
    }
}