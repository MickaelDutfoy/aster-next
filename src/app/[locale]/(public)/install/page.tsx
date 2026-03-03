import { Install } from '@/components/main/Install';
import { InstallProvider } from '@/components/tools/InstallProvider';
import '@/styles/privacy.scss';

const InstallPage = () => {
  return (
    <InstallProvider>
      <Install />
    </InstallProvider>
  );
};

export default InstallPage;
