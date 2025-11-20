pipeline {
    agent any
    
    stages {
        stage('Test NVM') {
            steps {
                echo '🧪 Test NVM sans permissions...'
                sh '''
                    echo "=== TEST NVM ==="
                    
                    # Installation NVM
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                    
                    # Charger NVM
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                    
                    # Installer Node.js
                    nvm install 20
                    nvm use 20
                    
                    echo "✅ Node: $(node --version)"
                    echo "✅ NPM: $(npm --version)"
                    echo "=== TEST RÉUSSI ==="
                '''
            }
        }
    }
}