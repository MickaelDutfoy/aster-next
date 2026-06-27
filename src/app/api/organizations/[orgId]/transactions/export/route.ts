import { routing } from '@/i18n/routing';
import { isAdminOfOrg } from '@/lib/permissions/isAdminOfOrg';
import { prisma } from '@/lib/prisma';
import { buildTransactionsCsv } from '@/lib/transactions/buildTransactionsCsv';
import { getTransactionsOfOrg } from '@/lib/transactions/getTransactionsOfOrg';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');

  if (!hasLocale(routing.locales, locale)) {
    return new NextResponse('Invalid locale', { status: 400 });
  }

  const t = await getTranslations({ locale });

  const { orgId } = await params;
  const parsedOrgId = Number(orgId);

  if (!Number.isSafeInteger(parsedOrgId) || parsedOrgId <= 0) {
    return new NextResponse('Invalid organization id', { status: 400 });
  }

  const { validation } = await isAdminOfOrg(parsedOrgId);

  if (!validation.ok) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const transactions = await getTransactionsOfOrg(parsedOrgId);

  const org = await prisma.organization.findUnique({
    where: { id: parsedOrgId },
    select: { name: true },
  });

  if (!org) {
    return new NextResponse('Organization not found', { status: 404 });
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

  const buildTransactionsCsvFilename = (orgName: string): string => {
    const normalizedOrgName = normalizeFileNamePart(orgName) || 'organization';

    const today = new Date().toISOString().slice(0, 10);

    return `aster-transactions-${normalizedOrgName}-${today}.csv`;
  };

  const filename = buildTransactionsCsvFilename(org.name);

  const csv = buildTransactionsCsv(transactions, locale, t);

  return new NextResponse(`\uFEFF${csv}`, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
