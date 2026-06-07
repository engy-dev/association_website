import { useEffect, useState } from 'react';
import { volunteerAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function VolunteersPage() {
  const [jobs,        setJobs]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selectedJob, setSelectedJob] = useState(null); // job whose modal is open
  const [form,        setForm]        = useState({});   // { applicant_name, applicant_email, answers:{} }
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    volunteerAPI.getAll()
      .then(r => setJobs(r.data))
      .finally(() => setLoading(false));
  }, []);

  // Open modal for a given job, reset form state
  function openModal(job) {
    setSelectedJob(job);
    setForm({ applicant_name: '', applicant_email: '', answers: {} });
    setSubmitted(false);
  }

  function closeModal() {
    setSelectedJob(null);
  }

  function handleFieldChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleAnswerChange(index, value) {
    setForm(prev => ({
      ...prev,
      answers: { ...prev.answers, [index]: value },
    }));
  }

  async function handleSubmit() {
    if (!selectedJob) return;
    setSubmitting(true);

    // Convert answers object to ordered array
    const answersArray = selectedJob.questions.map((q, i) => ({
      question: q.label,
      answer:   form.answers[i] ?? '',
    }));

    try {
      await volunteerAPI.apply(selectedJob.id, {
        applicant_name:  form.applicant_name,
        applicant_email: form.applicant_email,
        answers:         answersArray,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page volunteers">
      <h1>{t('nav.volunteers')}</h1>

      {loading ? (
        <p>{t('hero.loading')}</p>
      ) : jobs.length === 0 ? (
        <p>{t('volunteers.noJobs')}</p>
      ) : (
        <div className="volunteer-list">
          {jobs.map(job => (
            <article key={job.id} className="volunteer-card">
              <div className="volunteer-card-body">
                <h2>{job.title}</h2>
                {job.location && (
                  <p className="volunteer-meta">📍 {job.location}</p>
                )}
                <p className="volunteer-meta">
                  {t('volunteers.expires')}: {new Date(job.expires_at).toLocaleDateString()}
                </p>
                <p>{job.description}</p>
                <button
                  className="btn-apply"
                  onClick={() => openModal(job)}
                >
                  {t('volunteers.apply')}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {selectedJob && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2>{selectedJob.title}</h2>

            {submitted ? (
              <p className="modal-success">{t('volunteers.thankYou')}</p>
            ) : (
              <>
                <label>
                  {t('volunteers.name')}
                  <input
                    type="text"
                    value={form.applicant_name}
                    onChange={e => handleFieldChange('applicant_name', e.target.value)}
                  />
                </label>

                <label>
                  {t('volunteers.email')}
                  <input
                    type="email"
                    value={form.applicant_email}
                    onChange={e => handleFieldChange('applicant_email', e.target.value)}
                  />
                </label>

                {selectedJob.questions.map((q, i) => (
                  <label key={i}>
                    {q.label}
                    <textarea
                      value={form.answers[i] ?? ''}
                      onChange={e => handleAnswerChange(i, e.target.value)}
                    />
                  </label>
                ))}

                <button
                  className="btn-submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? t('hero.loading') : t('volunteers.submit')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}