'use client';

import { getCroppedImage } from '@/lib/images/getCroppedImage';
import { CircleX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

type AnimalImageEditModalProps = {
  image: File;
  onCancel: () => void;
  onValidate: (croppedImage: File) => Promise<void>;
};

export const AnimalImageEditModal = ({
  image,
  onCancel,
  onValidate,
}: AnimalImageEditModalProps) => {
  const t = useTranslations();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  const handleValidate = async () => {
    if (!previewUrl || !croppedAreaPixels) {
      return;
    }

    try {
      setIsLoading(true);

      const croppedImage = await getCroppedImage(previewUrl, croppedAreaPixels);

      await onValidate(croppedImage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <CircleX className="close" size={35} onClick={onCancel} />

        <h3>{t('animals.imageEditTitle')}</h3>

        <div className="confirm-modal-content">
          <div className="animal-image-crop-container">
            {previewUrl && (
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                cropShape="round"
                minZoom={1}
                maxZoom={3}
                zoomSpeed={0.2}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => {
                  setCroppedAreaPixels(croppedPixels);
                }}
              />
            )}
          </div>

          <div className="yes-no">
            <button
              type="button"
              onClick={handleValidate}
              className="little-button"
              aria-busy={isLoading}
              disabled={isLoading}
            >
              {isLoading ? t('common.loading') : t('common.submit')}
            </button>

            <button
              type="button"
              className="little-button"
              onClick={onCancel}
              aria-busy={isLoading}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
