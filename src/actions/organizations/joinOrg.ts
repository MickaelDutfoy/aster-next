'use server';

import { sendEmail } from '@/lib/email';
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
    if (user.organizations.some((orga) => orga.id === org.id)) {
      return {
        ok: false,
        status: 'error',
        message: 'toasts.alreadyMemberOfOrg',
      };
    }

    await prisma.memberOrganization.create({
      data: {
        orgId: org.id,
        memberId: user.id,
        role: MemberRole.MEMBER,
        status: MemberStatus.PENDING,
      },
    });

    if (!user.selectedOrgId) {
      await prisma.member.update({
        where: { id: user.id },
        data: { selectedOrgId: org.id },
      });
    }

    try {
      const adminLink = await prisma.memberOrganization.findFirst({
        where: { orgId: org.id, role: MemberRole.SUPERADMIN },
        select: { member: { select: { email: true } } },
      });

      const adminEmail = adminLink?.member.email;

      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
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
    } catch (err) {
      console.error(err);
    }

    revalidatePath('/organizations');

    return { ok: true, status: 'success', message: 'toasts.orgRequestSent' };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'toasts.genericError' };
  }
};
