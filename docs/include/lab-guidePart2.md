
## Implement security

[Cisco’s Application-First Security](https://www.cisco.com/c/en/us/solutions/security/application-first-security/index.html) solution enables you to gain visibility into application behavior and increase the effectiveness of security controls by combining capabilities of best-in-class products including Tetration, Stealthwatch Cloud, Duo Beyond and AppDynamics.

In this section you'll be using Tetration, Stealthwatch Cloud, and Duo to secure your AWS environment, Kubernetes cluster and your Sock Shop application.

* [Tetration](#implement-tetration)
* [Stealthwatch Cloud](#implement-stealthwatch-cloud)
* [Duo](#implement-duo)



### Implement Tetration

------

<img class="no-decoration" src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/arch2-tet.png" alt="arch2.png" />

This section will help you do the following:

1. Learn the basics of Tetration external integrations and policy
2. Create Kubernetes service accounts
3. Understand attack lateral movement in Kubernetes

#### Overview

Cisco Tetration offers holistic workload protection for multicloud data centers by enabling a zero-trust model using segmentation. This approach allows you to identify security incidents faster, contain lateral movement, and reduce your attack surface. Tetration's infrastructure-agnostic approach supports both on-premises and public cloud workloads.

Tetration provides these core benefits:

- Uses behavior-based application insight to automate whitelist policy.
- Minimizes lateral movement using application segmentation to enable a secure zero-trust model.
- Identifies anomalies faster by using process behavior deviations.
- Reduces the attack surface within the data center by quickly identifying common vulnerabilities and exposures.
- Collects comprehensive telemetry from a heterogeneous environment to provide actionable insights in minutes.
- Enables long-term data retention for deep forensics, analysis, and troubleshooting.

#### Steps

* [Tetration integration with AWS](#tetration-integration-with-aws)
* [Confirm Tetration agents have checked-in](#confirm-tetration-agents-have-checked-in)
* [Tetration integration with Kubernetes](#tetration-integration-with-kubernetes)
* [Enforce application segmentation based on Kubernetes annotations](#enforce-application-segmentation-based-on-kubernetes-annotations)
* [Simulate a breach and lateral movement](#simulate-a-breach-and-lateral-movement)
* [Create a flow search](#create-a-flow-search)
* [Create invetory filters](#create-invetory-filters)
* [Define application segmenation](#define-application-segmenation)
* [Confirm lateral movement has been blocked](#confirm-lateral-movement-has-been-blocked)
* [Confirm the application is working as expected](#confirm-the-application-is-working-as-expected)

> **WARNING**
>
> Firefox is not a supported browser for the Tetration management interface.

###### Set Tetration Credentials

Since this is the first time you'll be accessing Tetration, you'll need to set your credentials. We're using your own email _${DEVNET_EMAIL_ADDRESS}_ to give access to Tetration, but you'll need set the password for this account.

1. Visit the Tetration management interface to set a password for your newly created Tetration account

    > [https://tet-pov-rtp1.cpoc.co/h4_users/password/new](https://tet-pov-rtp1.cpoc.co/h4_users/password/new)

2. Enter _${DEVNET_EMAIL_ADDRESS}_, which is the email address associated with your DevNet account when you reserved the sandbox for this lab. Click the _Send password reset link_ button.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200715054416.png" alt="image-20200715054416" style="zoom:50%;" />

4. Check your for the password reset email and follow the steps in the email to set a new password for your account

    > **NOTE**
    >
    > It's recommended to use the password _${POD_PASSWORD}_ to simplify access for yourself across all interfaces in the lab.

5. Confirm you can log into the Tetration management interface using _${DEVNET_EMAIL_ADDRESS}_ and the password you just set

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co)

##### Tetration integration with AWS

Create AWS IAM policy and user for Tetration with restictive permissions using the AWS CLI.

1. Create AWS IAM policy with access to resources and actions that Tetration needs.

    ###### Command

    ```
    aws iam create-policy --policy-name tetration-read-only --policy-document file://${DOLLAR_SIGN}LAB/tetration/tetration-aws-read-only-policy.json
    ```

    ###### Output

    ```
    {
       "Policy": {
           "PolicyName": "tetration-read-only",
           "PolicyId": "RFUWK63KANPA5WOZ4JBES",
           "Arn": "arn:aws:iam::${AWS_ACCT_ID}:policy/tetration-read-only",
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

    If you review the policy applied to the _tetration-read-only_ IAM user in _${DOLLAR_SIGN}LAB/tetration/tetration-aws-read-only-policy.json_, you'll notice that it explicitly specifies read-only _Actions_.

2. Create AWS IAM user for Tetration to use.

    ###### Command

    ```
    aws iam create-user --user-name tetration-read-only
    ```

    ###### Output

    ```
    {
       "User": {
           "Path": "/",
           "UserName": "tetration-read-only",
           "UserId": "WOZRFUAIDA5WDXCIN34YQ",
           "Arn": "arn:aws:iam::${AWS_ACCT_ID}:user/tetration-read-only2",
           "CreateDate": "2019-10-18T12:35:55Z"
       }
    }
    ```

3. Attach the IAM policy to the IAM user to grant the user permissions to access resources. There will be no output from the command unless there's an error.

    ###### Command

    ```
    aws iam attach-user-policy --policy-arn arn:aws:iam::${AWS_ACCT_ID}:policy/tetration-read-only --user-name tetration-read-only
    ```

4. Generate an access key for the _tetration-read-only_ user.

    ###### Command

    ```
    aws iam create-access-key --user-name tetration-read-only
    ```

    ###### Output

    ```
    {
       "AccessKey": {
           "UserName": "tetration-read-only",
           "AccessKeyId": "AKIFUWHWXAQLFYA5WOZR",
           "Status": "Active",
           "SecretAccessKey": "AKIFUWHWXAQLFYA5WOZR/AKIFUWHWXAQLFYA5WOZR",
           "CreateDate": "2019-10-18T12:42:58Z"
       }
    }
    ```

    You'll use the _AccessKeyId_ and _SecretAccessKey_ values when you configure Tetration for AWS external orchestration integration.

5. Return to the Tetration administrative interface to add the AWS IAM user credentials.

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

8. Set the values in the _Create External Orchestrator Configuration_ dialogue modal with the following values. The _AWS Access Key Id_ and _AWS Secret Access Key_ corrispond to the _AccessKeyId_ and _SecretAccessKey_ values in the output of the _aws iam create-access-key_ command in an earlier step.

    | Field                 | Value                                                        |
    | --------------------- | ------------------------------------------------------------ |
    | Type                  | AWS                                                          |
    | Name                  | app-first-sec-aws                                            |
    | AWS Access Key Id     | [_AccessKeyId_ from _aws iam create-access-key_ in previous step] |
    | AWS Secret Access Key | [_SecretAccessKey_ from _aws iam create-access-key_ in previous step] |
    | AWS Region            | ${AWS_REGION}                                                |

9. Click the _Create_ button. Once Tetration successfully connects to AWS it will display a _Connection Status_ of _Success_.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022192046986.png" alt="image-20191022192046986" style="zoom:50%;" />

    > **WARNING**
    >
    > The _Connection Status_ field will show a value of _Failure_ for the _app-first-sec-aws_ row before it has attempted to connect to AWS. Give it a minute to validate the configuration you just entered. Once the _Connection Status_ field value is set to _Success_ proceed to the next step.

10. You can confirm that AWS annotations are available in Tetration by visiting _Inventory Search_ under _VISIBILITY_ in the left menu pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022192311933.png" alt="image-20191022192311933" style="zoom:50%;" />

11. In the _Filters_ field, type _aws_ to show the annotations that are available from the external orchestration integration you completed. These annotations can be used when defining policy, searching for inventory and filtering flows.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022192756143.png" alt="image-20191022192756143" style="zoom:50%;" />

    > **NOTE**
    >
    > It can take a minute or two for annotations to show up after the _Connection Status_ field value is set to _Success_.


> **NOTE**
>
> If you skipped ahead while waiting for your EKS Kubernetes cluster to be created, you should return to the terminal where you executed _eksctl create cluster_ and check the current status.
>
> If the cluster is still being created and you haven't started the Stealthwatch Cloud section, please proceed to [Implement Stealthwatch Cloud](#implement-stealthwatch-cloud).
>
> If the cluster creation has completed, return to [Explore Kubernetes using kubectl](#explore-kubernetes-using-kubectl) where you will deploy the Sock Shop application using Kubernetes.

> **WARNING**
>
> Do not proceed to the next section that covers Tetration's agents and integration with Kuberenetes if the cluster creation hasn't completed as the next set of steps will fail.


##### Confirm Tetration agents have checked-in

When you created the the EKS Kubernetes cluster, you specified _preBootstrapCommands_ that installed the Tetration software agent in each of the worker nodes during their first boot. When the Tetration agent services first start, they registered to the Tetration cluster using predefined information in the agent installation script. They periodically check-in with Tetration and wait for configuration pushes.

Software agents are configured by creating _Agent Config Intents_ that associate an _Agent Config Profile_ with either an _Inventory Filter_ or a _Scope_. A software agent configuration has already been created for you that enables all security features including segmentation enforcement.

1. Visit the Tetration administrative interface in your web browser.

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co)

2. Navigate to _Software Agent Configure_ via the top right navigation menu by clicking on the gear image.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200721073551.png" alt="image-20200721073551" style="zoom:50%;" />

3. Note that the _Agent Config Intent_ that was created for this lab is named _app-first-sec_ and uses the entire scope as its filter for selecting which agents will use this agent configuration.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191213135412989.png" alt="image-20191213135412989" style="zoom:50%;" />

4. View the _Agent List_ to see all agents that have ever registered including inactive agents.

    > [https://tet-pov-rtp1.cpoc.co/#/software-agents/list](https://tet-pov-rtp1.cpoc.co/#/software-agents/list)

5. Confirm the total number of agents is equal to the number of worker nodes in your EKS Kubernetes cluster. Also confirm that the _Hostname_ and _IP Addresses_ fields correlate to the worker nodes.

    ![image-20191018111656851](https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018111656851.png)

    ###### Command

    ```
    kubectl get nodes -o wide
    ```

    ###### Output

    ```
    NAME                            STATUS   ROLES    AGE     VERSION    INTERNAL-IP    ...
    ip-10-50-110-147.ec2.internal   Ready    <none>   3d23h   v1.13.10   10.50.110.147  ...
    ip-10-50-110-164.ec2.internal   Ready    <none>   3d23h   v1.13.10   10.50.110.164  ...
    ip-10-50-120-149.ec2.internal   Ready    <none>   3d23h   v1.13.10   10.50.120.149  ...
    ```


##### Tetration integration with Kubernetes

When an external orchestrator configuration is added for a Kubernetes cluster, Tetration connects to the cluster’s API server and tracks the status of nodes, pods and services in that cluster. For each object type, Tetration imports all Kubernetes labels and annotations associated with the object. Label keys are imported as is, and annotation keys are prefixed with annotation/. All values are imported as is.

In addition to importing the labels and annotations defined for Kubernetes/OpenShift objects, Tetration also generates a number of annotations that facilitate the use of these objects in inventory filters. These additional annotations are especially useful in defining scopes and policies.

> **WARNING**
>
> AWS EKS and EC2 Elastic LoadBalancers are not officially supported by Tetration. This documentation aims to show demo and POC capabilities. Tetration integrated with AWS EKS and EC2 Elastic LoadBalancers is not intended to be used in production without formal agreement from the Tetration Product Team and TAC.
>
> Tetration does not yet support Kubernetes version 1.16+ due to a Kubernetes API deprecation. Kubernetes worker nodes using Amazon Linux are not yet supported by Tetration agents, which will fail during installation.
>
> These support statements are true at time of writting, so make sure you’re using the latest information from https://www.cisco.com/c/en/us/products/security/tetration/.


1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Create a Kubernetes service account with RBAC controls that provided only the access necessary.

    ###### Command

    ```
    kubectl apply -f ${DOLLAR_SIGN}LAB/tetration/tetration-k8s-read-only-rbac.yaml
    ```

    ###### Output

    ```
    serviceaccount/tetration-read-only created
    clusterrole.rbac.authorization.k8s.io/tetration-read-only-role created
    clusterrolebinding.rbac.authorization.k8s.io/tetration-read-only-binding created
    ```

    > **NOTE**
    >
    > The file that we're passing to _kubectl_ is a Kubernetes manifest. A manifest is a specification of a Kubernetes API object in JSON or YAML format. It specifies the desired state of an object that Kubernetes will maintain when you apply the manifest. Each configuration file can contain multiple manifests.

3. Get the the token for the _tetration-read-only_ sevice account to use when entering the Kubernetes configuration into Tetration in future steps. There's nothing to do with the output for now other than confirm you have it ready.

    ###### Command

    ```
    kubectl get secret --namespace=default `kubectl --namespace=default get sa tetration-read-only -o json | jq -r '.secrets[0].name'` -o json | jq -r '.data.token' | base64 -d ; echo
    ```

    ###### Output

    ```
    eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9dltED7Ey30Z0IQqIPmzqFAfEJ9hSCpeaH3JmudUnpKPEbqIa4R8rnAx4wNK1oVyONfKkv-5rPSrQRJ8GCXTxeD-mKjjJZHcLriV6hfrmostHN3pioDpavBTsQ73KZOShfndvq6OeQW-HmFO1halMc8H5AEqqBhlLjChoY66YGdwWw_AjdXt2Viuj7cClj-FSzAiTo-iGo8EvEe-s1CwbQKb_BA3am_Hj00Y7GQylzEi2rp9CofaU6-CrWZxGwmHAqljFgf9QWT4q829PM1aENyz6Q
    ```

4. Retrieve the CA certificate for the Kuberentes API using the AWS CLI _eks describe-cluster_ command to use when entering the Kubernetes configuration into Tetration in future steps. There's nothing to do with the output for now other than confirm you have it ready.

    ###### Command

    ```
    aws eks describe-cluster --name app-first-sec | jq -r '.cluster.certificateAuthority.data' | base64 -d
    ```

    ###### Output

    ```
    -----BEGIN CERTIFICATE-----
    MIICyDCCAbCgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
    cm5ldGVzMB4XDTE5MTAxNDE1MTkxMloXDTI5MTAxMTE1MTkxMlowFTETMBEGA1UE
    AxMKa3ViZXJuZXR35HJ+Ct47YrqYAucyg3JxT8TsNJGwZo6FWdMPN3tZ
    7lWiZLROK4/X6fBv+glbdeDVXb/2cdc1UGKOqg+lKhm5+h2K2gtgUJKCEfHmJrgj
    3Skp6m377bluY8IIibazuXdMMR1dNuRtwGWfMnu7dZeXKeOgIeKxDdVnHEFzwFan
    Xfcm+jiPzVVjeO9PawX9bqXV7d9UuuPRRPKUkZW83qapQwaE2RGXeC7oSGiBbD1L
    rdHkK5WjAdqvXuY5gUcCAwEAAaMjMCEwDgYDVR0PAQH/BAQDAgKkMA8GA1UdEwEB
    /wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBABljEWtXrnINUNXgQWYkz6SjoHoO
    CMA2/Zzunz/Vf64jlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALcI
    pJx4sKDHM2OamvU/KC3y3aUFx5vy4DTabg4aliPRP07ar4UcMJ0T1OqYVK64OpZk
    rlLkeh+YeHsPopbOzGQ6IMpLT1EUCDjzJtVhCoZH2PAEPf9UNIIupkmGD2p7pIZYQg=
    -----END CERTIFICATE-----
    ```

5. Retrieve the Kuberentes API hostname using the AWS CLI _eks describe-cluster_ command to use when entering the Kubernetes configuration into Tetration in future steps. There's nothing to do with the output for now other than confirm you have it ready.

    ###### Command

    ```
    aws eks describe-cluster --name app-first-sec | jq -r '.cluster.endpoint' | sed 's/https:\/\///'
    ```

    ###### Output

    ```
    40D7AAC6763809EAD50E.gr1.${AWS_REGION}.eks.amazonaws.com
    ```

6. Return to the Tetration administrative interface to add the Kubernetes service account credentials.

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co/)

7. Navigate to _External Orchestrators_ under _VISIBILITY_ in the navigation menu in the left pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018083122803.png" alt="image-20191018083122803" style="zoom:50%;" />

8. Click the _Create New Configuration_ button.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018083250277.png" alt="image-20191018083250277" style="zoom:50%;" />

9. Set the values in the _Create External Orchestrator Configuration_ dialogue modal with the following values. The _Auth Token_ and _CA Certificate_ corrispond to the _kubectl get secret_ and _aws eks describe-cluster_ output in an earlier steps.


    | Field          | Value                                                     |
    | -------------- | --------------------------------------------------------- |
    | Type           | Kubernetes                                                |
    | Name           | app-first-sec-k8s                                         |
    | Auth Token     | [Output from _kubectl get secret_ in previous step]       |
    | CA Certificate | [Output from _aws eks describe-cluster_ in previous step] |

10. Click on _Hosts List_ in the dialogue modal menu on the left.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018093654679.png" alt="image-20191018093654679" style="zoom:50%;" />

11. Click the _+_ button next to the _Hosts List_ label to provide the EKS Kubernetes API hostname and port number using the output from the _aws eks describe-cluster_ output from the earlier step. Set the values hor _host name_ and _port number_ with the following values.

    | Field       | Value                                                       |
    | ----------- | ----------------------------------------------------------- |
    | host name   | [Output from _aws eks describe-cluster_ from previous step] |
    | port number | 443                                                         |

12. Click the _Create_ button. Once Tetration has successfully connected to the Kubernetes cluster, it will show a _Connection Status_ of _Success_.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191022192939535.png" alt="image-20191022192939535" />

    In the following section, you'll use this integration to define segmentation policy using Kubernetes annotations.

    > **WARNING**
    >
    > The _Connection Status_ field will show a value of _Failure_ for the _app-first-sec-k8s_ row before it has attempted to connect to Kubernetes. Give it a minute to validate the configuration you just entered. Once the _Connection Status_ field value is set to _Success_ proceed to the next step.



##### Enforce application segmentation based on Kubernetes annotations

Application definition in Tetration plays a central role in many features including visibility, policy enforcement, policy compliance and multi-tenancy.

Application Dependency Mapping (ADM) is a functionality in Cisco Tetration that helps provide insight into the kind of complex applications that run in a datacenter. These automatic policy generation works extremely well in brown-field application environments where you're not sure what applications exist and where. In a DevOps would where everything is automated and infrastructure configuration is managed like application code, manually defined policies are important to secure applications as they are deployed. A blend of both provides for complete coverage for our customers.

In our environment, we'll be using a zero trust policy specific to this lab that permits AWS EKS operational traffic, the Sock Shop application, and Cisco security services. You'll simulate an attack from the front-end service and subsequently block it from happening using the zero trust policy.

You'll build filters and policy manually to understand the management interface and concepts. However, in CI/CD pipelines policy would be defined in declarative configurations and checked into code repositories. Then infrastructure automation tools would be programmatically triggered to apply the configuration. In that vein, you'll use Ansible playbooks to configure and enforce the policy, which will protect against lateral movement between services.



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

You want to confirm that the software agent is sending flow data to Tetration, so you'll use the _Flow Search_ to verify that it's seeing flows to the _front-end_ pods.

1. Within the Tetration administrative interface navigate to _Flow Search_ under _VISIBILITY_ in the navigation menu on the left side.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018122327038.png" alt="image-20191018122327038" style="zoom:50%;" />

2. Specifiy a _Filter_ to serach for flows that were destiend to the Sock Shop _front-end_ pods.

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



###### Create invetory filters manually

Now that you know that flows are showing up in Tetration from worker nodes' agents, you can create _Inventory Filters_ that you can use to create application segmentation policies in future steps.

Filters are saved inventory searches that can be used when defining policies, config intents, etc. Each filter must be associated with a scope, which is defined as the filter’s ownership scope.

First you'll manually create a filter for the *front-end* pods to understand the process.

1. Return to the Tetration administrative interface in your web browser.

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co/)

2. Select _Inventory Filters_ under _VISIBILITY_ in the navigation menu in the left pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018124622764.png" alt="image-20191018124622764" style="zoom:50%;" />

3. Click the _Create Filter_ button.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018124753713.png" alt="image-20191018124753713" style="zoom:50%;" />

4. Define the filter in the dialogue modal by setting the fields with the following values. You'll need to just type _name_ in the _Query_ field to list the _orchestrator\_name_ option.

    | Field | Value                                              |
    | ----- | -------------------------------------------------- |
    | Name  | front-end                                          |
    | Query | * orchestrator_name = front-end                    |

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018125043303.png" alt="image-20191018125043303" style="zoom:50%;" />

5. Click the _Next_ button.

6. Ensure that there are workloads in the inventory list.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018125231869.png" alt="image-20191018125231869" style="zoom:50%;" />

    > **NOTE**
    >
    > If nothing shows up in the inventory list, click _Previous_ and make sure you used  _* Provider Orchestrator name_. Notice the lowercase *name* compared to *Name* in the instructions above.

7. Click the _Create_ button to complete creation of the _front-end_ invetory filter.



###### Create an API Key to use with Ansible

Given the application dependencies and kubernetes environment are well understood, this is an ideal situation to leverage the power of infrastructure automation. In our case, you'll use open source [Tetration modules](https://github.com/CiscoDevNet/tetration-ansible-playbooks) for Ansible along with Ansible playbooks that have already been created for your environment.

First you'll need to create a Tetration API Key that the modules will use to access the APIs and define the filters.

1. Return to the Tetration administrative interface in your web broswer.

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
    > The Tetration modules for Ansible could be used for other operations like managing users or doing flow searches. However, since we don't need them for this lab, we're following the least privilege principle and not enabling them.

6. Click the *Create* button.

7. You'll see a pop-up stating *API Key Created*.

    > **WARNING**
    >
    > Either leave the *API Key* and *Secret* pop-up accessible or download them so you can copy and paste the values into a configuration file in the Cloud9 terminal. If you close this pop-up, you'll need to delete this key and create a new one as there isn't a way to retrieve the *Secret* again.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200306154917232.png" alt="image-20200306154917232" style="zoom:50%;" />



###### Create inventory filters using Ansible

Now that we have an API Key we can configure Ansible to access Tetration and then run our playbooks to create inventory filters for all of the application, Kubernetes, AWS, and external inventory.

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Change the directory to the Tetration Ansible playbooks

    ###### Command

    ```
    cd ${DOLLAR_SIGN}LAB/tetration/ansible
    ```

3. Provide the Tetration *API Key* and *API Secret* using the helper script *tetansconf*, which will add the values to the host configuration file *${DOLLAR_SIGN}LAB/tetration/ansible/host_vars/tetration.yaml* and confgure the inventory filters (*${DOLLAR_SIGN}LAB/tetration/ansible/tet-sock-shop-filters.yaml*) and segmentation policy (*${DOLLAR_SIGN}LAB/tetration/ansible/tet-sock-shop-app.yaml*).

    ###### Command

    ```
    tetansconf
    ```

    ###### Output

    ```
    Tetration API Key:
    12341234123412341234

    Tetration API Secret:
    12341234123412341234

    Ansible Host Configuration for Tetration:
    ---
    # URL for the Tetration Dashboard
    tetration_url: "https://tet-pov-rtp1.cpoc.co"
    # API Details - Create new token from Tetration Dashboard!
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

4. Run the playbook to create the inventory filters. Take a moment to review the contents of *${DOLLAR_SIGN}LAB/tetration/ansible/tet-sock-shop-filters.yaml* and note its human-readable structure.

    ###### Command

    ```
    ansible-playbook tet-sock-shop-filters.yaml
    ```

    ###### Output

    ```
    PLAY [Configure Sock Shop Filters] ********

    TASK [Sock Shop Tetration add Duo] ********
    changed: [tetration]
    ...
    PLAY RECAP ********
    tetration                  : ok=34   changed=34
    ```

    > **NOTE**
    >
    > Although the output will say changed for these filters, it doesn't mean that the filter already existed. If an object exists and the settings are the same, the output will be *ok*. If it doesn't exist or is modified it will be shown as *changed*.

5. Return to the Tetration administrative interface in your web broswer.

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co/)

6. Select _Inventory Filters_ under _VISIBILITY_ in the navigation menu in the left pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018124622764.png" alt="image-20191018124622764" style="zoom:50%;" />

7. Confirm that there are additional filters beyond what you had already created manually.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200306161527737.png" alt="image-20200306161527737" style="zoom:50%;" />

> **NOTE**
>
> You might notice that the inventory filter you created for the front-end pods has changed. The playbook added the Kubernetes namespace to the query details to make the filters more precise and created an additional filter for the front-end service.



###### Define application segmentation manually

Network security policies are the building block for many powerful features of Cisco Tetration. They provide a simple and intuitive mechanism for both application owners and security teams to define the necessary intents to secure assets and applications within datacenters.

Tetration supports any mixture of deny/allow security models for different applications, letting application owners define very fine-grained policies to secure their applications while simultaneously allowing the security teams to enforce their guidelines and best practices on wide sets of applications.

The enforcement is managed by the Tetration software agents that are running on the Kubernetes worker nodes. The agent will modify the host firewall on the _Consumer_ and _Provider_ to deny or allow the specified connections.

You'll define a policy to show the power of using eternal orchestration annotations from Kubernetes to stop the lateral breach you simulated earlier between the Sock Shop _front-end_ pod and _payment_ service.

1. Return to the Tetration administrative interface in your web broswer.

    > [https://tet-pov-rtp1.cpoc.co](https://tet-pov-rtp1.cpoc.co/)

2. Select _SEGMENTATION_ in the navigation menu in the left pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018125829189.png" alt="image-20191018125829189" style="zoom:50%;" />

3. If you are taken to an existing applicaiton workspace, you'll see a _Switch Application_ option in the top right corner. If so, click _Switch Application_.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018130105438.png" alt="image-20191018130105438" style="zoom:50%;" />

4. Click the _Create New Application Workspace_ button to create a logical grouping for defining, analyzing and enforcing policies for a particular application.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191024150303383.png" alt="image-20191024150303383" />

5. Set the fields in the dialgoue modal with the following values. The _Scope_ should already be set with your specific scope name. Scopes are used to group datacenter applications and, along with Roles, enable fine grained control of their management.

    | Field | Value                       |
    | ----- | --------------------------- |
    | Name  | Sock Shop                   |
    | Scope | ${POD_NAME} |

6. Click the _Add a Manual Policy_ button.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191018130224563.png" alt="image-20191018130224563" style="zoom:50%;" />

7. Define the policy to permit connections from the Kubernetes pods providing the _orders_ service connecting to the pods providing the _payment_ service. Set the policy _Action_ to _ALLOW_. When you click in the _Consumer_ and _Provider_ fields, a drop-down list will appear that will include the _Inventory Filters_ that you created in an earlier step. Select _orders_ for _Consumer_ and _payment-svc_ for _Provider_.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20200306181109314.png" alt="image-20200306181109314" style="zoom:50%;" />

8. Click _Ok_ to save the policy.

9. The saved policy will have _Services_ set to _Inactive_. You need to define _Services_ for the _Provider_ in the bottom right pane. In this case you want to permit connections to the _payment_ service on _TCP_ port _80_. Click _Add_ and set the fields with the following values.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191021020824912.png" alt="image-20191021020824912" style="zoom:50%;" />

10. Click the checkmark button to apply the service to the _payment_ Provider for this policy. The _Services_ field will now have a value of _TCP: 80 (HTTP)_.



> **NOTE**
>
> If this policy was enforced, this would only allow connections from the _orders_ pods to the _payment_ service and block connections from other pods like the _front-end_ pod that was used for the lateral attack you did previously because the catch all policy is set to *DENY*.
>
> You'll use another Ansible playbook that defines the complete application policy and enforces it. If you did enable this policy now, the application would not work, configured Cisco services would fail, and you won't be able to SSH into any worker nodes.
>
> If you were manually defining and enforcing a policy, the next step would be to click on the _Enforcement_ tab in the top right corner.
>
> <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191021021913246.png" alt="image-20191021021913246" style="zoom:50%;" />
>
> From this screen you can review the _Enforcement_ status and analysis the outcome of policy enforcement on historical flows in addition to enabling enforcement using the _Enforce Policies_ button.



###### Define application segmentation using Ansible

In an earlier step, you configured application policy manually. Now we'll use Ansible to apply the complete zero trust policy for this application environment, which is a more DevOps friendly manner.

1. Return to the Cloud9 IDE and access a terminal tab in the bottom right pane.

    <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

2. Change the directory to the Tetration Ansible playbooks

    ###### Command

    ```
    cd ${DOLLAR_SIGN}LAB/tetration/ansible
    ```

3. You should have already provided the Tetration *API Key* and *API Secret* using the helper script *tetansconf*, in a previous step. You can confirm values are set for *api_key* and *api_secret* in *${DOLLAR_SIGN}LAB/tetration/ansible/host_vars/tetration.yaml*.

    ###### Command

    ```
    cat ${DOLLAR_SIGN}LAB/tetration/ansible/host_vars/tetration.yaml
    ```

    ###### Output

    ```
    ---
    # URL for the Tetration Dashboard
    tetration_url: "https://tet-pov-rtp1.cpoc.co"
    # API Details - Create new token from Tetration Dashboard!
    api_key: "12341234123412341234"
    api_secret: "12341234123412341234"
    # Set to true for production setups that use trusted certificates!
    validate_certs: true
    app_scope_name: "app-first-sec-02"
    external_orchestrator_name_k8s: "app-first-sec-k8s"
    k8s_namespace: "sock-shop"
    ```

4. Run the playbook to create the application policy. Take a moment to review the contents of *${DOLLAR_SIGN}LAB/tetration/ansible/tet-sock-shop-app.yaml* and note its human-readable structure.

    ###### Command

    ```
    ansible-playbook tet-sock-shop-app.yaml
    ```

    ###### Output

    ```
    PLAY [Configure Sock Shop App Policy] ********

    TASK [Create Application] ********
    changed: [tetration]
    ...
    PLAY RECAP ********
    tetration                  : ok=50   changed=47
    ```

    > **NOTE**
    >
    > Although the output will say changed for these policies, it doesn't mean that the policy already existed. If an object exists and the settings are the same, the output will be *ok*. If it doesn't exist or is modified it will be shown as *changed*.

    > **WARNING**
    >
    > If you get an error similar to _"a primary application with this scope already exist"_, it's possible that when you manually created the workspace in Tetration that the name doesn't match the playbook expected name of _Sock Shop_. You can change the name in Tetration or in the playbook to make sure they match to overcome the error.

5. Return to the Tetration administrative interface in your web broswer.

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
    > If there is still the same response as you saw earlier, Tetration hasn't made the changes yet in the host firewall. Wait ten more seconds, re-enter the text above.

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
> In a DevSecOps team, verification that the user experience hadn't been negatively impacted would be done as part of an automated test triggerred by the change in the security policy in a staging environment. If the tests failed, the policy would be automatically removed and the person who had defined the policy would be notified of the failed test.

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



#### Tetration summary

As a small business owner, you can rest soundly knowing that Tetration is now protecting your booming sock business without impacting your customers experience.

You've seen that Tetration is a ready-to-use platform with advanced management capabilities to enable quick deployment with few configuration requirements. Using machine-learning capabilities, the platform drastically reduces the amount of human input required to understand communication patterns. And with its holistic workload capabilities, the platform allows you to build a more secure infrastructure for applications and significantly reduces the risk of exposure.
