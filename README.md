# Cisco Application-First Security Lab

You're about to start on a doozy of lab that covers a lot of ground in a short time. Buckle in and get ready to secure a cloud-native application and public cloud infrastructure using Cisco Products: Tetration, Stealthwatch Cloud, and Duo. You'll stage the infrastructure, modify and deploy the application, instrument the security products into the environment and get your hands dirty with products and technologies including git, Kubernetes, GitHub, Docker, AWS and others.

## Pre-requisites

1. [AWS](https://aws.amazon.com/) account with administrative privileges
2. [Cisco DevNet](https://developer.cisco.com/) account
3. A thirst for knowledge and willingness to get knee-deep in tech 🤓💪

## AWS Costs

_Approximately $1 USD per hour_

Wherever possible within the lab, efforts have been made to provision the minimal AWS resources necessary to minimize the financial burden on you, but this lab will not be zero cost exercise in AWS. The longer you leave the lab running, the higher the cost. If you complete the lab in one sitting it could take up to 4 hours depending on your familiarity with the technology used within the lab. We've seen roughly a cost of $1 USD per hour once the EKS Kubernetes Cluster comes online.

Make sure to review the [lab cleanup](#lab-cleanup) process once you're done with the lab.

> **TIP**
>
> In general it's easy to have your AWS resources get costly, quick. It's highly recommended that you setup billing alerts so there aren't any surprises at the end of the month.
>
> [Creating a Billing Alarm to Monitor Your Estimated AWS Charges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)

## Getting Started

These quick steps will get you up and running. You'll need to reserve a DevNet sandbox, create AWS CloudFormation stack, and stage your Cloud9 IDE.

### Reserve DevNet Sandbox

1. Reserve a [Cisco Application-First Security Lab DevNet Sandbox](TODO link to sandbox). This step will get you access to Cisco Products for the duration of your sandbox reservation. You'll receive an email indicating that the reservation process has started. You'll receive two more emails.

3. You'll also receive an email from Stealhwatch Cloud to register your credentials. It's best to wait until you're instructed in the lab to setup that account to follow the instructions in that email.

4. Once your sandbox is ready, you'll receive another email that will contain essential information specific to your sandbox like your sandbox name and password. Keep that information handy when you create your AWS CloudFormation stack in upcoming steps.

### Create AWS CloudFormation Stack

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/) and select the region where you'd like to run this lab.

2. [Create](https://console.aws.amazon.com/cloudformation/home#/stacks/create/template) a CloudFormation stack by uploading the provided [template](https://raw.githubusercontent.com/CiscoDevNet/cisco-application-first-security-lab/master/aws/cf-template-setup.json) provided in this repo. Take a minute to review the contents of the template to understand what resources you'll be creating.

3. When prompted for a _Stack name_ and _Parameters_, use the values provided in the email from the previous step.

	> **NOTE**
	>
	> A strong password string is provided to you for the _PodPassword_ parameter. If you want to use your own, that's fine. We recommend that whatever value you set is used across all products when you're setting credentials as instructed in the lab guide to make things easy for you.

4. You don't need to adjust any other stack settings, so you can click _Next_ through the rest of the prompts. You will need to acknowledge that the template is creating an IAM User right before clicking _Create stack_. You'll use that IAM User to run the lab in a AWS Cloud9 environment.

5. Now monitor for the stack _Status_ to be _CREATE\_COMPLETE_. If you're interested in watching each part of the stack progress, take a look at the stack _Events_.

6. Once the stack is created, you'll need to sign out from your current AWS account and log in to the [AWS Management Console](https://console.aws.amazon.com/) using the newly created IAM User.

### Stage Cloud9 IDE

1. As the newly created IAM User, navigate to [AWS Cloud9](https://console.aws.amazon.com/cloud9/home) and open the _cisco-app-first-sec_ environment.

2. Open the Cloud9 IDE and access a terminal tab in the bottom right pane.

  <img src="https://app-first-sec.s3.amazonaws.com/lab-guide.assets/image-20191017202329590.png" alt="image-20191017202329590" style="zoom:50%;" />

3. Clone the lab repo into the Cloud9 environment.

	###### Command

	```
	git clone https://github.com/CiscoDevNet/cisco-application-first-security-lab.git
	```

	###### Output

	```
	Cloning into 'cisco-application-first-security-lab'...
	remote: Enumerating objects: 123, done.
	remote: Counting objects: 100% (123/123), done.
	remote: Total 123 (delta 0), reused 0 (delta 0), pack-reused 0
	Unpacking objects: 100% (123/123), done.
	```

4. Run the provided _labsetup_ script to stage the Cloud9 environment. This will install all the needed software packages and customize all templates including the lab guide with parameters you provided when creating the CloudFormation stack.

	###### Command

	```
	~/cisco-application-first-security-lab/bin/labsetup
	```

	###### Output

	```
	What is the name of your CloudFormation stack for this lab? [default: cisco-app-first-sec] cisco-app-first-sec
	...
	```

5. Set the necessary environment variables by sourcing your _.bashrc_

	###### Command

	```
	source ~/.bashrc
	```

6. Use the file explorer in the Cloud9 environment to navigate to _app-first-sec-lab > docs_. Right-click on _lab-guide.html_ and select _Preview_.

	Nice job 🎉 You're well on your way to becoming one with Cisco Application-First Security.

## Lab Cleanup

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
