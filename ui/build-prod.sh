cp .prod.env .env
echo "============== BUILDING PRODUCTION VERSION ==============="
docker-compose -f docker-compose-prod.yml build
