# akurath
> "Devops IDE on Cloud, a Frontend engine used in Codespaces"

Akurath is a devops IDE frontend for codespaces.io.


Akurath is built with web technologies: `node.js`, `javascript`, `html` and `less`. The IDE possesses a very modular and extensible architecture, that allows you to build your own features with through add-ons. Akurath is the first open and modular IDE created specially for writing Infrastructure as a Code with tools such as Chef, Puppet, Ansible, docker etc.

The project is open source under the [Apache 2.0](https://github.com/codespaces-io/akurath/blob/master/LICENSE) license.

### CodeboxIDE and Akurath, a fork story

Akurath project is been created  as a fork of a fantastic general purpose IDE, originally wrote by Sammy Pessé, who is a CTO at gitbooks at the the time of writing this,   with great contributions by Aaron O'Mullan. [Read the story](FORK.md) about why we forked it and in which directions are we going.  

## How to install and run Akurath

#### Install from NPM

Akurath can be installed as a Node package and use programatically or from the command line.

Install Akurath globally using NPM:
```
$ npm install -g akurath
```

And start the IDE from the command line:
```
$ akurath run ./myworkspace --open
```

Use this command to run and open Akurath IDE. By default, Akurath uses GIT to identify you, you can use the option ```--email=john.doe@gmail.com``` to define the email you want to use during GIT operations.

Others command line options are available and can be list with: ```akurath --help```.

#### Need help?

The IDE's documentation can be found at [Akurath Wiki](https://github.com/codespaces-io/akurath/wiki). Feel free to ask any questions or signal problems by adding issues.

## Helping Akurath

**I want to help with the code:** Akurath accepts pull-requests, please see the [Contributing to Akurath](https://github.com/codespaces-io/akurath/blob/master/CONTRIBUTING.md) guide for information on contributing to this project. And don't forget to add your contact informations on the AUTHORS list.

**I found a bug:** File it as an [issue](https://github.com/codespaces-io/akurath/issues) and please describe as much as possible the bug and the context.

**I have a new suggestion:** For feature requests please first check [the issues list](https://github.com/codespaces-io/akurath/issues) to see if it's already there. If not, feel free to file it as an issue and to define the label **enhancement**.

## Contact info

* **Website:** [www.codespaces.io](https://www.codespaces.io)
