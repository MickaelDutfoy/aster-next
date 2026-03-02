'use server';

import { sendEmail } from '@/lib/email';
import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

export const approveOrgRequest = async (
  memberId: number,
  orgId: number,
  locale: string,
): Promise<ActionValidation> => {
  const t = await getTranslations({ locale, namespace: 'emails' });

  const guard = await isOrgAdmin(orgId);
  if (!guard.validation.ok) return guard.validation;

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { name: true },
  });
  const orgName = org ? org.name : '';

  try {
    await prisma.memberOrganization.update({
      where: { memberId_orgId: { memberId, orgId: orgId } },
      data: { status: MemberStatus.VALIDATED },
    });

    await prisma.notification.create({
      data: {
        memberId,
        messageKey: 'notifications.organizations.approvedRequest',
        messageParams: {
          orgName,
        },
        href: `/organizations/${orgId}`,
      },
    });

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { email: true },
    });

    if (member) {
      await sendEmail({
        to: member.email,
        subject: t('orgRequestApproved.subject', { orgName }),
        html: `
            <p>${t('common.hello')}</p>
            <p>${t('orgRequestApproved.content1', { orgName })}</p>
            <p>${t('orgRequestApproved.content2')}</p>
            <p>${t('orgRequestApproved.content3')}</p>
            <p style="text-align: center">
              <a
                href="${process.env.AUTH_URL}/notifications"
                style="
                  display: inline-block;
                  padding: 10px 16px;
                  background: #653d24;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                "
              >
                ${t('common.link')}
              </a>
            </p>
            <p>${t('common.footer')}</p>
          `,
      });
    }

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
