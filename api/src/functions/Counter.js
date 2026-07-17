const { app } = require('@azure/functions');
const { TableClient } = require('@azure/data-tables');

async function counterHandler(request, context) {
    try {
        const connectionString = process.env.CosmosDBConnection;
        const tableName = 'VisitorCounter'; // matches the table you created
        const client = TableClient.fromConnectionString(connectionString, tableName);

        const partitionKey = 'counter';
        const rowKey = 'main';

        let entity;
        try {
            entity = await client.getEntity(partitionKey, rowKey);
        } catch (err) {
            // Entity doesn't exist yet — create it starting at 0
            entity = { partitionKey, rowKey, count: 0 };
            await client.createEntity(entity);
        }

        const newCount = (entity.count || 0) + 1;

        await client.updateEntity(
            { partitionKey, rowKey, count: newCount },
            'Merge'
        );

        return {
            status: 200,
            jsonBody: { count: newCount },
            headers: { 'Access-Control-Allow-Origin': 'https://www.mohamedalsafi.site' }
        };
    } catch (error) {
        context.error('Error updating counter:', error);
        return {
            status: 500,
            jsonBody: { error: 'Something went wrong' }
        };
    }
}

app.http('counter', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: counterHandler
});

module.exports = { counterHandler };


// const { app } = require('@azure/functions');
// const { TableClient } = require('@azure/data-tables');

// app.http('counter', {
//     methods: ['GET'],
//     authLevel: 'anonymous',
//     handler: async (request, context) => {
//         try {
//             const connectionString = process.env.CosmosDBConnection;
//             const tableName = 'VisitorCounter'; // matches the table you created
//             const client = TableClient.fromConnectionString(connectionString, tableName);

//             const partitionKey = 'counter';
//             const rowKey = 'main';

//             let entity;
//             try {
//                 entity = await client.getEntity(partitionKey, rowKey);
//             } catch (err) {
//                 // Entity doesn't exist yet — create it starting at 0
//                 entity = { partitionKey, rowKey, count: 0 };
//                 await client.createEntity(entity);
//             }

//             const newCount = (entity.count || 0) + 1;

//             await client.updateEntity(
//                 { partitionKey, rowKey, count: newCount },
//                 'Merge'
//             );

//             return {
//                 status: 200,
//                 jsonBody: { count: newCount },
//                 headers: { 'Access-Control-Allow-Origin': 'https://www.mohamedalsafi.site' }
//             };
//         } catch (error) {
//             context.error('Error updating counter:', error);
//             return {
//                 status: 500,
//                 jsonBody: { error: 'Something went wrong' }
//             };
//         }
//     }
// });