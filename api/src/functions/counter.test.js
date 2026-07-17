const { counterHandler } = require('./counter');
const { TableClient } = require('@azure/data-tables');

jest.mock('@azure/data-tables');

describe('counterHandler', () => {
    let mockContext;

    beforeEach(() => {
        jest.clearAllMocks();
        mockContext = { error: jest.fn() };
        process.env.CosmosDBConnection = 'fake-connection-string';
    });

    test('increments an existing count and returns it', async () => {
        const mockClient = {
            getEntity: jest.fn().mockResolvedValue({ partitionKey: 'counter', rowKey: 'main', count: 15 }),
            createEntity: jest.fn(),
            updateEntity: jest.fn().mockResolvedValue({})
        };
        TableClient.fromConnectionString.mockReturnValue(mockClient);

        const result = await counterHandler({}, mockContext);

        expect(result.status).toBe(200);
        expect(result.jsonBody.count).toBe(16);
        expect(mockClient.updateEntity).toHaveBeenCalledWith(
            { partitionKey: 'counter', rowKey: 'main', count: 16 },
            'Merge'
        );
    });

    test('creates a new entity starting at 1 when none exists yet', async () => {
        const mockClient = {
            getEntity: jest.fn().mockRejectedValue(new Error('Not found')),
            createEntity: jest.fn().mockResolvedValue({}),
            updateEntity: jest.fn().mockResolvedValue({})
        };
        TableClient.fromConnectionString.mockReturnValue(mockClient);

        const result = await counterHandler({}, mockContext);

        expect(mockClient.createEntity).toHaveBeenCalledWith({
            partitionKey: 'counter',
            rowKey: 'main',
            count: 0
        });
        expect(result.jsonBody.count).toBe(1);
    });

    test('returns 500 and logs when Cosmos DB throws unexpectedly', async () => {
        const mockClient = {
            getEntity: jest.fn().mockRejectedValue(new Error('Not found')),
            createEntity: jest.fn().mockRejectedValue(new Error('DB is down')),
            updateEntity: jest.fn()
        };
        TableClient.fromConnectionString.mockReturnValue(mockClient);

        const result = await counterHandler({}, mockContext);

        expect(result.status).toBe(500);
        expect(result.jsonBody.error).toBe('Something went wrong');
        expect(mockContext.error).toHaveBeenCalled();
    });

    test('sets the correct CORS header on success', async () => {
        const mockClient = {
            getEntity: jest.fn().mockResolvedValue({ partitionKey: 'counter', rowKey: 'main', count: 5 }),
            createEntity: jest.fn(),
            updateEntity: jest.fn().mockResolvedValue({})
        };
        TableClient.fromConnectionString.mockReturnValue(mockClient);

        const result = await counterHandler({}, mockContext);

        expect(result.headers['Access-Control-Allow-Origin']).toBe('https://www.mohamedalsafi.site');
    });
});