set -a
source ./docker-compose/envs/common-blockscout.env
set +a
export DATABASE_URL=postgresql://postgres:@localhost:7432/blockscout?ssl=false
mix do deps.get, local.rebar, deps.compile, compile && cd ./apps/block_scout_web/assets && npm install && cd ../../../