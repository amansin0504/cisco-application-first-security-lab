<!-- Copyright (c) 2020 Cisco and/or its affiliates.
   -
   - Licensed under the Apache License, Version 2.0 (the "License");
   - you may not use this file except in compliance with the License.
   - You may obtain a copy of the License at
   -
   -     http://www.apache.org/licenses/LICENSE-2.0
   -
   - Unless required by applicable law or agreed to in writing, software
   - distributed under the License is distributed on an "AS IS" BASIS,
   - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   - See the License for the specific language governing permissions and
   - limitations under the License. -->

<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/cisco-logo-transparent-20191112121340271.png" alt="Image result for cisco logo" style="zoom:10%;" />

<!--

WARNING: This file is intended to be used within Cloud9 in preview mode for the lab guide in an HTML format. Right-click on lab/docs/lab-guide.html (not lab-guide.md) in the file explorer and select Preview.

-->

# Cisco Application-First Security Lab

You're about to start on a doozy of lab that covers a lot of ground in a short time. Buckle in and get ready to secure a cloud-native application and public cloud infrastructure using Cisco Products: Tetration, Stealthwatch Cloud, and Duo. You'll stage the infrastructure, modify and deploy the application, instrument the security products into the environment. In the process, you'll get your hands dirty with products and technologies including git, Kubernetes, GitHub, Docker, AWS and others.



<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/arch2.png" alt="arch2.png" />



> **TIP**
>
> You can expand the lab guide into a dedicated browser tab by clicking on arrow icon in the top right corner of the viewer pane in the Cloud9 IDE.
>
> <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191023063905369.png" alt="image-20191023063905369" style="zoom:33%;" />



## Overview of Cisco Application-First Security

[Cisco's Application-First Security](https://www.cisco.com/c/en/us/solutions/security/application-first-security/index.html) solution enables you to gain visibility into application behavior and increase the effectiveness of security controls by combining capabilities of best-in-class products including Tetration, Stealthwatch Cloud, Duo Beyond and AppDynamics. Key features include:

* _Closer to the application_: Security closer to your application gives you insight and context of your applications so you can easily make intelligent decisions to protect them.
* _Continuous as application changes_: Application-First Security follows your applications as it changes and moves to ensure continuous protections in your digital business.
* _Adaptive to application dependencies_: Security designed to adapt to your application so it can give you granular control and reduce risk by detecting and preventing threats based on overall understanding of your environment.



<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/afs.png" alt="afs.png" />



## AWS Public Cloud

This lab uses AWS to host the workloads and applications and takes advantage of many of their native services. This diagram shows how the different components are logically connected.

<img class="no-decoration" src="https://raw.githubusercontent.com/amansin0504/cisco-application-first-security-lab/main/docs/assets/AppFirst-Lab-Diagram.png" alt="image-AppFirst_Lab_Diagram" style="zoom:50%;" />


## Lab Content

* [Prepare infrastructure and application](#prepare-infrastructure-and-application)
* [Implement security](#implement-security)
* [Wrap-Up](#wrap-up)
* [Definitions](#definitions)


## Prepare infrastructure and application

This section of the lab will have you prepare the public cloud infrastructure and deploy a microservice cloud-native application. Throughout the steps, you'll be laying the groundwork to implement security in a later sections.

* [Management interfaces](#management-interfaces)
* [Access the lab environment](#access-the-lab-environment)
* [Create a Kuberenetes cluster](#create-a-kuberenetes-cluster)
* [Deploy applications on Kubernetes](#deploy-applications-on-kubernetes)



> **NOTE**
>
> As you work through the lab you will come across sections that have _Commands_ and _Output_. The _Output_ that is shown can be different than what you will see because some values are randomly generated or specific to your lab pod. Use it as a guidepost and not a definitive view of your output. Also, if no _Output_ is shown after a _Command_ then you should not expect any output from the command.



### Management interfaces

------

There are three management interfaces that you will need to access to complete this lab. You'll be provided with links throughout the lab that will direct you to the following interfaces:

* [AWS Management Console - https://${AWS_REGION}.console.aws.amazon.com/](https://${AWS_REGION}.console.aws.amazon.com/)
* [Tetration - https://tet-pov-rtp1.cpoc.co/](https://tet-pov-rtp1.cpoc.co/)
* [Stealthwatch Cloud - https://cisco-${POD_NAME}.obsrvbl.com](https://cisco-${POD_NAME}.obsrvbl.com)
* [Duo - https://admin.duosecurity.com/](https://admin.duosecurity.com/)



### Credentials

------

The details below will be used for credentials unless you decide to use different passwords than what's recommended. In the relevant sections, you'll be instructed to set passwords where necessary.

| Product                                                     | Username / Email            | Password                      |
| ----------------------------------------------------------- | --------------------------- | ----------------------------- |
| [AWS](https://${AWS_REGION}.console.aws.amazon.com/)        | ${POD_NAME}                 | ${POD_PASSWORD}               |
| [Tetration](https://tet-pov-rtp1.cpoc.co/)                  | ${DEVNET_EMAIL_ADDRESS}     | ${POD_PASSWORD} (recommended) |
| [Stealthwatch Cloud](https://cisco-${POD_NAME}.obsrvbl.com) | ${DEVNET_EMAIL_ADDRESS}     | ${POD_PASSWORD} (recommended) |
| [Duo](https://admin.duosecurity.com/)                       | ${POD_NAME}@cisco.com       | ${POD_PASSWORD}               |


### Access the lab environment

------

This section will help you do the following:

1. Get familiar with Cloud9 IDE



#### Overview

The lab is intended to be driven from the Cloud9 environment that will already setup for you. Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. It includes a code editor, debugger, and terminal. It's not necessary for running applications in the public cloud, but it provides a good interface for running labs.

> **TIP**
>
> You can expand this lab guide into a dedicated browser tab by clicking on arrow icon in the top right corner of the viewer pane in the Cloud9 IDE.
>
> <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191023063905369.png" alt="image-20191023063905369" style="zoom:33%;" />



#### Steps

- [Explore the lab IDE](#explore-the-lab-ide)



##### Explore the lab IDE

Most of the lab will be driven from this AWS Cloud9 environment. Let's get familiar with this interface.

<img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191016154841243.png" alt="image-20191016154841243" style="zoom: 25%;" />

1. Make sure the _lab_ directory is expanded in the file tree in the left pane. These are the files you'll use throughout the lab.

2. Double-click on any file in the file tree. It will open in a tab in the top left editor pane.

3. Right-click on a file in the file tree. You can use the menu to manage the files.

4. Click within a tab in the lower right pane to access a terminal to the Cloud9 EC2 instance where the files in the left pane are contained. Type _find_ in the terminal and press enter. You'll see a listing of files in your current directory that corrisponds to the file tree.

    ###### Command

    ```
    find
    ```

    ###### Output

    ```
    .
    ./lab
    ./lab/swc
    ...
    ./.c9/metadata/preview-/lab/docs
    ./.c9/out_of_memory
    ```

### Create a Kuberenetes cluster

------

<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/arch2-aws-k8s.png" alt="arch2.png" />

This section will help you do the following:

1. Understand tagging of VPC resources in AWS
2. Understand AWS IAM, User policies and AWS CLI profile
3. Create an EKS Kubernetes cluster using eksctl
4. Basics of kubectl

#### Overview

Kubernetes is a portable, extensible, open-source platform for managing containerized workloads and services, that facilitates both declarative configuration and automation. It provides you with a framework to run distributed systems resiliently. It takes care of scaling and failover for your application, provides deployment patterns, and more.

Kubernetes targets the management of elastic applications that consist of multiple microservices communicating with each other. Often those microservices are tightly coupled forming a group of containers that would typically, in a non-containerized setup run together on one server. This group, the smallest unit that can be scheduled to be deployed through Kubernetes is called a pod.

The Kubernetes master node is responsible for the management of Kubernetes cluster. This is the entry point of all administrative tasks. The master node is the one taking care of orchestrating the worker nodes, where the actual services are running. The worker nodes run the pods, so it contains all the necessary services to manage the networking between the containers, communicate with the master node, and assign resources to the containers scheduled.

<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/o7leok.png" alt="img"  />

Self-managing production large-scale Kubernetes is really challenging and many organizations are looking to managed Kubernetes from AWS, GCP and Azure to alleviate the that burden. You'll be using AWS EKS for this lab.



#### Steps

* [Enable discovery of VPC resources by Kubernetes](#enable-discovery-of-vpc-resources-by-kubernetes)
* [Review IAM user permissions](#give-an-iam-user-eks-administrative-permissions)
* [Create an EKS Kubernetes cluster](#create-an-eks-kubernetes-cluster)
* [Explore Kubernetes using kubectl](#explore-kubernetes-using-kubectl)


##### Enable discovery of VPC resources by Kubernetes

When you create your Amazon EKS cluster, it has [requirements](https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html) for the VPC networking to function properly. For this lab, we've already setup the requirements for the public and private subnets, NAT gateway, and route tables. EKS requires _tags_ to be applied to the VPC and subnets to enable Kubernetes to discover them.

AWS allows customers to assign metadata to their AWS resources in the form of tags. Each tag is a simple label consisting of a customer-defined key and an optional value that can make it easier to manage, search for, and filter resources. Although there are no inherent types of tags, they enable customers to categorize resources by purpose, owner, environment, or other criteria.

1. Open the VPC console to review the tag on the _app-first-sec_ VPC.

    > [https://console.aws.amazon.com/vpc/home?region=${AWS_REGION}#vpcs:tag:Name=app-first-sec-vpc;sort=tag:Name](https://console.aws.amazon.com/vpc/home?region=${AWS_REGION}#vpcs:tag:Name=app-first-sec-vpc;sort=tag:Name)

2. Click on the _Tags_ tab in the lower left pane

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191016223152924.png" alt="image-20191016223152924" style="zoom:50%;" />

3. Click on the _Add/Edit Tags_ button

4. Review the following tag keys and values. _app-first-sec_ is going to be the name of the Kubernetes cluster that you'll setup in later steps. Ignore any other tags that are already present.

    | Key                                 | Value  |
    | ----------------------------------- | ------ |
    | kubernetes.io/cluster/app-first-sec | shared |

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191016223509479.png" alt="image-20191016223509479" style="zoom:50%;" />

5. Open _Subnets_ from the menu in the left pane and select the subnet with the _Name_ set to _Cisco App-First Sec Public Subnet_ or use the provided link.

    > [https://console.aws.amazon.com/vpc/home?region=${AWS_REGION}#subnets:tag:Name=app-first-sec-public-subnet;sort=desc:tag:Name](https://console.aws.amazon.com/vpc/home?region=${AWS_REGION}#subnets:tag:Name=app-first-sec-public-subnet;sort=desc:tag:Name)

6. Click on the _Tags_ tab in the lower left pane

7. Click on the _Add/Edit Tags_ button

8. Review the the following tag keys and values. Ignore any tags that are already present. Setting the _kubernetes.io/role/elb_ tag tells Kubernetes that it can use this subnet to create external load balancers, which you will do in a later step.

    | Key                                 | Value  |
    | ----------------------------------- | ------ |
    | kubernetes.io/cluster/app-first-sec | shared |
    | kubernetes.io/role/elb              | 1      |

9. Select the subnet with the _Name_ set to _app-first-sec-private-subnet-1_ or use the provided link.

    > [https://console.aws.amazon.com/vpc/home?region=${AWS_REGION}#subnets:tag:Name=app-first-sec-private-subnet-1;sort=desc:tag:Name](https://console.aws.amazon.com/vpc/home?region=${AWS_REGION}#subnets:tag:Name=app-first-sec-private-subnet-1;sort=desc:tag:Name)

    > **NOTE**
    >
    > There are two private subnets that have been created in this VPC. You only need to tag the subnet named _app-first-sec-private-subnet-1_ because the other subnets have already been tagged for you to expedite the lab.

10. Click on the _Tags_ tab in the lower left pane

11. Click on the _Add/Edit Tags_ button

12. Review the the following tag keys and values. Ignore any tags that are already present. Setting the _kubernetes.io/role/internal-elb_ tag tells Kubernetes that it can use this subnet to create internal load balancers.

    | Key                                 | Value  |
    | ----------------------------------- | ------ |
    | kubernetes.io/cluster/app-first-sec | shared |
    | kubernetes.io/role/internal-elb     | 1      |


##### Verify IAM user EKS administrative permissions

It's important to understand how authentication of IAM users to EKS managed Kubernetes differs from self-managed deployments. EKS uses IAM to provide authentication to your Kubernetes cluster (through the _aws eks get-token_ command, available in version 1.16.232 or greater of the AWS CLI, or the AWS IAM Authenticator for Kubernetes), but it still relies on native Kubernetes Role Based Access Control (RBAC) for authorization. This means that IAM is only used for authentication of valid IAM entities. All permissions for interacting with your Amazon EKS cluster’s Kubernetes API is managed through the native Kubernetes RBAC system.

We have already associated the required permissions to your IAM user. Follow the steps below to review the permissions.

1. Navigate AWS UI to review the policy attached to your IAM user

2. Verify that the AWS CLI profile is configured correctly by ensuring that the _Arn_ key's value ends with _user/${POD_NAME}_.

    ###### Command

    ```
    aws sts get-caller-identity
    ```

    ###### Output

    ```
    {
       "UserId": "JDHASD3232CSAJKWD",
       "Account": "${AWS_ACCT_ID}",
       "Arn": "arn:aws:iam::${AWS_ACCT_ID}:user/${POD_NAME}"
    }
    ```

##### Create an EKS Kubernetes cluster

There are three ways to create an EKS-managed Kubernetes cluster: eksctl CLI, management console and AWS CLI. The recommended method is eksctl as it provides the most streamlined method to manage EKS clusters and implement automation. It is written in Go, uses CloudFormation, was created by Weaveworks and is open source.

1. Return to the Cloud9 environment.

2. Review the content of the EKS cluster yaml _${DOLLAR_SIGN}LAB/aws/eks-cluster.yaml_ by double-clicking on it in the file tree to understand some of the parameters that eksctl will use to setup the cluster.

    You'll also see the _ssh_ portion references the EC2 _key pair_ name used in a previous step that contains the SSH public key for EC2 instances.

    ```
    ssh:
       allow: true
       publicKeyName: cisco-app-first-sec-cloud9
    ```

    >  **TIP**
    >
    > It's also worth noting that the EC2 instance type specified as _t2.medium_. Compute types smaller than that will quickly pose problems for even for non-production deployments of Kubernetes and small applications.

3. Start the process of creating the EKS Kubernertes cluster from the Cloud9 bottom right pane within a terminal. It's important to create the cluster using an AWS profile that has restricted permissions within your AWS org, which in this case is done setting a temporary env variable that was setup in previous steps at the beginning of the command.

    ###### Command

    ```
    eksctl create cluster -f ${DOLLAR_SIGN}LAB/aws/eks-cluster.yaml
    ```

    This single command begins a complex process driven through CloudFormation that will take approxiately 15 minutes to complete given the shear number of steps to prepare all of the AWS services.

    > **WARNING**
    >
    > Do not close the terminal tab or cancel the command so you can review the output of the process.

    There are two CloudFormation stacks created by the _eksctl_ command. The EKS control plane stack is named _eksctl-app-first-sec-cluster_ and the worker node group stack is named _eks-app-first-sec-nodegroup-app-first-sec_. The worker node group will not be created immediately.

4. Open a new terminal tab in the bottom right pane in the Cloud9 IDE while _eksctl create cluster_ completes. This tab will be used for to continue the lab steps.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

5. Review each step of the two CloudFormation stacks from the management console.

    > [https://console.aws.amazon.com/cloudformation/home?region=${AWS_REGION}#/stacks?filteringText=eksctl-app-first-sec-&filteringStatus=active&viewNested=true&hideStacks=false&stackId=](https://console.aws.amazon.com/cloudformation/home?region=${AWS_REGION}#/stacks?filteringText=eksctl-app-first-sec-&filteringStatus=active&viewNested=true&hideStacks=false&stackId=)

6. Click on the _Stack name_ listed as _eksctl-app-first-sec-cluster_.

7. Select the _Events_ tab in the right pane. You can periodically refresh the events using the <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017091146525.png" alt="image-20191017091146525" style="zoom:50%;" /> button

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022190239285.png" alt="image-20191022190239285" style="zoom:50%;" />

8. When eksctl completes both the _eksctl-app-first-sec-cluster_ and _eksctl-app-first-sec-nodegroup-app-first-sec_ stacks will show _CREATE\_COMPLETE_ to the left of the _Events_ listing.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022190152523.png" alt="image-20191022190152523" style="zoom:50%;" />

    You can also return to the Cloud9 IDE terminal to check on the output of _eksctl_, which should state that the cluster is ready.

    ###### Output

    ```
    [ℹ]  using region ${AWS_REGION}
    [ℹ]  setting availability zones to [${VPC_PRIV_SUBNET_1_AZ} ${VPC_PRIV_SUBNET_2_AZ}]
    ...
    [ℹ]  kubectl command should work with "/Users/ec2-user/.kube/config", try 'kubectl get nodes'
    [✔]  EKS cluster "app-first-sec" in "${AWS_REGION}" region is ready
    ```

    > **NOTE**
    > Wait the approximately 15 minutes for eksctl to complete, proceed to the next section below once the cluster is ready based on the output of _eksctl_.

##### Explore Kubernetes using kubectl

Kubectl is a command line interface for running commands against Kubernetes clusters. _kubectl_ looks for a file named _config_ in the _~/.kube_ directory. You can specify other kubeconfig files by setting the KUBECONFIG environment variable or by setting the _--kubeconfig_ flag.

Once you have created a cluster using _eksctl_, you will find that cluster credentials were added in _~/.kube/config_.

> **WARNING**
>
> Make sure that the _eksctl create cluster_ process has completed before proceeding here.

1. List all contexts contained with kubeconfig. There should be a single entry that was inserted by eksctl.

    ###### Command

    ```
    kubectl config get-contexts
    ```

    ###### Output

    ```
    CURRENT   NAME                                                     ...
    *         arn:aws:eks:${AWS_REGION}:123123123:cluster/app-first-sec    ...
    ```

    > **TIP**
    >
    > If there were mutliple contexts, you could swtich between them using _kubectl config set-context \[name of context\]_. You can check the current selected context using _kubectl config current-context_.

2. List the Kuberenetes worker nodes where pods will be scheduled.

    ###### Command

    ```
    kubectl get nodes -o wide
    ```

    ###### Output

    ```
    NAME                            STATUS   ROLES    AGE    VERSION    ...
    ip-10-50-110-147.ec2.internal   Ready    <none>   3d1h   v1.13.10   ...
    ip-10-50-110-164.ec2.internal   Ready    <none>   3d1h   v1.13.10   ...
    ip-10-50-120-149.ec2.internal   Ready    <none>   3d1h   v1.13.10   ...
    ```

    > **TIP**
    >
    > Using _-o wide_ will show additional information about the IP addressing, OS and container runtime of the nodes.

3. List the Kubernetes namespaces that provide virtual cluster supported by the same physical cluster. By default you should have three namespaces: _default_, _kube-public_ and _kube-system_. You'll create more namespaces in future steps to logical separate applications.

    ###### Command

    ```
    kubectl get namespaces
    ```

    ###### Output

    ```
    NAME             STATUS   AGE
    default          Active   3d2h
		kube-node-lease  Active   3d2h
		kube-public      Active   3d2h
    kube-system      Active   3d2h
    ```

    > **TIP**
    >
    > By default, all kubectl commands that are issued without specifying _--namespace=\[namespace name\]_ will use the _default_ namespace.

5. List pods contained within the _kube-system_ namespace that support the Kubernetes control plane.

    ###### Command

    ```
    kubectl get pods --namespace=kube-system
    ```

    ###### Output

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    aws-node-jnq94             1/1     Running   0          3d2h
    aws-node-lqgm5             1/1     Running   0          3d2h
    aws-node-mxwxk             1/1     Running   0          3d2h
    coredns-69bc49bfdd-ndlj4   1/1     Running   8          3d2h
    coredns-69bc49bfdd-nnjhx   1/1     Running   8          3d2h
    kube-proxy-gtdct           1/1     Running   0          3d2h
    kube-proxy-l94hc           1/1     Running   0          3d2h
    kube-proxy-smrfq           1/1     Running   0          3d2h
    ```



> **TIP**
>
> Typing _kubectl_ over and over can get very tiring. An alias has been created in your _~/.bashrc_ so using just _k_ is aliased to _kubectl_. Try it out with _k get nodes_.


### Deploy applications on Kubernetes

------

<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/arch2-app.png" alt="arch2.png" />

This section will help you do the following:

1. Learn how to deploy Kubernetes manifests
2. Understand common Kubernetes objects
3. Expose a Kubernetes service using a public load balancer
4. Understand the resiliency of Kubernetes
5. Learn common Kubernetes pod troubleshooting techniques

#### Overview

In order to understand the importance of Kubernetes and Cisco Seucrity products, it's important that we are actually running a microservice application. You'll deploy the [Sock Shop](https://microservices-demo.github.io/) demo application maintained by Weaveworks and Container Solutions. Sock Shop simulates the user-facing part of an e-commerce website that sells socks. All of the Sock Shop [source](https://github.com/microservices-demo) is on GitHub and you'll be updating part of the application's source in a future portion of the lab.



#### Steps

* [Deploy application to Kubernetes](#deploy-application-to-kubernetes)
* [Explore the Kubernetes architecture used for the application](#explore-the-kubernetes-architecture-used-for-the-application)
* [Expose the front-end service externally](#expose-the-front-end-service-externally)
* [Understand the benefits of Kubernetes](#understand-the-benefits-of-kubernetes)
* [Deploy user load test application](#deploy-user-load-test-application)
* [Get into running container to check its running](#get-into-running-container-to-check-its-running)
* [Monitor logs of a pod](#monitor-logs-of-a-pod)



##### Deploy application to Kubernetes

1. Create a namespace that will contain the Sock Shop application.

    ###### Command

    ```
    kubectl create namespace sock-shop
    ```

    ###### Output

    ```
    namespace/sock-shop created
    ```

2. Change the namespace used in the current kubeconfig context to simplify exectuing commands throughout the rest of the lab.

    ###### Command

    ```
    kubectl config set-context --current --namespace=sock-shop
    ```

    ###### Output

    ```
    Context "${POD_NAME}@app-first-sec.${AWS_REGION}.eksctl.io" modified.
    ```

    > **WARNING**
    >
    > It's easy to forgot that your namespace isn't set to _default_, which could result in creating objects in namespaces that you had not intended and therefore restricting what that object has access to. Make sure to specifiy namespaces in your manifest, switch the current context namespace or provide the _--namespace_ flag when creating objects.

3. Provide a manifest for all the objects necessary to run the Sock Shop application using a Kubernetes manifest.

    ###### Command

    ```
    kubectl apply -f ${DOLLAR_SIGN}LAB/sock-shop/sock-shop.yaml
    ```

    ###### Output

    ```
    deployment.extensions/carts-db created
    service/carts-db created
    deployment.extensions/carts created
    service/carts created
    ...
    ```



##### Explore the Kubernetes architecture used for the application

Deployments define how a replicaset of pods are to be deployed. Services define a logical set of pods and a policy by which to access them. It is recommended that applicaitons deployed using Kubernetes use all four of these object types to benefit from all of the orchestration capabilities although the flexibility of Kubernetes allows for more minimal deployment models.

1. View the deployments for each type of microservice.

    ###### Command

    ```
    kubectl get deployments
    ```

    ###### Output

    ```
    NAME           READY   UP-TO-DATE   AVAILABLE   AGE
    carts          1/1     1            1           3d2h
    carts-db       1/1     1            1           3d2h
    ...
    ```

3. View the scheduled pods.

    ###### Command

    ```
    kubectl get pods
    ```

    ###### Output

    ```
    NAME                            READY   STATUS    RESTARTS   AGE
    carts-6bfcf84f4-bh2km           1/1     Running   0          3d2h
    carts-db-6bfc588c5f-gzgw6       1/1     Running   0          3d
    ...
    ```

    > **TIP**
    >
    > You can view the node that a pod has been scheduled to by using _kubectl get pods -o wide_.



##### Expose the front-end service externally

1. View the services that provide access to the pods. These service will have their own IP address and port that provides a reverse proxy for the pods. This vitualization is fundamental to providing resiliency when a pod fails, upgrades or a deployment is scaled up or down.

    ###### Command

    ```
    kubectl get services
    ```

    ###### Output

    ```
    NAME           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
    carts          ClusterIP   172.20.89.193    <none>        80/TCP         3d2h
    carts-db       ClusterIP   172.20.69.28     <none>        27017/TCP      3d2h
    ...
    front-end      NodePort    172.20.229.246   <none>        80:30001/TCP   3d2h
    ```

    In order to expose a service external from the cluster you must select a service type other than _ClusterIP_, which is used for internal services. The _front-end_ service is set to a type of _NodePort_, which opens a specified port on all worker nodes that NATs to the services' ports.

    However, we have no configuration to expose those ports on an external IP. Public Cloud vendors make the type of _LoadBalancer_ effortless to expose ports using a network load balancer.

    > **NOTE**
    >
    > _NodePort_ is a method that comes with limitations that can be overcome using a service type of _LoadBalancer_, which integrates with an external network load balancer, or an _Ingress_ controller, which integrates with an HTTP load balancer. Both of these types having integrations with Public Cloud providers to automatically configure the necessary components to serve requests.
    >
    > In production most deployments will use an _Ingress_ controller to manage external access to services as the cost and rigidness of network load balancers can be prohibitive. While the Ingress method provides the most flexibility, it also has the most complexity. Common controllers are Istio and NGINX.

2. Switch the _front-end_ service type to _LoadBalancer_ to automatically deploy an EC2 Load Balancer with an external IP and DNS A record. A modified Sock Shop manifest includes the service type changes in _${DOLLAR_SIGN}LAB/sock-shop/sock-shop-elb.yaml_.

    ###### Command

    ```
    kubectl apply -f ${DOLLAR_SIGN}LAB/sock-shop/sock-shop-elb.yaml
    ```

    ###### Output

    ```
    deployment.extensions/carts-db unchanged
    service/carts-db unchanged
    ...
    deployment.extensions/front-end unchanged
    service/front-end configured
    ...
    ```

    Note the _configured_ status for the _front-end_ service.

4. Compare the different manifests of the _front-end_ service.

    ###### Command

    ```
    diff -c ${DOLLAR_SIGN}LAB/sock-shop/sock-shop.yaml ${DOLLAR_SIGN}LAB/sock-shop/sock-shop-elb.yaml
    ```

    ###### Output

    ```
    ...
          name: front-end
        namespace: sock-shop
      spec:
    !   type: NodePort
        ports:
        - port: 80
          targetPort: 8079
    -     nodePort: 30001
        selector:
          name: front-end
      ---
    --- 236,245 ----
          name: front-end
        namespace: sock-shop
      spec:
    !   type: LoadBalancer
        ports:
        - port: 80
          targetPort: 8079
        selector:
          name: front-end
      ---
    ```

    Note the difference in the _type_ value and the removal of the _nodePort_ parameter from the _LoadBalancer_ version of the manifest.


3. Check that an EC2 Load Balancer has been allocated to the _front-end_ service using kubectl.

    ###### Command

    ```
    kubectl get services front-end
    ```

    ###### Output

    ```
    NAME        TYPE           CLUSTER-IP       EXTERNAL-IP
    front-end   LoadBalancer   172.20.229.246   acdeb.${AWS_REGION}.elb.amazonaws.com
    ```

5. You've just launched your very own Sock Shop. Visit the DNS A record in the _EXTERNAL-IP_ field from kubectl or the _DNS name_ field from the AWS management console in a web browser. Congrats on starting your new business!

    ![image-20191017190954174](https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017190954174.png)

    > **NOTE**
    >
    > It can take some time for all pods to fully start and begin accepting traffic. If only a portion of the page loads, give it another couple of minutes.



##### Understand the benefits of Kubernetes

While there are numerous benefits to Kubernetes orchestration of containers, there are a couple of very clear ones that are good to witness first-hand. The following steps will show how Kubernetes maintains the declarative configuration by restoring missing pods and quickly scaling deployments to meet demand.

1. Save the DNS A record for the EC2 Load Balancer as an environment variable for use in future steps.

    ###### Command

    ```
    echo "export SOCK_SHOP_ELB=`kubectl get service front-end -o json | jq -r '.status.loadBalancer.ingress[0].hostname'`" >> ~/.bashrc_lab ; source ~/.bashrc
    ```

2. Open a new terminal tab in the bottom right pane in the Cloud9 IDE. This tab will be used for monitoring of the _front-end_ service.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

3. In the new terminal tab, start monitoring the _front-end_ service.

    ###### Command

    ```
    httping -t .5 -G -s -i .1 ${DOLLAR_SIGN}SOCK_SHOP_ELB
    ```

    ###### Output

    ```
    PING acd99ebd8ee9911e99b6f1693fa98981-1385913309.${AWS_REGION}.elb.amazonaws.com:80 (/):
    connected to 123.123.123.123:80 (294 bytes), seq=0 time= 28.62 ms 200 OK
    ...
    ```

4. Move to a different terminal tab while _httping_ is running in the background and cause a failure in the _front-end_ service by deleting the only pod servicing requests. Use the output from _kubectl get pods_ to find the pod name for the _front-end_ service in the _kubectl delete pod_ command.

    ###### Command

    ```
    kubectl get pods
    ```

    ###### Output

    ```
    NAME                            READY   STATUS    RESTARTS   AGE
    carts-6bfcf84f4-cnd7d           1/1     Running   0          178m
    ...
    front-end-b5f568888-5rxd6       1/1     Running   0          2m34s
    ...
    ```

    ###### Command

    ```
    kubectl delete pod <front-end pod name from previous command>
    ```

    ###### Output

    ```
    pod "front-end-b5f568888-5rxd6" deleted
    ```

      > **TIP**
      >
      > In automation use cases, you might find clever ways to deal with the random names used for the pods by using tools like _jq_ and _sed_.
      >
      > ```
      > kubectl delete pod `kubectl get pods | grep front-end | sed 's/^\([^\ ]*\).*$/\1/'`
      > ```

5. Return to the terminal where _httping_ is running and press _ctrl-c_ to stop _httping_ from running. Scroll up and find where the request timed out. Note how quickly the service returned.

    ```
    ...
    connected to 123.123.123.123:80 (294 bytes), seq=106 time=  2.85 ms 200 OK
    timeout while receiving reply-headers from host
    timeout while receiving reply-headers from host
    timeout while receiving reply-headers from host
    timeout while receiving reply-headers from host
    connected to 123.123.123.123:80 (294 bytes), seq=111 time=253.72 ms 200 OK
    timeout while receiving reply-headers from host
    connected to 123.123.123.123:80 (294 bytes), seq=113 time=  3.53 ms 200 OK
    connected to 123.123.123.123:80 (294 bytes), seq=113 time=  3.53 ms 200 OK
    connected to 123.123.123.123:80 (294 bytes), seq=114 time=  3.86 ms 200 OK
    connected to 123.123.123.123:80 (294 bytes), seq=115 time=  3.59 ms 200 OK
    ...
    ```

6. Start monitoring the _front-end_ service again.

    ###### Command

    ```
    httping -t .5 -G -s -i .1 ${DOLLAR_SIGN}SOCK_SHOP_ELB
    ```

    ###### Output

    ```
    PING acd99ebd8ee9911e99b6f1693fa98981-1385913309.${AWS_REGION}.elb.amazonaws.com:80 (/):
    connected to 123.123.123.123:80 (294 bytes), seq=0 time= 28.62 ms 200 OK
    ...
    ```

7. Move to a different terminal tab while _httping_ is running in the background and scale the _front-end_ deployment so that there is a larger replicaset of pods.

    ###### Command

    ```
    kubectl scale deployment front-end --replicas=3
    ```

    ###### Output

    ```
    deployment.extensions/front-end scaled
    ```

8. Check the number of _front-end_ pods running.

    ###### Command

    ```
    kubectl get pods
    ```

    ###### Output

    ```
    ...
    front-end-b5f568888-d7zmt       1/1     Running   0          2m33s
    front-end-b5f568888-rjrtn       1/1     Running   0          2m33s
    front-end-b5f568888-rrjhh       1/1     Running   0          9m2s
    ...
    ```

9. Return to the terminal tab where _httping_ is running and note that there was no service interruption.

10. Move to a different terminal tab while _httping_ is running in the background and scale the _front-end_ deployment so that there is a smaller replicaset of pods.

    ###### Command

    ```
    kubectl scale deployment front-end --replicas=1
    ```

    ###### Output

    ```
    deployment.extensions/front-end scaled
    ```

11. Return to the terminal tab where _httping_ is running and note that there was no service interruption.

    > **TIP**
    >
    > It's recommended to use _autoscale_, which automatically scales the number of pods in a replication controller, deployment, replica set or stateful set based on observed CPU utilization (or, with beta support, on some other, application-provided metrics). In the example below, Kubernetes will increase and decrease the number of replicas (via the deployment) to maintain an average CPU utilization across all Pods of 50%.
    >
    > ###### Command
    >
    > ```
    > kubectl autoscale deployment front-end --cpu-percent=50 --min=1 --max=1
    > ```



##### Deploy user load test application

In order to ensure that the application is being excerised during the remainder of the lab, you'll deploy another application that will simulate users using the applicaiton.

1. Create a namespace for the load generator to run in.

    ###### Command

    ```
    kubectl create namespace sock-shop-test
    ```

    ###### Output

    ```
    namespace/sock-shop-test created
    ```

2. Deploy the application manifest after replacing variables in the yaml with the ${DOLLAR_SIGN}SOCK_SHOP_ELB environment variable.

    ###### Command

    ```
    envsubst <${DOLLAR_SIGN}LAB/sock-shop/sock-shop-test.yaml | k apply -f -
    ```

    ###### Output

    ```
    deployment.apps/sock-shop-test-deployment created
    ```

3. Confirm the pods are in a running state.

    ###### Command

    ```
    kubectl get pods --namespace=sock-shop-test
    ```

    ###### Output

    ```
    NAME                                         READY   STATUS    RESTARTS   AGE
    sock-shop-test-deployment-77755c6ccf-8rml5   1/1     Running   0          39s
    ```

    > **TIP**
    >
    > It can take a minute or two for a pod to download the container image and start them, so if it's not in a running state, try the command _watch kubectl get pods --namespace=sock-shop-test_ instead of up/enter-ing over and over. It will execute the _kubectl_ command over and over until you _ctrl-c_ to stop it.


##### Get into running container to check its running

It's important to be able to troubleshoot Kubernetes, which can be challenging given it's complexity. One of the important tools is to open a shell on a running container in a pod.

1. Open a bash shell in the Sock Shop Test application. You'll need to retrieve the pod name to use in the _kubectl logs_ command.

    ###### Command

    ```
    kubectl get pods --namespace=sock-shop-test
    ```

    ###### Output

    ```
    NAME                                         READY   STATUS    RESTARTS   AGE
    sock-shop-test-deployment-77755c6ccf-8rml5   1/1     Running   0          39s
    ```

    ###### Command

    ```
    kubectl exec --namespace=sock-shop-test -it <pod name from previous command> -- /bin/bash
    ```

    ###### Output

    ```
    root@sock-shop-test-deployment-77755c6ccf-8rml5:/#
    ```

2. Confirm that the _locust_ load generator process is running.

    ###### Command

    ```
    ps x
    ```

    ###### Output

    ```
    PID TTY      STAT   TIME COMMAND
    1 ?        Ss     0:00 /bin/bash /usr/local/bin/runLocust.sh -h acd99ebd8ee9911e99b6f1693fa98981-1385913309.${AWS_REGION}.elb.amazonaws.com -r 2 -c 2 -t 8760h
    12 ?        Sl     0:02 /usr/local/bin/python /usr/local/bin/locust --host=http://acd99ebd8ee9911e99b6f1693fa98981-1385913309.${AWS_REGION}.elb.amazonaws.com -f /config/locustfi
    17 ?        Ss     0:00 /bin/bash
    21 ?        R+     0:00 ps x
    ```

3. Exit the shell to return to the Cloud9 instance shell.

    ###### Command

    ```
    exit
    ```



> **TIP**
>
> In our case, the Sock Shop Test application has only single container in a pod. If a pod has multiple containers, you can specifiy the container name as a cli flag to access a shell in it.
>
> ```
> kubectl exec -it my-pod --container main-app -- /bin/bash
> ```



##### Monitor logs of a pod

Everything a containerized application writes to stdout and stderr is handled and redirected somewhere by a container engine. For example, the Docker container engine redirects those two streams to a logging driver, which is configured in Kubernetes to write to a file in json format.

It's essential to be able to access these logs and often view the output in real-time, while troubleshooting problems.

1. Retrieve the latest log entries for the Sock Sop Test application. You'll need to retrieve the pod name to use in the _kubectl logs_ command.

    ###### Command

    ```
    kubectl get pods --namespace=sock-shop-test
    ```

    ###### Output

    ```
    NAME                                         READY   STATUS    RESTARTS   AGE
    sock-shop-test-deployment-77755c6ccf-8rml5   1/1     Running   0          39s
    ```

    ###### Command

    ```
    kubectl logs --namespace=sock-shop-test <pod name from previous command>
    ```

2. If you want to continuously monitor logs, you can use the _-f_ flag. Press _ctrl-c_ when you want to stop the log streaming.

    ###### Command

    ```
    kubectl logs --namespace=sock-shop-test <pod name from previous command> -f
    ```



> **TIP**
>
> In our case, the Sock Shop Test application has only single container in a pod. If a pod has multiple containers, you can specifiy the container name as a cli flag to access the specific containers shell.
>
> ```
> kubectl exec -it my-pod --container main-app -- /bin/bash
> ```


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
