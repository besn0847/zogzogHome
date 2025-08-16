// Debug script to check authentication status
console.log('=== DEBUG AUTH ===');

// Check localStorage tokens
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
const userEmail = localStorage.getItem('userEmail');
const userName = localStorage.getItem('userName');

console.log('Access Token:', accessToken ? 'EXISTS (length: ' + accessToken.length + ')' : 'MISSING');
console.log('Refresh Token:', refreshToken ? 'EXISTS' : 'MISSING');
console.log('User Email:', userEmail);
console.log('User Name:', userName);

// Test API call with token
if (accessToken) {
  console.log('Testing API call with token...');
  
  fetch('http://localhost:3001/api/collections', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    credentials: 'include'
  })
  .then(response => {
    console.log('API Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('API Response Data:', data);
  })
  .catch(error => {
    console.error('API Error:', error);
  });
} else {
  console.log('No access token found - user needs to login');
}

console.log('=== END DEBUG ===');
