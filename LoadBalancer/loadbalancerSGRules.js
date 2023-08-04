/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


// snippet-start:[s3.JavaScript.buckets.listBucketsV3]
import { DescribeSecurityGroupRulesCommand, DescribeSecurityGroupsCommand, EC2Client } from "@aws-sdk/client-ec2";
import { DescribeLoadBalancersCommand, ElasticLoadBalancingV2Client } from "@aws-sdk/client-elastic-load-balancing-v2";
import * as fs from 'fs';


const client = new ElasticLoadBalancingV2Client({region: "us-east-1"});
const client2 = new EC2Client({region: "us-east-1"})



 const main = async () => {
  const command = new DescribeLoadBalancersCommand([]) ;

  try {
    const loadbalancers = await client.send(command);
    let x = loadbalancers['LoadBalancers'];
   // console.log(x['LoadBalancers'].length);
   for(let i in x)
   {
    if(x[i]['SecurityGroups'])
    {
        console.log(x[i]['SecurityGroups']);
        fs.appendFile('Output.txt', String(x[i]['SecurityGroups'] + ','), err => {
            if (err) throw err;
        })
    }
   }
  } catch (err) {
    console.error(err);
  }
};

function readFile(fileName)
{
  const data = fs.readFileSync(fileName,
    { encoding: 'utf8', flag: 'r' });

    return data;
}


const getSg = async (sgGroups) =>{
  const command = new DescribeSecurityGroupRulesCommand({
    Filters: [
      {
        Name: "group-id",
        Values: sgGroups
      },
    ],
  });

  try {
    const securityGroup = await client2.send(command);
    // for(let i in securityGroup['SecurityGroups'])
    // {
    //   if(securityGroup['SecurityGroups'][i]['GroupId'] === 'sg-084b08da89079c06d')
    //   {
    //     console.log(securityGroup['SecurityGroups'][i])
    //   }
    // }
    console.log(securityGroup)
  }
  catch (err)
  {
    console.error(err);
  }
}



//main();


let x = readFile('./Output.txt')
x = x.split(',')
x.pop();

getSg(x)
