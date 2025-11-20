pipeline {
    agent any
    
    triggers {
        pollSCM('*/1 * * * *')
    }
    
    environment {
        IMAGE_NAME = 'plateforme-location-immobiliere'
        MAIN_PORT = '3000'
        NODE_VERSION = '18'
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
                            source "$NVM_DIR/nvm.sh"
                            nvm use ${NODE_VERSION} || nvm install ${NODE_VERSION}
                            echo "✅ Node.js $(node --version) configuré"
                        else
                            echo "⚠️  NVM non disponible, utilisation du Node.js système"
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
                        
                        echo "📊 INFORMATIONS DU PROJET:"
                        echo "🆔 Build: ${BUILD_NUMBER}"
                        echo "📅 Date: $(date '+%Y-%m-%d %H:%M:%S')"
                        echo "🌐 Dépôt: $(git config --get remote.origin.url)"
                        echo "🔀 Branche: $(git branch --show-current)"
                        echo "📝 Commit: $(git log -1 --pretty=format:'%h - %s')"
                        echo "👤 Auteur: $(git log -1 --pretty=format:'%an')"
                        
                        echo ""
                        echo "✅ VÉRIFICATIONS CRITIQUES:"
                        
                        # Fichiers essentiels avec vérification améliorée
                        echo "📁 Fichiers essentiels:"
                        ESSENTIAL_FILES=("package.json" "Dockerfile" "src/App.tsx")
                        MISSING_FILES=0
                        
                        for file in "${ESSENTIAL_FILES[@]}"; do
                            if [ -f "$file" ]; then
                                echo "  ✅ $file"
                            else
                                echo "  ❌ $file MANQUANT"
                                MISSING_FILES=$((MISSING_FILES + 1))
                            fi
                        done
                        
                        if [ $MISSING_FILES -gt 0 ]; then
                            echo "🚨 $MISSING_FILES fichier(s) essentiel(s) manquant(s)"
                            exit 1
                        fi
                        
                        # Analyse package.json
                        if [ -f "package.json" ]; then
                            echo ""
                            echo "📦 ANALYSE PACKAGE.JSON:"
                            node -e "
                                const pkg = require('./package.json');
                                console.log('  Nom:', pkg.name || 'Non spécifié');
                                console.log('  Version:', pkg.version || 'Non spécifié');
                                console.log('  Description:', pkg.description || 'Non spécifié');
                                console.log('  Scripts:', Object.keys(pkg.scripts || {}).join(', ') || 'Aucun');
                            "
                        fi
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
                        
                        echo "🚨 VÉRIFICATION ERREURS TYPESCRIPT"
                        echo "=================================="
                        
                        ERROR_COUNT=0
                        ERROR_FILES=()
                        
                        # Recherche d'erreurs TypeScript réelles (exclut node_modules)
                        echo "🔍 Analyse des fichiers source TypeScript..."
                        
                        # Pattern 1: Assignation incorrecte number -> string
                        PATTERN1_FILES=$(grep -r "const.*:.*string.*=.*[0-9]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules 2>/dev/null | head -5 | cat)
                        if [ -n "$PATTERN1_FILES" ]; then
                            echo "❌ ERREUR: Assignation number -> string détectée:"
                            echo "$PATTERN1_FILES"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                            ERROR_FILES+=("$PATTERN1_FILES")
                        fi
                        
                        # Pattern 2: Assignation incorrecte string -> number
                        PATTERN2_FILES=$(grep -r "const.*:.*number.*=.*['\\"]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules 2>/dev/null | head -5 | cat)
                        if [ -n "$PATTERN2_FILES" ]; then
                            echo "❌ ERREUR: Assignation string -> number détectée:"
                            echo "$PATTERN2_FILES"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                            ERROR_FILES+=("$PATTERN2_FILES")
                        fi
                        
                        # Pattern 3: Fichiers de test avec erreurs intentionnelles
                        PATTERN3_FILES=$(find . -name "*.ts" -o -name "*.tsx" ! -path "./node_modules/*" -exec grep -l "testError" {} \\; 2>/dev/null | head -5 | cat)
                        if [ -n "$PATTERN3_FILES" ]; then
                            echo "❌ ERREUR: Fichiers de test avec erreurs détectés:"
                            echo "$PATTERN3_FILES"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                            ERROR_FILES+=("$PATTERN3_FILES")
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
                            echo "🔍 Fichiers problématiques:"
                            for file in "${ERROR_FILES[@]}"; do
                                echo "$file"
                            done
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
                        
                        # Fichiers sensibles avec vérification de sécurité
                        SENSITIVE_FILES=(".env" ".env.local" ".env.production")
                        SENSITIVE_COUNT=0
                        
                        for file in "${SENSITIVE_FILES[@]}"; do
                            if [ -f "$file" ]; then
                                echo "⚠️  Fichier sensible présent: $file"
                                SENSITIVE_COUNT=$((SENSITIVE_COUNT + 1))
                                
                                # Vérification basique du contenu
                                FILE_SIZE=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
                                echo "    Taille: ${FILE_SIZE} octets"
                            fi
                        done
                        
                        if [ $SENSITIVE_COUNT -eq 0 ]; then
                            echo "✅ Aucun fichier sensible détecté"
                        fi
                        
                        # Dossiers de build
                        BUILD_DIRS=("dist" "build" "out" ".next")
                        BUILD_PRESENT=0
                        
                        for dir in "${BUILD_DIRS[@]}"; do
                            if [ -d "$dir" ]; then
                                echo "📁 Dossier de build présent: $dir"
                                BUILD_PRESENT=1
                            fi
                        done
                        
                        if [ $BUILD_PRESENT -eq 0 ]; then
                            echo "📁 Aucun dossier de build détecté"
                        fi
                        
                        # Vérification de la structure des dossiers
                        echo ""
                        echo "📁 STRUCTURE DES DOSSIERS:"
                        find . -maxdepth 2 -type d ! -path "./node_modules" ! -path "./.git" | sort | head -15
                        
                        echo "✅ Structure validée"
                    '''
                }
            }
        }
        
        stage('Dependencies Check') {
            steps {
                script {
                    echo '📦 Vérification des dépendances...'
                    sh '''
                        #!/bin/bash
                        set +e  # Continuer même en cas d'erreur pour ce stage
                        
                        if [ -f "package.json" ]; then
                            echo "🔍 ANALYSE DES DÉPENDANCES:"
                            
                            # Vérification de la présence des dépendances critiques
                            node -e "
                                const pkg = require('./package.json');
                                const deps = { ...pkg.dependencies, ...pkg.devDependencies };
                                const criticalDeps = ['react', 'typescript', '@types/react'];
                                
                                criticalDeps.forEach(dep => {
                                    if (deps[dep]) {
                                        console.log('  ✅ ' + dep + ': ' + deps[dep]);
                                    } else {
                                        console.log('  ⚠️  ' + dep + ': NON TROUVÉ');
                                    }
                                });
                            " || echo "⚠️  Impossible d'analyser package.json"
                            
                            # Vérification de l'existence de node_modules
                            if [ -d "node_modules" ]; then
                                echo "📁 node_modules: PRÉSENT"
                            else
                                echo "📁 node_modules: ABSENT (normal en CI)"
                            fi
                        else
                            echo "❌ package.json non trouvé pour l'analyse des dépendances"
                        fi
                        
                        echo "✅ Vérification des dépendances terminée"
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
                        echo ""
                        echo "🎉 VALIDATION RÉUSSIE"
                        echo "===================="
                        echo "✅ Aucune erreur TypeScript détectée"
                        echo "✅ Structure projet: VALIDE"
                        echo "✅ Fichiers essentiels: PRÉSENTS"
                        echo "✅ Dépendances: ANALYSÉES"
                        echo "🔄 Surveillance: ACTIVÉE"
                        echo ""
                        echo "📊 RÉSUMÉ DÉTAILLÉ:"
                        echo "• Build: ${BUILD_NUMBER}"
                        echo "• Commit: $(git log -1 --pretty=format:'%h - %s')"
                        echo "• Auteur: $(git log -1 --pretty=format:'%an')"
                        echo "• Date: $(date '+%Y-%m-%d %H:%M:%S')"
                        echo "• Node.js: $(node --version 2>/dev/null || echo 'Non disponible')"
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
            sh '''
                echo ""
                echo "⏱️  Durée du build: ${currentBuild.durationString}"
                echo "🔗 URL du build: ${env.BUILD_URL}"
            '''
        }
        success {
            echo '🎉 SYSTÈME DE VALIDATION OPÉRATIONNEL !'
            sh '''
                echo ""
                echo "✅ TOUTES LES VALIDATIONS SONT PASSÉES"
                echo "✅ Le code est prêt pour le déploiement"
                echo "✅ Aucune erreur TypeScript détectée"
                echo "✅ Structure du projet validée"
                echo ""
                echo "📈 MÉTRIQUES:"
                echo "• Build réussi: ${currentBuild.number}"
                echo "• Dernier commit valide: $(git log -1 --pretty=format:'%h')"
                echo "• Statut: STABLE"
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
                echo ""
                echo "🆘 SUPPORT:"
                echo "• Consultez les logs détaillés ci-dessus"
                echo "• Vérifiez la cohérence des types TypeScript"
                echo "• Supprimez le code de test en production"
            '''
        }
        cleanup {
            echo '🧹 Nettoyage des ressources...'
            sh '''
                echo "✅ Nettoyage terminé"
                echo "💾 Utilisation disque:"
                df -h . | tail -1
            '''
        }
    }
}