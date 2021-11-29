//called with /.netlify/functions/hello
exports.handler = async function(event, context) {
    const name = event.queryStringParameters.name || "World";

    return {
        statusCode: 200,
        //body: JSON.stringify({message: "Hello, ${name}"})
        body: 'Hello,' + name,
    };
}