//Create Global AWS Object and Cloud Formation Object
var AWS = require('aws-sdk');
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
exports.handler = function(event, context, callback){
    
    if("queryStringParameters" in event)
        {console.log("Query parameters present!")}
    // TODO implement
  console.log("inside handler");
  var params = {
  StackName: event["queryStringParameters"]["name"]+'-lab-environment', /* required */
  DisableRollback: true,
   NotificationARNs: [
    'arn:aws:sns:us-east-1:725909244594:Stack_Completion',
    /* more items */
  ],
  ResourceTypes: [
    'AWS::EC2::*',
    /* more items */
  ],
  
  TemplateURL: 'https://my-liftshift-templates-bucket.s3.amazonaws.com/lab-network.yaml',
  TimeoutInMinutes: '20'
};

var flag=0;
var statuscode=200;
var message="The environment is being created!"
var stack=cloudformation.createStack(params, function(err, data) {
    console.log("executing cloudformation");
  if (err){flag=1;console.log(err,err.stack);} // an error occurred
  else{  console.log(data)}// successful response
});
    
    
console.log("Status",stack)
if(flag==1){
    statuscode="400"
    message="Bad Request!"
}

  

  callback(null, {
            statusCode: statuscode,
            body: JSON.stringify({
                message: message
            
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    
};
