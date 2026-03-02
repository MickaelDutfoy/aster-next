'use server';

import { sendEmail } from '@/lib/email';
import { getOrgAdmins } from '@/lib/organizations/getOrgAdmins';
import { isUser } from '@/lib/permissions/isUser';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { MemberRole, MemberStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const joinOrg = async (orgId: number, locale: string): Promise<ActionValidation> => {
  const t = await getTranslations({ locale, namespace: 'emails' });

  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const user = guard.user;

  try {
    if (user.organizations?.some((org) => org.id === orgId)) {
      return {
        ok: false,
        status: 'error',
        message: 'toasts.alreadyMemberOfOrg',
      };
    }

    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.memberOrganization.create({
        data: {
          orgId,
          memberId: user.id,
          role: MemberRole.MEMBER,
          status: MemberStatus.PENDING,
        },
      });

      if (!user.selectedOrgId) {
        await prismaTransaction.member.update({
          where: { id: user.id },
          data: { selectedOrgId: orgId },
        });
      }
    });

    const admins = await getOrgAdmins(orgId);

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { name: true },
    });
    const orgName = org ? org.name : '';

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          memberId: admin.id,
          messageKey: 'notifications.organizations.joinRequest',
          messageParams: {
            memberFullName: `${user.firstName} ${user.lastName}`,
            orgName,
          },
          href: `/organizations/${orgId}`,
        },
      });

      await sendEmail({
        to: admin.email,
        subject: t('orgRequestSend.subject', { orgName }),
        html: `
              <p>${t('common.hello')}</p>
              <p>${t('orgRequestSend.content1', { orgName })}</p>
              <p>${t('orgRequestSend.content2', { memberFullName: user.firstName + ' ' + user.lastName })}</p>
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

      await sleep(1100);
    }

    revalidatePath('/organizations');

    return { ok: true, status: 'success', message: 'toasts.orgRequestSent' };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'toasts.errorGeneric' };
  }
};
