FROM debian:bookworm AS nodejs

WORKDIR /app

# Download and import the Nodesource GPG key
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg && \
    apt-get clean
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | \
    gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

# Make sure we have npm and nodejs
ENV NODE_MAJOR=18
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update && \
    apt-get install nodejs -y && \
    apt-get clean

# Next, let's run npm install
COPY package.json package-lock.json ./
RUN npm install
# Update browserslist
#RUN npx browserslist@latest --update-db

# Finally, let's copy over the rest of the stuff
COPY . ./

# Run npm run
ENTRYPOINT ["/usr/bin/npm", "run"]
