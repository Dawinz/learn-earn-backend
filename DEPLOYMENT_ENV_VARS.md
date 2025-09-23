# Backend Deployment Environment Variables

## Required Environment Variables for Render Deployment

Copy and paste these environment variables when setting up your Render service:

```
NODE_ENV=production
PORT=10000
MONGO_URL=mongodb+srv://dawinibra_db_user:vBIrKJo0qa7Ifr9m@cluster0.xf8trnw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_here_generate_a_strong_one
APP_PEPPER=your_app_pepper_here_generate_a_strong_one
SAFETY_MARGIN=0.6
MIN_PAYOUT_USD=5
PAYOUT_COOLDOWN_HOURS=48
MAX_DAILY_EARN_USD=0.5
NUMBER_CHANGE_LOCK_DAYS=30
EMULATOR_PAYOUTS=false
ADMIN_EMAIL=admin@learnearn.com
ADMIN_PASSWORD_HASH=your_admin_password_hash_here
ECPM_USD=1.5
COIN_TO_USD_RATE=0.001
```

## Environment Variable Descriptions

- **NODE_ENV**: Set to "production" for production deployment
- **PORT**: Port number for the server (Render will override this)
- **MONGO_URL**: MongoDB Atlas connection string
- **JWT_SECRET**: Secret key for JWT token signing (generate a strong random string)
- **APP_PEPPER**: Pepper for device ID generation (generate a strong random string)
- **SAFETY_MARGIN**: Safety margin for payout calculations (0.6 = 60%)
- **MIN_PAYOUT_USD**: Minimum payout amount in USD
- **PAYOUT_COOLDOWN_HOURS**: Hours between payouts
- **MAX_DAILY_EARN_USD**: Maximum daily earnings per user in USD
- **NUMBER_CHANGE_LOCK_DAYS**: Days to lock mobile number changes
- **EMULATOR_PAYOUTS**: Allow payouts from emulators (false for production)
- **ADMIN_EMAIL**: Admin email address
- **ADMIN_PASSWORD_HASH**: Hashed admin password (use bcrypt)
- **ECPM_USD**: Effective cost per mille for ads
- **COIN_TO_USD_RATE**: Conversion rate from coins to USD

## Generate Required Values

### JWT_SECRET
Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### APP_PEPPER
Generate a strong app pepper:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ADMIN_PASSWORD_HASH
Generate a bcrypt hash for admin password:
```bash
node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"
```

## Deployment Steps

1. **Create Render Service**: Use the render.yaml configuration
2. **Set Environment Variables**: Copy the above environment variables
3. **Deploy**: Render will automatically build and deploy
4. **Test**: Verify the service is running at the provided URL
5. **Update Mobile App**: Update the mobile app's API base URL to the new Render URL
6. **Update Admin Panel**: Update the admin panel's API base URL to the new Render URL

## Health Check

After deployment, test the health endpoint:
```bash
curl https://your-render-url.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-09-23T16:24:20.600Z",
  "uptime": 6.406471256
}
```
