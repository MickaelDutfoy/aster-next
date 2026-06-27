import { routing } from '@/i18n/routing';
import { buildAnimalPdf } from '@/lib/animals/buildAnimalPdf';
import { getAnimalById } from '@/lib/animals/getAnimalById';
import { isAdminOfOrg } from '@/lib/permissions/isAdminOfOrg';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orgId: string; animalId: string }> },
) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');

  if (!hasLocale(routing.locales, locale)) {
    return new NextResponse('Invalid locale', { status: 400 });
  }

  const t = await getTranslations({ locale });

  const { orgId, animalId } = await params;

  const parsedOrgId = Number(orgId);
  const parsedAnimalId = Number(animalId);

  const isDev = process.env.NODE_ENV === 'development';

  if (!Number.isSafeInteger(parsedOrgId) || parsedOrgId <= 0) {
    return new NextResponse('Invalid organization id', { status: 400 });
  }

  if (!Number.isSafeInteger(parsedAnimalId) || parsedAnimalId <= 0) {
    return new NextResponse('Invalid animal id', { status: 400 });
  }

  const { validation } = await isAdminOfOrg(parsedOrgId);

  if (!validation.ok) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const animal = await getAnimalById(parsedAnimalId);

  if (!animal || animal.orgId !== parsedOrgId) {
    return new NextResponse('Animal not found', { status: 404 });
  }

  const normalizeFileNamePart = (value: string): string => {
    return value
      .trim()
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'o')
      .replace(/å/g, 'a')
      .replace(/Æ/g, 'ae')
      .replace(/Ø/g, 'o')
      .replace(/Å/g, 'a')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const buildAnimalPdfFilename = (animalName: string): string => {
    const normalizedAnimalName = normalizeFileNamePart(animalName) || 'organization';

    const today = new Date().toISOString().slice(0, 10);

    return `aster-animal-${normalizedAnimalName}-${today}.pdf`;
  };

  const filename = buildAnimalPdfFilename(animal.name);

  const pdfBuffer = await buildAnimalPdf({
    animal,
    locale,
    t,
  });

  const pdfBody = new Uint8Array(pdfBuffer);

  return new NextResponse(pdfBody, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${isDev ? 'inline' : 'attachment'}; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
