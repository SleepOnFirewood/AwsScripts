
import { DescribeSecurityGroupRulesCommand, EC2Client } from "@aws-sdk/client-ec2";
import { DescribeLoadBalancersCommand, ElasticLoadBalancingV2Client } from "@aws-sdk/client-elastic-load-balancing-v2";
import * as fs from 'fs';
// const rs = require('fs')
//const rsPromises = require('fs').promises


const loadBalancerClient = new ElasticLoadBalancingV2Client({region: "us-east-1"});
const securityGroupClient = new EC2Client({region: "us-east-1"})



 const getAllLoadBalancers = async () => {
  const command = new DescribeLoadBalancersCommand([]) ;

  try {
    const loadbalancers = await loadBalancerClient.send(command);
    let x = loadbalancers['LoadBalancers'];
    let loadBalancerTrack = {};
   for(let i in x)
   {
    loadBalancerTrack[x[i]['LoadBalancerArn']] = x[i]['SecurityGroups']

    if(x[i]['SecurityGroups'])
    {
        fs.appendFile('Output.txt', String(x[i]['SecurityGroups'] + ','), err => {
            if (err) throw err;
        })
    }
   }
   //read in hashmap into file.
   for(let lb in loadBalancerTrack)
   {
    fs.appendFile('loadBalancerTracker.txt', String(lb + " : " + loadBalancerTrack[lb] + '\n'), err => {
      if(err) throw err;
    })
   }
  }
  catch (err) {
    console.error(err);
  }
  finally {
    const data = await fs.promises.readFile('./Output.txt', 'utf8');
    return(data);
  }
};

// function readLoadBalancerFile(fileName) //dont need this anymore.
// {
//   const data = fs.readFileSync(fileName,
//     { encoding: 'utf8', flag: 'r' });

//     return data;
// }




const getSg = async (loadBalancerSgIds) =>{
  const command = new DescribeSecurityGroupRulesCommand({
    Filters: [
      {
        Name: "group-id",
        Values: loadBalancerSgIds
      },
    ],
  });

  try {
    const securityGroup = await securityGroupClient.send(command);

    for(let i = 0; i<securityGroup['SecurityGroupRules'].length; i++)
    {
          fs.appendFile('SecurityGroups.txt', (JSON.stringify(securityGroup['SecurityGroupRules'][i])) + '\n', err => {
            if(err) throw err;
            })
    }
    
  }
  catch (err)
  {
    console.error(err);
  }
}



// async function resolve()
// {
//   await getAllLoadBalancers();
//   let loadBalancerSgIds = readLoadBalancerFile('Output.txt')
//   loadBalancerSgIds = loadBalancerSgIds.split(',')
//   loadBalancerSgIds.pop(); //remove last entry as as sult of separation via ','
//   getSg(loadBalancerSgIds)
// }


let getLb = getAllLoadBalancers();
getLb.then((data) =>{
  let loadBalancerSgIds = data.split(',')
  loadBalancerSgIds.pop(); //remove last entry as as sult of separation via ','
  getSg(loadBalancerSgIds)
})




// let loadBalancerSgIds = readLoadBalancerFile('Output.txt')



//resolve();
