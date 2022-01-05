FROM alpine AS intermediate
WORKDIR /pgadmin4

COPY ./servers.json servers.json
COPY ./access.log access.log
RUN chmod 700 servers.json
RUN chmod 700 access.log

FROM dpage/pgadmin4
WORKDIR /pgadmin4

COPY --from=intermediate --chown=pgadmin:pgadmin /pgadmin4/servers.json servers.json
COPY --from=intermediate --chown=pgadmin:pgadmin /pgadmin4/access.log access.log

ENV PGADMIN_DEFAULT_EMAIL=postgres@postgres.com
ENV PGADMIN_DEFAULT_PASSWORD=postgres
ENV PGADMIN_CONFIG_CONSOLE_LOG_LEVEL=40
ENV GUNICORN_ACCESS_LOGFILE=/pgadmin4/access.log
