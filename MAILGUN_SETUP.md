# Mailgun Email Setup Guide

## Step 1: Create Mailgun Account

1. **Go to [Mailgun.com](https://mailgun.com)**
2. **Click "Get Started Free"**
3. **Fill out the signup form**:
   - Email: your email address
   - Password: create a secure password
   - Company: VolunTEEN
4. **Verify your email** (check your inbox and click the link)
5. **Complete the account setup**

## Step 2: Get Your API Key

1. **Log into your Mailgun dashboard**
2. **Go to Settings → API Keys** (in the left sidebar)
3. **Click "Create API Key"**
4. **Name it**: "VolunTEEN Email Service"
5. **Copy the API key** (starts with `key-`)

## Step 3: Add Your Domain

1. **In Mailgun dashboard, go to "Sending → Domains"**
2. **Click "Add New Domain"**
3. **Enter your domain**: `studentvolunteen.org`
4. **Click "Add Domain"**
5. **Copy the Domain name** (usually `mg.studentvolunteen.org`)

## Step 4: Verify Your Domain (Optional but Recommended)

1. **In the Domains section, click on your domain**
2. **You'll see DNS records to add** (similar to SendGrid)
3. **Add these to your domain registrar** (same process as before)
4. **Wait 24-48 hours for verification**

## Step 5: Update Your Code

1. **Open `js/email-service.js`**
2. **Find this line**:
   ```javascript
   this.apiKey = 'YOUR_MAILGUN_API_KEY_HERE';
   ```
3. **Replace `YOUR_MAILGUN_API_KEY_HERE`** with your actual Mailgun API key
4. **Find this line**:
   ```javascript
   this.domain = 'YOUR_MAILGUN_DOMAIN_HERE';
   ```
5. **Replace with your Mailgun domain**:
   ```javascript
   this.domain = 'mg.studentvolunteen.org';
   ```

## Step 6: Test the Integration

1. **Save the file**
2. **Deploy to your website**
3. **Create an event** as a supervisor
4. **Sign up as a student**
5. **Check your email inbox** for the real email!

## Mailgun Free Tier Benefits

- ✅ **5,000 emails per month** (forever free)
- ✅ **No trial period** - truly free
- ✅ **Professional email delivery**
- ✅ **Email tracking and analytics**
- ✅ **Spam protection**

## Troubleshooting

### If emails don't send:
- Check browser console for errors
- Verify your API key is correct
- Make sure your domain is properly configured
- Check Mailgun dashboard for delivery status

### If you get API errors:
- Ensure your Mailgun account is active
- Check that you have remaining emails in your free tier
- Verify the API key has proper permissions

## Security Note

⚠️ **Never commit your API key to public repositories**
- The API key in the code is just a placeholder
- Replace it with your actual key after deployment
- Consider using environment variables for production

## Next Steps

Once you have your Mailgun credentials:
1. **Update the code** with your API key and domain
2. **Test with a real email address**
3. **Deploy to your website**
4. **Enjoy real email delivery!** 📬 