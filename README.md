**Pratik Mukherjee** <br />
**Unity ID: pmukher** <br />
**Masters in Computer Science** <br />
**North Carolina State University** <br />

Link to You Tube Video for Digital Ocean provisioning: https://www.youtube.com/watch?v=ZhhuGp8Mcyw <br /> 
Link to You Tube Video for AWS provisioning: https://www.youtube.com/watch?v=RFaszTi7C3U <br /> 


The repository consits of the following: 
* AWSProvition.sh: The sh script that runs the npm install command and the the node js script for provisioning AWS.
* DigitalOceanProvition.sh: The sh script that runs the npm install command and the the node js script for provisioning Digital Ocean.<br />
* HW1DigitalOcean.js: The node js script for provisioning Digital Ocean, creates the inventory file and executes the Ansible playbook. <br />
4. HWAWS.js: The node js script for provisioning AWS, creates the inventory file and executes the Ansible playbook.<br />
5. digitalocean.yml: The playbook file to be used by Ansible while launching and starting a NGIX server on a droplet in Digital Ocean. <br />
6. inventory: A sample inventory file that is overwritten everytime the node.js script runs for provisioning AWS or Digital Ocean and later executed by Ansible. <br />
7. package.json: The package.json file that contains the dependencies on external modules required for executing the script.  <br />
8. playbook.yml: The playbook file to be used by Ansible while launching and starting a NGIX server on an instance in Digital Ocean. <br />

**Provitioning a remote server from Digital Ocean** <br />
Link to You Tube Video: https://www.youtube.com/watch?v=ZhhuGp8Mcyw

1. The first thing needs to be done is to create an account with Digital Ocean. Log Into the Account. 
2. Go to the API option in the menu and generate a new token for your account.The token needs to be copied.  
3. Before we start provisioning from the service provider we need to create a RSA key value pair and associate the public key with the account on Digital Ocean. This wil be required when we try to connect to the server automatically through the ssh protocol. For this purpose we create the RSA security key value pair using the ssh-keygen -t rsa command in the command prompt (For Mac OS). This will create two different keys - a public key (id_rsa.pub) and a private key (id_rsa). Store both these keys in the same directory or the folder from where you need to run the script. 
4. Now we need assocate the public key with the account in the DigitalOcean. Under the drop down menu list directly below your profile link select the "Settings" option. Now select the "Security" option from the left hand side Menu of the Settings page. Now click on the "Add SSH key" option. Give a name of the key and the copy the contentx of the Public Key (generated in Step 3) in the contents box. Now we can Create the Key that will be associated with the Account on DigitalOcean.  
5. To create a droplet we  would need the SSH Key id in the .js program. To get the id of the SSH key type the following command in the command prompt: curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN” "https://api.digitalocean.com/v2/account/keys" where $TOKEN is the token that was generated in the Step 1. Copy the id from the output that was generated and paste it in the "ssh_keys" attribute in the createDroplet function (line 43). 
6. The id that was generated in the previous step will be used as a ssh key id in the creation of the droplet. As it is the id of the public key component of the RSA key value pair I have directly used it in the program itself. The private key component id_rsa needed for logging into the server using ssh, has beem pushed into the repository. 
7. We also need to push a playbook.yml file in the repository. A Playbook file will contain the configuration and the deployment details of the remote server and its image that we are trying to launch in the droplet that is to be created. These details are the type of service and the package which is NGIX in this case. These details are put into a yml file called digitalocean.yml and pushed to the repository.
8. We also need to install all the depenencies before running. A package.json file has been pushed to the repository with all the dependencies that needs to be executed for the purpose. 
9. The sh script DigitalOceanProvision.sh and the Node js script HW1DigitalOCean.js has been pushed to the repository for the purpose. Run the sh script from the command prompt using the command: sh DigitalOceanProvision.sh. 
10. The sh script first installs all the dependencies using the npm install command. This ensures that all the modules that are used by the node.js script are up to date with the latest version. Hence this feature implements the configuration management.  
11. Now the script also executes the node.js script HW1DigitalOcean.sh. The node.js script creates a droplet id and prints the ID of the droplet ID that has been created.
12. An inventory file is also automatically created by the script. The inventory file contains the details of the node that is being launched in the droplet using the user (which is root in this case), the name of the private security file in the local system (id_rsa) and the host IP address of the droplet that we are trying to access.
13. After the inventory file has been created the script uses the ansible playbook and the file to launch and log a ngix server in the system. You will be prompted "Are you sure you want to continue connecting (yes/no)?". Type yes and press enter. You will see in the command prompt that the NGIX server has been installed and started. 
14. Now open a tab in the browser and put the IP address of the droplet. We will be able to see that the NGIX server has been launches, logged into from the client machine and hence can be accessed. 

**Amazon Web Services**

Virtualization is a way to greatly reduce operating cost in the business applications and the application architecture has moved from the desktop oriented one to a service oriented architecture.  The software as a service has gradually given way to cloud computing. Cloud computing enables organization to utilize shared computing resources like storage, databases, power thereby making the applications scalable, flexible and reliable and enabling them to focus on their core competencies.  Amazon provides a distributed IT infrastructure and cloud computing services through the Amazon Web Service. It enables organizations to get storage, computing power\, operating systems, architectures and development programming models for solving the business centric problems. Organizations can mix and match the architectures to serve their business requirements making the services quite flexible. The service is also quite cost effective as organizations only pay for the services that they want to use. Organizations can add and subtract services according to the requirements. One such service is Amazon Elastic MapReduce (Amazon EMR). It can be used to process large amounts of data by organizations using Hadoop which is a open source framework in a distributed environment. The distributed environment consists of a number of clusters which can process the data and can be resized according to the need. The applications can be used for a number of purposes like log analysis, financial analysis, data warehousing and machine learning. Customers launch millions of such EMR clusters every year.  

**Provisioning a remote server in AWS (Amazon Web Services)** <br />
You tube Link for Screencast: https://www.youtube.com/watch?v=RFaszTi7C3U

1. The first thing that needs to be done is to create an Account in AWS. This provided a 12 month free access to us to utilize Amazon Web Services.  
2. Now we need to update the package.json file with some dependencies with respect to some modules that will be required for provisioning AWS. This is node-ansible (for the ansible playbook that we will be using for accessing the server). The dependencies are already included in the package.json file that has been uploaded to the repository.  
3. For creating an image on AWS and accessing it via ansible playboak through a secure ssh connection we need to associate a Secure Key Pair to be associated with the image. Assuming that we don't have a secure key pair readily available, we need to create a secure key pair through the AWS account. Additionally for creating and running the instance we need trhe values of certain attributes like ImageID and Instance Type. The values of these parameters can be known and the security key pair can be made available if we create an instance in AWS through the GUI. For this purpose go to the Services option in the Menu bar and select the Compute option. Under Compute select EC2. Now to create an EC2 instance click on the Launch Instance. Now click on the type of image of you want to provision. I selected an Ubuntu 64 bit image. You can note down the example instance type ("t2.micro" as utilized in our script) - the instance type and image has already been specified in the script. Click on the "Next" button and click on the review and launch button. Click on the "launch" button. You will be prompted to create a new security group. Enter the name of the security group and Click on the "Launch instances" button. The instance will be launched and the private security key pair (with a .pem extension) will be downloaded to your computer automatically. You also need to generate a key pair for a secure ssh connection. For this go tyo the following path: Services-> Compute-> AWS. In the menu under the left hand side, select Key Pairs under the Network Security option. Now click on the "Create Key Pair" option. Give a Key Pair name and then click on the Create option after giving a key pair name. The public key will be created and associated with your account and you will be given he private key. The key will be downloaded to your own machine. Keep it in the directory where you will run your script and then change gthe permission of the file by the command: chmod 400 <filename>. 
4. Put the key that was generated and downloaded in the previous step in the same folder as that of the script. You need to change the name of the Key Pair in two places in the script HW1AWS.js that I have written: a. In the attribute Keyname in the params varaible (line 15) and b. ansible_ssh_private_key_file name in line 30 in the fs.writeFile command. The reason being the security key file name is specific to the one just created in step 3.  
5. Save the changes in the HW1AWS.js script. Now we atre ready to run the sh script AWSProvition.sh.  before that ensure that the playbook.yml file is present in the directory. As stated earlier, a Playbook file will contain the configuration and the deployment details of the remote server and its image that we are trying to launch in the droplet that is to be created. These details are the type of service and the package which is NGIX in this case. 
6. Run the script by typing the following command in the command prompt: sh AWSProvition.sh. 
7. You will see that the dependencies have been installed as stated in the package.json file. This ensures configuration management by ensuring that all the external modules that the script utilizes are all up to date.
8. An inventory file also gets automatically gets created. As stated earlier, this inventory file will contain the details of the Dnsnamae and the user instance of the server (ubuntu) that we are tring to acess along with the name of the security file name that was changes in Step 4.  
9. The ansible playbook command utilized the playbook.yml file and the inventory file to automatically launch the ngix server in AWS. Copy the DNS name or the IP address and open a web browsr tab and paste it there. You will see the server has been launced and can be accessed. 