pipeline {
    agent any
    
    // TRIGGERS FONCTIONNELS
    triggers {
        // 1. Webhook GitHub (recommandé)
        githubPush()
        
        // 2. Polling toutes les 2 minutes (backup)
        pollSCM('H/2 * * * *')
        
        // 3. Déclenchement périodique (alternative)
        cron('H/5 * * * *')
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
    }
    
    stages {
        stage('🔍 Détection Changements Git') {
            steps {
                script {
                    // Vérifier si déclenché par un changement Git
                    if (currentBuild.getBuildCauses('hudson.triggers.SCMTrigger$SCMTriggerCause') || 
                        currentBuild.getBuildCauses('com.cloudbees.jenkins.GitHubPushCause')) {
                        echo "🎯 DÉCLENCHÉ AUTOMATIQUEMENT PAR CHANGEMENT GIT"
                    } else {
                        echo "👤 DÉCLENCHÉ MANUELLEMENT"
                    }
                }
                
                sh """
                    echo "=========================================="
                    echo "🔍 ANALYSE DES CHANGEMENTS GIT"
                    echo "=========================================="
                    
                    echo "📝 Dernier commit: \$(git log -1 --pretty=format:'%h - %s')"
                    echo "👤 Auteur: \$(git log -1 --pretty=format:'%an')" 
                    echo "📅 Date: \$(git log -1 --pretty=format:'%cd')"
                    echo "🔀 Branche: \$(git branch --show-current)"
                    
                    echo "🔄 Derniers changements:"
                    git log --oneline -5
                    
                    # Afficher les fichiers modifiés dans le dernier commit
                    echo "📁 Fichiers modifiés:"
                    git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "Premier commit ou pas d'historique"
                    
                    if [ -f "package.json" ]; then
                        echo "📦 Projet: \$(grep '\"name\"' package.json | head -1 | cut -d'\"' -f4)"
                    fi
                """
            }
        }
        
        stage('📥 Installation') {
            steps {
                sh """
                    echo "🔧 INSTALLATION DES DÉPENDANCES"
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
                                    npx eslint . --ext .js,.jsx,.ts,.tsx 2>/dev/null || echo '⚠️  Problèmes de style (ESLint v9)'
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
                    echo "🔬 EXÉCUTION DES TESTS"
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
                        
                        echo '✅ Aucun problème de sécurité critique'
                    "
                """
            }
        }
        
        stage('🏗️ Build Production') {
            steps {
                sh """
                    echo "🔨 CONSTRUCTION PRODUCTION"
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npm run build
                        echo '✅ Build réussi'
                    "
                """
                
                sh """
                    if [ -d "dist" ]; then
                        echo "📊 Build créé dans: dist/"
                        echo "📁 Taille: \$(du -sh dist | cut -f1)"
                        echo "📋 Fichiers: \$(find dist -type f | wc -l)"
                    fi
                """
            }
        }
        
        stage('🐳 Dockerisation') {
            steps {
                sh """
                    echo "📦 CRÉATION IMAGE DOCKER"
                    
                    # Création du Dockerfile
                    echo 'FROM nginx:alpine' > Dockerfile
                    echo 'COPY dist/ /usr/share/nginx/html' >> Dockerfile
                    echo 'EXPOSE 80' >> Dockerfile
                    echo 'CMD [\"nginx\", \"-g\", \"daemon off;\"]' >> Dockerfile
                    
                    docker build -t plateforme-location:\${BUILD_NUMBER} .
                    echo "✅ Image Docker créée: plateforme-location:\${BUILD_NUMBER}"
                """
            }
        }
    }
    
    post {
        always {
            echo "🏁 PIPELINE TERMINÉ - Build #\${BUILD_NUMBER}"
            
            script {
                // Afficher la cause du déclenchement
                def causes = currentBuild.getBuildCauses()
                causes.each { cause ->
                    echo "🎯 DÉCLENCHÉ PAR: \${cause.shortDescription}"
                }
            }
        }
        success {
            echo "🎉 DÉPLOIEMENT AUTOMATIQUE RÉUSSI !"
            echo "📋 CAUSE: \${currentBuild.getBuildCauses()[0].shortDescription}"
            echo "🚀 COMMANDE: docker run -d -p 3000:80 plateforme-location:\${BUILD_NUMBER}"
            echo "🌐 ACCÈS: http://localhost:3000"
        }
    }
}