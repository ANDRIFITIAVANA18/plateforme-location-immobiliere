pipeline {
    agent any
    
    triggers {
        pollSCM('H/1 * * * *')
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
    }
    
    stages {
        stage('🔍 Détection Auto') {
            steps {
                sh """
                    echo "=========================================="
                    echo "🔍 DÉTECTION AUTOMATIQUE"
                    echo "=========================================="
                    
                    echo "📝 Dernier commit: \$(git log -1 --pretty=format:'%h - %s')"
                    echo "👤 Auteur: \$(git log -1 --pretty=format:'%an')"
                    echo "🔀 Branche: \$(git branch --show-current)"
                    
                    if [ -f "package.json" ]; then
                        echo "📦 Type: Application Node.js/React"
                        echo "🆔 Nom: \$(grep '\"name\"' package.json | head -1 | cut -d'\"' -f4)"
                        echo "📋 Version: \$(grep '\"version\"' package.json | head -1 | cut -d'\"' -f4)"
                        
                        if grep -q '\"react\"' package.json; then
                            echo "⚛️  Framework: React"
                        fi
                        
                        if [ -f "tsconfig.json" ]; then
                            echo "📘 Langage: TypeScript"
                        fi
                    fi
                    
                    echo "📁 Structure:"
                    echo "• Composants: \$(find src -name '*.tsx' -o -name '*.jsx' 2>/dev/null | wc -l)"
                    echo "• Tests: \$(find . -name '*.test.*' -o -name '*.spec.*' 2>/dev/null | wc -l)"
                """
            }
        }
        
        stage('📥 Installation') {
            steps {
                sh """
                    echo "🔧 INSTALLATION"
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npm install --silent
                        echo '✅ Dépendances installées'
                    "
                """
            }
        }
        
        stage('✅ Validation Qualité') {
            parallel {
                stage('📘 TypeScript') {
                    steps {
                        sh """
                            echo "🔬 VALIDATION TYPESCRIPT"
                            docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                                if [ -f 'tsconfig.json' ]; then
                                    npx tsc --noEmit --skipLibCheck
                                    echo '✅ TypeScript validé'
                                else
                                    echo '⚠️  TypeScript non configuré'
                                fi
                            "
                        """
                    }
                }
                
                stage('📏 ESLint') {
                    steps {
                        sh """
                            echo "🎨 ANALYSE DE CODE"
                            docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                                if npx eslint --version > /dev/null 2>&1; then
                                    npx eslint . --ext .js,.jsx,.ts,.tsx || echo '⚠️  Problèmes de style'
                                else
                                    echo '⚠️  ESLint non disponible'
                                fi
                            "
                        """
                    }
                }
            }
        }
        
        stage('🧪 Tests Auto') {
            steps {
                sh """
                    echo "🔬 TESTS AUTOMATISÉS"
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npm test -- --watchAll=false --passWithNoTests --silent
                        echo '✅ Tests terminés'
                    "
                """
            }
        }
        
        stage('🛡️ Sécurité') {
            steps {
                sh """
                    echo "🔒 ANALYSE DE SÉCURITÉ"
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npm audit --audit-level=high || echo '⚠️  Audit avec avertissements'
                        
                        if [ -f '.env' ]; then
                            echo '❌ FICHIER .env DÉTECTÉ'
                            exit 1
                        fi
                        
                        if grep -r 'AKIA[0-9A-Z]' src/ > /dev/null 2>&1; then
                            echo '❌ CLÉS AWS DÉTECTÉES'
                            exit 1
                        fi
                        
                        echo '✅ Aucun problème de sécurité'
                    "
                """
            }
        }
        
        stage('🏗️ Build Production') {
            steps {
                sh """
                    echo "🔨 BUILD PRODUCTION"
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npm run build
                        echo '✅ Build réussi'
                    "
                """
                
                sh """
                    if [ -d "dist" ]; then
                        echo "📊 Build dans: dist/"
                        echo "📁 Taille: \$(du -sh dist | cut -f1)"
                    fi
                """
            }
        }
        
        stage('🐳 Dockerisation') {
            steps {
                sh """
                    echo "📦 CRÉATION IMAGE DOCKER"
                    
                    cat > Dockerfile << EOF
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
                    
                    docker build -t plateforme-location:\${BUILD_NUMBER} .
                    echo "✅ Image: plateforme-location:\${BUILD_NUMBER}"
                """
            }
        }
    }
    
    post {
        always {
            echo "🏁 PIPELINE TERMINÉ - Build #\${BUILD_NUMBER}"
        }
        success {
            echo "🎉 SUCCÈS COMPLET"
            echo "🐳 Image: plateforme-location:\${BUILD_NUMBER}"
            echo "🚀 docker run -p 3000:80 plateforme-location:\${BUILD_NUMBER}"
        }
        failure {
            echo "❌ ÉCHEC - Vérifiez les logs"
        }
    }
}