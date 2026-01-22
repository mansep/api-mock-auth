import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { MultiAuthGuard } from '../auth/guards/multi-auth.guard';
import { randomUUID } from 'crypto';

const uuidv4 = () => randomUUID();

@ApiTags('Upload')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('API-Key')
@ApiSecurity('Basic-auth')
@Controller('api/upload')
@UseGuards(MultiAuthGuard)
export class UploadController {
  
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload single file', description: 'Upload a single file and get a mock URL' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File uploaded successfully' },
        file: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
            originalName: { type: 'string', example: 'document.pdf' },
            mimeType: { type: 'string', example: 'application/pdf' },
            size: { type: 'number', example: 102400 },
            url: { type: 'string', example: 'https://cdn.mockapi.local/uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479/document.pdf' },
            thumbnailUrl: { type: 'string', example: 'https://cdn.mockapi.local/thumbnails/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg' },
            uploadedAt: { type: 'string', example: '2024-01-22T10:30:00.000Z' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No file provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileId = uuidv4();
    const extension = file.originalname.split('.').pop() || '';
    
    return {
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: fileId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `https://cdn.mockapi.local/uploads/${fileId}/${file.originalname}`,
        thumbnailUrl: file.mimetype.startsWith('image/') 
          ? `https://cdn.mockapi.local/thumbnails/${fileId}.jpg`
          : null,
        uploadedAt: new Date().toISOString(),
      },
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload multiple files', description: 'Upload multiple files (max 10) and get mock URLs' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to upload (max 10)',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Files uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Files uploaded successfully' },
        totalFiles: { type: 'number', example: 3 },
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              originalName: { type: 'string' },
              mimeType: { type: 'string' },
              size: { type: 'number' },
              url: { type: 'string' },
              uploadedAt: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No files provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedFiles = files.map((file) => {
      const fileId = uuidv4();
      return {
        id: fileId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `https://cdn.mockapi.local/uploads/${fileId}/${file.originalname}`,
        thumbnailUrl: file.mimetype.startsWith('image/') 
          ? `https://cdn.mockapi.local/thumbnails/${fileId}.jpg`
          : null,
        uploadedAt: new Date().toISOString(),
      };
    });

    return {
      success: true,
      message: 'Files uploaded successfully',
      totalFiles: uploadedFiles.length,
      files: uploadedFiles,
    };
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload image', description: 'Upload an image file with automatic thumbnail generation mock' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload (jpg, png, gif, webp)',
        },
      },
      required: ['image'],
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Image uploaded successfully' },
        image: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            originalName: { type: 'string' },
            mimeType: { type: 'string' },
            size: { type: 'number' },
            url: { type: 'string' },
            thumbnailUrl: { type: 'string' },
            mediumUrl: { type: 'string' },
            largeUrl: { type: 'string' },
            uploadedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No image provided or invalid image type' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image provided');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image type. Allowed: jpg, png, gif, webp');
    }

    const fileId = uuidv4();
    const basePath = `https://cdn.mockapi.local/images/${fileId}`;

    return {
      success: true,
      message: 'Image uploaded successfully',
      image: {
        id: fileId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `${basePath}/original.${file.mimetype.split('/')[1]}`,
        thumbnailUrl: `${basePath}/thumbnail.jpg`,
        mediumUrl: `${basePath}/medium.jpg`,
        largeUrl: `${basePath}/large.jpg`,
        uploadedAt: new Date().toISOString(),
      },
    };
  }
}
