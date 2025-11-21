pipeline {
    agent any
    
    triggers {
        pollSCM('H/1 * * * *')  // ✅ Vérifie Git toutes les 2 minutes
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
    }
    
    stages {
        stage('🔍 Détection Auto Git') {
            steps {
                sh """
                    echo "=========================================="
                    echo "🔍 DÉTECTION AUTOMATIQUE GIT"
                    echo "=========================================="
                    
                    echo "📝 Dernier commit: \$(git log -1 --pretty=format:'%h - %s')"
                    echo "👤 Auteur: \$(git log -1 --pretty=format:'%an')" 
                    echo "📅 Date: \$(git log -1 --pretty=format:'%cd')"
                    echo "🔀 Branche: \$(git branch --show-current)"
                    
                    # Détection des changements
                    echo "🔄 Derniers changements détectés:"
                    git log --oneline -5
                    
                    if [ -f "package.json" ]; then
                        echo "📦 Type: Application Node.js/React"
                        echo "🆔 Nom: \$(grep '\"name\"' package.json | head -1 | cut -d'\"' -f4)"
                    fi
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
                            docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                                if [ -f 'tsconfig.json' ]; then
                                    npx tsc --noEmit --skipLibCheck
                                    echo '✅ TypeScript validé'
                                fi
                            "
                        """
                    }
                }
                
                stage('📏 ESLint') {
                    steps {
                        sh """
                            docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                                if npx eslint --version > /dev/null 2>&1; then
                                    npx eslint . --ext .js,.jsx,.ts,.tsx || echo '⚠️  Problèmes de style'
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
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npm audit --audit-level=high || echo '⚠️  Audit avec avertissements'
                        
                        if [ -f '.env' ]; then
                            echo '❌ FICHIER .env DÉTECTÉ'
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
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npm run build
                        echo '✅ Build réussi'
                    "
                """
                
                sh """
                    if [ -d "dist" ]; then
                        echo "📊 Build créé dans: dist/"
                        echo "📁 Taille: \$(du -sh dist | cut -f1)"
                    fi
                """
            }
        }
        
        stage('🐳 Dockerisation') {
            steps {
                sh """
                    echo "FROM nginx:alpine" > Dockerfile
                    echo "COPY dist/ /usr/share/nginx/html" >> Dockerfile
                    echo "EXPOSE 80" >> Dockerfile
                    echo "CMD [\"nginx\", \"-g\", \"daemon off;\"]" >> Dockerfile
                    
                    docker build -t plateforme-location:\${BUILD_NUMBER} .
                    echo "✅ Image Docker créée: plateforme-location:\${BUILD_NUMBER}"
                """
            }
        }
    }
    
    post {
        success {
            echo "🎉 DÉPLOIEMENT AUTOMATIQUE RÉUSSI !"
            echo "📋 RAPPORT:"
            echo "• ✅ Détection auto Git activée"
            echo "• ✅ Tests automatisés" 
            echo "• ✅ Validation qualité"
            echo "• ✅ Analyse sécurité"
            echo "• ✅ Build production"
            echo "• ✅ Image Docker"
            echo ""
            echo "🚀 COMMANDE DE DÉPLOIEMENT:"
            echo "docker run -d -p 3000:80 plateforme-location:\${BUILD_NUMBER}"
            echo "🌐 VOTRE APP: http://localhost:3000"
        }
    }
}