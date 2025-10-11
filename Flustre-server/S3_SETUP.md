# AWS S3 Setup Guide for SukalMart

This guide will help you set up AWS S3 for image uploads in your SukalMart application.

## Prerequisites

1. AWS Account
2. Node.js and npm installed
3. Basic understanding of AWS services

## Step 1: AWS S3 Bucket Setup

### 1.1 Create S3 Bucket

1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to S3 service
3. Click "Create bucket"
4. Configure bucket settings:
   - **Bucket name**: `sukalmart-images` (or your preferred name)
   - **Region**: Choose your preferred region (e.g., `us-east-1`)
   - **Block Public Access**: Uncheck "Block all public access" (for public image access)
   - **Bucket Versioning**: Disabled (recommended for images)
   - **Default encryption**: Enabled (recommended)

### 1.2 Configure CORS (Cross-Origin Resource Sharing)

1. Select your bucket
2. Go to "Permissions" tab
3. Scroll down to "Cross-origin resource sharing (CORS)"
4. Click "Edit" and add this configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Step 2: IAM User Setup

### 2.1 Create IAM User

1. Navigate to IAM service
2. Click "Users" → "Create user"
3. Enter username: `sukalmart-s3-user`
4. Select "Programmatic access"

### 2.2 Attach Permissions

1. Click "Attach existing policies directly"
2. Search for and select `AmazonS3FullAccess`
3. Complete user creation
4. **Important**: Save the Access Key ID and Secret Access Key

### 2.3 Alternative: Custom Policy (More Secure)

If you want more restrictive permissions, create a custom policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

## Step 3: Environment Variables

Add these variables to your `.env` file:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name-here
```

## Step 4: Folder Structure

The S3 setup automatically organizes images into folders:

```
s3://your-bucket-name/
├── sukalmart/
│   ├── products/          # Product images
│   ├── banners/           # Banner images
│   ├── categories/        # Category images
│   ├── brands/            # Brand images
│   ├── users/             # User profile images
│   ├── offers/            # Offer images
│   └── uploads/           # General uploads
```

## Step 5: API Endpoints

### Public Endpoints (No Authentication Required)

#### Upload Single Image

```http
POST /api/v1/s3-upload/upload-single
Content-Type: multipart/form-data

Body:
- image: [file]
- folder: [string] (optional, default: 'general')
- filename: [string] (optional)
```

#### Upload Multiple Images

```http
POST /api/v1/s3-upload/upload-multiple
Content-Type: multipart/form-data

Body:
- images: [files] (max 10)
- folder: [string] (optional, default: 'general')
- filename: [string] (optional)
```

### Protected Endpoints (Authentication Required)

#### Upload Product Images

```http
POST /api/v1/s3-upload/upload-product-images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- images: [files] (max 10)
- productId: [string] (optional)
- productName: [string] (optional)
```

#### Upload Banner Images

```http
POST /api/v1/s3-upload/upload-banner-images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- images: [files] (max 5)
- bannerType: [string] (optional)
- bannerName: [string] (optional)
```

#### Upload Category Images

```http
POST /api/v1/s3-upload/upload-category-images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- images: [files] (max 5)
- categoryName: [string] (optional)
- categoryId: [string] (optional)
```

#### Upload Brand Images

```http
POST /api/v1/s3-upload/upload-brand-images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- images: [files] (max 5)
- brandName: [string] (optional)
- brandId: [string] (optional)
```

### File Management Endpoints

#### Delete Image

```http
DELETE /api/v1/s3-upload/delete/:key
Authorization: Bearer <token>
```

#### Get Signed URL

```http
GET /api/v1/s3-upload/signed-url/:key?expiresIn=3600
Authorization: Bearer <token>
```

#### List Files in Folder

```http
GET /api/v1/s3-upload/list-files?folder=products&maxKeys=100
Authorization: Bearer <token>
```

## Step 6: Usage Examples

### Frontend JavaScript Example

```javascript
// Upload single image
const uploadSingleImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", "products");
  formData.append("filename", "my-product");

  const response = await fetch("/api/v1/s3-upload/upload-single", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  return result.data.url;
};

// Upload multiple images
const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });
  formData.append("folder", "products");

  const response = await fetch("/api/v1/s3-upload/upload-multiple", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  return result.data.images.map((img) => img.url);
};
```

### Backend Usage Example

```javascript
const { uploadToS3, uploadMultipleToS3 } = require("./utilities/s3Upload");

// Upload single image
const uploadImage = async (buffer, filename) => {
  const result = await uploadToS3(buffer, {
    folder: "products",
    filename: filename,
    contentType: "image/jpeg",
  });

  return result.url;
};

// Upload multiple images
const uploadImages = async (files) => {
  const results = await uploadMultipleToS3(files, {
    folder: "products",
    filename: "product-gallery",
  });

  return results.map((result) => result.url);
};
```

## Step 7: Testing

### Test with cURL

```bash
# Upload single image
curl -X POST \
  http://localhost:5000/api/v1/s3-upload/upload-single \
  -F "image=@/path/to/your/image.jpg" \
  -F "folder=products" \
  -F "filename=test-product"

# Upload multiple images
curl -X POST \
  http://localhost:5000/api/v1/s3-upload/upload-multiple \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "folder=products"
```

## Step 8: Security Considerations

1. **IAM Permissions**: Use least privilege principle
2. **CORS Configuration**: Restrict origins in production
3. **File Size Limits**: Configure appropriate limits
4. **File Type Validation**: Only allow image files
5. **Access Control**: Use signed URLs for private content
6. **Monitoring**: Set up CloudTrail for audit logs

## Step 9: Cost Optimization

1. **Lifecycle Policies**: Set up automatic deletion of old files
2. **Storage Classes**: Use appropriate storage classes
3. **CDN**: Consider using CloudFront for global distribution
4. **Compression**: Compress images before upload
5. **Monitoring**: Monitor usage and costs

## Troubleshooting

### Common Issues

1. **Access Denied**: Check IAM permissions
2. **CORS Errors**: Verify CORS configuration
3. **File Upload Fails**: Check file size and type limits
4. **Bucket Not Found**: Verify bucket name and region

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

## Support

For issues related to:

- AWS S3: Check AWS documentation
- Application: Check server logs
- Configuration: Verify environment variables

## Migration from Cloudinary

If you're migrating from Cloudinary, the existing `cloudinaryUpload.js` file has been updated to use S3 while maintaining backward compatibility. You can gradually migrate your code to use the new S3 functions.
