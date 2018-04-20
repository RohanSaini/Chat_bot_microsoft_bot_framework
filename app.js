var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
  
    function(session)
    {
        session.beginDialog('First_msg');
    }
]);


bot.dialog('First_msg',[
    function(session)
    {
        session.send(`hello!<br/> Wellcome to Pizza hub.`);
        session.send("Order your pizza");
        session.beginDialog('b_pizza');
   
        
    }
    
]);

bot.dialog('order_pizza',[


    function(session)
    {  session.dialogData.pizza_name =session.message.text.replace('Order Pizza','');
        builder.Prompts.text(session,"Would you like to add some thing extra.");
    },
    function(session,results)
    {   session.dialogData.extra=results.response;
        session.send(`You have ordered ${session.dialogData.pizza_name} <br/>Extra ${session.dialogData.extra}`);
      
        builder.Prompts.text(session,"Please Provide the delivery address");

    },
    function(session,results)
    {
        session.dialogData.ad=results.response;
        builder.Prompts.text(session,"Please provide a contact number.");
    },
    function(session,results)
    {
        session.dialogData.contact_no=results.response;
        session.send(`Your pizza will be delivered within 20 min <br/>Address :${session.dialogData.ad}<br/>Contact Number: ${session.dialogData.contact_no}<br/> Total bill : Rs 600`)
        session.send("Thank you for choosing us.")
        session.endDialog();
    }
]).triggerAction({matches:/(Order)\s.*Pizza/i});


// here is the list of action that user can do






bot.dialog('b_pizza',[
    function(session)
    {
       var msg =new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments([

            new builder.HeroCard(session)
    
                .title("Veggie Supreme")
                .subtitle("Onion, Capsicum, Mushroom, Red Paprika, Black Olives, Sweet Corn")
                .text("rs 545")
    
               
    
                .buttons([
    
                    builder.CardAction.imBack(session,'Order Pizza Veggie Supreme', "Order")
    
                ]),
                new builder.HeroCard(session)
    
                .title("Veg Exotica")
                .subtitle("Red Capsicum, Green Capsicum, Baby Corn, Black Olives, Jalapenos")
                .text("rs 545")
               
    
               
    
                .buttons([
    
                    builder.CardAction.imBack(session,'Order Pizza Veg Exotica', "Order")
    
                ])
    
    
            
        ]);
        session.send(msg);
        session.endDialog();
    }
]);








