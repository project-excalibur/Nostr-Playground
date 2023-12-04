import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppState } from 'src/controllers/state/use-app-state';
import PageWrapper from 'src/views/components/PageWrapper';

const RSS = () => {
  const router = useRouter();
  const { publicKey } = useAppState();

  useEffect(() => {
    const defaultCreatorKey = publicKey?.toString() || 'Hodp413SWuWtfzuYZd247GaAGBmMbALD4cAMTDf45hc2';
    router.push(`/rss/${defaultCreatorKey}`).then();
  }, []); // eslint-disable-line

  return (
    <PageWrapper>
      <div />
    </PageWrapper>
  );
};

export default RSS;