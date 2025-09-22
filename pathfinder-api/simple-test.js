// Simple manual test - no Azure Functions needed
console.log('🧪 Manual Testing Guide');
console.log('=======================\n');

console.log('To test locally:');
console.log('1. Start Azure Functions:');
console.log('   npx func start\n');

console.log('2. Test health endpoint:');
console.log('   curl http://localhost:7071/api/health\n');

console.log('3. Test intake endpoint:');
console.log('   curl -X POST http://localhost:7071/api/intake-test \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"assessment":{"firstName":"John","lastName":"Doe","email":"test@example.com","struggles":["social-media-overwhelm"],"door":"secular","timeBudget":"10-15","daypart":"morning"}}\'\n');

console.log('4. Run comprehensive tests:');
console.log('   node test-intake.js\n');

console.log('📁 Available functions:');
console.log('- health/           (GET /api/health)');
console.log('- intake-test/      (POST /api/intake-test)');
console.log('- src/functions/    (TypeScript versions for production)');
