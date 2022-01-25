pipelineJob('Auth Pipeline') {
    definition {
        cpsScm {
            scm {
                git {
                    branch('master')
                    remote {
                        url('git@github.tamu.edu:SpaceCRAFT/space-teams-backend')
												credentials('github')
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
