
## Wrap-up

<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/arch2.png" alt="arch2.png" />

Congrats for making it to the end. At this point, you can say you prepared AWS to run a cloud-native application, stood up a Kubernetes cluster, deployed a microservices containerized application, configured Tetration and Stealthwatch Cloud integration with AWS and Kubernetes, and instrumented an applicaiton with Duo MFA. Not to mention you now have a steady stream of income from your Sock Shop.


### Lab Cleanup

------

We've provided a lab cleanup script that you can execute within your Cloud9 environment that will remove all AWS resources you created as part of the lab once you're done. It will help make sure you don't pay any more than you have to.

> **WARNING**
>
> This step cannot be reversed. All progress in the lab will be lost and you'll need to start again at [Getting Started](https://github.com/CiscoDevNet/cisco-application-first-security-lab/README.md#getting-started).

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Run the provided _labcleanup_ script to remove all AWS resources.

    ###### Command

    ```
    labcleanup
    ```

    ###### Output

    ```
    This script will remove all of the AWS objects created as part of this lab. This action can not be undone.

    AWS CloudFormation Stack: cisco-app-first-sec"
    AWS S3 Bucket for Flow Logs: name-of-flow-logs-bucket"
    AWS S3 Bucket for Tetration agent installer: name-of-tetration-agent-bucket"
    AWS EC2 Key Pair: cisco-app-first-sec-cloud9"

    Type 'delete' if you're sure you want to permanently delete these AWS resources: delete
    ...
    Lab cleanup will continue in the background. This Cloud9 environment will stop working very shortly.
    ```

> **TIP**
>
> In general it's easy to have your AWS resources get costly, quick. It's highly recommended that you setup billing alerts so there aren't any surprises at the end of the month.
>
> [Creating a Billing Alarm to Monitor Your Estimated AWS Charges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)

## Definitions

The following sections provide high-level descriptions of technology concepts, application environment, Cisco products and AWS services. Skip over anything that you already are familiar with.

- [Technology concepts](#technology-concepts)
- [Application and Infrastructure Tooling](#application-environment)
- [Cisco](#cisco)
- [AWS](#aws)


### Technology concepts

------

#### Version control

Version control is a system that records changes to a file or set of files over time so that you can recall specific versions later. For the examples in this book, you will use software source code as the files being version controlled, though in reality you can do this with nearly any type of file on a computer.

#### YAML

YAML (a recursive acronym for "YAML Ain't Markup Language") is a human-readable data-serialization language. It is commonly used for configuration files and in applications where data is being stored or transmitted. YAML targets many of the same communications applications as Extensible Markup Language (XML) but has a minimal syntax which intentionally differs from SGML . It uses both Python-style indentation to indicate nesting, and a more compact format that uses [] for lists and {} for maps[1] making YAML 1.2 a superset of JSON. It can be used to store delcarative configuration data for Kubernetes.

#### Microservices

Microservices are a software development technique—a variant of the service-oriented architecture architectural style that structures an application as a collection of loosely coupled services. In a microservices architecture, services are fine-grained and the protocols are lightweight.

#### Containers

A container is a standard unit of software that packages up code and all its dependencies so the application runs quickly and reliably from one computing environment to another. A Docker container image is a lightweight, standalone, executable package of software that includes everything needed to run an application: code, runtime, system tools, system libraries and settings.

#### CI/CD

A [CI](https://en.wikipedia.org/wiki/Continuous_integration)/[CD](https://en.wikipedia.org/wiki/Continuous_delivery) pipeline helps you automate steps in your software delivery process, such as initiating code builds, running automated tests, and deploying to a staging or production environment. Automated pipelines remove manual errors, provide standardized development feedback loops and enable fast product iterations.



### Application and Infrastructure Tooling

------

#### GitHub

[GitHub]([https://github.com](https://github.com/)) is a development platform inspired by the way you work. From open source to business, you can host and review code, manage projects, and build software alongside 40 million developers.

#### Docker

[Docker]([https://www.docker.com](https://www.docker.com/)) is a set of platform-as-a-service (PaaS) products that use OS-level virtualization to deliver software in packages called containers. Containers are isolated from one another and bundle their own software, libraries and configuration files; they can communicate with each other through well-defined channels. All containers are run by a single operating-system kernel and are thus more lightweight than virtual machines.

#### Kubernetes

[Kubernetes](https://kubernetes.io) (k8s) is an open-source system for automating deployment, scaling, and management of containerized applications.

It groups containers that make up an application into logical units for easy management and discovery. Kubernetes builds upon 15 years of experience of running production workloads at Google, combined with best-of-breed ideas and practices from the community.

#### Ansible

[Ansible](https://www.ansible.com/) is an open-source software provisioning, configuration management, and application-deployment tool. It runs on many Unix-like systems, and can configure both Unix-like systems as well as Microsoft Windows. It includes its own declarative language to describe system configuration.

#### Sock Shop demo application

[Sock Shop](https://microservices-demo.github.io/) simulates the user-facing part of an e-commerce website that sells socks. It is intended to aid the demonstration and testing of microservice and cloud native technologies.



### Cisco

------

#### Tetration

[Cisco Tetration](https://www.cisco.com/c/en/us/products/data-center-analytics/tetration-analytics/index.html) offers holistic workload protection for multicloud data centers by enabling a [zero-trust model](https://www.cisco.com/c/en/us/products/security/zero-trust-network.html) using segmentation. This approach allows you to identify security incidents faster, contain lateral movement, and reduce your attack surface. Tetration's infrastructure-agnostic approach supports both on-premises and public cloud workloads.

#### Stealthwatch Cloud

[Cisco Stealthwatch Cloud](https://www.cisco.com/c/en/us/products/security/stealthwatch-cloud/index.html) improves security and incident response across the distributed network, from the private network and branch office to the public cloud. This solution addresses the need for digital businesses to quickly identify threats posed by their network devices and cloud resources, and to do so with minimal management, oversight, and security manpower.

#### Duo

[Duo](https://duo.com/) provides secure access to your applications and data, no matter where your users are - on any device - from anywhere. For organizations of all sizes, Duo’s trusted access solution creates trust in users, devices and the applications they access. Reduce the risk of a data breach and ensure trusted access to sensitive data.

#### AppDynamics

[AppDynamics](https://www.appdynamics.com/) is an application performance management and IT operations analytics solution. The application performance management (APM) solution baselines, monitors and reports on the performance of all transactions that flow through your app. It was built for production environments, which provides an agile approach when it comes to capturing the details of transactions. Automatically determine normal performance and stop false alarms with dynamic baselining for end-to-end response time.


### AWS

------

#### Cloud9

[AWS Cloud9](https://aws.amazon.com/cloud9/) is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. It includes a code editor, debugger, and terminal. Cloud9 comes prepackaged with essential tools for popular programming languages, including JavaScript, Python, PHP, and more, so you don’t need to install files or configure your development machine to start new projects. Since your Cloud9 IDE is cloud-based, you can work on your projects from your office, home, or anywhere using an internet-connected machine. Cloud9 also provides a seamless experience for developing serverless applications enabling you to easily define resources, debug, and switch between local and remote execution of serverless applications. With Cloud9, you can quickly share your development environment with your team, enabling you to pair program and track each other's inputs in real time.

#### EC2

[Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2) is a web service that provides secure, resizable compute capacity in the cloud. It is designed to make web-scale cloud computing easier for developers.

Amazon EC2’s simple web service interface allows you to obtain and configure capacity with minimal friction. It provides you with complete control of your computing resources and lets you run on Amazon’s proven computing environment. Amazon EC2 reduces the time required to obtain and boot new server instances to minutes, allowing you to quickly scale capacity, both up and down, as your computing requirements change. Amazon EC2 changes the economics of computing by allowing you to pay only for capacity that you actually use. Amazon EC2 provides developers the tools to build failure resilient applications and isolate them from common failure scenarios.

#### CloudFormation

[AWS CloudFormation](https://aws.amazon.com/cloudformation/) provides a common language for you to describe and provision all the infrastructure resources in your cloud environment. CloudFormation allows you to use programming languages or a simple text file to model and provision, in an automated and secure manner, all the resources needed for your applications across all regions and accounts. This gives you a single source of truth for your AWS resources.

AWS CloudFormation is available at no additional charge, and you pay only for the AWS resources needed to run your applications.

#### EKS

[Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS) makes it easy to deploy, manage, and scale containerized applications using Kubernetes on AWS.

Amazon EKS runs the Kubernetes management infrastructure for you across multiple AWS availability zones to eliminate a single point of failure. Amazon EKS is certified Kubernetes conformant so you can use existing tooling and plugins from partners and the Kubernetes community. Applications running on any standard Kubernetes environment are fully compatible and can be easily migrated to Amazon EKS.

Amazon EKS supports both Windows Containers and Linux Containers to enable all your use cases and workloads.

#### CloudWatch

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) is a monitoring and observability service built for DevOps engineers, developers, site reliability engineers (SREs), and IT managers. CloudWatch provides you with data and actionable insights to monitor your applications, respond to system-wide performance changes, optimize resource utilization, and get a unified view of operational health. CloudWatch collects monitoring and operational data in the form of logs, metrics, and events, providing you with a unified view of AWS resources, applications, and services that run on AWS and on-premises servers. You can use CloudWatch to detect anomalous behavior in your environments, set alarms, visualize logs and metrics side by side, take automated actions, troubleshoot issues, and discover insights to keep your applications
running smoothly.

#### IAM

[AWS Identity and Access Management](https://aws.amazon.com/iam/) (IAM) enables you to manage access to AWS services and resources securely. Using IAM, you can create and manage AWS users and groups, and use permissions to allow and deny their access to AWS resources.

IAM is a feature of your AWS account offered at no additional charge. You will be charged only for use of other AWS services by your users.

#### VPC

[Amazon Virtual Private Cloud](https://aws.amazon.com/vpc/) (Amazon VPC) lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define. You have complete control over your virtual networking environment, including selection of your own IP address range, creation of subnets, and configuration of route tables and network gateways. You can use both IPv4 and IPv6 in your VPC for secure and easy access to resources and applications.

You can easily customize the network configuration for your Amazon VPC. For example, you can create a public-facing subnet for your web servers that has access to the Internet, and place your backend systems such as databases or application servers in a private-facing subnet with no Internet access. You can leverage multiple layers of security, including security groups and network access control lists, to help control access to Amazon EC2 instances in each subnet.

#### ECR

[Amazon Elastic Container Registry](https://aws.amazon.com/ecr/) (ECR) is a fully-managed Docker container registry that makes it easy for developers to store, manage, and deploy Docker container images. Amazon ECR eliminates the need to operate your own container repositories or worry about scaling the underlying infrastructure. Amazon ECR hosts your images in a highly available and scalable architecture, allowing you to reliably deploy containers for your applications. Integration with AWS Identity and Access Management (IAM) provides resource-level control of each repository. With Amazon ECR, there are no upfront fees or commitments. You pay only for the amount of data you store in your repositories and data transferred to the Internet.

### Continue the learning

------

There's so many cool things to discover in this space. Find some time to explore on your own.


#### Resources

##### Application-First Security

- Cisco.com - www.cisco.com/go/appsec
- DevNet - https://developer.cisco.com/application-first-security/

##### Tetration

- Sales connect - https://salesconnect.cisco.com/#/program/PAGE-15164
- Workload protection E-book- https://www.cisco.com/c/m/en_us/products/data-center-analytics/tetration-analytics/cloud-workload-prot-ebook.html

##### Stealthwatch Cloud

- SWC: https://salesconnect.cisco.com/#/program/PAGE-10915
  - Watch the 16-min demo “SWC and Tetration Joint Workload Protection Demo”
- SWC Resource Center: http://go2.cisco.com/swc-science

##### AppSec and DevSecOps Recommended Reading and Viewing

- [The Emergent Cloud Security Toolchain for CICD - James ](https://www.youtube.com/watch?v=pBy4iUDZpNA)[Wickett](https://www.youtube.com/watch?v=pBy4iUDZpNA)
- [DevOpsSec – Jim Bird](https://www.oreilly.com/library/view/devopssec/9781491971413/)
- [Agile Application Security - Laura Bell, Michael Brunton-Spall, Rich Smith, Jim Bird](https://www.amazon.com/Agile-Application-Security-Enabling-Continuous/dp/1491938846)
- [NIST.SP.800-190 - Application Container Security Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-190.pdf)



#### Setup personal tools

It's handy to have the tools you've used during this lab at your finger tips on your own host as well as your own public cloud infrastructure to learn and explore with.

Version control systems

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

- [GitHub Desktop](https://desktop.github.com/)
- [Fork](https://git-fork.com/)

- [GitHub](https://github.com)

Source Code Editing

- [Vim](https://www.vim.org)

- [Atom](https://atom.io/)

Containers

- [Docker for Desktop](https://www.docker.com/products/docker-desktop) (bundles Kubernetes)

Programming languages

- [Python](https://www.python.org)
- [Node.js](https://nodejs.org)
- [Go](https://golang.org)

AWS

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- [eksctl](https://docs.aws.amazon.com/en_pv/eks/latest/userguide/getting-started-eksctl.html)
