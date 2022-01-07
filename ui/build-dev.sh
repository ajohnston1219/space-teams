cp .dev.env .env
echo "================ BUILDING DEV VERSION ================="
docker-compose -f docker-compose.yml build
