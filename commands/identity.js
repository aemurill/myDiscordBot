const tools = require('../tools.js');
const consts = require('../consts.js');

/**
 *  Pronouns 
 * 
 *  they/them, he/him, she/her, pronouns (any), 
 *  pronouns (ask)
 * 
 *  cis, egg, enby, transmasc, transfemme, fluid, agender
 * 
 *  straight, lesbian, gay, bi, pan, queer, ace, demi 
 * 
 *  Can request other if necessary
 * 
 * 
 * identityroles -> DO GENDER(1) SEXUALITY (2) OR IDENTITY (3)
 * 
 * identityroles n -> DO 1 2 3 4 5 6 7 for INDIVIDUAL SUBROLE
 * 
 * identityroles subrole -> toggles subrole directly
 * 
 * 
 */

const cname = 'identityroles';
var prefix = '';
  

function generateIdOptions(option){
	var str = '';
	for(const element of option){
		console.log(element)
		str+= '  • '+element+'\n';
	}
	str+= +
	'Do \"' +prefix+cname+ ' <option>\" to toggle that role\n' +
	'For example: '+prefix +cname+ ' '+option[0];
	return str;
}

function descRoles(number, message){	
	var x = function(message, subset){
		tools.sendReply(
			'Write out the option you would like to be added/removed:\n'+
			generateIdOptions(consts[subset])
			,message);
	}

	if(number == 1){
		x(message,'PRONOUNS');
		return;
	}
	if(number == 2){
		x(message,'GENDERS');
		return;
	}
	if(number == 3){
		x(message,'SEXUALITIES');
		return;
	}
	improperUse(message);
}

function error(message){
	tools.sendReply(`an error has occured`,message);
}

function toggleRole(option, message){
	//tools.sendReply(option + ' is what you selected',message)
	console.log(option);

	var role = (consts.ID_ROLES).includes(option);
	if(role != undefined){
		message.guild.fetch().then(result=>{
			console.log(`fetched`);		
			message.guild.roles.fetch()
			.then(result => {
				console.log(`fetched`);		
				let myRole = tools.getRoleByValue(message.guild.roles.cache, option)		
				if(myRole == undefined) throw new Error("Missing Role");
				//let myRole = message.guild.roles.cache.get(role);
				//tools.sendReply(`${myRole.name} is what you selected`,message);				
				message.member.fetch()
				.then(result => {
					let hasRole = tools.getRoleByValue(message.member.roles.cache, option)
					if(hasRole != undefined){ //HAS ROLE
						message.member.roles.remove(myRole.id).then(result => {
							tools.sendReply(option + ' has been removed from your roles!',message)
						}).catch(error => {
							console.error(error); error(message);
						});		
					}else{ //DOES NOT HAVE ROLE
						message.member.roles.add(myRole.id).then(result => {
							tools.sendReply(option + ' has been added to your roles!',message)
						}).catch(error =>{
							console.error(error);// error(message);
						});		
					}
				}).catch(error =>{
					console.error(error);// error(message);
				});		
			})
			.catch(error =>{
				console.error(error);// error(message);
				tools.sendReply('It would appear this role is not implemented or otherwise an error has occured.',message);
			});		
		}).catch(error =>{
			console.error(error);// error(message);
		})
	}
	else tools.sendReply('It would appear this role is not implemented or otherwise an error has occured.',message);
}

function improperUse(message){
	tools.sendReply(
		'Please use this command correctly, as instructed previously'/*or just ask'
		+ '\"'+prefix+'help ' +cname+ '\".'*/
		,message);		
}

module.exports = {
	name: cname,
	description: 'Use me to pick your pronouns and whatnot, yah?',
	guildOnly: true,
	execute(message, args) {		
		const config = tools.readJsonFromFileAsString(consts.CONFIG_FILENAME);  
		prefix = config.prefix;
		if (args.length >= 1){
			//NUMBER - role listing
			if(!isNaN(args[0])) descRoles(args[0], message);
			
			//NAN - Toggle role
			else toggleRole(tools.argsAsString(0, args), message);
			return;
		}
		
		if (args.length == 0){
			tools.sendReply(
				'Pick which role type you\'d like to view:\n'+
				'  1) Pronouns\n' +
				'  2) Gender\n' +
				'  3) Sexuality\n' +
				'Do \"'+prefix +cname+ ' <number>\" to see that list\n' +
				'For example: '+prefix +cname+ ' 1'				
				,message);
			return;
		}

		improperUse(message);
	},
};


