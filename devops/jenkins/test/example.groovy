pipelineJob('NodeJS Pipeline') {
    definition {
        cpsScm {
            scm {
                git {
                    branch('master')
                    remote {
                        github('ajohnston1219/space-teams')
                    }
                }
            }
            scriptPath('auth/Jenkinsfile')
            lightweight(true)
        }
    }
    triggers {
        scm('H/2 * * * *')
    }
}
