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


## Overall Lab Content

* [Part1: Prepare infrastructure and application](#prepare-infrastructure-and-application)
* [Part2: Implement security - Secure Cloud Workload](#Part2)
* [Part3: Implement security - Secure Cloud Analytics](#Part3)
* [Part4: Implement security - Secure Cloud Access by Duo](#Part4)
* [Wrap-Up](#wrap-up)

## Prepare infrastructure and application

This section of the lab will have you prepare the public cloud infrastructure and deploy a micro-services based cloud-native application. Throughout the steps, you'll be laying the groundwork to implement security in a later sections.

* [Management interfaces](#management-interfaces)
* [Access the lab environment](#access-the-lab-environment)
* [Create a Kubernetes cluster](#create-a-kuberenetes-cluster)
* [Deploy applications on Kubernetes](#deploy-applications-on-kubernetes)
* [Setup development environment](#setup-development-environment)


> **NOTE**
>
> As you work through the lab you will come across sections that have _Commands_ and _Output_. The _Output_ that is shown can be different than what you will see because some values are randomly generated or specific to your lab pod. Use it as a guidepost and not a definitive view of your output. Also, if no _Output_ is shown after a _Command_ then you should not expect any output from the command.

### Management interfaces

------

There are five management interfaces that you will need to access to complete this lab. You'll be provided with links throughout the lab that will direct you to the following interfaces:

* [AWS Management Console - https://${AWS_REGION}.console.aws.amazon.com/](https://${AWS_REGION}.console.aws.amazon.com/)
* [Tetration - https://tet-pov-rtp1.cpoc.co/](https://tet-pov-rtp1.cpoc.co/)
* [Stealthwatch Cloud - https://cisco-${POD_NAME}.obsrvbl.com](https://cisco-${POD_NAME}.obsrvbl.com)
* [Duo - https://admin.duosecurity.com/](https://admin.duosecurity.com/)
* [GitLab - http://${AWS_GITLAB_FQDN}/](http://${AWS_GITLAB_FQDN}/)


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

* [Review subnet tags required by EKS](#review-subnet-tags-required-by-eks)
* [Verify IAM user permissions](#verify-iam-user-permissions)
* [Create an EKS cluster](#create-an-eks-cluster)
* [Explore Kubernetes using kubectl](#explore-kubernetes-using-kubectl)


##### Review subnet tags required by EKS

When you create your Amazon EKS cluster, it has [requirements](https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html) for the VPC networking to function properly. For this lab, we've already setup all the requirements for the public and private subnets, NAT gateway, and route tables. EKS requires _tags_ to be applied to the VPC and subnets to enable Kubernetes to discover them.

AWS allows customers to assign metadata to their AWS resources in the form of tags. Each tag is a simple label consisting of a customer-defined key and an optional value that can make it easier to manage, search for, and filter resources.

1. Navigate to the VPC console and open _Subnets_ from the menu in the left pane and select the subnet with the _Name_ starting with _Cisco-App-First-Sec Spoke Private Subnet_ or use the provided link and select any subnet.

    > [https://console.aws.amazon.com/vpc/home?region=${AWS_REGION}#subnets:SubnetId=${VPC_PRIV_SUBNET_1_ID},${VPC_PRIV_SUBNET_2_ID},${VPC_PRIV_SUBNET_3_ID}](https://console.aws.amazon.com/vpc/home?region=${AWS_REGION}#subnets:SubnetId=${VPC_PRIV_SUBNET_1_ID},${VPC_PRIV_SUBNET_2_ID},${VPC_PRIV_SUBNET_3_ID})

2. Click on the _Tags_ tab in the lower left pane

3. Review the the following tag keys and values. Ignore any other tags that are already present. Setting the _kubernetes.io/role/elb_ tag tells EKS that it can use this subnet to create internal load balancers, which you will do in a later step.

    | Key                                 | Value  |
    | ----------------------------------- | ------ |
    | kubernetes.io/cluster/app-first-sec | shared |
    | kubernetes.io/role/internal-elb     | 1      |

4. Now, select any subnet starting with _Name_ as _Cisco-App-First-Sec Spoke Public Subnet_ or use the provided link.

    > [https://console.aws.amazon.com/vpc/home?region=${AWS_REGION}#subnets:search='Cisco-App-First-Sec Spoke Public Subnet'](https://console.aws.amazon.com/vpc/home?region=${AWS_REGION}subnets:search='Cisco-App-First-Sec Spoke Public Subnet')

5. Click on the _Tags_ tab in the lower left pane

6. Review the the following tag keys and values. Ignore any other tags that are already present. Setting the _kubernetes.io/role/internal-elb_ tag tells EKS that it can use this subnet to create external load balancers.

    | Key                                 | Value  |
    | ----------------------------------- | ------ |
    | kubernetes.io/cluster/app-first-sec | shared |
    | kubernetes.io/role/elb              | 1      |


##### Verify IAM user permissions

It's important to understand how authentication of IAM users to EKS managed Kubernetes differs from self-managed deployments. EKS uses IAM to provide authentication to your Kubernetes cluster (through the _aws eks get-token_ command, available in version 1.16.232 or greater of the AWS CLI, or the AWS IAM Authenticator for Kubernetes), but it still relies on native Kubernetes Role Based Access Control (RBAC) for authorization. This means that IAM is only used for authentication of valid IAM entities. All permissions for interacting with your Amazon EKS cluster’s Kubernetes API is managed through the native Kubernetes RBAC system.

We have already associated the required permissions to your IAM user. Follow the steps below to review the permissions.

1. Navigate IAM console to review the _AppFirstUserPolicy_ policy attached to your IAM user under _Permissions_ tab.

    > [https://console.aws.amazon.com/iam/home#/users/${POD_NAME}](https://console.aws.amazon.com/iam/home#/users/${POD_NAME})

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

##### Create an EKS cluster

There are three ways to create an EKS-managed Kubernetes cluster: eksctl CLI, management console and AWS CLI. The recommended method is eksctl as it provides the most streamlined method to manage EKS clusters and implement automation. It is written in Go, uses CloudFormation, was created by Weaveworks and is open source.

1. Return to the Cloud9 environment.

2. Review the content of the EKS cluster yaml _${DOLLAR_SIGN}LAB/aws/eks-cluster.yaml_ by double-clicking on it in the file tree to understand some of the parameters that eksctl will use to setup the cluster.

    You'll also see the _ssh_ portion references the EC2 _key pair_ name provided at the beginning of the lab.

    ```
    ssh:
       allow: true
       publicKeyName: ${AWS_KEYPAIR_NAME}
    ```

    You'll also notice the _vpc_ portion references the _private subnets_ created under Spoke VPC.

    ```
    vpc:
      subnets:
        private:
          ${VPC_PRIV_SUBNET_1_AZ}: { id: ${VPC_PRIV_SUBNET_1_ID} }
          ${VPC_PRIV_SUBNET_2_AZ}: { id: ${VPC_PRIV_SUBNET_2_ID} }
          ${VPC_PRIV_SUBNET_3_AZ}: { id: ${VPC_PRIV_SUBNET_3_ID} }
    ```

    >  **TIP**
    >
    > It's also worth noting that the EC2 instance type specified as _t2.medium_. Compute types smaller than that will quickly pose problems for even for non-production deployments of Kubernetes and small applications.


3. Start the process of creating the EKS cluster from the Cloud9 bottom right pane within a terminal. It's important to create the cluster using an AWS profile that has restricted permissions within your AWS org, which in this case is done by setting a temporary env variable that was setup at the beginning of the lab.

    ###### Command

    ```
    eksctl create cluster -f ${DOLLAR_SIGN}LAB/aws/eks-cluster.yaml
    ```

    This single command begins a complex process driven through CloudFormation that will take approximately 15 minutes to complete given the shear number of steps to prepare all of the AWS services.

    > **WARNING**
    >
    > Do not close the terminal tab or cancel the command so you can review the output of the process.

    There are two CloudFormation stacks created by the _eksctl_ command. The EKS control plane stack is named _eksctl-app-first-sec-cluster_ and the worker node group stack is named _eks-app-first-sec-nodegroup-app-first-sec_. The worker node group will not be created immediately.


4. Review each step of the two CloudFormation stacks from the management console.

    > [https://console.aws.amazon.com/cloudformation/home?region=${AWS_REGION}#/stacks?filteringText=eksctl-app-first-sec-&filteringStatus=active&viewNested=true&hideStacks=false&stackId=](https://console.aws.amazon.com/cloudformation/home?region=${AWS_REGION}#/stacks?filteringText=eksctl-app-first-sec-&filteringStatus=active&viewNested=true&hideStacks=false&stackId=)

5. Click on the _Stack name_ listed as _eksctl-app-first-sec-cluster_.

6. Select the _Events_ tab in the right pane. You can periodically refresh the events using the <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017091146525.png" alt="image-20191017091146525" style="zoom:50%;" /> button

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022190239285.png" alt="image-20191022190239285" style="zoom:50%;" />

7. When eksctl completes both the _eksctl-app-first-sec-cluster_ and _eksctl-app-first-sec-nodegroup-app-first-sec_ stacks will show _CREATE\_COMPLETE_ to the left of the _Events_ listing.

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

2. List the Kubernetes worker nodes where pods will be scheduled.

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

1. View the services that provide access to the pods. These service will have their own IP address and port that provides a reverse proxy for the pods. This virtualization is fundamental to providing resiliency when a pod fails, upgrades or a deployment is scaled up or down.

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

### Setup development environment

------

#### Overview

In software development lifecycle, an application goes through a series of stages to be finally available to an end user to consume. These series of stages, once a developer pushes the changes from their local environment to a remote repository, would typically include building an image, testing it and eventually merging the code to the main branch of source code management system. Once the changes are merged, the new version of app is released to the repository. The final stage is when this newly released application is deployed and made available to the end users.

In this section, you will create a project for Front-End microservice of Sock Shop application on your private GitLab Instance. You will then set up your local environment on Cloud9 IDE and configure the git client to point to your private Front-End project GitLab Instance. We have already hosted a private Gitlab instance ins AWS Hub VPC.

After the local and remote repositories are set up, you will set up a CI/CD pipeline for your _Sock-Shop-Front-End_ GitLab project and automate the testing, building and deployment of the Front End microservice to EKS cluster.


#### Steps

* [Setup Private GitLab environment](#setup-private-gitlab-environment)
* [Setup CICD Pipeline](#setup-cicd-pipeline)




##### Setup Private GitLab environment

1. Login to the Private GitLab console and navigate to _New project > Create blank project_. Enter the project name _Sock-Shop-Front-End_ and create a new blank GitLab project.

    > [http://${AWS_GITLAB_FQDN}/projects/new#blank_project](http://${AWS_GITLAB_FQDN}/projects/new#blank_project)

  Username: root
  Run the command below to retrieve the password


    ###### Command

    ```
    ssh -i ~/.ssh/$AWS_KEYPAIR_NAME ubuntu@$AWS_GITLAB_IP 'sudo grep Password: /etc/gitlab/initial_root_password'
    ```

2. From the drop down menu on the top right corner, navigate to _Edit Profile > Access Tokens_ and create a personal access token with _write_repository_ and _api_ permissions. Export the token to an environment variable for later use. We will need this token to set up local git repository on Cloud9 host in the next step.

    > [http://${AWS_GITLAB_FQDN}/-/profile/personal_access_tokens](http://${AWS_GITLAB_FQDN}/-/profile/personal_access_tokens)


    ###### Command

    ```
    export GITLAB_TOKEN=<personal-access-token>
    ```

3. Switch back to Cloud9 host terminal and set up a local git repository pointing to your private GitLab instance.


    ###### Command

    ```
    cd $HOME/environment
    git clone https://github.com/amansin0504/front-end.git Sock-Shop-Front-End && cd Sock-Shop-Front-End
    git config --global user.name "Administrator" && git config --global user.email "admin@cloudnativeapp.com"
    git remote rm origin && git remote add origin http://Administrator:$GITLAB_TOKEN@$AWS_GITLAB_FQDN/root/sock-shop-front-end.git
    git push -u origin --all
    ```

##### Setup CICD Pipeline

In this section, you will set up a CI/CD pipeline for your newly created GitLab project _Sock-Shop-Front-End_.

[GitLab Runners](https://docs.gitlab.com/runner/) is an application that works with GitLab CI/CD to run jobs in a pipeline. An AWS Elastic Container Registry is already set up as part of initial lab set up, you will use this registry to push container images that you will build during the course of this lab.

1. Navigate to _Administrator/Sock-Shop-Front-End > Settings > CI/CD_, expand the _Variables_ section add the following key-value pairs as environment variables.

    > [http://${AWS_GITLAB_FQDN}/root/sock-shop-front-end/-/settings/ci_cd](http://${AWS_GITLAB_FQDN}/root/sock-shop-front-end/-/settings/ci_cd)


  | Key                       | Value                       |
  | --------------------------| ----------------------------|
  | AWS_ACCESS_KEY_ID         | ${AWS_ACCESS_KEY}           |
  | AWS_SECRET_ACCESS_KEY     | ${AWS_SECRET_ACCESS}        |
  | AWS_DEFAULT_REGION        | ${AWS_REGION}               |
  | DOCKER_REGISTRY           | ${DOCKER_REGISTRY}          |


    > **TIP**
    >
    > For ease of use, we are displaying the AWS Secret Key in this guide, this is not recommended in a real world environment because of security reasons. We will delete these keys as part of lab clean up at the end of this lab.
    >


2. Navigate to _Administrator/Sock-Shop-Front-End > Settings > CI/CD_, expand the _Runners_ section and copy the registration token and export it as environment variable.

    > [http://${AWS_GITLAB_FQDN}/root/sock-shop-front-end/-/settings/ci_cd](http://${AWS_GITLAB_FQDN}/root/sock-shop-front-end/-/settings/ci_cd)


    ###### Command

    ```
    export RUNNER_TOKEN=<registration-token>
    ```

3. On the Cloud9 host terminal, run the command below to register a GitLab runner to the GitLab project.


    ###### Command

    ```
    ssh -i ~/.ssh/${AWS_KEYPAIR_NAME} ubuntu@${AWS_GITLAB_IP} << EOF
    sudo gitlab-runner register \
    --non-interactive \
    --url "http://${AWS_GITLAB_FQDN}/" \
    --registration-token $RUNNER_TOKEN \
    --executor "docker" \
    --docker-image alpine:latest \
    --description "docker-runner" \
    --docker-privileged \
    --tag-list "docker,aws"
    EOF
    ```

4. Make a test change to ReadMe file in Sock-Shop-Front-End source. Push the local update to the remote repository _Sock-Shop-Front-End_ on your private GitLab instance.


    ###### Command

    ```
      cd $HOME/environment/Sock-Shop-Front-End
      echo "test" >> README.md
      git add README.md
      git commit -m "Test change to README.md"
      git push
    ```

5. Navigate to _Administrator/Sock-Shop-Front-End > CICD > Pipeline_ on GitLab console. A new pipeline run should be triggered. The pipeline will build a new Front End Sock Shop container image and push it to the AWS ECR registry. The pipeline will then pause at deployment stage for a manual input. While the pipeline is running, review the _.gitlab-ci.yml_ file under the GitLab _Sock-Shop-Front-End_ project to see the tasks performed at various stages of pipeline.

    > [http://${AWS_GITLAB_FQDN}/root/sock-shop-front-end/-/ci/editor](http://${AWS_GITLAB_FQDN}/root/sock-shop-front-end/-/ci/editor)

    > **NOTE**
    >
    > The new Front End container image is essentially same image as the one we are already running in the EKS cluster because only made a change to the ReadMe file, no code changes were done

6. Once the CI/CD pipeline run completes the testing stage, run the command below to see the newly pushed image to the private Elastic Container Repository(ECR).


    ###### Command

    ```
    aws ecr list-images --repository-name sock-shop/front-end
    ```

7. Now, provide the manual input by clicking on play button on deployment stage to automatically deploy your newly built Front-End microservice container image to the Sock-Shop application running on the EKS cluster. Once the deployment stage is successful, run the CLI below to see the updated pod image on EKS cluster. The image name will match the name listed in the ECR registry in the last step.


    ###### Command

    ```
    kubectl describe deployment front-end -n sock-shop | grep Image:
    ```

------


### Implement Duo

------

<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/arch2-duo-sdk.png" alt="arch2.png" />

This section will help you do the following:

1. Instrument an microservice application with Duo MFA
2. Learn about Docker containers and registries
3. Learn how to use git for version control
4. Learn how CI/CD pipeline automates deployment

#### Overview

Duo secure's access to your applications and data, no matter where users are - on any device - from anywhere. For organizations of all sizes, Duo’s trusted access solution creates trust in users, devices and the applications they access. It reduces the risk of a data breach and ensures trusted access to sensitive data.

To regain trust of endpoints, Duo Beyond provides the ability to identify corporate vs. personal devices, block untrusted devices, and give users secure access to internal applications.

You'll instrument Duo MFA into the Sock Shop so that users of the application must have a second form of authentication to login.


#### Steps

* [Set Duo Admin Credentials](#set-duo-admin-credentials)
* [Instrument the Sock Shop with Duo](#instrument-the-sock-shop-with-duo)
  * [Validate authentication without MFA](#validate-authentication-without-mfa)
  * [Make Duo secrets available to Sock Shop](#make-duo-secrets-available-to-sock-shop)
  * [Update source with Duo MFA](#update-source-with-duo-mfa)
  * [Validate authentication with Duo MFA](#validate-authentication-with-duo-mfa)


##### Set Duo Admin Credentials

We're using a pre-defined email of _${POD_NAME}@cisco.com_ to give access to the Duo Admin portal.

1. Return to the Cloud9 environment and select a terminal tab in the bottom right pane

2. Use the _duoconf_ script to configure the Duo Admin portal with your phone number for multi-factor authentication (MFA) in addition to transparenly setting your admin password to _${POD_PASSWORD}_. The phone number you provide will receive SMS messages, so normal messaging costs might apply.

    > **NOTE**
    >
    > The script will validate the phone number format and if it's deemed invalid, you'll be prompted to provide it again. [E.164 format](https://www.google.com/search?q=e.164%20format) for this number is required.

    ###### Command

    ```
    duoconf
    ```

    ###### Output

    ```
    Enter your phone number in E.164 format (example: +1 408 555 5555):
    ```

3. Confirm you can log into the Duo Admin management interface

    > [https://admin.duosecurity.com/](https://admin.duosecurity.com/)


##### Instrument the Sock Shop with Duo

Duo Web SDK makes it easy to add strong two-factor authentication to your web application, complete with inline self-service enrollment and Duo Prompt.

Implementing Duo two-factor authentication into your site involves simply adding a second login page and splitting your login handler into two parts. Client libraries are available for Python, Ruby, Classic ASP, ASP.NET, Java, PHP, Node.js, ColdFusion, and Perl.

You'll test the current login process, update the source code of the Sock Shop, build a new container, create Kuberenetes secrets, update the Kubernetes manifest for the Sock Shop and finally experience the new login process.

###### Validate authentication without MFA

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Retrieve the EC2 Load Balancer DNS A record that has been allocated to the _front-end_ service using kubectl.

    ###### Command

    ```
    kubectl get services front-end
    ```

    ###### Output

    ```
    NAME        TYPE           CLUSTER-IP       EXTERNAL-IP                         ...
    front-end   LoadBalancer   172.20.229.246   acdeb.${AWS_REGION}.elb.amazonaws.com   ...
    ```

3. Visit the DNS A record in the _EXTERNAL-IP_ field in a web browser.

4. Login to the Sock Shop as the user _${POD_NAME}_. Click the _Login_ link in the top right. Login with the following values.

    > **NOTE**
    >
    > The password is intentionally the same as the username for this login.

    | username          | password          |
    | ----------------- | ----------------- |
    | _${POD_NAME}_     | _${POD_NAME}_     |

		> **NOTE**
		>
		> If your login is unsuccessful, you might have missed the step where you created this user. Execute the command _addshopuser_ in a Cloud9 terminal and try to login to the Sock Shop again.

4. Once you've confirmed the login was successful, click on the _Logout_ link in the top right.


###### Make Duo secrets available to Sock Shop

Kubernetes _secret_ objects let you store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys. Putting this information in a secret is safer and more flexible than putting it verbatim in a Pod definition or in a container image.

You'll store four secrets in Kubernetes that will be available to the front-end service as environment variables. These secrets corrispond to the Duo Web SDK Application configured in the administrative portal.

1. View the Duo Web SDK Applications from the administrative portal in a web browser.

    > [https://admin.duosecurity.com/applications](https://admin.duosecurity.com/applications)

2. Login using the following values.

    | Field                 | Value                                        |
    | --------------------- | -------------------------------------------- |
    | Email                 | ${POD_NAME}@cisco.com                        |
    | Password              | ${POD_PASSWORD}                              |

3. Select your application name _${POD_NAME}-sock-shop_ from the list to view it's configuration.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022122800995.png" alt="image-20191022122800995" style="zoom:50%;" />

4. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

5. Use the _duosecrets_ helper script to create a Kubernetes secret object with the values from the Duo Web SDK Application you opened in a previous step. You'll need to move back and forth between the Duo administrative portal and the Cloud9 IDE terminal as you copy and paste values.

    ###### Command

    ```
    duosecrets
    ```

    ###### Output

    ```
    Integration key:
    123abc123abc123abc123abc123abc

    Secret key:
    123abc123abc123abc123abc123abc

    API hostname:
    api-123abc.duosecurity.com

    Application key (auto-generated):
    123abc123abc123abc123abc123abc

    Kubernetes secret object YAML:
    apiVersion: v1
    kind: Secret
    metadata:
     name: duo
     namespace: sock-shop
    type: Opaque
    data:
     ikey: MTIzYWJjMTIzYWJjMTIzYWJjMTIzYWJjMTIzYWJjCg==
     skey: MTIzYWJjMTIzYWJjMTIzYWJjMTIzYWJjMTIzYWJjCg==
     api_hostname: MTIzYWJjMTIzYWJjMTIzYWJjMTIzYWJjMTIzYWJjCg==
     akey: MTIzYWJjMTIzYWJjMTIzYWJjMTIzYWJjMTIzYWJjCg==

    Creating Kubernetes object using 'envsubst <${DOLLAR_SIGN}LAB/duo/duo-secrets.yaml | kubectl apply -f -':
    secret/duo configured
    ```

6. Confirm the secret exists in Kubernetes where the front-end pods will be able to reach them.

    ###### Command

    ```
    kubectl get secret duo
    ```

    ###### Output

    ```
    NAME   TYPE     DATA   AGE
    duo    Opaque   4      7d22h
    ```

    > **TIP**
    >
    > If you want to view the secrets themselves, you'll need to use _kubectl get secret duo -o yaml_ and then _echo <secret value here> | base64 --decode_ as they are base64 encoded.

###### Update source with Duo MFA

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Change the working directory to work on the source for the Sock Shop front-end service.

    ###### Command

    ```
    cd ${DOLLAR_SIGN}Sock-Shop-Front-End/
    ```

5. Copy the three source files in _${DOLLAR_SIGN}LAB/src/duo/_ that are already instrumented with a Duo MFA login process into the cloned front-end repository.

    _duo.js_ is the Duo Web SDK for Node.js and handles all interactions with the Duo service and is provided by Duo. _index.js_ defines the API for the user endpoint, which includes the login process. _client.js_ handles the web browser client logic for connecting to the backend services like the user endpoint.

    Take some time to open up the _index.js_ and _client.js_ files by double-clicking on them in the file navigator tree in Cloud9 IDE left pane. Search for _DUO_ to review the changes that were made to integrate Duo MFA into the login process. It was around 100 lines of code.

    ###### Command

    ```
    cp ${DOLLAR_SIGN}LAB/src/duo/duo.js helpers/ ; cp ${DOLLAR_SIGN}LAB/src/duo/index.js api/user/ ; cp ${DOLLAR_SIGN}LAB/src/duo/client.js public/js/
    ```

    > **TIP**
    >
    > If you're more comfortable in another language, Duo provides SDKs for lots of languages and provide [documentation](https://duo.com/docs/duoweb) on how to use them. You can access the SDKs from [Duo's GitHub](https://github.com/duosecurity).

6. Add all the changes into the front-end repository staging area. The _git add_ command tells Git that you want to include updates to a particular file in the next commit.

    ###### Command

    ```
    git add .
    ```

7. Commit all changes to the front-end repository and provide a meaningful commit message. The _git commit_ command captures a snapshot of the project's currently staged changes. Committed snapshots can be thought of as “safe” versions of a project—Git will never change them unless you explicitly ask it to.

    ###### Command

    ```
    git commit -m "add Duo MFA support to login"
    ```

    ###### Output

    ```
    [master edbbb1b] add Duo MFA support to login
		Committer: EC2 Default User <ec2-user@ip-10-50-10-88.ec2.internal>
		...
    3 files changed, 0 insertions(+), 0 deletions(-)
    create mode 100644 helpers/duo.js
    create mode 100644 api/user/index.js
    create mode 100644 public/js/client.js
    ```

8. Push the local changes to these three files to the remote repository on your private GitLab Project using the command.

  ###### Command

  ```
  git push
  ```

  ###### Output

  ```
  [master edbbb1b] add Duo MFA support to login
  Committer: EC2 Default User <ec2-user@ip-10-50-10-88.ec2.internal>
  ...
  3 files changed, 0 insertions(+), 0 deletions(-)
  create mode 100644 helpers/duo.js
  create mode 100644 api/user/index.js
  create mode 100644 public/js/client.js
  ```

###### CI/CD pipeline automation

Docker images are the basis of containers. An Image is an ordered collection of root filesystem changes and the corresponding execution parameters for use within a container runtime. An image typically contains a union of layered filesystems stacked on top of each other. An image does not have state and it never changes.

Docker can automatically build images by reading the instructions from a Dockerfile. A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image. Using docker build users can create an automated build that executes several command-line instructions in succession.

The git push action in last section will trigger the CI/CD pipeline run. The pipeline will build a new Front-End container image using the dockerfile present in the repo and then, push the newly built image to the private registry in ECR.

1. Change the working directory to the _front-end_ cloned repository.

    ###### Command

    ```
    cd ${DOLLAR_SIGN}Sock-Shop-Front-End/
    ```

2. Review _${DOLLAR_SIGN}Sock-Shop-Front-End/Dockerfile_, which contains the instructions to build the front-end container image.

    The line _ENV PORT 8079_ defines an environment variable that the service will read when starting to define what TCP port to listen on. When running that container image in a future step, you will need to specify what port on the host to map to the container's internal port.

    > **TIP**
    >
    > You'll also see _EXPOSE 8079_, which surprisingly does *not* expose that port to external connections. It functions as a type of documentation between the person who builds the image and the person who runs the container, about which ports are intended to be published.

3. Go back to CI/CD pipeline on GitLab console. The pipeline should be running at this point. Click on _docker build_ stage and review the logs. The GitLab pipeline will use the dockerfile instructions to build a new container image and then push it to ECR repository in an automated manner.

    ###### Output

    ```
    Sending build context to Docker daemon  102.9MB
    Step 1/13 : FROM node:10-alpine
    ...
    Successfully built 48237c37f9b9
    Successfully tagged sock-shop/front-end:latest
    ```

    Each step in the output correlates to steps included in _${DOLLAR_SIGN}LAB/src/front-end/Dockerfile_ . In the _Successfully built_ line of output the value _48237c37f9b9_ is the container image ID that was created.

    > **NOTE**
    >
    > If you were to rebuild this container image, the Docker daemon would reuse layers from the first build to reuse for build this image, which speeds up the build process and saves on resources.

4. Once the image is built, the pipeline moves to the next stage and tests the newly build image by running it. You can click _docker_test_ stage to review the logs.

    > [http://${AWS_GITLAB_FQDN}/root/sock-shop-front-end/-/ci/editor](http://${AWS_GITLAB_FQDN}/root/sock-shop-front-end/-/ci/editor)


5. Last stage is _deployment_, which will require manual input from you. Once you click on play button, the pipeline will resume and deploy the Front End image with Duo MFA to the EKS cluster deployment.

    > [http://${AWS_GITLAB_FQDN}/root/sock-shop-front-end/-/ci/editor](http://${AWS_GITLAB_FQDN}/root/sock-shop-front-end/-/ci/editor)

6. Ensure that the new front-end pod has started and is in a _Running_ status. You'll see that the _AGE_ will be different than the rest of the running pods. You can also verify the image name using _kubectl describe deployment front-end -n sock-shop | grep Image:_ command.

    ###### Command

    ```
    kubectl get pods
    ```

    ###### Output

    ```
    NAME                            READY   STATUS    RESTARTS   AGE
    carts-6bfcf84f4-cnd7d           1/1     Running   1          4d22h
    carts-db-6bfc588c5f-tw48c       1/1     Running   1          4d22h
    ...
    front-end-b5f568888-vz6sc       1/1     Running   1          30s
    ...
    ```

    > **TIP**
    >
    > In production it's possible to make this update without a service disruption. You'll need to have more replicas than the the single pod you have in the lab. That way, the Deployment will declaratively update the deployed front-end pod progressively behind the scene. It ensures that only a certain number of old replicas may be down while they are being updated, and only a certain number of new replicas may be created above the desired number of pods.



###### Validate authentication with Duo MFA

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Retrieve the EC2 Load Balancer DNS A record that has been allocated to the _front-end_ service using kubectl.

    ###### Command

    ```
    kubectl get services front-end
    ```

    ###### Output

    ```
    NAME        TYPE           CLUSTER-IP       EXTERNAL-IP                         ...
    front-end   LoadBalancer   172.20.229.246   acdeb.${AWS_REGION}.elb.amazonaws.com   ...
    ```

3. Visit the DNS A record in the _EXTERNAL-IP_ field in a web browser.

4. Login to the Sock Shop as the user _${POD_NAME}_. Click the _Login_ link in the top right. Login with the following values.

    > **NOTE**
    >
    > The password is intentionally the same as the username for this login.

    | username          | password          |
    | ----------------- | ----------------- |
    | _${POD_NAME}_     | _${POD_NAME}_     |

		> **NOTE**
		>
		> If your login is unsuccessful, you might have missed the step where you created this user. Execute the command _addshopuser_ in a Cloud9 terminal and try to login to the Sock Shop again.

4. You will be redirected to the Duo self enrollment dialogue after a succesfull authentication.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022183024378.png" alt="image-20191022183024378" style="zoom:50%;" />

5. When prompted to select what device you are adding, use _Tablet_ and click _Continue_.

    > **WARNING**
    >
    > Even though you might have installed the Duo app on your mobile phone, you can select _Tablet_. This avoids having to provide your mobile phone number, which isn't necessary for this lab.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022183515433.png" alt="image-20191022183515433" style="zoom:50%;" />

6. When prompted for the type of tablet, select the appropriate OS based on your mobile device.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022183930111.png" alt="image-20191022183930111" style="zoom:50%;" />

7. You should already have installed the Duo mobile app. If you haven't, install it now. Then click _I have Duo Mobile installed_.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022184041137.png" alt="image-20191022184041137" style="zoom:50%;" />

8. When prompted to activate _Duo Mobile_, open the Duo app and tap the _+_ button at the top. Scan the displayed QR code.

9. Once there's a green check in the center of the QR code, click _Continue_.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022184259668.png" alt="image-20191022184259668" style="zoom:50%;" />

10. When prompted for device settings, select _Automatically send this device a Duo Push_ and click the _Continue to Login_ button.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022184434050.png" alt="image-20191022184434050" style="zoom:50%;" />

11. You will receive a notification in the Duo app that there is a login request. If you select that notifcation, you'll be prompt to _Approve_ or _Deny_ the request. Tap _Approve_.

12. Back in your web broswer, the Duo authentication prompt will have automatically redirected you back to the Sock Shop app. In the top right corner of the site, you will show as logged in.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022185118929.png" alt="image-20191022185118929" style="zoom:50%;" />


#### Duo Summary

You can rest easy knowing access to your lucrative Sock Shop has MFA enabled for its users.

Duo is providing self-managed MFA for a custom web application using the Duo Web SDK. Additional configuration in Duo could further protect those resources by setting device restrictions using Duo Beyond.


------

### Implement Stealthwatch Cloud

------

<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/arch2-swc.png" alt="arch2.png" />

This section will help you do the following:

1. Configure AWS and Stealthwatch Cloud integration
2. Configure Kubernetes and Stealthwatch Cloud integration


#### Overview

Stealthwatch Cloud improves security and incident response across the distributed network, from the private network and branch office to the public cloud. This solution addresses the need for digital businesses to quickly identify threats posed by their network devices and cloud resources, and to do so with minimal management, oversight, and security manpower.

You'll integration Stealthwatch Cloud with AWS and a Kubernetes cluster in this section.


#### Steps

* [Set Stealthwatch Cloud Credentials](#set-stealthwatch-cloud-credentials)
* [Give Stealthwatch Cloud access to AWS](#give-stealthwatch-cloud-access-to-aws)
* [Consume AWS Flow Logs in Stealthwatch Cloud](#consume-aws-flow-logs-in-stealthwatch-cloud)
* [Instrument Stealthwatch Cloud into Kubernetes](#instrument-stealthwatch-cloud-into-kubernetes)


##### Set Stealthwatch Cloud Credentials

We're using your own email of _${DEVNET_EMAIL_ADDRESS}_ to give access to Stealthwatch Cloud. You'll set the password for this account.

1. Check for an email to _${DEVNET_EMAIL_ADDRESS}_ inviting you to join _cisco-${POD_NAME}.obsrvbl.com_

2. Follow the instructions to register your account credentials

    > **NOTE**
    >
    > It's recommended to use the password _${POD_PASSWORD}_ to simplify access for yourself across all interfaces in the lab.

3. Confirm you can log into the Stealthwatch Cloud management interface

    > [https://cisco-${POD_NAME}.obsrvbl.com](https://cisco-${POD_NAME}.obsrvbl.com)


##### Give Stealthwatch Cloud access to AWS

Stealthwatch Cloud Public Cloud Monitoring (PCM) is a visibility, threat identification, and compliance service for Amazon Web Services (AWS). Stealthwatch Cloud consumes network traffic data, including Virtual Private Cloud (VPC) flow logs, from your AWS public cloud network. It then performs dynamic entity modeling by running analytics on that data to detect threats and indicators of compromise.

Stealthwatch Cloud consumes VPC flow logs directly from your AWS account using a cross-account IAM role with the proper permissions. In addition, Stealthwatch Cloud can consume other sources of data, like CloudTrail and IAM, for additional context and monitoring.

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Create an IAM role that allows SWC to access configuration and flow logs

    > **NOTE**
    >
    > An IAM *role* is an IAM identity that you can create in your account that has specific permissions. An IAM role is similar to an IAM user, in that it is an AWS identity with permission policies that determine what the identity can and cannot do in AWS. However, instead of being uniquely associated with one person, a role is intended to be assumable by anyone who needs it. Also, a role does not have standard long-term credentials such as a password or access keys associated with it. Instead, when you assume a role, it provides you with temporary security credentials for your role session.

    ###### Command

    ```
    aws iam create-role --role-name swc-role --assume-role-policy-document file://${DOLLAR_SIGN}LAB/swc/swc-aws-assume-role.json
    ```

    ###### Output

    ```
    {
       "Role": {
           "Path": "/",
           "RoleName": "swc-role",
           "RoleId": "AAODGROA5WOZRFUWOU5SB",
           "Arn": "arn:aws:iam::${AWS_ACCT_ID}:role/swc-role",
           "CreateDate": "2019-10-21T22:50:57Z",
           "AssumeRolePolicyDocument": {
               "Version": "2012-10-17",
               "Statement": {
                   "Effect": "Allow",
                   "Action": "sts:AssumeRole",
                   "Principal": {
                       "AWS": "757972810156"
                   },
                   "Condition": {
                       "StringEquals": {
                           "sts:ExternalId": "cisco-${POD_NAME}"
                       }
                   }
               }
           }
       }
    }
    ```

    It's worth taking a minute to review the assume role policy document _${DOLLAR_SIGN}LAB/swc/swc-aws-assume-role.json_. You'll see it specifies the AWS principal of _757972810156_. That's Stealthwatch Cloud's ID used for the AWS integration.

    You'll also see a condition that says that _sts:ExternalId_ must equal _cisco-${POD_NAME}_. This is a unique identity within Stealthwatch Cloud for your account.

3. Create an IAM policy for the SWC role to use that restricts access to AWS resources and actions.

    ###### Command

    ```
    aws iam create-policy --policy-name swc-policy --policy-document file://${DOLLAR_SIGN}LAB/swc/swc-aws-policy.json
    ```

    ###### Output

    ```
    {
       "Policy": {
           "PolicyName": "swc-policy",
           "PolicyId": "AWH3QXOYQV7NPA5WOZRFU",
           "Arn": "arn:aws:iam::${AWS_ACCT_ID}:policy/swc-policy",
           "Path": "/",
           "DefaultVersionId": "v1",
           "AttachmentCount": 0,
           "PermissionsBoundaryUsageCount": 0,
           "IsAttachable": true,
           "CreateDate": "2019-10-21T22:52:28Z",
           "UpdateDate": "2019-10-21T22:52:28Z"
       }
    }
    ```

    If you review the policy file _${DOLLAR_SIGN}LAB/swc/swc-aws-policy.json_, you'll see the services and actions it requires. In most cases it doesn't need anything other than read access (e.g., _Get_, _List_). The exceptions to that are for Inspector and CloudWatch log filters.

    > **TIP**
    >
    > You can adjust the policy as you see fit to restrict Stealthwatch Cloud. It will adjust it's capabilities according to what access it has been granted.

4. Attach the IAM policy to the role to set access permissions. There will be no output from the command unless there's an error.

    ###### Command

    ```
    aws iam attach-role-policy --role-name swc-role --policy-arn arn:aws:iam::${AWS_ACCT_ID}:policy/swc-policy
    ```

5. Retrieve the role ARN from the step where you created the role or execute the following command to retrieve it. We'll need this value to enter into the Stealthwatch Cloud AWS settings.

    ###### Command

    ```
    aws iam get-role --role-name swc-role | jq -r '.Role.Arn'
    ```

    ###### Output

    ```
    arn:aws:iam::${AWS_ACCT_ID}:role/swc-role
    ```

6. Visit the Stealthwatch Cloud management interface's AWS settings.

    > [https://cisco-${POD_NAME}.obsrvbl.com/accounts/settings/aws/#/settings/aws/credentials](https://cisco-${POD_NAME}.obsrvbl.com/accounts/settings/aws/#/settings/aws/credentials)

7. Click on _Login via cisco-${POD_NAME}_ and login using the following values.

    | Field                 | Value                                                        |
    | --------------------- | ------------------------------------------------------------ |
    | Email                 | ${DEVNET_EMAIL_ADDRESS}                                      |
    | Password              | ${POD_PASSWORD} (or password you set)                        |

8. Provide the role ARN and name from past steps for Stealthwatch Cloud to use for access to your AWS environment. Set the the fields with the following values.

    | Role ARN                                  | Name     |
    | ----------------------------------------- | -------- |
    | arn:aws:iam::${AWS_ACCT_ID}:role/swc-role | swc-role |

9. Click on the _+_ button to save the details.

10. Review the permissions that Stealthwatch Cloud has access to using the management interface. This page lists the most important permissions for Stealthwatch Cloud.

    > **NOTE**
    >
    > It's likely that there will be no AWS services listed when you visit this page immediately after adding your newly created role. It could take 5 to 10 minutes for Stealthwatch Cloud processes to validate access to all services.

    > [https://cisco-${POD_NAME}.obsrvbl.com/accounts/settings/aws/#/settings/aws/permissions](https://cisco-${POD_NAME}.obsrvbl.com/accounts/settings/aws/#/settings/aws/permissions)



##### Consume AWS Flow Logs in Stealthwatch Cloud

When the VPC for this lab was created using CloudFormation, VPC flow logs were setup for you. This is a recommended best practice so that there's a record of all traffic within a VPC before any workloads are even deployed.

It's worth taking some time to review the CloudFormation template _${DOLLAR_SIGN}LAB/aws/cf-setup-template.json_ we used if you haven't already. We needed to create a S3 Bucket, S3 Bucket Policy, and configure the VPC to send flow logs to the S3 Bucket. Those items were configured using the respective resources of _ciscoAppFirstSecFlowLogBucket_, _ciscoAppFirstSecFlowLogBucketPolicy_ and _ciscoAppFirstSecVpcFlowLog_.

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Update the S3 flow log bucket policy to permit the *swc-role* to list and retrieve files. Take a minute to review the contents of the new policy at *${DOLLAR_SIGN}LAB/swc/swc-flowlogs-bucket-policy.json*. There will be no output from the command unless there's an error.

    ###### Command

    ```
    aws s3api put-bucket-policy --bucket ${AWS_FLOW_LOG_BUCKET} --policy file://${DOLLAR_SIGN}LAB/swc/swc-flowlogs-bucket-policy.json
    ```

3. Provide Stealthwatch Cloud with the S3 Bucket name that contains the VPC flow logs. Visit the management interface and set the fields with the following values.

    > [https://cisco-${POD_NAME}.obsrvbl.com/accounts/settings/aws/#/settings/aws/flowlogs](https://cisco-${POD_NAME}.obsrvbl.com/accounts/settings/aws/#/settings/aws/flowlogs)

    | **S3 Path**                             | **Credentials**     |
    | ----------------------------------------| ------------------- |
    | ${AWS_FLOW_LOG_BUCKET}    | swc-role            |

4. Click the _+_ button.

5. Visit the Stealthwatch Cloud management interface to confirm that the _AWS_ sensor shows up in the _Sensor List_ and has a green icon to indicate the configuration is working as expected.

    > [https://cisco-${POD_NAME}.obsrvbl.com/sensors/list/](https://cisco-${POD_NAME}.obsrvbl.com/sensors/list/)

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191021172621979.png" alt="image-20191021172621979" style="zoom:50%;" />


##### Instrument Stealthwatch Cloud into Kubernetes

The Stealthwatch Cloud service can monitor network traffic between pods running in Kubernetes clusters. In order to to have visibility into inter-pod traffic, each node needs a Stealthwatch Cloud sensor pod. A Kuberentes DaemonSet is used to ensure that those pods always exist on those nodes.

> **TIP**
>
> If you're using Google Kubernetes Engine (GKE)  there is no need to deploy a Kubernetes sensor. Instead, set up an integration to GCP VPC Flow Logs, which already contain Kubernetes inter-pod traffic.

> **TIP**
>
> There are good instructions for setting up this integration (among others) in the Stealthwatch Cloud administrative interface. It's worth reviewing, although it's recommended for this lab to follow the steps below to better understand what you're doing and maintain naming conventions.
>
> [https://cisco-${POD_NAME}.obsrvbl.com/integrations/kubernetes/](https://cisco-${POD_NAME}.obsrvbl.com/integrations/kubernetes/)

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Change the current context for _kubectl_ to ensure that the Kubernetes objects that you're going to create are in the _default_ namesapce.

    ###### Command

    ```
    kubectl config set-context --current --namespace=default
    ```

    ###### Output

    ```
    Context "arn:aws:eks:${AWS_REGION}:${AWS_ACCT_ID}:cluster/app-first-sec" modified.
    ```

3. Create a Kubernetes secret with the service key that the pods will use to authenticate to Stealthwatch Cloud.

    ###### Command

    ```
    kubectl create secret generic swc --from-file=service_key=${DOLLAR_SIGN}HOME/environment/lab/swc/swc-service-key.txt
    ```

4. After creating the _swc_ secret, create a new Kubernetes service account named _swc_.

    ###### Command

    ```
    kubectl create serviceaccount --generator=serviceaccount/v1 swc
    ```

    ###### Output

    ```
    serviceaccount/swc created
    ```

5.  Bind the _swc_ service account to the read-only cluster role named _view_.

    ###### Command

    ```
    kubectl create clusterrolebinding swc --clusterrole=view --serviceaccount=default:swc
    ```

    ###### Output

    ```
    clusterrolebinding.rbac.authorization.k8s.io/swc created
    ```

6. Deploy the the DaemonSet to schedule a sensor pod on the nodes. By default, this DaemonSet will schedule pods on the master and worker nodes, which is a best practice.

    A DaemonSet ensures that all (or some) nodes run a copy of a pod. As nodes are added to the cluster, pods are added to them. As nodes are removed from the cluster, those pods are garbage collected. Deleting a DaemonSet will clean up the pods it created.

    > **NOTE**
    >
    > If you're using a managed Kubernetes service like AWS EKS, the master node is completely managed by AWS. Therefore, it's not possible to have the DaemonSet deploy a sensor pod to the master node. This follows the shared security model for PaaS and IaaS, where you expect AWS to secure the infrastructure like the master node.

    ###### Command

    ```
    kubectl apply -f ${DOLLAR_SIGN}LAB/swc/swc-k8s-daemonset.yaml
    ```

    ###### Output

    ```
    daemonset.apps/swc-ona created
    ```

7. Verify that there are three _swc-ona_ pods running with one on each worker node in your cluster.

    ###### Command

    ```
    kubectl get pods -o wide
    ```

    ###### Output

    ```
    NAME                READY   STATUS    ...   NODE
    swc-ona-bptvr   1/1     Running   ...   ip-10-50-120-150.ec2.internal
    swc-ona-hkgfd   1/1     Running   ...   ip-10-50-120-149.ec2.internal
    swc-ona-qsbpg   1/1     Running   ...   ip-10-50-110-164.ec2.internal
    ```

8. Visit the Stealthwatch Cloud administrative interface to confirm that there are three new sensors showing up in the sensor list.

    > [https://cisco-${POD_NAME}.obsrvbl.com/sensors/list/](https://cisco-${POD_NAME}.obsrvbl.com/sensors/list/)

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022200716161.png" alt="image-20191022200716161" style="zoom:50%;" />

9. Return to the Cloud9 IDE terminal that you were just using.

10. Change the current context for _kubectl_ back to the _sock-shop_ namespace for the remainder of the lab.

    ###### Command

    ```
    kubectl config set-context --current --namespace=sock-shop
    ```

    ###### Output

    ```
    Context "arn:aws:eks:${AWS_REGION}:${AWS_ACCT_ID}:cluster/app-first-sec" modified.
    ```



#### Stealthwatch Cloud summary

Now you can sleep more soundly knowing that Stealthwatch Cloud is providing public visibility and threat detection for your vibrant Sock Shop business.

Stealthwatch Cloud is now consuming all sources of telemetry native to AWS, including Amazon Virtual Private Cloud (VPC) flow logs, and Kubernetes pod traffic to monitor all activity in the cloud without the need for software agents. Stealthwatch Cloud was deployed in these environments in a matter of minutes with no disruption to service availability. Stealthwatch Cloud uses this data to model the behavior of each cloud resource, a method called entity modeling. It is then able to detect and alert on sudden changes in behavior, malicious activity, and signs of compromise.

------

## Implement security - Secure Cloud Workload

------

<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/arch2-tet.png" alt="arch2.png" />

This section will help you do the following:

1. Learn the basics of Cisco Secure Workload external integrations and policy
2. Create Kubernetes service accounts
3. Understand attack lateral movement in Kubernetes

#### Overview

Cisco Secure Workload offers holistic workload protection for multi-cloud data centers by enabling a zero-trust model using segmentation. This approach allows you to identify security incidents faster, contain lateral movement, and reduce your attack surface. Secure Workload's infrastructure-agnostic approach supports both on-premises and public cloud workloads.

Secure Workload provides these core benefits:

- Uses behavior-based application insight to automate whitelist policy.
- Minimizes lateral movement using application segmentation to enable a secure zero-trust model.
- Identifies anomalies faster by using process behavior deviations.
- Reduces the attack surface within the data center by quickly identifying common vulnerabilities and exposures.
- Collects comprehensive telemetry from a heterogeneous environment to provide actionable insights in minutes.
- Enables long-term data retention for deep forensics, analysis, and troubleshooting.

#### Steps

* [Secure Workload integration with AWS](#Secure Workload-integration-with-aws)
* [Secure Workload integration with Kubernetes](#Secure Workload-integration-with-kubernetes)
* [Enforce application segmentation based on Kubernetes annotations](#enforce-application-segmentation-based-on-kubernetes-annotations)
* [Simulate a breach and lateral movement](#simulate-a-breach-and-lateral-movement)
* [Create a flow search](#create-a-flow-search)
* [Create invetory filters](#create-invetory-filters)
* [Define application segmenation](#define-application-segmenation)
* [Confirm lateral movement has been blocked](#confirm-lateral-movement-has-been-blocked)
* [Confirm the application is working as expected](#confirm-the-application-is-working-as-expected)

> **WARNING**
>
> Firefox is not a supported browser for the Secure Workload management interface.

###### Set Secure Workload Credentials

Since this is the first time you'll be accessing Secure Workload, you'll need to set your credentials. We're using your own email _${DEVNET_EMAIL_ADDRESS}_ to give access to Secure Workload, but you'll need set the password for this account.

1. Visit the Secure Workload management interface to set a password for your newly created Secure Workload account

    > [https://tet-pov-rtp1.cpoc.co/h4_users/password/new](https://tet-pov-rtp1.cpoc.co/h4_users/password/new)

2. Enter _${DEVNET_EMAIL_ADDRESS}_, which is the email address associated with your DevNet account when you reserved the sandbox for this lab. Click the _Send password reset link_ button.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200715054416.png" alt="image-20200715054416" style="zoom:50%;" />

4. Check your for the password reset email and follow the steps in the email to set a new password for your account

    > **NOTE**
    >
    > It's recommended to use the password _${POD_PASSWORD}_ to simplify access for yourself across all interfaces in the lab.

5. Confirm you can log into the Secure Workload management interface using _${DEVNET_EMAIL_ADDRESS}_ and the password you just set

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co)


##### Secure Workload integration with AWS

Create AWS IAM policy and user for Secure Workload with restrictive permissions using the AWS CLI.

1. Create AWS IAM policy with access to resources and actions that Secure Workload needs.

    ###### Command

    ```
    aws iam create-policy --policy-name Secure Workload-read-only --policy-document file://${DOLLAR_SIGN}LAB/Secure Workload/Secure Workload-aws-read-only-policy.json
    ```

    ###### Output

    ```
    {
       "Policy": {
           "PolicyName": "Secure Workload-read-only",
           "PolicyId": "RFUWK63KANPA5WOZ4JBES",
           "Arn": "arn:aws:iam::${AWS_ACCT_ID}:policy/Secure Workload-read-only",
           "Path": "/",
           "DefaultVersionId": "v1",
           "AttachmentCount": 0,
           "PermissionsBoundaryUsageCount": 0,
           "IsAttachable": true,
           "CreateDate": "2019-10-18T12:35:08Z",
           "UpdateDate": "2019-10-18T12:35:08Z"
       }
    }
    ```

    If you review the policy applied to the _Secure Workload-read-only_ IAM user in _${DOLLAR_SIGN}LAB/Secure Workload/Secure Workload-aws-read-only-policy.json_, you'll notice that it explicitly specifies read-only _Actions_.

2. Create AWS IAM user for Secure Workload to use.

    ###### Command

    ```
    aws iam create-user --user-name Secure Workload-read-only
    ```

    ###### Output

    ```
    {
       "User": {
           "Path": "/",
           "UserName": "Secure Workload-read-only",
           "UserId": "WOZRFUAIDA5WDXCIN34YQ",
           "Arn": "arn:aws:iam::${AWS_ACCT_ID}:user/Secure Workload-read-only2",
           "CreateDate": "2019-10-18T12:35:55Z"
       }
    }
    ```

3. Attach the IAM policy to the IAM user to grant the user permissions to access resources. There will be no output from the command unless there's an error.

    ###### Command

    ```
    aws iam attach-user-policy --policy-arn arn:aws:iam::${AWS_ACCT_ID}:policy/Secure Workload-read-only --user-name Secure Workload-read-only
    ```

4. Generate an access key for the _Secure Workload-read-only_ user.

    ###### Command

    ```
    aws iam create-access-key --user-name Secure Workload-read-only
    ```

    ###### Output

    ```
    {
       "AccessKey": {
           "UserName": "Secure Workload-read-only",
           "AccessKeyId": "AKIFUWHWXAQLFYA5WOZR",
           "Status": "Active",
           "SecretAccessKey": "AKIFUWHWXAQLFYA5WOZR/AKIFUWHWXAQLFYA5WOZR",
           "CreateDate": "2019-10-18T12:42:58Z"
       }
    }
    ```

    You'll use the _AccessKeyId_ and _SecretAccessKey_ values when you configure Secure Workload for AWS external orchestration integration.

5. Return to the Secure Workload administrative interface to add the AWS IAM user credentials.

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co/)

    Login using the following values.

    | Field                 | Value                                        |
    | --------------------- | -------------------------------------------- |
    | Email                 | ${DEVNET_EMAIL_ADDRESS}                      |
    | Password              | ${POD_PASSWORD} (or password you set)        |

6. Navigate to the _External Orchestrators_ page under _VISIBILITY_ in the left menu pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018083122803.png" alt="image-20191018083122803" style="zoom:50%;" />

7. Click the _Create New Configuration_ button.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018083250277.png" alt="image-20191018083250277" style="zoom:50%;" />

8. Set the values in the _Create External Orchestrator Configuration_ dialogue modal with the following values. Select _Type_ as Kubernetes and _K8s Manager Type_ as EKS. The _AWS Access Key Id_ and _AWS Secret Access Key_ correspond to the _AccessKeyId_ and _SecretAccessKey_ values in the output of the _aws iam create-access-key_ command in an earlier step.

    | Field                 | Value                                                                 |
    | --------------------- | ----------------------------------------------------------------------|
    | Type                  | AWS                                                                   |
    | Name                  | app-first-sec-aws                                                     |
    | AWS Access Key Id     | [_AccessKeyId_ from _aws iam create-access-key_ in previous step]     |
    | AWS Secret Access Key | [_SecretAccessKey_ from _aws iam create-access-key_ in previous step] |
    | AWS Region            | ${AWS_REGION}                                                         |

10. Retrieve the Kubernetes API hostname using the AWS CLI _eks describe-cluster_ command to use when entering the Kubernetes configuration into Secure Workload in future steps. Switch to Hosts List tab from vertical menu on the left-hand side and add API server endpoint address and port (TCP Port 443) details for the EKS cluster in the provided space.

    ###### Command

    ```
    aws eks describe-cluster --name app-first-sec | jq -r '.cluster.endpoint' | sed 's/https:\/\///'
    ```

    ###### Output

    ```
    40D7AAC6763809EAD50E.gr1.${AWS_REGION}.eks.amazonaws.com
    ```

11. Click the _Create_ button. Once Secure Workload successfully connects to AWS it will display a _Connection Status_ of _Success_.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022192046986.png" alt="image-20191022192046986" style="zoom:50%;" />

    > **WARNING**
    >
    > The _Connection Status_ field will show a value of _Failure_ for the _app-first-sec-aws_ row before it has attempted to connect to AWS. Give it a minute to validate the configuration you just entered. Once the _Connection Status_ field value is set to _Success_ proceed to the next step.

12. You can confirm that AWS annotations are available in Secure Workload by visiting _Inventory Search_ under _VISIBILITY_ in the left menu pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022192311933.png" alt="image-20191022192311933" style="zoom:50%;" />

13. In the _Filters_ field, type _aws_ to show the annotations that are available from the external orchestration integration you completed. These annotations can be used when defining policy, searching for inventory and filtering flows.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022192756143.png" alt="image-20191022192756143" style="zoom:50%;" />

    > **NOTE**
    >
    > It can take a minute or two for annotations to show up after the _Connection Status_ field value is set to _Success_.
    > **WARNING**
    >
    > The _Connection Status_ field will show a value of _Failure_ for the _app-first-sec-k8s_ row before it has attempted to connect to Kubernetes. Give it a minute to validate the configuration you just entered. Once the _Connection Status_ field value is set to _Success_ proceed to the next step.



##### Enforce application segmentation based on Kubernetes annotations

Application definition in Secure Workload plays a central role in many features including visibility, policy enforcement, policy compliance and multi-tenancy.

Application Dependency Mapping (ADM) is a functionality in Cisco Secure Workload that helps provide insight into the kind of complex applications that run in a datacenter. These automatic policy generation works extremely well in brown-field application environments where you're not sure what applications exist and where. In a DevOps would where everything is automated and infrastructure configuration is managed like application code, manually defined policies are important to secure applications as they are deployed. A blend of both provides for complete coverage for our customers.

In our environment, we'll be using a zero trust policy specific to this lab that permits AWS EKS operational traffic, the Sock Shop application, and Cisco security services. You'll simulate an attack from the front-end service and subsequently block it from happening using the zero trust policy.

You'll use Ansible playbooks to configure and enforce the policy, which will protect against lateral movement between services.



###### Simulate a breach and lateral movement

1. Simulate an attacker gaining shell access via the _front-end_ service by opening a shell on the _front-end_ pod. First we need to retrieve the _front-end_ pod name.

    ###### Command

    ```
    kubectl get pods
    ```

    ###### Output

    ```
    NAME                            READY   STATUS    RESTARTS   AGE
    carts-6bfcf84f4-cnd7d           1/1     Running   0          16h
    carts-db-6bfc588c5f-tw48c       1/1     Running   0          16h
    ...
    front-end-b5f568888-rrjhh       1/1     Running   0          13h
    ```

    ###### Command

    ```
    kubectl exec -it <front-end pod name from previous command> -- /bin/sh
    ```

    ###### Output

    ```
    /usr/src/app $
    ```

2. Simulate lateral movement by having the attacker access the _payment_ service although only the _orders_ pods should have access to it. We'll use _netcat_ to connect to the _payment_ service and provide the necessary http headers and payload once connected.

    In this simulation, we don't actual provide any unique identifiers to associated the authorization with a user's account or credit card, but the implications in the real-world could be crediting an account with some funds from another accounts payment details.

    ###### Command

    ```
    nc payment 80
    ```

    ###### Enter

    ```
    POST /paymentAuth HTTP/1.1
    Host: payment
    Content-Length: 14

    {"Amount":40}
    ```

    ###### Output

    ```
    {"authorised":true,"message":"Payment authorised"}
    ```

    ###### Enter

    ```
    [ctrl-c]
    ```

    ###### Output

    ```
    ^Cpunt!

    /usr/src/app $
    ```

    > **TIP**
    >
    > Although obvious, it's worth noting that it is not recommend to leave _netcat_ installed in a container image. In addition, it's recommended to run containers as immutable so that software can't be installed or built locally should an attacker gain access. As we all know, best practices are not always followed so this scenario is 100% valid and witnessed in production application deployments.


###### Perform a flow search

The Flows option in the top-level menu takes you to the Flow Search page. This page provides the means for quickly filtering and drilling down into the flows corpus. The basic unit is a “Flow Observation” which is a per-minute aggregation of each unique flow. The two sides of the flow are called “Consumer” and “Provider”, the Consumer is the side that initiated the flow, and the Provider is responding to the Consumer (e.g. “Client” and “Server” respectively). Each observation tracks the number of packets, bytes, and other metrics in each direction for that flow for that minute interval.

You want to confirm that the software agent is sending flow data to Secure Workload, so you'll use the _Flow Search_ to verify that it's seeing flows to the _front-end_ pods.

1. Within the Secure Workload administrative interface navigate to _Flow Search_ under _VISIBILITY_ in the navigation menu on the left side.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018122327038.png" alt="image-20191018122327038" style="zoom:50%;" />

2. Specify a _Filter_ to search for flows that were destined to the Sock Shop _front-end_ pods.

    Type _name_ in the _Filters_ field. Select _* Provider Orchestrator name_ from the drop-down options provided.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018122810702.png" alt="image-20191018122810702" style="zoom:50%;" />

    > **NOTE**
    >
    > Do not select _* Provider Orchestrator Name_. Notice the capitalized *N* compared to *name* in the instructions above.

    Select _=_ from the drop-down options provided.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018122953224.png" alt="image-20191018122953224" style="zoom:50%;" />

    Type _front-end_ and press _return_ or _Enter_.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018123045876.png" alt="image-20191018123045876" style="zoom:50%;" />

    Click on the _Filter Flows_ button.

    It will take some time for the flows to be filtered and then displayed at the bottom of the window.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018123212670.png" alt="image-20191018123212670" style="zoom:50%;" />


###### Create an API Key to use with Ansible

Given the application dependencies and kubernetes environment are well understood, this is an ideal situation to leverage the power of infrastructure automation. In our case, you'll use open source [Secure Workload modules](https://github.com/CiscoDevNet/Secure Workload-ansible-playbooks) for Ansible along with Ansible playbooks that have already been created for your environment.

First you'll need to create a Secure Workload API Key that the modules will use to access the APIs and define the filters.

1. Return to the Secure Workload administrative interface in your web broswer.

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co/)

2. Click the gears icon in the upper right-hand corner and then select *API Keys*.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200721073604.png" alt="image-20200721073604" style="zoom:50%;" />

3. Click on the *Create API Key* button in the upper right-hand corner.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200306142231868.png" alt="image-20200306142231868" style="zoom:50%;" />

4. Type *Ansible* in the *Description* field.

5. Check the box for *Applications and policy management: API to manage applications and enforce policies*

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200306142555651.png" alt="image-20200306142555651" style="zoom:50%;" />

    > **NOTE**
    >
    > The Secure Workload modules for Ansible could be used for other operations like managing users or doing flow searches. However, since we don't need them for this lab, we're following the least privilege principle and not enabling them.

6. Click the *Create* button.

7. You'll see a pop-up stating *API Key Created*.

    > **WARNING**
    >
    > Either leave the *API Key* and *Secret* pop-up accessible or download them so you can copy and paste the values into a configuration file in the Cloud9 terminal. If you close this pop-up, you'll need to delete this key and create a new one as there isn't a way to retrieve the *Secret* again.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200306154917232.png" alt="image-20200306154917232" style="zoom:50%;" />



###### Create inventory filters using Ansible

Now that we have an API Key we can configure Ansible to access Secure Workload and then run our playbooks to create inventory filters for all of the application, Kubernetes, AWS, and external inventory.

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Change the directory to the Secure Workload Ansible playbooks

    ###### Command

    ```
    cd ${DOLLAR_SIGN}LAB/Secure Workload/ansible
    ```

3. Provide the Secure Workload *API Key* and *API Secret* using the helper script *tetansconf*, which will add the values to the host configuration file *${DOLLAR_SIGN}LAB/Secure Workload/ansible/host_vars/Secure Workload.yaml* and confgure the inventory filters (*${DOLLAR_SIGN}LAB/Secure Workload/ansible/tet-sock-shop-filters.yaml*) and segmentation policy (*${DOLLAR_SIGN}LAB/Secure Workload/ansible/tet-sock-shop-app.yaml*).

    ###### Command

    ```
    tetansconf
    ```

    ###### Output

    ```
    Secure Workload API Key:
    12341234123412341234

    Secure Workload API Secret:
    12341234123412341234

    Ansible Host Configuration for Secure Workload:
    ---
    # URL for the Secure Workload Dashboard
    Secure Workload_url: "https://tet-pov-rtp1.cpoc.co"
    # API Details - Create new token from Secure Workload Dashboard!
    api_key: "12341234123412341234"
    api_secret: "12341234123412341234"
    # Set to true for production setups that use trusted certificates!
    validate_certs: true
    app_scope_name: "app-first-sec-02"
    external_orchestrator_name_k8s: "app-first-sec-k8s"
    k8s_namespace: "sock-shop"
    ```

    > **NOTE**
    >
    > The variables set in this file are used in the Ansible playbooks you'll use in subsequent steps.

4. Run the playbook to create the inventory filters. Take a moment to review the contents of *${DOLLAR_SIGN}LAB/Secure Workload/ansible/tet-sock-shop-filters.yaml* and note its human-readable structure.

    ###### Command

    ```
    ansible-playbook tet-sock-shop-filters.yaml
    ```

    ###### Output

    ```
    PLAY [Configure Sock Shop Filters] ********

    TASK [Sock Shop Secure Workload add Duo] ********
    changed: [Secure Workload]
    ...
    PLAY RECAP ********
    Secure Workload                  : ok=34   changed=34
    ```

    > **NOTE**
    >
    > Although the output will say changed for these filters, it doesn't mean that the filter already existed. If an object exists and the settings are the same, the output will be *ok*. If it doesn't exist or is modified it will be shown as *changed*.

5. Return to the Secure Workload administrative interface in your web broswer.

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co/)

6. Select _Inventory Filters_ under _VISIBILITY_ in the navigation menu in the left pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018124622764.png" alt="image-20191018124622764" style="zoom:50%;" />

7. Confirm that there are additional filters beyond what you had already created manually.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200306161527737.png" alt="image-20200306161527737" style="zoom:50%;" />

> **NOTE**
>
> You might notice that the inventory filter you created for the front-end pods has changed. The playbook added the Kubernetes namespace to the query details to make the filters more precise and created an additional filter for the front-end service.


###### Define application segmentation using Ansible

Network security policies are the building block for many powerful features of Cisco Secure Workload. They provide a simple and intuitive mechanism for both application owners and security teams to define the necessary intents to secure assets and applications within data centers.

Secure Workload supports any mixture of deny/allow security models for different applications, letting application owners define very fine-grained policies to secure their applications while simultaneously allowing the security teams to enforce their guidelines and best practices on wide sets of applications.

The enforcement is managed by the Secure Workload software agents that are running on the Kubernetes worker nodes. The agent will modify the host firewall on the _Consumer_ and _Provider_ to deny or allow the specified connections.

You'll define a policy to show the power of using eternal orchestration annotations from Kubernetes to stop the lateral breach you simulated earlier between the Sock Shop _front-end_ pod and _payment_ service.

In an earlier step, you configured policy filters. Now we'll use Ansible to apply the complete zero trust policy for this application environment.

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Change the directory to the Secure Workload Ansible playbooks

    ###### Command

    ```
    cd ${DOLLAR_SIGN}LAB/Secure Workload/ansible
    ```

3. You should have already provided the Secure Workload *API Key* and *API Secret* using the helper script *tetansconf*, in a previous step. You can confirm values are set for *api_key* and *api_secret* in *${DOLLAR_SIGN}LAB/Secure Workload/ansible/host_vars/Secure Workload.yaml*.

    ###### Command

    ```
    cat ${DOLLAR_SIGN}LAB/Secure Workload/ansible/host_vars/Secure Workload.yaml
    ```

    ###### Output

    ```
    ---
    # URL for the Secure Workload Dashboard
    Secure Workload_url: "https://tet-pov-rtp1.cpoc.co"
    # API Details - Create new token from Secure Workload Dashboard!
    api_key: "12341234123412341234"
    api_secret: "12341234123412341234"
    # Set to true for production setups that use trusted certificates!
    validate_certs: true
    app_scope_name: "app-first-sec-02"
    external_orchestrator_name_k8s: "app-first-sec-k8s"
    k8s_namespace: "sock-shop"
    ```

4. Run the playbook to create the application policy. Take a moment to review the contents of *${DOLLAR_SIGN}LAB/Secure Workload/ansible/tet-sock-shop-app.yaml* and note its human-readable structure.

    ###### Command

    ```
    ansible-playbook tet-sock-shop-app.yaml
    ```

    ###### Output

    ```
    PLAY [Configure Sock Shop App Policy] ********

    TASK [Create Application] ********
    changed: [Secure Workload]
    ...
    PLAY RECAP ********
    Secure Workload                  : ok=50   changed=47
    ```

    > **NOTE**
    >
    > Although the output will say changed for these policies, it doesn't mean that the policy already existed. If an object exists and the settings are the same, the output will be *ok*. If it doesn't exist or is modified it will be shown as *changed*.

    > **WARNING**
    >
    > If you get an error similar to _"a primary application with this scope already exist"_, it's possible that when you manually created the workspace in Secure Workload that the name doesn't match the playbook expected name of _Sock Shop_. You can change the name in Secure Workload or in the playbook to make sure they match to overcome the error.

5. Return to the Secure Workload administrative interface in your web broswer.

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co/)

6. Select _SEGMENTATION_ in the navigation menu in the left pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018125829189.png" alt="image-20191018125829189" style="zoom:50%;" />

7. You should be taken back to the *Sock Shop* application workspace that you created in a previous step. If that's not the case, click _Switch Application_. Then select the *Sock Shop* application workspace.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018130105438.png" alt="image-20191018130105438" style="zoom:50%;" />

8. Confirm that there are additional policies beyond what you had already created manually.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200306182347896.png" alt="image-20200306182347896" style="zoom:50%;" />



###### Confirm lateral movement has been blocked

These are the same steps that you did earlier, but this time the attempt to simulate a breach and lateral  movement from the _front-end_ pod to the _payment_ service will fail.

1. Simulate an attacker gaining shell access via the _front-end_ service by opening a shell on the _front-end_ pod. First we need to retrieve the _front-end_ pod name.

    ###### Command

    ```
    kubectl get pods
    ```

    ###### Output

    ```
    NAME                            READY   STATUS    RESTARTS   AGE
    carts-6bfcf84f4-cnd7d           1/1     Running   0          16h
    carts-db-6bfc588c5f-tw48c       1/1     Running   0          16h
    ...
    front-end-b5f568888-rrjhh       1/1     Running   0          13h
    ```

    ###### Command

    ```
    kubectl exec -it <front-end pod name from previous command> -- /bin/sh
    ```

    ###### Output

    ```
    /usr/src/app $
    ```

2. Simulate lateral movement by having the attacker access the _payment_ service although only the _orders_ pods should have access to it. We'll use _netcat_ to connect to the _payment_ service and provide the necessary http headers and payload once connected.

    ###### Command

    ```
    nc payment 80
    ```

    ###### Enter

    ```
    POST /paymentAuth HTTP/1.1
    Host: payment
    Content-Length: 14

    {"Amount":40}
    ```

    There should be no response after entering the last line and pressing enter. Thee connection was never established and the lateral movement has been denied.

    > **NOTE**
    >
    > If there is still the same response as you saw earlier, Secure Workload hasn't made the changes yet in the host firewall. Wait ten more seconds, re-enter the text above.

    ###### Enter

    ```
    [ctrl-c]
    ```

    ###### Output

    ```
    ^Cpunt!

    /usr/src/app $
    ```



###### Confirm the application is working as expected

Negative impacts of enforced security policy is a large concern for application owners and DevOps teams. In some cases, they will avoid engaging with security teams altogether to avoid the risk of security "breaking" their applicaiton. It's important to be able to show that the application continues to work after enforcing our security policy.

> **NOTE**
>
> In a DevSecOps team, verification that the user experience hadn't been negatively impacted would be done as part of an automated test triggered by the change in the security policy in a staging environment. If the tests failed, the policy would be automatically removed and the person who had defined the policy would be notified of the failed test.

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Create your lab user for the Sock Shop application using a helper script.

    ###### Command

    ```
    addshopuser
    ```

3. Retrieve the EC2 Load Balancer DNS A record that has been allocated to the _front-end_ service using kubectl.

    ###### Command

    ```
    kubectl get services front-end
    ```

    ###### Output

    ```
    NAME        TYPE           CLUSTER-IP       EXTERNAL-IP                         ...
    front-end   LoadBalancer   172.20.229.246   acdeb.${AWS_REGION}.elb.amazonaws.com   ...
    ```

4. Visit the DNS A record in the _EXTERNAL-IP_ field in a web browser.

5. Login to the Sock Shop as the user _${POD_NAME}_. Click the _Login_ button in the top right. Login with the following values.

    > **NOTE**
    >
    > The password is intentionally the same as the username for this login.

    | username          | password          |
    | ----------------- | ----------------- |
    | _${POD_NAME}_ | _${POD_NAME}_ |

		> **NOTE**
		>
		> If your login is unsuccessful, you might have missed the step where you created this user. Execute the command _addshopuser_ in a Cloud9 terminal and try to login to the Sock Shop again.

4. Find a pair of socks from the catalogue that are equal to or below ${DOLLAR_SIGN}40 and click on _Add to cart_. Socks that cost more than ${DOLLAR_SIGN}40 can't be purchased due to an simulated limit on credit card purchases within the app.

5. Click on the _N item(s) in cart_ button to view your cart in the Sock Shop application.

6. Click _Proceed to checkout_. This will complete the order and a new row will be added to the _My orders_ page.

    ![image-20191021025811246](https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191021025811246.png)


#### Secure Workload summary

As a small business owner, you can rest soundly knowing that Secure Workload is now protecting your booming sock business without impacting your customers experience.

You've seen that Secure Workload is a ready-to-use platform with advanced management capabilities to enable quick deployment with few configuration requirements. Using machine-learning capabilities, the platform drastically reduces the amount of human input required to understand communication patterns. And with its holistic workload capabilities, the platform allows you to build a more secure infrastructure for applications and significantly reduces the risk of exposure.
