pipeline {
    agent any
    
    triggers {
        pollSCM('*/1 * * * *')
    }
    
    environment {
        NODE_ENV = 'production'
        NVM_DIR = '/tmp/nvm'
    }
    
    stages {
        stage('Installation Node.js avec NVM') {
            steps {
                echo '🔧 Installation de Node.js sans permissions...'
                sh '''
                    echo "=== INSTALLATION NODE.JS AVEC NVM ==="
                    
                    # Vérifier si Node.js est déjà disponible
                    if command -v node >/dev/null 2>&1; then
                        echo "✅ Node.js déjà installé: $(node --version)"
                    else
                        echo "📥 Installation de Node.js avec NVM..."
                        
                        # Télécharger et installer NVM sans permissions
                        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                        
                        # Charger NVM
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                        
                        # Installer Node.js avec NVM
                        nvm install 20
                        nvm use 20
                        
                        echo "✅ Node.js installé: $(node --version)"
                        echo "✅ npm installé: $(npm --version)"
                    fi
                '''
            }
        }
        
        stage('Vérification Outils') {
            steps {
                echo '🔍 Vérification des outils...'
                sh '''
                    echo "=== VÉRIFICATION ==="
                    node --version || echo "❌ Node.js non disponible"
                    npm --version || echo "❌ npm non disponible"
                    echo "📁 Répertoire: $(pwd)"
                    echo "=== VÉRIFICATION TERMINÉE ==="
                '''
            }
        }
        
        stage('Checkout Code') {
            steps {
                checkout scm
                echo '📦 Code récupéré depuis Git'
            }
        }
        
        stage('Installation Dépendances') {
            steps {
                echo '📥 Installation des dépendances...'
                sh '''
                    echo "🔧 Installation avec npm..."
                    
                    # Charger NVM à nouveau pour être sûr
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                    nvm use 20
                    
                    npm ci
                    echo "✅ Dépendances installées"
                    echo "📦 Taille: $(du -sh node_modules 2>/dev/null | cut -f1 || echo 'inconnue')"
                '''
            }
        }
        
        stage('Validation TypeScript') {
            steps {
                echo '🔍 Validation TypeScript...'
                sh '''
                    echo "🔧 Compilation TypeScript..."
                    
                    # Charger NVM
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                    nvm use 20
                    
                    npx tsc --noEmit --skipLibCheck
                    echo "✅ Aucune erreur TypeScript"
                '''
            }
        }
        
        stage('Build Production') {
            steps {
                echo '🏗️  Construction...'
                sh '''
                    echo "🔨 Build avec Vite..."
                    
                    # Charger NVM
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                    nvm use 20
                    
                    npm run build
                    
                    if [ -d "dist" ]; then
                        echo "✅ Build réussi"
                        echo "📦 Taille: $(du -sh dist | cut -f1)"
                        echo "📁 Fichiers: $(find dist -type f | wc -l)"
                    else
                        echo "❌ Build échoué - dossier dist manquant"
                        exit 1
                    fi
                '''
            }
        }
        
        stage('Rapport Final') {
            steps {
                echo '📊 Rapport de qualité...'
                sh '''
                    echo " "
                    echo "🎉 SUCCÈS - PIPELINE COMPLÈTE"
                    echo "=============================="
                    echo "🆔 Build: ${BUILD_NUMBER}"
                    echo "📅 Date: $(date)"
                    echo "🔧 Node.js: $(node --version)"
                    echo "📦 Build: $(du -sh dist | cut -f1)"
                    echo "📝 Commit: $(git log -1 --pretty=format:'%h - %s')"
                    echo " "
                    echo "✅ Node.js installé avec NVM"
                    echo "✅ Dépendances résolues"
                    echo "✅ TypeScript validé"
                    echo "✅ Build production réussi"
                    echo "🚀 Application prête pour le déploiement"
                '''
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline terminé'
            archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
        }
        success {
            echo '🎉 SUCCÈS : Pipeline de qualité complète !'
        }
        failure {
            echo '❌ ÉCHEC : Vérifiez les erreurs ci-dessus'
        }
    }
}