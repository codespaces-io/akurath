# akurath
> "Open source devops IDE on cloud, a Frontend engine used in Codespaces"

Akurath is a complete and modular cloud IDE. 


Akurath is built with web technologies: `node.js`, `javascript`, `html` and `less`. The IDE possesses a very modular and extensible architecture, that allows you to build your own features with through add-ons. Akurath is the first open and modular IDE capable of running both on the Desktop and in the cloud (with offline support).

The project is open source under the [Apache 2.0](https://github.com/codespaces-io/akurath/blob/master/LICENSE) license.



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

Others comand line options are available and can be list with: ```akurath --help```. For deeper configuration, take a look at the documentation about [environment variables](http://help.akurath.io/ide/env.html).

#### Need help?

The IDE's documentation can be found at [help.akurath.io](http://help.akurath.io). Feel free to ask any questions or signal problems by adding issues.

## Helping Akurath

**I want to help with the code:** Akurath accepts pull-requests, please see the [Contributing to Akurath](https://github.com/codespaces-io/akurath/blob/master/CONTRIBUTING.md) guide for information on contributing to this project. And don't forget to add your contact informations on the AUTHORS list.

**I found a bug:** File it as an [issue](https://github.com/codespaces-io/akurath/issues) and please describe as much as possible the bug and the context.

**I have a new suggestion:** For feature requests please first check [the issues list](https://github.com/codespaces-io/akurath/issues) to see if it's already there. If not, feel free to file it as an issue and to define the label **enhancement**.

## Contact info

* **Website:** [www.codespaces.io](https://www.codespaces.io)

