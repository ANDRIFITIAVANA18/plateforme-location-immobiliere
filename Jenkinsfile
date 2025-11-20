pipeline {
    agent any
    
    stages {
        stage('Test Simple') {
            steps {
                echo '🧪 Test simple sans NVM...'
                sh '''
                    echo "=== TEST SIMPLE ==="
                    echo "Répertoire: $(pwd)"
                    echo "Node.js test..."
                    node --version || echo "Node.js pas encore installé"
                    echo "=== TEST TERMINÉ ==="
                '''
            }
        }
        
        stage('Installation NVM Simple') {
            steps {
                echo '📥 Installation NVM...'
                sh '''
                    echo "=== INSTALLATION NVM SIMPLE ==="
                    # Installation NVM
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                    
                    # Charger NVM simplement
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    
                    # Installer Node.js
                    nvm install 20
                    nvm use 20
                    
                    echo "✅ Résultat: Node $(node --version)"
                    echo "=== INSTALLATION TERMINÉE ==="
                '''
            }
        }
    }
}