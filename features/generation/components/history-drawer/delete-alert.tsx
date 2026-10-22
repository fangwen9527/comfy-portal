import { ConfirmDialog } from '@/components/self-ui/confirm-dialog';
import { useTranslation } from '@/i18n';
import React from 'react';

interface DeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export const DeleteAlert = (props: DeleteAlertProps) => {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      {...props}
      confirmText={t('common.action.delete')}
      confirmButtonColor="bg-error-500"
    />
  );
};
