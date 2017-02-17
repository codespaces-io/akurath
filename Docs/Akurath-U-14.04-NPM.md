# How to Install and Use Akurath on Ubuntu 14.04

## Introduction

###  Akurath

> "Open source devops IDE on cloud, a Frontend engine used in Codespaces"

Akurath is a complete and modular cloud IDE.


Akurath is built with web technologies: `node.js`, `javascript`, `html` and `less`. The IDE possesses a very modular and extensible architecture, that allows you to build your own features with through add-ons. Akurath is the first open and modular IDE capable of running both on the Desktop and in the cloud (with offline support).

## Prerequisites

These are the prerequisites of Akurath IDE:
* 64-bit Ubuntu 14.04
* Non-root user with sudo privileges
* Git and other libraries (Covered in this tutorial)
* NodeJS (Covered in this tutorial)

All the commands in this tutorial should be run as a non-root user or as a root user. Priviliged commands are preceded by sudo.

## Step 1 - Install Dependencies

NodeJS needs some libraries to be installed. Let us install them. But before that update the package database.

```
sudo apt-get update
```

Install the dependencies.

```
sudo apt-get install -y make g++ python git curl
```

## Step 2 - Install NodeJS

As mentioned earlier, Akurath is a Node based application. So Install NodeJS.

```
curl -sL https://deb.nodesource.com/setup | sudo bash
sudo apt-get install -y nodejs
```

## Step 3 - Install Akurath

Now we are going to install the latest and greatest version of Akurath. Run the following command one after the other.

```
sudo npm -g install node-gyp akurath

cd /usr/lib/node_modules/akurath/node_modules/shux/node_modules/pty.js

sudo make clean

sudo make

cd ~
```

## Step 4 - Run Akurath

To start Akurath IDE, all you need to do is to run

```
sudo akurath run
```

After running that command, you will see that Akurath is running on localhost with port 8000.

```
Akurath is running at http://localhost:8000
```

Akurath console is accessible on your machine's IP with port 8000. Just visit the IP on your browser to see Akurath in action.

![email](images/email.jpg)

Enter your e-mail and you are ready to use Akurath IDE!

![landingpage](images/landing.jpg)
