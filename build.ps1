New-Item dist -ItemType Directory -Force

docker build . -t qcext-client
docker run --mount "type=bind,source=${PWD}\\dist,target=/app/dist" qcext-client

Move-Item .\dist\package-lock.json . -Force
