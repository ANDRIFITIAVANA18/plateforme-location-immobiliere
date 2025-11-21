pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '--privileged -u root -v /tmp/.npm:/root/.npm'
        }
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
        APP_NAME = 'plateforme-location-immobiliere'
        DOCKER_IMAGE = "${APP_NAME}:${BUILD_NUMBER}"
    }
    
    stages {
        stage('🔍 Détection Auto') {
            steps {
                script {
                    echo '🎯 ANALYSE AUTOMATIQUE DU PROJET'
                    sh '''
                        echo "=========================================="
                        echo "🔍 DÉTECTION INTELLIGENTE"
                        echo "=========================================="
                        
                        # Détection framework
                        if [ -f "package.json" ]; then
                            PROJECT_NAME=$(jq -r '.name' package.json)
                            PROJECT_VERSION=$(jq -r '.version' package.json)
                            echo "📦 Projet: $PROJECT_NAME v$PROJECT_VERSION"
                            
                            # Détection React
                            if [ $(jq '.dependencies | has("react")' package.json) = "true" ]; then
                                echo "⚛️  Framework: React"
                                FRAMEWORK="react"
                            fi
                            
                            # Détection TypeScript
                            if [ -f "tsconfig.json" ]; then
                                echo "📘 Langage: TypeScript"
                            fi
                        fi
                        
                        echo "📁 Structure:"
                        echo "• Composants: $(find src -name '*.tsx' -o -name '*.jsx' 2>/dev/null | wc -l)"
                        echo "• Tests: $(find . -name '*.test.*' -o -name '*.spec.*' 2>/dev/null | wc -l)"
                        echo "• Dependencies: $(jq '.dependencies | length' package.json)"
                        echo "=========================================="
                    '''
                }
            }
        }
        
        stage('📥 Installation Intelligente') {
            steps {
                script {
                    echo '🧠 INSTALLATION OPTIMISÉE'
                    sh '''
                        echo "🔧 STRATÉGIE D'INSTALLATION"
                        
                        # Nettoyage cache
                        npm cache clean --force
                        
                        # Installation selon lock file
                        if [ -f "package-lock.json" ]; then
                            echo "📦 npm ci (optimisé)"
                            npm ci --silent --no-audit --prefer-offline
                        else
                            echo "📦 npm install"
                            npm install --silent --no-audit --prefer-offline
                        fi
                        
                        if [ $? -eq 0 ]; then
                            echo "✅ Dépendances installées"
                            echo "📊 Taille: $(du -sh node_modules | cut -f1)"
                        else
                            echo "❌ Échec installation"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('✅ Validation Qualité') {
            parallel {
                stage('📘 TypeScript') {
                    steps {
                        script {
                            echo '📘 VALIDATION TYPESCRIPT'
                            sh '''
                                echo "🔍 Compilation TypeScript..."
                                npx tsc --noEmit --skipLibCheck --strict
                                
                                if [ $? -eq 0 ]; then
                                    echo "✅ Aucune erreur TypeScript"
                                else
                                    echo "❌ Erreurs TypeScript détectées"
                                    exit 1
                                fi
                            '''
                        }
                    }
                }
                
                stage('📏 ESLint') {
                    steps {
                        script {
                            echo '📏 ANALYSE DE CODE'
                            sh '''
                                if npx eslint --version > /dev/null 2>&1; then
                                    echo "🔍 Exécution ESLint..."
                                    npx eslint src/ --max-warnings=0
                                    
                                    if [ $? -eq 0 ]; then
                                        echo "✅ Code style validé"
                                    else
                                        echo "❌ Problèmes de style détectés"
                                        exit 1
                                    fi
                                else
                                    echo "⚠️  ESLint non installé - skip"
                                fi
                            '''
                        }
                    }
                }
            }
        }
        
        stage('🧪 Tests Automatisés') {
            steps {
                script {
                    echo '🧪 EXÉCUTION DES TESTS'
                    sh '''
                        echo "🔬 STRATÉGIE DE TEST"
                        
                        # Exécution des tests avec couverture
                        npm test -- --watchAll=false --coverage --passWithNoTests
                        
                        if [ $? -eq 0 ]; then
                            echo "✅ Tests réussis"
                            
                            # Rapport couverture
                            if [ -d "coverage" ]; then
                                echo "📊 Couverture: $(grep -oP 'All files[^|]*\\|\\s*\\K[0-9.]+' coverage/lcov-report/index.html || echo 'N/A')%"
                            fi
                        else
                            echo "❌ Tests échoués"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('🛡️ Analyse Sécurité') {
            steps {
                script {
                    echo '🔒 SCAN DE SÉCURITÉ'
                    sh '''
                        echo "🚨 VÉRIFICATIONS CRITIQUES"
                        
                        # Audit npm
                        echo "📦 Audit des vulnérabilités..."
                        npm audit --audit-level=high
                        
                        # Fichiers sensibles
                        echo "📁 Scan des secrets..."
                        if [ -f ".env" ]; then
                            echo "❌ .env DÉTECTÉ - NE DEVRAIT PAS ÊTRE COMMITÉ"
                            exit 1
                        fi
                        
                        # Secrets dans le code
                        if grep -r "AKIA[0-9A-Z]" src/ > /dev/null 2>&1; then
                            echo "❌ CLÉ AWS DÉTECTÉE!"
                            exit 1
                        fi
                        
                        if grep -r "sk_live_" src/ > /dev/null 2>&1; then
                            echo "❌ CLÉ STRIPE DÉTECTÉE!"
                            exit 1
                        fi
                        
                        echo "✅ Sécurité validée"
                    '''
                }
            }
        }
        
        stage('🏗️ Build Production') {
            steps {
                script {
                    echo '🏗️ CONSTRUCTION PRODUCTION'
                    sh '''
                        echo "🔨 BUILD OPTIMISÉ"
                        
                        # Construction
                        npm run build
                        
                        if [ $? -eq 0 ]; then
                            echo "✅ Build réussi"
                            
                            # Analyse build
                            BUILD_DIR=$(ls -d build dist 2>/dev/null | head -1)
                            if [ -n "$BUILD_DIR" ]; then
                                echo "📊 Analyse:"
                                echo "• Taille: $(du -sh $BUILD_DIR | cut -f1)"
                                echo "• Fichiers: $(find $BUILD_DIR -type f | wc -l)"
                                echo "• Fichier principal: $(find $BUILD_DIR -name 'index.html')"
                            fi
                        else
                            echo "❌ Échec build"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('🐳 Dockerisation') {
            steps {
                script {
                    echo '🐳 CONSTRUCTION IMAGE DOCKER'
                    sh '''
                        echo "🔨 Création image Docker..."
                        
                        # Créer Dockerfile si absent
                        if [ ! -f "Dockerfile" ]; then
                            cat > Dockerfile << 'EOF'
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
                            echo "📝 Dockerfile généré automatiquement"
                        fi
                        
                        # Construction image
                        docker build -t $DOCKER_IMAGE .
                        
                        if [ $? -eq 0 ]; then
                            echo "✅ Image créée: $DOCKER_IMAGE"
                            echo "📋 Images disponibles:"
                            docker images | grep $APP_NAME
                        else
                            echo "❌ Échec construction Docker"
                            exit 1
                        fi
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "🏁 PIPELINE TERMINÉ - Build #${BUILD_NUMBER}"
                echo "📅 Date: $(date)"
                echo "🔀 Branche: $(git branch --show-current)"
                echo "📝 Commit: $(git log -1 --pretty=format:'%h - %s')"
            }
        }
        success {
            script {
                echo "🎉 SUCCÈS - APPLICATION VALIDÉE"
                echo "📋 RÉSUMÉ:"
                echo "• ✅ Détection automatique"
                echo "• ✅ Installation intelligente" 
                echo "• ✅ Validation qualité"
                echo "• ✅ Tests automatisés"
                echo "• ✅ Sécurité vérifiée"
                echo "• ✅ Build production"
                echo "• 🐳 Docker: $DOCKER_IMAGE"
                echo " "
                echo "🚀 POUR DÉPLOYER:"
                echo "docker run -p 3000:80 $DOCKER_IMAGE"
            }
        }
        failure {
            script {
                echo "❌ ÉCHEC - CORRECTIONS REQUISES"
                echo "🔧 ACTIONS:"
                echo "1. Vérifier les logs d'erreur"
                echo "2. Tester localement: npm run build"
                echo "3. Corriger les problèmes"
                echo "4. Recommiter et relancer"
            }
        }
    }
}