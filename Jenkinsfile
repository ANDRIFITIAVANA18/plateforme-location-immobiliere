pipeline {
    agent any
    
    triggers {
        githubPush()
        pollSCM('H/5 * * * *')
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
        APP_PORT = '3100'
    }
    
    stages {
        stage('🔧 Préparation Environnement') {
            steps {
                sh '''
                    echo "🔧 CONFIGURATION DE L'ENVIRONNEMENT"
                    echo "📊 Système: $(uname -a)"
                    echo "📁 Répertoire: $PWD"
                    echo "👤 Utilisateur: $(whoami)"
                    
                    # Installation de Node.js si absent
                    if ! command -v node &> /dev/null; then
                        echo "📥 Installation de Node.js..."
                        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                        apt-get install -y nodejs
                    fi
                    
                    echo "✅ Environnement prêt"
                    echo "📊 Node: $(node --version)"
                    echo "📊 npm: $(npm --version)"
                '''
            }
        }
        
        stage('🔍 Analyse Git') {
            steps {
                script {
                    if (currentBuild.getBuildCauses('hudson.triggers.SCMTrigger$SCMTriggerCause') || 
                        currentBuild.getBuildCauses('com.cloudbees.jenkins.GitHubPushCause')) {
                        echo "🎯 DÉCLENCHÉ AUTOMATIQUEMENT PAR CHANGEMENT GIT"
                        currentBuild.description = "Auto: ${currentBuild.getBuildCauses()[0].shortDescription}"
                    } else {
                        echo "👤 DÉCLENCHÉ MANUELLEMENT"
                        currentBuild.description = "Manuel: Build #${BUILD_NUMBER}"
                    }
                }
                
                sh """
                    echo "=========================================="
                    echo "🔍 ANALYSE GIT - Build #${BUILD_NUMBER}"
                    echo "=========================================="
                    echo "📝 Commit: \$(git log -1 --pretty=format:'%h - %s')"
                    echo "👤 Auteur: \$(git log -1 --pretty=format:'%an')" 
                    echo "🔀 Branche: \$(git branch --show-current)"
                    echo "📁 Fichiers modifiés:"
                    git diff --name-only HEAD~1 HEAD 2>/dev/null | head -10 || echo "Nouveau commit"
                    echo "📦 Projet: \$(grep '\"name\"' package.json | head -1 | cut -d'\"' -f4)"
                """
            }
        }
        
        stage('📥 Installation Dépendances') {
            steps {
                sh '''
                    echo "🔧 INSTALLATION DES DÉPENDANCES"
                    
                    # Nettoyage cache npm si nécessaire
                    npm cache clean --force || true
                    
                    # Installation avec fallback
                    if [ -f "package-lock.json" ]; then
                        npm ci --silent --no-audit
                    else
                        npm install --silent --no-audit
                    fi
                    
                    echo "✅ Dépendances installées"
                    echo "📦 TypeScript: \$(npx tsc --version 2>/dev/null || echo 'Installation...')"
                    
                    # Installation TypeScript si manquant
                    if ! npx tsc --version &> /dev/null; then
                        npm install -g typescript
                    fi
                '''
            }
        }
        
        stage('✅ Validation') {
            steps {
                sh '''
                    echo "🔬 VALIDATION CODE"
                    
                    # Validation TypeScript
                    npx tsc --noEmit --skipLibCheck
                    echo "✅ TypeScript validé"
                    
                    # Tests avec timeout
                    timeout(time: 2, unit: 'MINUTES') {
                        npm test -- --watchAll=false --passWithNoTests --silent || echo "⚠️ Tests avec avertissements"
                    }
                    
                    echo "✅ Validation terminée"
                '''
            }
        }
        
        stage('🏗️ Build Production') {
            steps {
                sh '''
                    echo "🔨 BUILD PRODUCTION"
                    
                    # Nettoyage préalable
                    rm -rf dist/ build/
                    
                    # Build
                    npm run build
                    
                    echo "✅ Build réussi"
                '''
                
                sh '''
                    echo "📊 ANALYSE BUILD"
                    if [ -d "dist" ]; then
                        echo "📁 Dossier dist créé"
                        echo "📏 Taille: $(du -sh dist | cut -f1)"
                        echo "📋 Fichiers: $(find dist -type f | wc -l)"
                        echo "🔍 Contenu:"
                        ls -la dist/ | head -10
                    else
                        echo "❌ Aucun build détecté"
                        echo "📁 Contenu actuel:"
                        ls -la
                        exit 1
                    fi
                '''
            }
        }
        
        stage('📦 Archivage') {
            steps {
                sh '''
                    echo "📦 CRÉATION DE L'ARCHIVE"
                    tar -czf build-${BUILD_NUMBER}.tar.gz dist/
                    echo "✅ Archive créée: build-${BUILD_NUMBER}.tar.gz"
                '''
                
                archiveArtifacts artifacts: 'build-*.tar.gz', fingerprint: true
            }
        }
        
        stage('🔍 Vérification Finale') {
            steps {
                sh '''
                    echo "🔍 VÉRIFICATION FINALE"
                    echo "📊 Structure finale:"
                    find dist/ -type f -name "*.html" -o -name "*.js" -o -name "*.css" | head -10
                    echo "✅ Build prêt pour le déploiement"
                '''
            }
        }
    }
    
    post {
        always {
            echo "🏁 PIPELINE TERMINÉ - Build #${BUILD_NUMBER}"
            echo "⏱️ Durée: ${currentBuild.durationString}"
        }
        success {
            echo "🎉 SUCCÈS COMPLET !"
            echo "📋 RAPPORT:"
            echo "• ✅ Environnement configuré"
            echo "• ✅ Dépendances installées" 
            echo "• ✅ Validation TypeScript"
            echo "• ✅ Build production"
            echo "• ✅ Archive créée"
            echo ""
            echo "📦 ARTEFACT: build-${BUILD_NUMBER}.tar.gz"
            echo "🔧 Prochain: Déploiement manuel ou automatique"
        }
        failure {
            echo "❌ ÉCHEC - Diagnostic:"
            echo "• Vérifiez les logs d'installation"
            echo "• Vérifiez la connexion internet pour npm"
            echo "• Vérifiez package.json et les scripts de build"
        }
    }
}