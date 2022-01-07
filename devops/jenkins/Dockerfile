FROM jenkins/jenkins:lts
USER root

RUN curl https://get.docker.com/ > dockerinstall && chmod 777 dockerinstall && ./dockerinstall
RUN apt install -y docker-compose
