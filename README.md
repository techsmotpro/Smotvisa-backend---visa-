# Horizon Travel Hub Email Server

This backend server handles email sending functionality for the Horizon Travel Hub website. It uses Nodemailer to send two emails for each inquiry:
1. An email to the company owner with the inquiry details
2. A thank you email to the user who submitted the inquiry

## Configuration

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Email Settings
Update the `backend/.env` file with your SMTP credentials:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Owner Email (where inquiries will be sent)
OWNER_EMAIL=owner@horizontravelhub.com

# Server Configuration
PORT=5001
```

### 3. Gmail SMTP Setup (Recommended)
To use Gmail SMTP, you need to create an App Password:

1. Enable 2-Step Verification on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Create a new app password
4. Copy the generated 16-character password to `SMTP_PASSWORD` in the .env file

### 4. Other SMTP Providers
You can use any SMTP provider (e.g., Outlook, Yahoo, SendGrid, Mailgun) by updating the SMTP configuration:

```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@your-provider.com
SMTP_PASSWORD=your-password
```

## Running the Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5001`

## API Endpoints

### Send Email (POST)
```http
POST /api/send-email
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 12345 67890",
  "service": "Passport Services",
  "message": "I need assistance with passport renewal"
}
```

**Response:**
```json
{
  "message": "Emails sent successfully"
}
```

## Email Templates

The server sends two HTML emails:

### Owner Email
- Subject: `New Inquiry from {name} - Horizon Travel Hub`
- Contains all inquiry details
- Blue color scheme

### User Email
- Subject: `Thank You for Your Inquiry - Horizon Travel Hub`
- Thank you message with inquiry details
- Green color scheme

## Frontend Integration

The frontend sends inquiries to the backend using:
```javascript
fetch('http://localhost:5001/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
})
```

## Troubleshooting

### 1. EADDRINUSE Error
If you get an "Address already in use" error, change the PORT in the .env file.

### 2. Authentication Errors
- Double-check your SMTP credentials
- For Gmail, ensure you're using an App Password (not your regular password)
- Verify that your SMTP provider allows connections from your server

### 3. Connection Errors
- Check that the SMTP port is correct
- Verify that your server has internet connectivity
- Some providers block SMTP connections from certain regions

## License

MIT# Smot-pro-backend---visa-
# manismottpro-eng-Smot-pro-backend---visa-
# manismottpro-eng-Smot-pro-backend---visa-
# manismottpro-eng-Smot-pro-backend---visa-
# Smotvisa-backend---visa-
