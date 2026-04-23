pipeline {
    agent any

    environment {
        APP_NAME = 'my-app'
        DOCKER_IMAGE = "myusername/${APP_NAME}"
    }

    stages {

        stage('Build') {
            steps {
                echo '🔨 Building the application...'
                sh 'npm install'       // or: mvn package, gradle build, etc.
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test -- --watchAll=false'
            }
            post {
                always {
                    junit 'test-results/**/*.xml'   // publish test reports
                }
            }
        }

        stage('Lint & Code Quality') {
            steps {
                echo '🔍 Running lint checks...'
                sh 'npm run lint'
            }
        }

        stage('Docker Build & Push') {
            steps {
                echo '🐳 Building Docker image...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                        docker push ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo '🚀 Deploying to staging server...'
                sh """
                    ssh -o StrictHostKeyChecking=no user@staging-server \\
                    'docker pull ${DOCKER_IMAGE}:latest && \\
                     docker stop my-app || true && \\
                     docker run -d --name my-app -p 80:3000 ${DOCKER_IMAGE}:latest'
                """
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'    // Only deploy to prod from main branch
            }
            input {
                message "Deploy to production?"
                ok "Yes, deploy it!"
            }
            steps {
                echo '🌐 Deploying to PRODUCTION...'
                sh """
                    ssh user@production-server \\
                    'docker pull ${DOCKER_IMAGE}:latest && \\
                     docker stop my-app || true && \\
                     docker run -d --name my-app -p 80:3000 ${DOCKER_IMAGE}:latest'
                """
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded!'
            slackSend channel: '#deployments', message: "✅ ${APP_NAME} deployed successfully!"
        }
        failure {
            echo '❌ Pipeline failed!'
            slackSend channel: '#deployments', message: "❌ ${APP_NAME} pipeline FAILED! Check Jenkins."
            mail to: 'team@yourcompany.com',
                 subject: "Build Failed: ${env.JOB_NAME}",
                 body: "Check console: ${env.BUILD_URL}"
        }
    }
}
