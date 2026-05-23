import { Area } from 'react-easy-crop';

export const getCroppedImage = async (imageSrc: string, crop: Area): Promise<File> => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.9);
  });

  if (!blob) {
    throw new Error('Could not create image blob');
  }

  return new File([blob], 'photo.jpg', {
    type: 'image/jpeg',
  });
};
