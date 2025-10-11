# Frontend Environment Variables Setup Guide

## Frontend Environment Variables (.env.local)

Create a `.env.local` file in the `Sukalmart_user` directory with the following variables:

### Required Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME=SukalMart
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional Variables (for enhanced functionality)

```env
# Payment Gateway Keys (for client-side payment integration)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Google Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Social Media
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id

# Cloudinary (for client-side uploads if needed)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
```

## Environment-Specific Configurations

### Development (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Production (.env.production)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
NODE_ENV=production
```

### Staging (.env.staging)

```env
NEXT_PUBLIC_API_URL=https://staging-api.your-domain.com/api/v1
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
NODE_ENV=staging
```

## Quick Start (Minimal Setup)

For basic functionality, you only need:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=SukalMart
```

## Important Notes

1. **NEXT*PUBLIC* prefix**: Only variables with this prefix are accessible in the browser
2. **Security**: Never expose sensitive keys (like API secrets) to the client
3. **Environment files priority**:
   - `.env.local` (highest priority, not committed to git)
   - `.env.development`
   - `.env.production`
   - `.env` (lowest priority)

## API Integration

The frontend will use these environment variables to connect to your backend API. Make sure:

1. The `NEXT_PUBLIC_API_URL` matches your backend server URL
2. CORS is properly configured on the backend
3. The API endpoints are accessible

## Testing Environment Variables

You can test if your environment variables are loaded correctly by adding this to any component:

```javascript
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("App Name:", process.env.NEXT_PUBLIC_APP_NAME);
```

## Deployment Considerations

- For Vercel deployment, add environment variables in the Vercel dashboard
- For other platforms, follow their specific environment variable setup guides
- Always use production URLs for production deployments
