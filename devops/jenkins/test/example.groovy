job('NodeJS Example') {
    scm {
        git('git://github.com/ajohnston1219/space-teams.git') { node ->
            node / gitConfigName('Jenkins')
            node / gitConfigEmail('ajohnston1219@gmail.com')
        }
    }
    triggers {
        scm('H/5 * * * * ')
    }
    wrappers {
        nodejs('nodejs')
    }
    steps {
        dockerBuildAndPublish {
            repositoryName('ajohnston1219/example-app')
            buildContext('auth')
            tag('${GIT_REVISION,length=9}')
            registryCredentials('dockerhub')
            forcePull(false)
            forceTag(false)
            createFingerprints(false)
            skipDecorate()
        }
    }
}
