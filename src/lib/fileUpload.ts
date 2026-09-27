import { AppLogger } from './logger';
import { uploadFileToFirebaseStorage } from './firebase';

export interface FileValidationOptions {
  maxSizeMb?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  uploadToFirebaseStorage?: boolean;
  storageFolder?: string;
}

export interface ValidatedFileResult {
  success: boolean;
  dataUrl?: string;
  storageUrl?: string;
  fileName?: string;
  fileSizeKb?: number;
  mimeType?: string;
  error?: string;
}

const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
];

export async function validateAndProcessFileUpload(
  file: File,
  options: FileValidationOptions = {}
): Promise<ValidatedFileResult> {
  const maxSizeMb = options.maxSizeMb || DEFAULT_MAX_SIZE_MB;
  const maxSizeBytes = maxSizeMb * 1024 * 1024;
  const allowedMimes = options.allowedMimeTypes || DEFAULT_ALLOWED_MIME_TYPES;

  // 1. Check size
  if (file.size > maxSizeBytes) {
    const errorMsg = `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${maxSizeMb}MB.`;
    AppLogger.warn('FileUpload', errorMsg, { fileName: file.name, fileSize: file.size });
    return { success: false, error: errorMsg };
  }

  // 2. Check MIME type
  if (!allowedMimes.includes(file.type)) {
    const errorMsg = `File type '${file.type || 'unknown'}' is not allowed. Supported formats: JPEG, PNG, WebP, GIF, SVG, PDF.`;
    AppLogger.warn('FileUpload', errorMsg, { fileName: file.name, mimeType: file.type });
    return { success: false, error: errorMsg };
  }

  // 3. Check filename extension safety
  const fileNameLower = file.name.toLowerCase();
  const dangerousExtensions = ['.exe', '.js', '.html', '.php', '.sh', '.bat', '.cmd', '.vbs'];
  if (dangerousExtensions.some((ext) => fileNameLower.endsWith(ext))) {
    const errorMsg = `Executable or script extension detected in filename '${file.name}'. Upload blocked for security.`;
    AppLogger.error('FileUploadSecurity', errorMsg, { fileName: file.name });
    return { success: false, error: errorMsg };
  }

  // 4. Read and process image/file
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const rawDataUrl = reader.result as string;

      // Helper to attempt Firebase Storage upload if requested
      const attemptStorageUpload = async (contentBlob: Blob | File, finalDataUrl: string, mime: string, sizeKb: number) => {
        let storageUrl: string | undefined = undefined;
        if (options.uploadToFirebaseStorage !== false) {
          try {
            const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const folder = options.storageFolder || 'uploads';
            const storagePath = `${folder}/${Date.now()}_${cleanName}`;
            const uploadedUrl = await uploadFileToFirebaseStorage(storagePath, contentBlob);
            if (uploadedUrl) {
              storageUrl = uploadedUrl;
              AppLogger.info('FileUpload', `File uploaded to Firebase Storage at ${storagePath}`, { storageUrl });
            }
          } catch (storageErr) {
            console.warn('Firebase storage upload fallback to dataUrl:', storageErr);
          }
        }

        resolve({
          success: true,
          dataUrl: storageUrl || finalDataUrl,
          storageUrl,
          fileName: file.name,
          fileSizeKb: sizeKb,
          mimeType: mime,
        });
      };

      // If file is an image (and not SVG), compress it using canvas
      if (file.type.startsWith('image/') && !file.type.includes('svg')) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas');
            const maxDim = 800; // max 800px width/height
            let width = img.width;
            let height = img.height;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
              const compressedKb = Number((compressedDataUrl.length / 1024).toFixed(1));
              
              // Convert canvas to blob for storage upload
              canvas.toBlob(async (blob) => {
                const targetBlob = blob || file;
                await attemptStorageUpload(targetBlob, compressedDataUrl, 'image/jpeg', compressedKb);
              }, 'image/jpeg', 0.8);
              return;
            }
          } catch (compressErr) {
            console.warn('Image canvas compression failed, falling back to raw data URL', compressErr);
          }
          // Fallback if canvas context fails
          await attemptStorageUpload(file, rawDataUrl, file.type, Number((file.size / 1024).toFixed(1)));
        };

        img.onerror = async () => {
          await attemptStorageUpload(file, rawDataUrl, file.type, Number((file.size / 1024).toFixed(1)));
        };

        img.src = rawDataUrl;
      } else {
        AppLogger.info('FileUpload', `File '${file.name}' successfully validated and encoded.`, {
          fileName: file.name,
          sizeKb: (file.size / 1024).toFixed(1),
        });
        await attemptStorageUpload(file, rawDataUrl, file.type, Number((file.size / 1024).toFixed(1)));
      }
    };

    reader.onerror = (e) => {
      const errorMsg = 'Failed to read uploaded file.';
      AppLogger.error('FileUpload', errorMsg, { fileName: file.name, error: e });
      resolve({ success: false, error: errorMsg });
    };

    reader.readAsDataURL(file);
  });
}
