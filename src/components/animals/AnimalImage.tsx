'use client';

import { deleteAnimalImage } from '@/actions/animals/deleteAnimalImage';
import { setAnimalImage } from '@/actions/animals/setAnimalImage';
import { Action, AnimalWithoutDetails } from '@/lib/types';
import imageCompression from 'browser-image-compression';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { ConfirmModal } from '../tools/ConfirmModal';
import { showToast } from '../tools/ToastProvider';
import { AnimalImageEditModal } from './AnimalImageEditModal';

export const AnimalImage = ({
  animal,
  canEditAnimal,
}: {
  animal: AnimalWithoutDetails;
  canEditAnimal: boolean;
}) => {
  const t = useTranslations();

  const inputRef = useRef<HTMLInputElement>(null);

  const [actionConfirm, setActionConfirm] = useState<Action | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleEditClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];

    if (!image) {
      return;
    }

    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleValidateImage = async (croppedImage: File) => {
    const compressedImage = await imageCompression(croppedImage, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    });

    const formData = new FormData();
    formData.append('animalId', animal.id.toString());
    formData.append('image', compressedImage, 'photo.jpg');

    try {
      const res = await setAnimalImage(formData);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });

      handleCloseModal();
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await deleteAnimalImage(animal.id);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    }

    setActionConfirm(null);
  };

  const deleteImage: Action = {
    id: 'deleteImage',
    name: t('common.deleteImage'),
    handler: handleDeleteImage,
  };

  return (
    <div className="animal-image-box">
      {actionConfirm && (
        <ConfirmModal onCancel={() => setActionConfirm(null)} action={actionConfirm} />
      )}
      <img
        className="animal-image"
        src={
          animal.imageKey
            ? `/api/animals/${animal.id}/image?v=${animal.updatedAt.getTime()}`
            : '/images/animal-placeholder.png'
        }
        alt={animal.name}
      />

      {canEditAnimal && (
        <div className="animal-image-actions">
          <button type="button" onClick={handleEditClick}>
            <Pencil size={26} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!animal.imageKey) {
                return;
              } else {
                setActionConfirm(deleteImage);
              }
            }}
          >
            <Trash2 size={26} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        name="image"
        accept="image/*"
        hidden
        onChange={handleImageChange}
      />

      {selectedImage && (
        <AnimalImageEditModal
          image={selectedImage}
          onCancel={handleCloseModal}
          onValidate={handleValidateImage}
        />
      )}
    </div>
  );
};
