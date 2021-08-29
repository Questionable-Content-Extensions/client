FROM ubuntu:focal

# Set a directory for the app
WORKDIR /app

# Update APT
RUN apt-get update

# Install curl
RUN apt-get install -y curl

# Install node.js v16
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Install build-essentials (required for certain npm packages)
RUN apt-get install -y build-essential

# Install grunt, jsonlint and jshint
RUN npm install -g grunt

# Install latest stable Ruby
RUN curl -sSL https://rvm.io/mpapis.asc | gpg --import
RUN curl -sSL https://rvm.io/pkuczynski.asc | gpg --import
RUN curl -sSL https://get.rvm.io | bash -s stable --ruby

# Update Gem
RUN bash -c "source /etc/profile.d/rvm.sh && gem update --system"

# Install compass
RUN bash -c "source /etc/profile.d/rvm.sh && gem install compass"

# Copy over package*.json files
COPY package*.json ./

# Install our NPM dependencies
RUN npm install

# Preserve package-lock.json
RUN cp package-lock.json package-lock.json.new

# Copy all the files to the container
COPY . .

# Restore package-lock.json
RUN cp package-lock.json.new package-lock.json

# Finally, run the build script on run
ENV grunt_command default
CMD ["bash", "-c", "source /etc/profile.d/rvm.sh && grunt ${grunt_command}"]
