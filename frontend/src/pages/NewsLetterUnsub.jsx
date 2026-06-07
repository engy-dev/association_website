import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Unsubscribed() {
  const [params] = useSearchParams();
  const status = params.get('status');
  const { t } = useLanguage();

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      {status === 'success' && (
        <>
          <h1>{t('unsubscribe.successTitle')}</h1>
          <p>{t('unsubscribe.successMessage')}</p>
        </>
      )}
      {status === 'invalid' && (
        <>
          <h1>{t('unsubscribe.invalidTitle')}</h1>
          <p>{t('unsubscribe.invalidMessage')}</p>
        </>
      )}
      {status === 'notfound' && (
        <>
          <h1>{t('unsubscribe.notFoundTitle')}</h1>
          <p>{t('unsubscribe.notFoundMessage')}</p>
        </>
      )}
    </div>
  );
}