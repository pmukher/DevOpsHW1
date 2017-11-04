console.log("Dev Ops Homework - Digital Ocean"); 
var needle = require("needle"); 
var os = require("os"); 
var fs = require("fs");
const readline = require('readline');
var Ansible = require('node-ansible'); 
var image, region; 
var sleep = require("sleep");
var dropletID; 
var config = {};
var keyID;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const rl1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question('Please enter the token: ', (answer) => {
  console.log('The token you have entered is:', answer);
  config.token = answer;
  rl.close();
  // rl1.question('Please enter the SSH Key ID: ', (answer) => {
  // console.log('The SSH Key you have entered is:', answer);
  // keyID = parseInt(answer);
  // rl1.close();
  var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};
var client =
{
		listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},
		listImages: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
	},
	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image": "ubuntu-14-04-x64",
			"ssh_keys":[3377876],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};
		console.log("Attempting to create: "+ JSON.stringify(data) );
		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},
	getDropletIP: function( onResponse )
	{
		console.log("https://api.digitalocean.com/v2/droplets/"+dropletID);
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletID, {headers:headers}, onResponse)
	}
}; 
client.listImages(function(error, response)
{
	var data = response.body;
	if( response.headers )
	{
		//console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}

	if( data.images )
	{
		for(var i=0; i<data.images.length; i++)
		{
			console.log(data.images[i].slug); 

		}
	}
});
client.listRegions(function(error, response)
{
	var data = response.body;
	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}
	if( data.regions )
	{
		region = data.regions[0].slug; 
		client.listImages(function(error, response)
		{
		 	data = response.body;
			if( response.headers )
			{
				console.log( "Calls remaining", response.headers["ratelimit-remaining"]);
			}
			if( data.images )
			{
				// for(var i=0; i<data.images.length; i++)
				// {
				// 	console.log(data.images[i].slug); 

				// }
				//image = data.images[0].slug; 
				var name = "pmukher"+os.hostname(); 
				console.log("The name  to be used for creating the droplet: "+name); 
				console.log("The image to be used for creating the droplet: "+image); 
				console.log("The region to be used for crating the droplet: "+region); 
				client.createDroplet(name, region, image, function(err, resp, body)
				{	
 					if(!err && resp.statusCode == 202)
 					{
 						console.log("Droplet successfully created"); 
 						dropletID=body.droplet.id;
 						console.log("The dropletID is: "+dropletID); 
 						sleep.sleep(60); 
 						client.getDropletIP(function(error, response)
						{
							var data1 = response.body;
							if(data1.droplet.id)
							{
								console.log(data1.droplet.networks.v4[0].ip_address); 
								fs.writeFile('inventory', 'node0 ansible_ssh_host=' + data1.droplet.networks.v4[0].ip_address +' ansible_python_interpreter=\'/usr/bin/env python\' ansible_ssh_user=root ansible_ssh_private_key_file=id_rsa');
							    var playbook= new Ansible.Playbook().playbook('playbook').inventory('inventory');
								var promise = playbook.exec(); 
								promise.then(function(successResult) {
  									console.log(successResult.code); // Exit code of the executed command 
  									console.log(successResult.output) // Standard output/error of the executed command 
								}, function(error) {
  									console.error(error);
								})
							}
						});//end of getDropletIP method 
 					}
 				});//end of create Droplet IP method 
			}
		});//end of listImages method
	}
});//end of listRegions method
});
//});
//config.token = result.token;
//config.token = "a2e1dfba7f280b4bb459b2364ca0933cc9fa4422cae0d8b1e6d74da7bf3c1bbc"; 
// var headers =
// {
// 	'Content-Type':'application/json',
// 	Authorization: 'Bearer ' + config.token
// };
// var client =
// {
// 		listRegions: function( onResponse )
// 	{
// 		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
// 	},
// 		listImages: function( onResponse )
// 	{
// 		needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
// 	},
// 	createDroplet: function (dropletName, region, imageName, onResponse)
// 	{
// 		var data = 
// 		{
// 			"name": dropletName,
// 			"region":region,
// 			"size":"512mb",
// 			"image": "ubuntu-14-04-x64",
// 			"ssh_keys":[3377876],
// 			"backups":false,
// 			"ipv6":false,
// 			"user_data":null,
// 			"private_networking":null
// 		};
// 		console.log("Attempting to create: "+ JSON.stringify(data) );
// 		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
// 	},
// 	getDropletIP: function( onResponse )
// 	{
// 		console.log("https://api.digitalocean.com/v2/droplets/"+dropletID);
// 		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletID, {headers:headers}, onResponse)
// 	}
// }; 
// client.listImages(function(error, response)
// {
// 	var data = response.body;
// 	if( response.headers )
// 	{
// 		//console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
// 	}

// 	if( data.images )
// 	{
// 		for(var i=0; i<data.images.length; i++)
// 		{
// 			console.log(data.images[i].slug); 

// 		}
// 	}
// });
// client.listRegions(function(error, response)
// {
// 	var data = response.body;
// 	if( response.headers )
// 	{
// 		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
// 	}
// 	if( data.regions )
// 	{
// 		region = data.regions[0].slug; 
// 		client.listImages(function(error, response)
// 		{
// 		 	data = response.body;
// 			if( response.headers )
// 			{
// 				console.log( "Calls remaining", response.headers["ratelimit-remaining"]);
// 			}
// 			if( data.images )
// 			{
// 				// for(var i=0; i<data.images.length; i++)
// 				// {
// 				// 	console.log(data.images[i].slug); 

// 				// }
// 				//image = data.images[0].slug; 
// 				var name = "pmukher"+os.hostname(); 
// 				console.log("The name  to be used for creating the droplet: "+name); 
// 				console.log("The image to be used for creating the droplet: "+image); 
// 				console.log("The region to be used for crating the droplet: "+region); 
// 				client.createDroplet(name, region, image, function(err, resp, body)
// 				{	
//  					if(!err && resp.statusCode == 202)
//  					{
//  						console.log("Droplet successfully created"); 
//  						dropletID=body.droplet.id;
//  						console.log("The dropletID is: "+dropletID); 
//  						sleep.sleep(60); 
//  						client.getDropletIP(function(error, response)
// 						{
// 							var data1 = response.body;
// 							if(data1.droplet.id)
// 							{
// 								console.log(data1.droplet.networks.v4[0].ip_address); 
// 								fs.writeFile('inventory', 'node0 ansible_ssh_host=' + data1.droplet.networks.v4[0].ip_address +' ansible_python_interpreter=\'/usr/bin/env python\' ansible_ssh_user=root ansible_ssh_private_key_file=id_rsa');
// 							    var playbook= new Ansible.Playbook().playbook('playbook').inventory('inventory');
// 								var promise = playbook.exec(); 
// 								promise.then(function(successResult) {
//   									console.log(successResult.code); // Exit code of the executed command 
//   									console.log(successResult.output) // Standard output/error of the executed command 
// 								}, function(error) {
//   									console.error(error);
// 								})
// 							}
// 						});//end of getDropletIP method 
//  					}
//  				});//end of create Droplet IP method 
// 			}
// 		});//end of listImages method
// 	}
// });//end of listRegions method