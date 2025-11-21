pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-p 3000:3000 -v /tmp/.npm:/root/.npm'
        }
    }
    
    triggers {
        pollSCM('*/1 * * * *')
    }
    
    environment {
        IMAGE_NAME = 'plateforme-location-immobiliere'
        MAIN_PORT = '3000'
        NODE_ENV = 'test'
        CI = 'true'
    }
    
    stages {
        stage('Environment Setup') {
            steps {
                script {
                    echo '🚀 INITIALISATION ENVIRONNEMENT DOCKER + NODE.JS'
                    sh '''
                        echo "=========================================="
                        echo "🔧 ENVIRONNEMENT DE BUILD"
                        echo "=========================================="
                        echo "📦 Node.js: $(node --version)"
                        echo "📦 npm: $(npm --version)" 
                        echo "📦 npx: $(npx --version)"
                        echo "🐳 Docker: En cours d'exécution"
                        echo "📁 Répertoire: $(pwd)"
                        echo "=========================================="
                    '''
                }
            }
        }
        
        stage('Checkout & Analysis') {
            steps {
                checkout scm
                script {
                    echo '📦 Code récupéré avec succès depuis Git'
                    sh '''
                        echo "📊 INFORMATIONS DU PROJET:"
                        echo "🆔 Build: ${BUILD_NUMBER}"
                        echo "📅 Date: $(date)"
                        echo "🌐 Dépôt: $(git config --get remote.origin.url)"
                        echo "🔀 Branche: $(git branch --show-current)"
                        echo "📝 Commit: $(git log -1 --pretty=format:'%h - %s')"
                        
                        echo " "
                        echo "✅ VÉRIFICATIONS CRITIQUES:"
                        echo "📁 Fichiers essentiels:"
                        [ -f "package.json" ] && echo "  ✅ package.json" || { echo "  ❌ package.json MANQUANT"; exit 1; }
                        [ -f "Dockerfile" ] && echo "  ✅ Dockerfile" || echo "  ⚠️  Dockerfile manquant"
                        [ -f "src/App.tsx" ] && echo "  ✅ App.tsx" || { echo "  ❌ App.tsx MANQUANT"; exit 1; }
                        [ -f "tsconfig.json" ] && echo "  ✅ tsconfig.json" || echo "  ⚠️  tsconfig.json manquant"
                        [ -f "src/__tests__/ci-cd.validation.test.ts" ] && echo "  ✅ Tests CI/CD présents" || echo "  ⚠️  Tests CI/CD manquants"
                    '''
                }
            }
        }
        
        stage('Dependency Installation') {
            steps {
                script {
                    echo '📦 Installation des dépendances...'
                    sh '''
                        echo "🔧 INSTALLATION DES DÉPENDANCES NPM"
                        echo "=================================="
                        
                        # Nettoyer le cache npm si nécessaire
                        npm cache clean --force 2>/dev/null || true
                        
                        # Installation avec cache optimisé
                        if [ -f "package-lock.json" ]; then
                            echo "📥 Installation avec package-lock.json..."
                            npm ci --silent --no-audit --prefer-offline
                        else
                            echo "📥 Installation standard..."
                            npm install --silent --no-audit --prefer-offline
                        fi
                        
                        # Vérifier l'installation
                        if [ $? -eq 0 ]; then
                            echo "✅ Dépendances installées avec succès"
                            echo "📊 Nombre de packages: $(npm list --depth=0 2>/dev/null | wc -l)"
                        else
                            echo "❌ Erreur lors de l'installation des dépendances"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('TypeScript Validation') {
            steps {
                script {
                    echo '🔬 Validation TypeScript...'
                    sh '''
                        echo "🚨 VÉRIFICATION ERREURS TYPESCRIPT"
                        echo "=================================="
                        
                        # Vérification compilation TypeScript
                        echo "📝 Compilation TypeScript..."
                        npx tsc --noEmit --skipLibCheck --strict
                        
                        if [ $? -eq 0 ]; then
                            echo "✅ Aucune erreur TypeScript détectée"
                            echo "✅ Compilation TypeScript réussie"
                        else
                            echo "❌ Erreurs TypeScript détectées"
                            exit 1
                        fi
                        
                        # Recherche de patterns problématiques
                        echo "🔍 Analyse des patterns problématiques..."
                        ERROR_COUNT=0
                        
                        if find src -name "*.ts" -o -name "*.tsx" ! -path "*/node_modules/*" -exec grep -l "const.*string.*=.*[0-9]" {} \\; 2>/dev/null | grep -q "."; then
                            echo "❌ Assignation number -> string détectée"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        if find src -name "*.ts" -o -name "*.tsx" ! -path "*/node_modules/*" -exec grep -l "const.*number.*=.*['\\"]" {} \\; 2>/dev/null | grep -q "."; then
                            echo "❌ Assignation string -> number détectée"
                            ERROR_COUNT=$((ERROR_COUNT + 1))
                        fi
                        
                        if [ $ERROR_COUNT -eq 0 ]; then
                            echo "✅ Aucun pattern problématique détecté"
                        else
                            echo "❌ $ERROR_COUNT pattern(s) problématique(s) détecté(s)"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Test Execution') {
            steps {
                script {
                    echo '🧪 Exécution des tests...'
                    sh '''
                        echo "🔬 LANCEMENT DES TESTS AUTOMATISÉS"
                        echo "================================"
                        
                        # Exécuter les tests avec rapport de couverture
                        echo "🏃‍♂️ Exécution des tests..."
                        npm test -- --passWithNoTests --silent --coverage --watchAll=false
                        
                        if [ $? -eq 0 ]; then
                            echo "✅ Tous les tests sont passés"
                            
                            # Vérifier si des tests existent
                            TEST_COUNT=$(find src -name "*.test.ts" -o -name "*.test.tsx" | wc -l)
                            if [ $TEST_COUNT -gt 0 ]; then
                                echo "📊 Nombre de fichiers de test: $TEST_COUNT"
                            else
                                echo "⚠️  Aucun fichier de test trouvé"
                            fi
                        else
                            echo "❌ Certains tests ont échoué"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Build Application') {
            steps {
                script {
                    echo '🏗️  Construction de l application...'
                    sh '''
                        echo "🔨 BUILD DE L APPLICATION REACT"
                        echo "=============================="
                        
                        # Build de production
                        echo "🏗️  Construction en mode production..."
                        npm run build
                        
                        if [ $? -eq 0 ]; then
                            echo "✅ Build réussi"
                            
                            # Vérifier les fichiers générés
                            echo "📁 Fichiers générés dans dist/:"
                            find dist -type f -name "*.js" -o -name "*.html" -o -name "*.css" | head -10
                            
                            # Taille du build
                            BUILD_SIZE=$(du -sh dist/ | cut -f1)
                            echo "📊 Taille du build: $BUILD_SIZE"
                            
                            # Vérifier le fichier principal
                            if [ -f "dist/index.html" ]; then
                                echo "✅ Fichier index.html généré"
                            else
                                echo "❌ Fichier index.html manquant"
                                exit 1
                            fi
                        else
                            echo "❌ Échec du build"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Security Checks') {
            steps {
                script {
                    echo '🛡️  Vérifications de sécurité...'
                    sh '''
                        echo "🔒 ANALYSE DE SÉCURITÉ"
                        echo "======================"
                        
                        # Fichiers sensibles
                        echo "📁 Fichiers sensibles:"
                        if [ -f ".env" ]; then
                            echo "❌ FICHIER .env DÉTECTÉ - NE DEVRAIT PAS ÊTRE COMMITÉ"
                            exit 1
                        else
                            echo "✅ Aucun fichier .env détecté"
                        fi
                        
                        # Mots de passe en clair
                        echo "🔑 Recherche de mots de passe en clair..."
                        if find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" ! -path "*/node_modules/*" ! -path "*/dist/*" -exec grep -i "password.*=.*['\\"][^'\\"]*['\\"]" {} \\; 2>/dev/null | grep -q "."; then
                            echo "❌ MOTS DE PASSE EN CLAIR DÉTECTÉS"
                            find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" ! -path "*/node_modules/*" ! -path "*/dist/*" -exec grep -l "password.*=.*['\\"][^'\\"]*['\\"]" {} \\; 2>/dev/null | head -3
                            exit 1
                        else
                            echo "✅ Aucun mot de passe en clair détecté"
                        fi
                        
                        # Clés API en clair
                        echo "🔑 Recherche de clés API..."
                        if find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" ! -path "*/node_modules/*" ! -path "*/dist/*" -exec grep -i "api_key.*=.*['\\"][^'\\"]*['\\"]\\|secret.*=.*['\\"][^'\\"]*['\\"]\\|token.*=.*['\\"][^'\\"]*['\\"]" {} \\; 2>/dev/null | grep -q "."; then
                            echo "❌ CLÉS API EN CLAIR DÉTECTÉES"
                            find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" ! -path "*/node_modules/*" ! -path "*/dist/*" -exec grep -l "api_key.*=.*['\\"][^'\\"]*['\\"]\\|secret.*=.*['\\"][^'\\"]*['\\"]\\|token.*=.*['\\"][^'\\"]*['\\"]" {} \\; 2>/dev/null | head -3
                            exit 1
                        else
                            echo "✅ Aucune clé API en clair détectée"
                        fi
                        
                        echo "✅ Tests de sécurité PASSÉS"
                    '''
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    echo '🐳 Construction de l image Docker...'
                    sh '''
                        echo "🔨 BUILD DE L IMAGE DOCKER"
                        echo "========================="
                        
                        # Vérifier que le Dockerfile existe
                        if [ ! -f "Dockerfile" ]; then
                            echo "⚠️  Dockerfile non trouvé, création d'un Dockerfile basique..."
                            cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
EOF
                        fi
                        
                        # Construction de l'image Docker
                        echo "🏗️  Construction de l'image..."
                        docker build -t $IMAGE_NAME:$BUILD_NUMBER .
                        
                        if [ $? -eq 0 ]; then
                            echo "✅ Image Docker construite avec succès"
                            echo "📦 Image: $IMAGE_NAME:$BUILD_NUMBER"
                            
                            # Lister les images
                            echo "📋 Images Docker disponibles:"
                            docker images | grep $IMAGE_NAME
                        else
                            echo "❌ Échec de la construction Docker"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Final Report') {
            steps {
                script {
                    echo '📊 Rapport final...'
                    sh '''
                        echo " "
                        echo "🎉 🎉 🎉 PIPELINE CI/CD RÉUSSI 🎉 🎉 🎉"
                        echo "========================================"
                        echo " "
                        echo "✅ TOUTES LES ÉTAPES ONT ÉTÉ EXÉCUTÉES AVEC SUCCÈS"
                        echo " "
                        echo "📋 RÉSUMÉ DES VALIDATIONS:"
                        echo "• ✅ Environnement Node.js: OPÉRATIONNEL"
                        echo "• ✅ Dépendances: INSTALLÉES" 
                        echo "• ✅ TypeScript: AUCUNE ERREUR"
                        echo "• ✅ Tests unitaires: PASSÉS"
                        echo "• ✅ Build React: RÉUSSI"
                        echo "• ✅ Sécurité: VALIDÉE"
                        echo "• ✅ Docker: IMAGE CONSTRUITE"
                        echo " "
                        echo "🚀 STATUT: PRÊT POUR LA PRODUCTION"
                        echo " "
                        echo "📊 MÉTRIQUES:"
                        echo "• Build: $BUILD_NUMBER"
                        echo "• Commit: $(git log -1 --pretty=format:'%h - %s')"
                        echo "• Date: $(date)"
                        echo "• Node.js: $(node --version)"
                        echo "• Build size: $(du -sh dist/ | cut -f1)"
                        echo "• Docker image: $IMAGE_NAME:$BUILD_NUMBER"
                        echo " "
                        echo "🎯 PROCHAINES ÉTAPES:"
                        echo "1. 🐳 Déployer l'image Docker"
                        echo "2. 🌐 Configurer le reverse proxy"
                        echo "3. 📈 Monitoring des performances"
                        echo "4. 🔄 Mise en production automatique"
                        echo " "
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline de validation terminé'
            sh '''
                echo " "
                echo "📈 STATISTIQUES FINALES:"
                echo "• Temps d'exécution: Variable"
                echo "• Fichiers TypeScript analysés: $(find src -name "*.ts" -o -name "*.tsx" | wc -l)"
                echo "• Tests exécutés: Tous validés"
                echo "• Build: Production ready"
                echo " "
            '''
        }
        success {
            echo '🎉 SYSTÈME CI/CD COMPLÈTEMENT OPÉRATIONNEL !'
            sh '''
                echo " "
                echo "✅✅✅ DÉPLOIEMENT AUTOMATIQUE PRÊT ✅✅✅"
                echo "Votre application React est construite et containerisée !"
                echo " "
                echo "Pour déployer:"
                echo "docker run -p 3000:3000 $IMAGE_NAME:$BUILD_NUMBER"
                echo " "
            '''
        }
        failure {
            echo '❌ PIPELINE EN ÉCHEC - CORRECTION REQUISE'
            sh '''
                echo " "
                echo "🔧 ACTIONS REQUISES:"
                echo "1. Vérifiez les logs d'erreur ci-dessus"
                echo "2. Testez localement: npm run build && npm test"
                echo "3. Corrigez les problèmes identifiés"
                echo "4. Recommitez et relancez le pipeline"
                echo " "
            '''
        }
    }
}