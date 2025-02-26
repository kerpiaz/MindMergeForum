// 'npm run test-db' - to run the test

import { db } from './tests-config/firebase.test.config.js';
import { ref, set, get, remove } from 'firebase/database';
import process from 'node:process';

/**
 * Tests Firebase database connection
 * 
 * Performs CRUD operations to verify database connectivity:
 * 1. Creates test data
 * 2. Reads test data
 * 3. Deletes test data
 * 
 * Exits with code 0 on success or 1 on failure
 */
const testDbConnection = async () => {
  const testData = {
    title: 'Test Forum Post',
    content: 'This is a test post to verify database connection',
    timestamp: Date.now()
  };

  try {
    console.log('🔵 Starting database connection test...');
    
    // Create test data
    console.log('📝 Creating test data...');
    const testRef = ref(db, 'test/connection-test');
    await set(testRef, testData);
    console.log('✅ Test data created successfully');
    
    // Read test data
    console.log('🔍 Reading test data...');
    const snapshot = await get(testRef);
    if (snapshot.exists()) {
      console.log('✅ Test data read successfully:', snapshot.val());
    } else {
      throw new Error('Test data not found');
    }
    
    // Delete test data
    console.log('🗑️  Cleaning up test data...');
    await remove(testRef);
    console.log('✅ Test data cleaned up successfully');
    
    console.log('✨ Database connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
};

// Run the test
testDbConnection();