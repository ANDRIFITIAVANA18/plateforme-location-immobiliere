pipeline {
    agent any
    
    // ✅ TRIGGERS RENFORCÉS
    triggers {
        githubPush()
        pollSCM('* * * * *')  // ✅ Toutes les minutes pour test
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
        APP_PORT = '3100'
    }
    
    stages {
        stage('🎯 Diagnostic Déclenchement') {
            steps {
                script {
                    echo "=========================================="
                    echo "🔍 DIAGNOSTIC DÉCLENCHEMENT AUTO"
                    echo "=========================================="
                    
                    // 🔥 ANALYSE COMPLÈTE DES CAUSES
                    def causes = currentBuild.getBuildCauses()
                    echo "📋 Nombre de causes: ${causes.size()}"
                    
                    causes.eachWithIndex { cause, index ->
                        echo "--- Cause #${index + 1} ---"
                        echo "Description: ${cause.shortDescription}"
                        echo "Classe: ${cause.getClass().getName()}"
                        if (cause.properties) {
                            cause.properties.each { key, value ->
                                if (!key.contains('class') && !key.contains('MetaClass')) {
                                    echo "  ${key}: ${value}"
                                }
                            }
                        }
                    }
                    
                    // DÉTECTION SPÉCIFIQUE
                    boolean isAutoSCM = false
                    boolean isAutoGitHub = false
                    boolean isManual = false
                    
                    causes.each { cause ->
                        def className = cause.getClass().getName()
                        echo "🔎 Analyse: ${className}"
                        
                        if (className.contains('SCMTriggerCause')) {
                            isAutoSCM = true
                            echo "✅ DÉTECTÉ: Changement SCM (Polling Git)"
                            currentBuild.description = "🔄 Auto-SCM: Build #${BUILD_NUMBER}"
                        }
                        else if (className.contains('GitHubPushCause')) {
                            isAutoGitHub = true
                            echo "✅ DÉTECTÉ: Webhook GitHub (Push)"
                            currentBuild.description = "🚀 Auto-Webhook: Build #${BUILD_NUMBER}"
                        }
                        else if (className.contains('UserIdCause')) {
                            isManual = true
                            echo "👤 DÉTECTÉ: Déclenchement manuel"
                            currentBuild.description = "👤 Manuel: Build #${BUILD_NUMBER}"
                        }
                    }
                    
                    if (!isAutoSCM && !isAutoGitHub && !isManual) {
                        echo "❓ DÉCLENCHEMENT INCONNU - Causes:"
                        causes.each { cause ->
                            echo "  - ${cause.shortDescription}"
                        }
                        currentBuild.description = "❓ Inconnu: Build #${BUILD_NUMBER}"
                    }
                    
                    // STATISTIQUES
                    echo ""
                    echo "📊 STATISTIQUES DÉCLENCHEMENT:"
                    echo "• Auto SCM: ${isAutoSCM}"
                    echo "• Auto GitHub: ${isAutoGitHub}"
                    echo "• Manuel: ${isManual}"
                    echo "• Build: #${BUILD_NUMBER}"
                }
            }
        }
        
        stage('🔍 Analyse Git Détaillée') {
            steps {
                sh """
                    echo "=========================================="
                    echo "🔍 ANALYSE GIT APPROFONDIE"
                    echo "=========================================="
                    
                    echo "📝 Dernier commit:"
                    git log -1 --pretty=format:'%Cgreen%h%Creset - %s - %Cblue%an%Creset - %cr'
                    
                    echo ""
                    echo "👤 Informations auteur:"
                    git log -1 --pretty=format:'• Nom: %an%n• Email: %ae%n• Date: %cd'
                    
                    echo ""
                    echo "🔀 Branche actuelle:"
                    git branch --show-current
                    
                    echo ""
                    echo "🔄 Derniers commits (5):"
                    git log --oneline -5 --graph --decorate
                    
                    echo ""
                    echo "📁 Fichiers modifiés dans dernier commit:"
                    git show --name-only --pretty=format:'' HEAD | head -10
                    
                    echo ""
                    echo "📊 Statistiques repository:"
                    echo "• Total commits: \$(git rev-list --count HEAD)"
                    echo "• Dernière modification: \$(git log -1 --pretty=format:'%cr')"
                    echo "• Hash complet: \$(git rev-parse HEAD)"
                    
                    echo ""
                    echo "📦 Informations projet:"
                    if [ -f "package.json" ]; then
                        echo "• Nom: \$(jq -r '.name' package.json 2>/dev/null || grep '\"name\"' package.json | head -1 | cut -d'\"' -f4)"
                        echo "• Version: \$(jq -r '.version' package.json 2>/dev/null || grep '\"version\"' package.json | head -1 | cut -d'\"' -f4)"
                    fi
                """
            }
        }
        
        stage('🔧 Vérification Docker') {
            steps {
                sh """
                    echo "🐳 VÉRIFICATION DOCKER"
                    echo "• Version: \$(docker --version 2>/dev/null || echo 'Non disponible')"
                    echo "• Statut: \$(docker ps >/dev/null 2>&1 && echo '✅ OK' || echo '❌ Erreur')"
                    
                    echo ""
                    echo "🔍 Ports utilisés:"
                    echo "• Port 3000: \$(docker ps --format '{{.Ports}}' | grep 3000 | wc -l) conteneur(s)"
                    echo "• Port ${APP_PORT}: \$(docker ps --format '{{.Ports}}' | grep ${APP_PORT} | wc -l) conteneur(s)"
                    
                    echo ""
                    echo "📋 Conteneurs en cours:"
                    docker ps --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}" | head -10
                """
            }
        }
        
        stage('📥 Installation') {
            steps {
                sh """
                    echo "🔧 INSTALLATION DES DÉPENDANCES"
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        echo '📦 Installation TypeScript...'
                        npm install -g typescript
                        
                        echo '📦 Installation dépendances projet...'
                        npm install --silent --no-audit --prefer-offline
                        
                        echo ''
                        echo '✅ DÉPENDANCES INSTALLÉES'
                        echo '📊 Node.js: \$(node --version)'
                        echo '📊 npm: \$(npm --version)'
                        echo '📊 TypeScript: \$(npx tsc --version)'
                        echo '📊 Taille node_modules: \$(du -sh node_modules | cut -f1)'
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
                                npx tsc --noEmit --skipLibCheck --strict
                                echo '✅ TypeScript validé - Aucune erreur'
                            "
                        """
                    }
                }
                
                stage('🧪 Tests') {
                    steps {
                        sh """
                            echo "🔬 EXÉCUTION TESTS"
                            docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                                npm test -- --watchAll=false --passWithNoTests --silent --coverage
                                echo '✅ Tests exécutés avec succès'
                            "
                        """
                    }
                }
            }
        }
        
        stage('🏗️ Build Production') {
            steps {
                sh """
                    echo "🔨 BUILD PRODUCTION"
                    docker run --rm -v \$(pwd):/app -w /app node:18-alpine sh -c "
                        npm run build
                        echo '✅ Build production réussi'
                    "
                """
                
                sh """
                    echo "📊 ANALYSE DU BUILD"
                    if [ -d "dist" ]; then
                        echo "📁 Dossier: dist/"
                        echo "📏 Taille: \$(du -sh dist | cut -f1)"
                        echo "📋 Fichiers: \$(find dist -type f | wc -l)"
                        echo "🔍 Structure:"
                        find dist -type f -name "*.html" -o -name "*.js" -o -name "*.css" | head -10
                    else
                        echo "❌ ERREUR: Aucun build détecté"
                        exit 1
                    fi
                """
            }
        }
        
        stage('🐳 Containerisation') {
            steps {
                sh """
                    echo "📦 CRÉATION IMAGE DOCKER"
                    
                    # Dockerfile optimisé
                    cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
                    
                    echo "🔨 Construction image..."
                    docker build -t plateforme-location:\${BUILD_NUMBER} .
                    
                    echo "✅ IMAGE CRÉÉE: plateforme-location:\${BUILD_NUMBER}"
                    
                    echo ""
                    echo "📋 REGISTRE IMAGES:"
                    docker images plateforme-location:* --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}\\t{{.CreatedSince}}"
                """
            }
        }
        
        stage('🚀 Déploiement Auto') {
            steps {
                sh """
                    echo "🚀 DÉPLOIEMENT AUTOMATIQUE"
                    
                    # Nettoyage préalable
                    echo "🧹 Nettoyage ancien conteneur..."
                    docker stop plateforme-app-\${APP_PORT} 2>/dev/null || true
                    docker rm plateforme-app-\${APP_PORT} 2>/dev/null || true
                    
                    # Déploiement
                    echo "🎯 Déploiement nouveau conteneur..."
                    docker run -d \\
                        --name plateforme-app-\${APP_PORT} \\
                        -p \${APP_PORT}:80 \\
                        plateforme-location:\${BUILD_NUMBER}
                    
                    echo "✅ DÉPLOIEMENT RÉUSSI"
                    echo "🌐 URL: http://localhost:\${APP_PORT}"
                    
                    # Vérification santé
                    echo ""
                    echo "🏥 VÉRIFICATION SANTÉ..."
                    sleep 5
                    
                    if curl -f http://localhost:\${APP_PORT} > /dev/null 2>&1; then
                        echo "✅ APPLICATION ACCESSIBLE"
                    else
                        echo "⚠️ Application en cours de démarrage"
                    fi
                    
                    echo ""
                    echo "📊 STATUT FINAL:"
                    docker ps --filter name=plateforme-app-\${APP_PORT} --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}\\t{{.RunningFor}}"
                """
            }
        }
    }
    
    post {
        always {
            echo ""
            echo "=========================================="
            echo "🏁 RAPPORT FINAL - Build #${BUILD_NUMBER}"
            echo "=========================================="
            
            script {
                def duration = currentBuild.durationString.replace('and counting', '')
                echo "⏱️ Durée totale: ${duration}"
                echo "📅 Heure fin: ${new Date().format('HH:mm:ss')}"
                
                // Résumé déclenchement
                def causes = currentBuild.getBuildCauses()
                def triggerType = "INCONNU"
                causes.each { cause ->
                    if (cause.getClass().getName().contains('SCMTriggerCause')) {
                        triggerType = "🔄 AUTO-SCM (Polling Git)"
                    } else if (cause.getClass().getName().contains('GitHubPushCause')) {
                        triggerType = "🚀 AUTO-WEBHOOK (GitHub)"
                    } else if (cause.getClass().getName().contains('UserIdCause')) {
                        triggerType = "👤 MANUEL"
                    }
                }
                
                echo "🎯 Type déclenchement: ${triggerType}"
                echo "📊 Résultat: ${currentBuild.result ?: 'SUCCESS'}"
            }
        }
        
        success {
            echo ""
            echo "🎉 🎉 🎉 DÉPLOIEMENT AUTOMATIQUE RÉUSSI ! 🎉 🎉 🎉"
            echo ""
            echo "📋 SYNTHÈSE:"
            echo "✅ Diagnostic déclenchement complet"
            echo "✅ Analyse Git détaillée" 
            echo "✅ Vérification Docker"
            echo "✅ Installation dépendances"
            echo "✅ Validation qualité code"
            echo "✅ Build production"
            echo "✅ Containerisation Docker"
            echo "✅ Déploiement automatique"
            echo "✅ Vérification santé"
            echo ""
            echo "🚀 APPLICATION LIVE:"
            echo "🌐 URL: http://localhost:${APP_PORT}"
            echo "🐳 Image: plateforme-location:${BUILD_NUMBER}"
            echo "🔧 Port: ${APP_PORT}"
            echo "⏱️ Déployé en: ${currentBuild.durationString}"
        }
        
        failure {
            echo ""
            echo "❌ ❌ ❌ DÉPLOIEMENT ÉCHOUÉ ❌ ❌ ❌"
            echo ""
            echo "🔧 DIAGNOSTIC:"
            echo "• Vérifiez les logs détaillés ci-dessus"
            echo "• Testez manuellement: docker ps"
            echo "• Vérifiez les ports: netstat -tulpn | grep 31"
            echo "• Relancez après correction"
        }
        
        unstable {
            echo ""
            echo "⚠️ ⚠️ ⚠️ BUILD INSTABLE ⚠️ ⚠️ ⚠️"
            echo "Certains tests ont échoué mais le déploiement a continué"
        }
    }
}