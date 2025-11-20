pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-v /var/jenkins_home/workspace/plateforme-location-immobiliere:/app'
            reuseNode true
        }
    }
    
    triggers {
        pollSCM('*/1 * * * *')
    }
    
    environment {
        NODE_ENV = 'production'
    }
    
    stages {
        stage('Vérification Environnement') {
            steps {
                echo '🔧 Vérification des outils...'
                sh '''
                    echo "✅ Node.js: $(node --version)"
                    echo "✅ npm: $(npm --version)"
                    echo "📁 Répertoire: $(pwd)"
                '''
            }
        }
        
        stage('Checkout & Analyse') {
            steps {
                checkout scm
                echo '📦 Code récupéré depuis Git'
                
                script {
                    echo '🔍 Analyse du projet...'
                    sh '''
                        echo "📊 INFORMATIONS:"
                        echo "🆔 Build: ${BUILD_NUMBER}"
                        echo "📅 Date: $(date)"
                        echo "🌐 Dépôt: $(git config --get remote.origin.url)"
                        echo "📝 Commit: $(git log -1 --pretty=format:'%h - %s')"
                    '''
                }
            }
        }
        
        stage('Installation Dépendances') {
            steps {
                echo '📥 Installation des dépendances...'
                sh '''
                    echo "🔧 Installation avec npm ci..."
                    npm ci
                    echo "✅ Dépendances installées"
                    echo "📦 Taille: $(du -sh node_modules | cut -f1)"
                '''
            }
        }
        
        stage('Validation TypeScript') {
            steps {
                echo '🔍 Validation TypeScript...'
                sh '''
                    echo "🔧 Compilation TypeScript..."
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
                    npm run build
                    
                    if [ -d "dist" ]; then
                        echo "✅ Build réussi"
                        echo "📦 Taille: $(du -sh dist | cut -f1)"
                        echo "📁 Fichiers: $(find dist -type f | wc -l)"
                    else
                        echo "❌ Build échoué"
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
                    echo "🎉 PIPELINE RÉUSSIE"
                    echo "=================="
                    echo "🆔 Build: ${BUILD_NUMBER}"
                    echo "📅 Date: $(date)"
                    echo "🔧 Node.js: $(node --version)"
                    echo "📦 Build: $(du -sh dist | cut -f1)"
                    echo "✅ Toutes les validations passées"
                '''
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
        }
        success {
            echo '🎉 SUCCÈS : Pipeline complète réussie !'
        }
        failure {
            echo '❌ ÉCHEC : Vérifiez les erreurs'
        }
    }
}