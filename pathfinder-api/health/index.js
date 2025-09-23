module.exports = async function (context, req) {
    context.log('Health check endpoint hit');
    
    try {
        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                functions: 'up'
            },
            version: '1.0.0'
        };

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: healthStatus
        };
    } catch (error) {
        context.log.error('Health check failed:', error);
        
        context.res = {
            status: 503,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error.message,
                version: '1.0.0'
            }
        };
    }
};
