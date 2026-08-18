import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const imageUploadOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _req: unknown,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!/^image\/(jpeg|jpg|png|gif|webp)$/.test(file.mimetype)) {
      cb(
        new BadRequestException(
          'Only image files (jpeg, jpg, png, gif, webp) are allowed',
        ),
        false,
      );
      return;
    }
    cb(null, true);
  },
};
