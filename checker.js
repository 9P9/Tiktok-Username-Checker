const request = require('request');
const colors = require('colors');
const chalk = require('chalk');
const ProxyAgent = require('proxy-agent');
const prompt = require('prompt');
const fs = require('fs');
const proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/gi, '').split('\n');
const usernames = [...new Set(require('fs').readFileSync('usernames.txt', 'utf-8').replace(/\r/g, '').split('\n'))];
const config = require("./config.json");


process.on('uncaughtException', e => {});
process.on('uncaughtRejection', e => {});
process.warn = () => {};

var available = 0;
var unavailable = 0;
var rate = 0;
var checked = 0;

function write(content, file) {
    fs.appendFile(file, content, function(err) {
    });
}

function pcheck(username) {
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
	var agent = new ProxyAgent(`${config.proxyType}://` + proxy);
    request({
        method: "GET",
        url: `https://www.tiktok.com/@${username}`,
		agent, 
        json: true,
    }, (err, res, body) => {
        if (res && res.statusCode === 200) {
            unavailable++;
            console.log(chalk.red("[%s] (%s/%s/%s) [Unavailable] Username: %s | Proxy: %s"), res.statusCode, available, checked, usernames.length, username, proxy);
            write(username + "\n", "usernames/unavailable.txt");
		}
		else if (res && res.statusCode === 404) {
			available++;
			console.log(chalk.green(`[%s] (%s/%s/%s) [Available] Username: %s | Proxy: %s`), res.statusCode, available, checked, usernames.length, username, proxy);
			write(username + "\n", "usernames/available.txt");

        } else if (res && res.statusCode === 429) {
            rate++;
            console.log(chalk.red("[%s] (%s) Proxy: %s has been rate limited".inverse), res.statusCode, rate, proxy);
            pcheck(username);
		}
		else{
			pcheck(username)
		}

        checked = available + unavailable;
        process.title = `[313][Tiktok Usernames Checker] - ${checked}/${usernames.length} Total Checked | ${available} Available | ${unavailable} Unavailable | ${rate} Rate Limited`;
    });
}

function check(username) {
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
    request({
        method: "GET",
        url: `https://www.tiktok.com/@${username}`,
        json: true,
    }, (err, res, body) => {
        if (res && res.statusCode === 200) {
            unavailable++;
            console.log(chalk.red("[%s] (%s/%s/%s) [Unavailable] Username: %s | "), res.statusCode, available, checked, usernames.length, username);
            write(username + "\n", "usernames/unavailable.txt");
		}
		else if (res && res.statusCode === 404) {
			available++;
			console.log(chalk.green(`[%s] (%s/%s/%s) [Available] Username: %s |`), res.statusCode, available, checked, usernames.length, username);
			write(username + "\n", "usernames/available.txt");

        } else if (res && res.statusCode === 429) {
            rate++;
            console.log(chalk.red("[%s] (%s) you have been rate limited (consider using a VPN)".inverse), res.statusCode, rate);
            check(username);
		}
		else{
			check(username)
		}

        checked = available + unavailable;
        process.title = `[313][Tiktok Usernames Checker] - ${checked}/${usernames.length} Total Checked | ${available} Available | ${unavailable} Unavailable | ${rate} Rate Limited`;
    });
}





//Program Startup
function printAsciiLogo() {
  console.log(`
${chalk.yellow('┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐')}   
${chalk.yellow('│')}${chalk.hex('add8e6')( ' ███████╗██╗██╗  ██╗████████╗ ██████╗ ██╗  ██╗ ')}${chalk.hex('d6204e')('██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███████╗██████╗  ')} ${chalk.yellow('│')}
${chalk.yellow('│')}${chalk.hex('add8e6')('╚══██╔══╝██║██║ ██╔╝╚══██╔══╝██╔═══██╗██║ ██╔╝')}${chalk.hex('d6204e')('██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗ ')} ${chalk.yellow('│')}
${chalk.yellow('│')}${chalk.hex('add8e6')('   ██║   ██║█████╔╝    ██║   ██║   ██║█████╔╝ ')}${chalk.hex('d6204e')('██║     ███████║█████╗  ██║     █████╔╝ █████╗  ██████╔╝	')} ${chalk.yellow('│')}
${chalk.yellow('│')}${chalk.hex('add8e6')('   ██║   ██║██╔═██╗    ██║   ██║   ██║██╔═██╗ ')}${chalk.hex('d6204e')('██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══╝  ██╔══██╗ ')} ${chalk.yellow('│')}
${chalk.yellow('│')}${chalk.hex('add8e6')('   ██║   ██║██║  ██╗   ██║   ╚██████╔╝██║  ██╗')}${chalk.hex('d6204e')('╚██████╗██║  ██║███████╗╚██████╗██║  ██╗███████╗██║  ██║ ')} ${chalk.yellow('│')}
${chalk.yellow('│')}${chalk.hex('add8e6')('   ╚═╝   ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝')}${chalk.hex('d6204e')(' ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ')} ${chalk.yellow('│')}
${chalk.yellow('│')}					${chalk.underline("Coded by Luci")}			   			       	 ${chalk.yellow('│')}
${chalk.yellow('└────────────────────────────────────────────────────────────────────────────────────────────────────────┘')}   
`);
}
printAsciiLogo();
process.title = `[313][Tiktok Usernames Checker] Created By Luci`;
console.log(chalk.red("[WARN] Some Usernames could be banned! ".inverse));
console.log(chalk.inverse("[1] Proxied Checking ".inverse));
console.log(chalk.inverse("[2] Proxyless Checker (Proxies)".inverse));
prompt.start();	
	console.log(""); 
	prompt.get(['options'], function(err, result) {
	console.log('');
	var options = result.options;
		switch(options) {
		case "1":
			console.log(`[Proxy] ${config.proxyType}`);
			console.log(`[Tiktok Username Checker]: Started!`.inverse);
			console.log(`[Checking %s Usernames with %s Proxies!]`.inverse, usernames.length, proxies.length);
			for (var i in usernames) pcheck(usernames[i]);
			break;
			
		case "2":
			console.log(`[Tiktok Username Checker]: Started!`.inverse);
			console.log(`[Checking %s Usernames with No Proxies!]`.inverse, usernames.length,);
			for (var i in usernames) check(usernames[i]);
			break;
		}
			
		
	})
	
	
