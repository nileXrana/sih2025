## 🩺 Doctor Login Testing Guide

### Test the Real Authentication Flow

1. **Open the application**: http://localhost:3001

2. **Go to Doctor Login**: http://localhost:3001/doctor/login

3. **Use these real credentials**:
   - Email: `dr.preet@nabhahospital.gov.in`
   - Password: `doctor123`

4. **Expected Flow**:
   - ✅ Login form makes API call to `/api/auth/login`
   - ✅ Server validates credentials and returns JWT token
   - ✅ Token is stored in HTTP-only cookie
   - ✅ User is redirected to `/doctor/dashboard`
   - ✅ Dashboard calls `/api/auth/me` to verify authentication
   - ✅ SSE connection is established only after user is authenticated
   - ✅ Real consultations data is loaded

### Debug Information

Check the browser console for these logs:
- `✅ Login successful:` - Login API call succeeded
- `Dashboard - Checking auth...` - Dashboard checking authentication
- `Dashboard - User data received:` - User authenticated successfully
- `Setting up SSE connection for user:` - SSE being initialized
- `✅ SSE connection established` - Real-time notifications working

### Troubleshooting

If you see `SSE connection error: {}`:
1. Make sure you're logged in first
2. Check that the token is set in cookies
3. Verify the user object is set in dashboard state

### Alternative Test Accounts

**Other Doctor Accounts**:
- `dr.manpreet@nabhahospital.gov.in` / `doctor123`
- `dr.simran@nabhahospital.gov.in` / `doctor123`

**MI Room Accounts** (for testing end-to-end):
- `incharge.khanna@miroom.gov.in` / `password123`
- `incharge.nabha@miroom.gov.in` / `password123`
- `incharge.ludhiana@miroom.gov.in` / `password123`