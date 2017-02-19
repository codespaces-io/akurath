# The fork story

Akurath project is been created  as a fork of a fantastic general purpose IDE, originally wrote by Sammy Pessé, who is a CTO at gitbooks at the the time of writing this,   with great contributions by Aaron O'Mullan.  

When you fork a existing project, there has to be a compelling reason to do so. And it should be done only as a last resort. Before we decided to create a fork, we contemplated all the options as well as took certain steps as per the recommendations we received from various community members. 

## Why did we create a fork ?

The reasons why we decided to create a fork were

  * CodeboxIDE/codebox project is dead for about 2 years. There are issues un addressed, pull requests pending.
  * The original authors seem to have moved on, with [all their IP including Codebox trademark being sold](https://www.shoretel.com/news/corvisa-acquires-codebox-enhance-open-source-tools-developers) to another entity.
  * As per Aaron, one of the original contributors,  the company which bought the IP, were keen to maintain the open source project, but seem to have not followed up on their interest to do so.
  * Since Sammy and Aaron do not own the IP and are no more maintaining it, there is no way to even transfer the project maintainer ship, which is what we were contemplating initially.
  * The latest version and the main branch of the code  was in non operational state before even we started to make changes.
  * Our goal is to create a highly customized devops IDE, and not duplicate the efforts to create and maintain a general purpose IDE, when there are excellent alternatives available.


## I am a developer looking for a general purpose IDE on cloud, is this a right project for me  ?

No.Definitely not when you have much better options available. If you are looking for a general purpose IDE for developing and collaborating on cloud, we highly recommend the following tools,

  * [Cloud9 IDE](https://c9.io/)
  * [Eclipse Che](http://www.eclipse.org/che/)

Both are feature rich, complete IDE solutions with open source versions, come with active community support and are excellent choices for your general purpose IDE usage.   

## What does Akurath do then ?  

Akurath is been created as a special purpose devops IDE, which we plan to use as a front end engine as part of codespaces.io. To works with tools which allow you to write your infrastructure as a code, e.g. Chef, Puppet, Ansible, you also need to simulate infrastructure.  Codespaces.io plans to achieve this by combining the forces with docker backend which powers the containers, acting as managed nodes. And these nodes are then pre baked with the application specific utilities.   Working with this backend engine, akurath then lets you connect to and work with multiple nodes, all out of the IDE frontend.

Anyone who is looking for launching and working with  devops workspaces, codespaces.io offers the fasted way to get started, removing the barrier to provision, configure and connect the nodes in a cluster.

## Which version  of Codebox we have forked from ?

To take a project which is two years old, with  rapid advancement in the web technologies, our first big challenge was to actually getting it to run, and to a stage from where we could start making changes. After fiddling with the code, various previous version (0.8.3), we could find a version of code which became operational with a few tweaks.  And we have created a fork using this version.


## What are our immediate challenges?

Even with a previous versions, the fork that we have created works well with its core editing features and terminals. And thanks to the original authors, its simple and fantastic to use.  And those are the code functionalities we needed to  use for codespaces.io.  

In addition to using the core features, we have been also able to successfully make changes and create our own addons.

Our next big challenge is to port this code to the latest versions of node, npm  and upgrade modules, including the ace editor which is at the heart of akurath.

Another area that we need to address is adding syntax for launguages such as Puppet, Chef, Ansible, which will make it  a true devops IDE. 

## What is our long term plan ?

Based on the feedback we receive as well as the real problems we encounter during the trainings and usage  we are going to decide the next course of action. Also based on the efforts estimate to redo and maintain the legacy code, we could either continue using the forked core, or completely create something new. Having said that, we will let the community decide the next course of action.
