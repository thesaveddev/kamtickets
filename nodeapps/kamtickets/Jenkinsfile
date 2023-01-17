/* IMPORTANT NOTE ** This Jenkinsfile design is only for Staging Envrionment */
/* Jenkinsfile created by Abhishek Jalan */
/* Before doing any modification, please clone/backup this Jenkinsfile */

pipeline {
    agent any

    environment {
            // Slack configuration
            SLACK_COLOR_DANGER  = '#E01563'
            SLACK_COLOR_INFO    = '#6ECADC'
            SLACK_COLOR_WARNING = '#FFC300'
            SLACK_COLOR_GOOD    = '#3EB991'
            //Slack configuration
            
            HOSTNAME="stgpeopliva"
            DCR="http://registry.wikiance.com:5001/v2/"
            IMAGE_REPO_NAME="peopliva"
            CONTAINER="stgpeopliva"
            PORT="5000:5000"
            
            } // environment

    stages {
            stage ('Check Requirement') {
                steps {
                    // get user that has started the build
                    wrap([$class: 'BuildUser']) { script { env.USER_ID = "${BUILD_USER}" } }
                    // first of all, notify the team
                    slackSend (color: "${env.SLACK_COLOR_INFO}",
                    channel: '#jenkins_update',
                    message: "*STARTED:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} by ${env.USER_ID}:crossed_fingers::relaxed:\n More info at: ${env.BUILD_URL}")
                    }
            }
            stage ('Clone Repositry') { 
                steps {
                    checkout scm
                    }
            }
            stage ('Docker Image Build & Publish') {
                steps {
                    echo 'Starting to build docker image'
                    script {
                        def app = docker.build(env.IMAGE_REPO_NAME)
                        docker.withRegistry(env.DCR) {
                        app.push("v_${env.BUILD_NUMBER}")
                        app.push("latest")
                        }
                    }
                }
            }
            stage('K8S Deployment') {
                steps {

                    sh label: '', script: 'kubectl rollout restart deployment/stgpeopliva -n peopliva'
                }

            }
            stage ('Cleanup') {
                steps {
                    sh label: '', script: 'docker images -a | grep "peopliva" | awk \'{print $3}\' | xargs docker rmi -f'
                    deleteDir()
                }
            }
        }
    post {
        aborted {
                echo "Sending message to Slack"
                slackSend (color: "${env.SLACK_COLOR_WARNING}",
                channel: '#jenkins_update',
                message: "*ABORTED:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} by ${env.USER_ID}:face_with_hand_over_mouth::pray:\n More info at: ${env.BUILD_URL}")
                } // aborted

        failure {
                echo "Sending message to Slack"
                slackSend (color: "${env.SLACK_COLOR_DANGER}",
                channel: '#jenkins_update',
                message: "*FAILED:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} by ${env.USER_ID} :cry::sob::disappointed_relieved:\n More info at: ${env.BUILD_URL}")
                } // failure

        success {
                echo "Sending message to Slack"
                slackSend (color: "${env.SLACK_COLOR_GOOD}",
                channel: '#jenkins_update',
                message: "*SUCCESS:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} by ${env.USER_ID} :sunglasses::face_with_cowboy_hat:\n More info at: ${env.BUILD_URL}")
                } // success
    } //post
} //pipeline