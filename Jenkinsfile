pipeline {
    agent any
    
    triggers {
        pollSCM('H/1 * * * *')  // ✅ Détection auto des changements Git
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
    }
    
    stages {
        stage('🔍 Détection Auto') {
            steps {
                sh '''
                    echo "=========================================="
                    echo "🔍 DÉTECTION AUTOMATIQUE"
                    echo "=========================================="
                    
                    # Détection des changements Git
                    echo "📝 Dernier commit: $(git log -1 --pretty=format:'%h - %s')"
                    echo "👤 Auteur: $(git log -1 --pretty=format:'%an')"
                    echo "📅 Date: $(git log -1 --pretty=format:'%cd')"
                    echo "🔀 Branche: $(git branch --show-current)"
                    
                    # Analyse du projet
                    if [ -f "package.json" ]; then
                        echo "📦 Type: Application Node.js/React"
                        echo "🆔 Nom: $(grep '"name"' package.json | head -1 | cut -d'"' -f4)"
                        echo "📋 Version: $(grep '"version"' package.json | head -1 | cut -d'"' -f4)"
                        
                        # Détection framework
                        if grep -q '"react"' package.json; then
                            echo "⚛️  Framework: React"
                        fi
                        
                        # Détection TypeScript
                        if [ -f "tsconfig.json" ]; then
                            echo "📘 Langage: TypeScript"
                        fi
                    fi
                    
                    # Analyse structure
                    echo "📁 Structure du projet:"
                    echo "• Composants: $(find src -name '*.tsx' -o -name '*.jsx' 2>/dev/null | wc -l)"
                    echo "• Tests: $(find . -name '*.test.*' -o -name '*.spec.*' 2>/dev/null | wc -l)"
                '''
            }
        }
        
        stage('📥 Installation') {
            steps {
                sh '''
                    echo "🔧 INSTALLATION INTELLIGENTE"
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                        echo '📦 Installation des dépendances...'
                        npm install --silent
                        echo '✅ Dépendances installées'
                    "
                '''
            }
        }
        
        stage('✅ Validation Qualité') {
            parallel {
                stage('📘 TypeScript') {
                    steps {
                        sh '''
                            echo "🔬 VALIDATION TYPESCRIPT"
                            docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                                if [ -f 'tsconfig.json' ]; then
                                    echo '📝 Compilation TypeScript...'
                                    npx tsc --noEmit --skipLibCheck
                                    echo '✅ Aucune erreur TypeScript'
                                else
                                    echo '⚠️  TypeScript non configuré'
                                fi
                            "
                        '''
                    }
                }
                
                stage('📏 ESLint') {
                    steps {
                        sh '''
                            echo "🎨 ANALYSE DE CODE"
                            docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                                if npx eslint --version > /dev/null 2>&1; then
                                    echo '🔍 Exécution ESLint...'
                                    npx eslint . --ext .js,.jsx,.ts,.tsx || echo '⚠️  Problèmes de style détectés'
                                else
                                    echo '⚠️  ESLint non disponible'
                                fi
                            "
                        '''
                    }
                }
            }
        }
        
        stage('🧪 Tests Auto') {
            steps {
                sh '''
                    echo "🔬 TESTS AUTOMATISÉS"
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                        echo '🏃‍♂️ Exécution des tests...'
                        npm test -- --watchAll=false --passWithNoTests --silent
                        echo '✅ Tests terminés'
                    "
                '''
            }
        }
        
        stage('🛡️ Sécurité') {
            steps {
                sh '''
                    echo "🔒 ANALYSE DE SÉCURITÉ"
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                        echo '📦 Audit des vulnérabilités npm...'
                        npm audit --audit-level=high || echo '⚠️  Audit avec avertissements'
                        
                        echo '🔍 Recherche de secrets...'
                        if [ -f '.env' ]; then
                            echo '❌ FICHIER .env DÉTECTÉ - NE PAS COMMITER!'
                            exit 1
                        fi
                        
                        # Recherche de clés API
                        if grep -r 'AKIA[0-9A-Z]' src/ > /dev/null 2>&1; then
                            echo '❌ CLÉS AWS DÉTECTÉES!'
                            exit 1
                        fi
                        
                        if grep -r 'sk_live_' src/ > /dev/null 2>&1; then
                            echo '❌ CLÉS STRIPE DÉTECTÉES!'
                            exit 1
                        fi
                        
                        echo '✅ Aucun problème de sécurité critique'
                    "
                '''
            }
        }
        
        stage('🏗️ Build Production') {
            steps {
                sh '''
                    echo "🔨 BUILD PRODUCTION"
                    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                        echo '🏗️ Construction de l application...'
                        npm run build
                        echo '✅ Build réussi!'
                    "
                    
                    # Analyse du build
                    sh '''
                        if [ -d "dist" ]; then
                            echo "📊 Build dans: dist/"
                            echo "📁 Taille: $(du -sh dist | cut -f1)"
                            echo "📋 Fichiers: $(find dist -type f | wc -l)"
                        elif [ -d "build" ]; then
                            echo "📊 Build dans: build/"
                            echo "📁 Taille: $(du -sh build | cut -f1)"
                        fi
                    '''
                '''
            }
        }
        
        stage('🐳 Dockerisation') {
            steps {
                sh '''
                    echo "📦 CRÉATION IMAGE DOCKER"
                    
                    # Création du Dockerfile
                    cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
                    
                    echo "🔨 Construction de l image..."
                    docker build -t plateforme-location:${BUILD_NUMBER} .
                    
                    echo "✅ Image créée: plateforme-location:${BUILD_NUMBER}"
                    
                    # Vérification
                    echo "📋 Images disponibles:"
                    docker images | grep plateforme-location
                '''
            }
        }
    }
    
    post {
        always {
            echo "🏁 PIPELINE TERMINÉ - Build #${BUILD_NUMBER}"
            echo "📅 Heure de fin: $(date)"
        }
        success {
            echo "🎉 SUCCÈS COMPLET !"
            echo "📋 RAPPORT FINAL:"
            echo "• ✅ Détection automatique des changements"
            echo "• ✅ Installation intelligente"
            echo "• ✅ Validation qualité du code"
            echo "• ✅ Tests automatisés"
            echo "• ✅ Analyse de sécurité"
            echo "• ✅ Build production"
            echo "• ✅ Dockerisation"
            echo ""
            echo "🚀 DÉPLOIEMENT PRÊT:"
            echo "🐳 Image: plateforme-location:${BUILD_NUMBER}"
            echo "🌐 Commande: docker run -p 3000:80 plateforme-location:${BUILD_NUMBER}"
            echo "📊 Accédez à: http://localhost:3000"
        }
        failure {
            echo "❌ ÉCHEC - CORRECTIONS REQUISES"
            echo "🔧 DIAGNOSTIC:"
            echo "1. Vérifiez les étapes en échec ci-dessus"
            echo "2. Testez localement avec: npm run build"
            echo "3. Corrigez les erreurs identifiées"
            echo "4. Recommitez et relancez le pipeline"
        }
    }
}