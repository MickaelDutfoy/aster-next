'use server';

import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { ActionValidation, Member, MemberOfOrg, Organization } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

export const approveOrgRequest = async (
  member: MemberOfOrg,
  org: Organization,
  locale: string,
): Promise<ActionValidation> => {
  const t = await getTranslations({ locale, namespace: 'emails' });

  const user: Member | null = await getUser();
  if (!user) {
    return { ok: false, status: 'error', message: 'toasts.noUser' };
  }

  const memberId = member.id;
  const orgId = org.id;

  try {
    await prisma.memberOrganization.update({
      where: { memberId_orgId: { memberId, orgId } },
      data: { status: MemberStatus.VALIDATED },
    });

    await sendEmail({
      to: member.email,
      subject: t('orgRequestApproved.subject', { orgName: org.name }),
      html: `
          <p>${t('common.hello')}</p>
          <p>${t('orgRequestApproved.content1', { orgName: org.name })}</p>
          <p>${t('orgRequestApproved.content2')}</p>
          <p>${t('orgRequestApproved.content3')}</p>
          <p>${t('common.footer')}</p>
      `,
    });

    revalidatePath('/organizations');

    return { ok: true, status: 'success', message: 'toasts.orgRequestApproved' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
