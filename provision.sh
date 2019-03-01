#!/bin/bash

# Update APT
sudo apt-get update

# Install curl
sudo apt-get install -y curl

# Install node.js v6
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install build-essentials (required for certain npm packages)
sudo apt-get install -y build-essential

# Install grunt, jsonlint and jshint
sudo npm install -g grunt

# Install latest stable Ruby
curl -sSL https://get.rvm.io | bash -s stable --ruby
source /home/vagrant/.rvm/scripts/rvm

# Update Gem
gem update --system

# Install compass
gem install compass

# Install our NPM dependencies
cd /vagrant
npm install

# Finally, run the build script to check that we're good
grunt build

# Set the shell to always start in /vagrant
echo "cd /vagrant" >> ~/.bashrc
