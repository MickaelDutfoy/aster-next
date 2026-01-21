'use server';

import { sendEmail } from '@/lib/email';
import { getOrgAdmin } from '@/lib/organizations/getOrgAdmin';
import { isUser } from '@/lib/permissions/isUser';
import { prisma } from '@/lib/prisma';
import { ActionValidation, Organization } from '@/lib/types';
import { MemberRole, MemberStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

export const joinOrg = async (org: Organization, locale: string): Promise<ActionValidation> => {
  const t = await getTranslations({ locale, namespace: 'emails' });

  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }

  const user = guard.user;

  try {
    if (user.organizations?.some((orga) => orga.id === org.id)) {
      return {
        ok: false,
        status: 'error',
        message: 'toasts.alreadyMemberOfOrg',
      };
    }

    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.memberOrganization.create({
        data: {
          orgId: org.id,
          memberId: user.id,
          role: MemberRole.MEMBER,
          status: MemberStatus.PENDING,
        },
      });

      if (!user.selectedOrgId) {
        await prismaTransaction.member.update({
          where: { id: user.id },
          data: { selectedOrgId: org.id },
        });
      }
    });

    const admin = await getOrgAdmin(org.id);

    if (admin) {
      await prisma.notification.create({
        data: {
          memberId: admin.id,
          messageKey: 'notifications.organizations.joinRequest',
          messageParams: {
            memberFullName: `${user.firstName} ${user.lastName}`,
            orgName: org.name,
          },
          href: `/organizations/${org.id}`,
        },
      });

      await sendEmail({
        to: admin.email,
        subject: t('orgRequestSend.subject', { orgName: org.name }),
        html: `
              <p>${t('common.hello')}</p>
              <p>${t('orgRequestSend.content1', { orgName: org.name })}</p>
              <p>${t('orgRequestSend.content2', { memberFullName: user.firstName + ' ' + user.lastName })}</p>
              <p>${t('orgRequestSend.content3')}</p>
              <p>${t('common.footer')}</p>
            `,
      });
    }

    revalidatePath('/organizations');

    return { ok: true, status: 'success', message: 'toasts.orgRequestSent' };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'toasts.genericError' };
  }
};
