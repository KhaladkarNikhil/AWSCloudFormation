//Functions for sending SNS notification once the cloud formation completes stack creation.
var topic_arn = "{arn:aws:sns:us-east-1:725909244594:Stack_Completion}";
var AWS = require('aws-sdk'); 
AWS.config.region_array = topic_arn.split(':'); // splits the ARN into an array 
AWS.config.region = AWS.config.region_array[3]; 
var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
console.log(topic_arn);   // just for logging to the that the var was parsed correctly
console.log(AWS.config.region_array); // to see if the SPLIT command worked
console.log(AWS.config.region_array[3]); // to see if it got the region correctly
console.log(AWS.config.region); // to confirm that it set the AWS.config.region to the correct region from the ARN

exports.handler = async (event) => {
    // TODO implement
       const message = event.Records[0].Sns.Message;
       var fields = message.split("\n");
       
        if (message.indexOf("CREATE_COMPLETE") > -1) {
        var fields = message.split("\n");
        var subject = fields[11].replace(/['']+/g, '');
        send_SNS_notification(subject, message);   
        if(message.indexOf("AWS::CloudFormation::Stack")>-1){
            var stackname= fields[11].replace(/['']+/g, '');
            var params={
               StackName:stackname.split("=")[1]
           }
           cloudformation.describeStacks(params, function(err, data) {
             if (err) console.log(err, err.stack); // an error occurred
            else {
                 send_SNS_notification(subject, data);  
            }  // successful response
});
            
        }
    }
   
    function send_SNS_notification(subject, message) {
    var sns = new AWS.SNS();
    subject = subject + " is in completion";
    sns.publish({ 
        Subject: subject,
        Message: message,
        TopicArn: "arn:aws:sns:us-east-1:725909244594:CloudStackReportPublisher"
    }, function(err, data) {
        if (err) {
            console.log(err.stack);
            return;
        } 
        console.log('push sent');
        console.log(data);
    }); }
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
