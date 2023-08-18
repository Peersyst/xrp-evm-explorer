set -a
source ./docker-compose/envs/common-blockscout.env
set +a
export DATABASE_URL=postgresql://postgres:@localhost:7432/blockscout?ssl=false
./init-db.sh
mix phx.server