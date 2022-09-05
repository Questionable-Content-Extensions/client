# Create the `dist` directory
New-Item dist -ItemType Directory -Force

# Build using the Dockerfile
docker build . -t qcext-client

# Run our build command inside the Docker container
docker run --mount "type=bind,source=${PWD}\\dist,target=/app/dist" -e grunt_command=dist qcext-client

# Make sure our local package-lock.json is up to date
Move-Item .\dist\package-lock.json . -Force
