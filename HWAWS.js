console.log("Dev Ops Homework Provisioning AWS");
var AWS = require('aws-sdk'); 
var sleep = require("sleep"); 
var fs = require('fs');
var Ansible = require('node-ansible'); 
//var acm = new AWS.ACM(); 
AWS.config.update({region: 'us-west-2'});
// Creating an instance of EC2 
var ec2 = new AWS.EC2(); 
// Creating a paramater for running the VM instance 
//The Security KeyPair was used from an instance of a VM created in AWS through  GUI  
var params = { 
  ImageId: "ami-d732f0b7",
  MaxCount: 1,
  MinCount: 1,
  KeyName: "EC2KeyPair2",
  InstanceType: "t2.micro"
  };
ec2.runInstances(params, function(err, data) {
if (err) console.log(err, err.stack); // an error occurred
   else {
            console.log("The instance has been successfully started"); // successful response
            console.log("Running Describe Instances"); 
            var params1 = {}; //params1 to be used in the describeInstances method  
            sleep.sleep(60);
            ec2.describeInstances(params1, function(err, data1) {
              if(err) console.log(err, err.stack);
              else {
                var i = 0; 
                var inst; 
                for(var reservation of data1.Reservations){
                  for(var instance of reservation.Instances){
                    if(instance.State.Code==16 && instance.KeyName=="EC2KeyPair2"){
                       inst = instance; 
                      console.log("The IP Address of the AWS instance is:");
                      console.log(instance.PublicIpAddress); 
                      i=1;
                    } 
                }
                if(i==1)
                  break;
              }
              fs.writeFile('inventory', 'node0 ansible_ssh_host=' + inst.PublicIpAddress + ' ansible_ssh_user=ubuntu ansible_ssh_private_key_file=EC2KeyPair2.pem');
              console.log("Starting the ansible playbook")
              var playbook = new Ansible.Playbook().playbook('playbook').inventory('inventory');
              var promise = playbook.exec(); 
                promise.then(function(successResult) {
                console.log(successResult.code); // Exit code of the executed command 
                console.log(successResult.output) // Standard output/error of the executed command 
                }, function(error) {
                console.error(error);
                })
              }
        });//end of sescribe instance
        }//end of else run instance
 });//end of run instances    