pipeline {
    agent any
    
    stages {
        stage('Installation Node.js') {
            steps {
                sh '''
                    # Installation NVM
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                    
                    # Configuration environnement
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                    
                    # Installation Node.js
                    nvm install 18 --lts
                    nvm use 18
                    
                    # Vérification
                    node --version
                    npm --version
                '''
            }
        }
    }
}