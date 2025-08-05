# SendGrid Email Setup Guide

## Step 1: Create SendGrid Account

1. **Go to [SendGrid.com](https://sendgrid.com)**
2. **Click "Start for Free"**
3. **Fill out the signup form** with your email and password
4. **Verify your email address** (check your inbox)
5. **Complete the account setup**

## Step 2: Get Your API Key

1. **Log into your SendGrid dashboard**
2. **Go to Settings → API Keys** (in the left sidebar)
3. **Click "Create API Key"**
4. **Name it**: "VolunTEEN Email Service"
5. **Select permissions**: 
   - ✅ **Mail Send** (Full Access)
6. **Click "Create & View"**
7. **Copy the API key** (starts with `SG.`)

## Step 3: Verify Your Sender Email

1. **Go to Settings → Sender Authentication**
2. **Click "Verify a Single Sender"**
3. **Fill out the form**:
   - **From Name**: VolunTEEN
   - **From Email**: your-email@domain.com (use your actual email)
   - **Reply To**: your-email@domain.com
   - **Company Name**: VolunTEEN
   - **Address**: Your address
4. **Click "Create"**
5. **Check your email** and click the verification link

## Step 4: Update Your Code

1. **Open `js/email-service.js`**
2. **Find this line**:
   ```javascript
   this.apiKey = 'YOUR_SENDGRID_API_KEY_HERE';
   ```
3. **Replace `YOUR_SENDGRID_API_KEY_HERE`** with your actual API key
4. **Find this line**:
   ```javascript
   this.fromEmail = 'noreply@volunteen.com';
   ```
5. **Replace with your verified email**:
   ```javascript
   this.fromEmail = 'your-email@domain.com';
   ```

## Step 5: Test the Integration

1. **Save the file**
2. **Deploy to your website**
3. **Create an event** as a supervisor
4. **Sign up as a student**
5. **Check your email inbox** for the real email!

## Troubleshooting

### If emails don't send:
- Check browser console for errors
- Verify your API key is correct
- Make sure your sender email is verified
- Check SendGrid dashboard for delivery status

### If you get API errors:
- Ensure your SendGrid account is active
- Check that you have remaining emails in your free tier
- Verify the API key has "Mail Send" permissions

## Free Tier Limits

- **100 emails per day** (free tier)
- **Perfect for testing and small projects**
- **Upgrade anytime** if you need more

## Security Note

⚠️ **Never commit your API key to public repositories**
- The API key in the code is just a placeholder
- Replace it with your actual key after deployment
- Consider using environment variables for production 