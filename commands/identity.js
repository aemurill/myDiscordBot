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
 */

const cname = 'identityroles';
const oReminder = 'Do \''+cname+' n\' where n is the option you have selected';

function generateOptions(option){
	var str = '';
	for(const element of option){
		console.log(element)
		str+= ' '+element+'\n';
	}
	return str;
}

function descRoles(number, message){
	if(number == 1){
		tools.sendReply(
			'Write out the option you would like to be added/removed:\n'+
			generateOptions(consts.PRONOUNS) +
			oReminder
			,message);
		return;
	}
	if(number == 2){
		tools.sendReply(
			'Write out the option you would like to be added/removed:\n'+
			generateOptions(consts.GENDERS) +
			oReminder
			,message);
		return;
	}
	if(number == 3){
		tools.sendReply(
			'Write out the option you would like to be added/removed:\n'+
			generateOptions(consts.SEXUALITIES) +
			oReminder
			,message);
		return;
	}
	improperUse(message);
}

function error(message){
	tools.sendReply(`an error has occured`,message);
}

function toggleRole(option, message){
	//tools.sendReply(option + ' is what you selected',message)
	
	var role = (consts.ID_ROLES).includes(option);
	if(role != undefined){
		message.guild.fetch().then(result=>{
			console.log(`fetched`);		
			message.guild.roles.fetch()
			.then(result => {
				console.log(`fetched`);		
				let myRole = tools.getRoleByValue(message.guild.roles.cache, option)		
				//let myRole = message.guild.roles.cache.get(role);
				//tools.sendReply(`${myRole.name} is what you selected`,message);				
				message.member.fetch()
				.then(result => {
					let hasRole = tools.getRoleByValue(message.member.roles.cache, option)
					if(hasRole != undefined){ //HAS ROLE
						message.member.roles.remove(myRole.id).then(result => {
							tools.sendReply(option + ' has been removed to your roles!',message)
						}).catch(error => {
							console.error(error); error(message);
						});		
					}else{ //DOES NOT HAVE ROLE
						message.member.roles.add(myRole.id).then(result => {
							tools.sendReply(option + ' has been added from your roles!',message)
						}).catch(error =>{
							console.error(error); error(message);
						});		
					}
				}).catch(error =>{
					console.error(error); error(message);
				});		
			})
			.catch(error =>{
				console.error(error); error(message);
			});		
		}).catch(error =>{
			console.error(error); error(message);
		})
	}
	else improperUse(message);
}

function improperUse(message){
	tools.sendReply(
		'Please use this role correctly, as instructed previously or just as \''+cname+'\''
		,message);		
}

module.exports = {
	name: cname,
	description: 'Use me to pick your pronouns and whatnot, yah?',
	guildOnly: true,
	execute(message, args) {		
		if (args.length == 1){
			//role listing
			if(!isNaN(args[0])) descRoles(args[0], message);
			
			//results
			else toggleRole(args[0], message);
			return;
		}
		
		if (args.length == 0){
			tools.sendReply(
				'Pick which roles you\'d like to add:\n'+
				'  1. Pronouns\n' +
				'  2. Gender\n' +
				'  3. Sexuality\n' +
				oReminder
				,message);
			return;
		}

		improperUse(message);
	},
};