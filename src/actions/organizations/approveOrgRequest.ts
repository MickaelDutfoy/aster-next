'use server';

import { sendEmail } from '@/lib/email';
import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation, MemberOfOrg, Organization } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

export const approveOrgRequest = async (
  member: MemberOfOrg,
  org: Organization,
  locale: string,
): Promise<ActionValidation> => {
  const t = await getTranslations({ locale, namespace: 'emails' });

  const guard = await isOrgAdmin(org.id);
  if (!guard.validation.ok) return guard.validation;

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.memberOrganization.update({
        where: { memberId_orgId: { memberId: member.id, orgId: org.id } },
        data: { status: MemberStatus.VALIDATED },
      });

      await prismaTransaction.notification.create({
        data: {
          memberId: member.id,
          messageKey: 'notifications.organizations.approvedRequest',
          messageParams: {
            orgName: org.name,
          },
          href: `/organizations/${org.id}`,
        },
      });
    });

    await sendEmail({
      to: member.email,
      subject: t('orgRequestApproved.subject', { orgName: org.name }),
      html: `
            <p>${t('common.hello')}</p>
            <p>${t('orgRequestApproved.content1', { orgName: org.name })}</p>
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
