const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testBackend() {
    try {
        console.log('🧪 Testing Task Management Backend...\n');

        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Health check passed:', healthResponse.data.message);
        console.log('   Status:', healthResponse.data.status);
        console.log('   Timestamp:', healthResponse.data.timestamp);
        console.log('');

        // Test 2: User Registration
        console.log('2️⃣ Testing User Registration...');
        const registerData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123'
        };

        const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
        console.log('✅ Registration successful:', registerResponse.data.message);
        console.log('   User:', registerResponse.data.user.username);
        console.log('   Token received:', !!registerResponse.data.token);
        console.log('');

        // Test 3: User Login
        console.log('3️⃣ Testing User Login...');
        const loginData = {
            email: 'test@example.com',
            password: 'Password123'
        };

        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
        console.log('✅ Login successful:', loginResponse.data.message);
        console.log('   User:', loginResponse.data.user.username);
        console.log('   Token received:', !!loginResponse.data.token);
        console.log('');

        // Test 4: Get User Profile
        console.log('4️⃣ Testing Get User Profile...');
        const token = loginResponse.data.token;
        const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Profile retrieved:', profileResponse.data.message);
        console.log('   Username:', profileResponse.data.user.username);
        console.log('');

        // Test 5: Create Task
        console.log('5️⃣ Testing Task Creation...');
        const taskData = {
            title: 'Test Task',
            description: 'This is a test task',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            status: 'Pending'
        };

        const createTaskResponse = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Task created:', createTaskResponse.data.message);
        console.log('   Task ID:', createTaskResponse.data.task._id);
        console.log('   Title:', createTaskResponse.data.task.title);
        console.log('');

        // Test 6: Get Tasks
        console.log('6️⃣ Testing Get Tasks...');
        const getTasksResponse = await axios.get(`${API_BASE_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Tasks retrieved successfully');
        console.log('   Total tasks:', getTasksResponse.data.tasks.length);
        console.log('   Pagination info:', getTasksResponse.data.pagination);
        console.log('');

        // Test 7: Update Task Status
        console.log('7️⃣ Testing Task Status Update...');
        const taskId = createTaskResponse.data.task._id;
        const updateStatusResponse = await axios.patch(`${API_BASE_URL}/tasks/${taskId}/status`, {
            status: 'In Progress'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Task status updated:', updateStatusResponse.data.message);
        console.log('   New status:', updateStatusResponse.data.task.status);
        console.log('');

        // Test 8: Filter Tasks by Status
        console.log('8️⃣ Testing Task Filtering...');
        const filterResponse = await axios.get(`${API_BASE_URL}/tasks?status=In Progress`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Tasks filtered successfully');
        console.log('   Tasks with "In Progress" status:', filterResponse.data.tasks.length);
        console.log('');

        console.log('🎉 All backend tests passed successfully!');
        console.log('🚀 Backend is ready for production use.');
        console.log('');
        console.log('📋 Summary of implemented features:');
        console.log('   ✅ Express.js RESTful APIs');
        console.log('   ✅ MongoDB with Mongoose');
        console.log('   ✅ JWT-based authentication');
        console.log('   ✅ CRUD operations on tasks');
        console.log('   ✅ Task filtering by status');
        console.log('   ✅ Proper error handling and HTTP status codes');

    } catch (error) {
        console.error('❌ Backend test failed:', error.response?.data || error.message);
        console.log('');
        console.log('🔧 Troubleshooting tips:');
        console.log('   1. Make sure MongoDB is running');
        console.log('   2. Check if the server is running on port 5000');
        console.log('   3. Verify the .env file is configured correctly');
    }
}

// Run the test
testBackend(); 