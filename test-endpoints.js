// Simple endpoint testing script
// Run with: node test-endpoints.js

const BASE_URL = 'https://nobunkzone-server-3.onrender.com/api';

async function testEndpoint(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(`✅ ${options.method || 'GET'} ${url}`);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    console.log('---');
    return { success: true, data, status: response.status };
  } catch (error) {
    console.log(`❌ ${options.method || 'GET'} ${url}`);
    console.log(`Error:`, error.message);
    console.log('---');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing NoBunkZone API Endpoints\n');

  // Test health endpoint
  await testEndpoint(`${BASE_URL}/health`);

  // Test basic server endpoint
  await testEndpoint(`${BASE_URL}/test`);

  // Test auth endpoints
  console.log('📝 Testing Authentication...');
  
  // Register test user
  const registerResult = await testEndpoint(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Student',
      email: 'test@example.com',
      password: 'password123',
      role: 'student'
    })
  });

  // Login test user
  const loginResult = await testEndpoint(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  });

  if (loginResult.success && loginResult.data.token) {
    const token = loginResult.data.token;
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('👨‍🎓 Testing Student Endpoints...');
    
    // Test student endpoints
    await testEndpoint(`${BASE_URL}/student/profile`, {
      headers: authHeaders
    });

    await testEndpoint(`${BASE_URL}/student/attendance`, {
      headers: authHeaders
    });

    await testEndpoint(`${BASE_URL}/student/leaves`, {
      headers: authHeaders
    });

    // Test apply leave
    await testEndpoint(`${BASE_URL}/student/leave`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        from: '2024-01-15',
        to: '2024-01-16',
        reason: 'Medical appointment',
        type: 'sick'
      })
    });
  }

  // Register teacher for teacher endpoint tests
  const teacherRegisterResult = await testEndpoint(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Teacher',
      email: 'teacher@example.com',
      password: 'password123',
      role: 'teacher'
    })
  });

  // Login teacher
  const teacherLoginResult = await testEndpoint(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'teacher@example.com',
      password: 'password123'
    })
  });

  if (teacherLoginResult.success && teacherLoginResult.data.token) {
    const teacherToken = teacherLoginResult.data.token;
    const teacherAuthHeaders = {
      'Authorization': `Bearer ${teacherToken}`,
      'Content-Type': 'application/json'
    };

    console.log('👨‍🏫 Testing Teacher Endpoints...');
    
    // Test teacher endpoints
    await testEndpoint(`${BASE_URL}/teacher/students`, {
      headers: teacherAuthHeaders
    });

    await testEndpoint(`${BASE_URL}/teacher/attendance`, {
      headers: teacherAuthHeaders
    });

    await testEndpoint(`${BASE_URL}/teacher/leaves`, {
      headers: teacherAuthHeaders
    });

    await testEndpoint(`${BASE_URL}/teacher/todos`, {
      headers: teacherAuthHeaders
    });

    // Test add student
    await testEndpoint(`${BASE_URL}/teacher/student`, {
      method: 'POST',
      headers: teacherAuthHeaders,
      body: JSON.stringify({
        name: 'New Student',
        roll: 'TEST001',
        className: 'Test Class',
        email: 'newstudent@example.com'
      })
    });

    // Test add todo
    await testEndpoint(`${BASE_URL}/teacher/todo`, {
      method: 'POST',
      headers: teacherAuthHeaders,
      body: JSON.stringify({
        text: 'Test todo item',
        completed: false
      })
    });
  }

  console.log('✅ All tests completed!');
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests, testEndpoint };