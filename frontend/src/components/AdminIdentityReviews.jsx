import { useEffect, useState } from 'react';
import api, { getApiError } from '../utils/api';
import { User, Mail, MapPin, CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react';

const ReviewCard = ({ account, onReviewed, showToast }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [backImageUrl, setBackImageUrl] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (account.is_dummy) {
      setImageUrl('/assets/images/karla_front.jpg');
      return;
    }
    
    let active = true;
    let objectUrl;
    const controller = new AbortController();
    api.get(`/admin/identity-reviews/${account.id}/image`, { responseType: 'blob', signal: controller.signal })
      .then(({ data }) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(data);
        setImageUrl(objectUrl);
      }).catch(() => { if (active) setError('The ID image could not be loaded.'); });
    return () => {
      active = false;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [account.id, account.is_dummy]);

  useEffect(() => {
    if (account.is_dummy) {
      setBackImageUrl('/assets/images/karla_back.jpg');
      return;
    }
    if (!account.has_back_image) return;
    
    let active = true;
    let objectUrl;
    const controller = new AbortController();
    api.get(`/admin/identity-reviews/${account.id}/image/back`, { responseType: 'blob', signal: controller.signal })
      .then(({ data }) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(data);
        setBackImageUrl(objectUrl);
      }).catch(() => { if (active) setError('The back ID image could not be loaded.'); });
    return () => { active = false; controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [account.id, account.has_back_image, account.is_dummy]);

  const imagesReady = imageUrl && (!account.has_back_image || backImageUrl);

  const review = async (status) => {
    if (saving) return;
    if (!confirmed || !imagesReady) { setError('View the ID and confirm your review first.'); return; }
    if (status === 'rejected' && !note.trim()) { setError('Give a reason for rejecting this ID.'); return; }
    setSaving(true);
    setError('');
    
    if (account.is_dummy) {
      setTimeout(() => {
        showToast('Review saved', `${account.name}: ${status}.`);
        onReviewed(account.id);
        setSaving(false);
      }, 800);
      return;
    }

    try {
      await api.put(`/admin/identity-reviews/${account.id}`, { status, note, confirmed });
      showToast('Review saved', `${account.name}: ${status}.`);
      onReviewed(account.id);
    } catch (error) {
      setError(getApiError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header section */}
      <div className="bg-gray-50 border-b border-gray-100 p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <User size={20} className="text-blue-600" /> {account.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            account.kyc_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            account.kyc_status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {account.kyc_status}
          </span>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <p className="flex items-center gap-2"><Mail size={16} className="text-gray-400" /> {account.email}</p>
          <p className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {account.resident?.address || 'No address provided'}</p>
          <p className="flex items-center gap-2 mt-2 font-medium text-gray-700">
            <FileText size={16} className="text-gray-400" /> ID Type: <span className="text-blue-600">{account.id_type || 'Not specified'}</span>
          </p>
        </div>
      </div>

      {/* Image section */}
      <div className="p-5 bg-gray-100 flex flex-col gap-4">
        {imageUrl ? (
          <img src={imageUrl} alt={`Submitted ID for ${account.name}`} className="max-h-64 w-full object-cover border-2 border-white rounded-lg shadow-sm" />
        ) : (
          !error && <p className="text-center text-gray-500 py-10 animate-pulse">Loading ID image…</p>
        )}
        {backImageUrl && (
          <img src={backImageUrl} alt={`Back of submitted ID for ${account.name}`} className="max-h-64 w-full object-cover border-2 border-white rounded-lg shadow-sm" />
        )}
      </div>

      {/* Action section */}
      <div className="p-5">
        {account.kyc_status === 'pending' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Review Note (Required for Rejection)
              <textarea 
                className="block w-full border border-gray-300 rounded-lg p-3 mt-1 text-sm focus:ring-blue-500 focus:border-blue-500" 
                maxLength={1000} 
                placeholder="E.g., ID is blurry, Name does not match..."
                value={note} 
                onChange={event => setNote(event.target.value)} 
                rows="2"
              />
            </label>
            
            <label className="flex gap-3 items-start p-3 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
              <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />
              <span className="text-sm text-blue-900 font-medium leading-tight">
                I verify that the AI face-match is accurate, and this ID matches the resident's registered details.
              </span>
            </label>

            {error && <p role="alert" className="text-red-600 text-sm flex items-center gap-1 font-medium"><AlertTriangle size={16}/> {error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="button" disabled={saving || !confirmed || !imagesReady} onClick={() => review('verified')} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg px-4 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <CheckCircle size={18} /> Approve
              </button>
              <button type="button" disabled={saving || !confirmed || !imagesReady} onClick={() => review('rejected')} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg px-4 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 italic">
            Review Note: {account.kyc_review_note || 'No review note left.'}
          </div>
        )}
      </div>
    </article>
  );
};

export default function AdminIdentityReviews({ showToast }) {
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    api.get('/admin/identity-reviews', { params: { status, page }, signal: controller.signal })
      .then(({ data }) => { 
        
        // --- INJECT DUMMY KARLA MAGALONG DATA FOR PRESENTATION ---
        if (status === 'pending' && page === 1) {
            const dummyKarla = {
                id: 'dummy-karla-123',
                name: 'Karla Magalong',
                email: 'karla.magalong@example.com',
                kyc_status: 'pending',
                id_type: 'National ID (PhilSys)',
                has_back_image: false,
                is_dummy: true,
                resident: {
                    address: 'Block 4 Lot 12, South Avenue, Barangay Olympia, Makati City'
                }
            };
            // Put Karla at the very top of the list!
            data.data = [dummyKarla, ...data.data];
        }
        // ---------------------------------------------------------

        setResult(data); 
        setError(''); 
      })
      .catch(error => { if (!controller.signal.aborted) setError(getApiError(error)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [status, page]);

  const changePage = next => { setLoading(true); setPage(next); };

  return (
    <section className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">eKYC Identity Reviews</h2>
        <p className="text-gray-600 mb-6 max-w-3xl">
          Review residents who have completed the AI facial recognition process. Verify their uploaded documents against their registered details before approving their account access.
        </p>
        
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <label className="font-semibold text-gray-700">Filter by Status:</label>
          <select 
            className="border border-gray-300 rounded-lg p-2.5 bg-white text-gray-800 font-medium focus:ring-blue-500 focus:border-blue-500 min-w-[200px]" 
            value={status} 
            onChange={event => { setLoading(true); setPage(1); setStatus(event.target.value); }}
          >
            <option value="pending">🟡 Pending Review</option>
            <option value="verified">🟢 Approved Residents</option>
            <option value="rejected">🔴 Rejected</option>
          </select>
        </div>
      </div>

      {error && <p role="alert" className="p-4 bg-red-100 text-red-800 rounded-lg border border-red-200 font-medium flex items-center gap-2"><AlertTriangle /> {error}</p>}
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600 font-medium">Loading resident files…</span>
        </div>
      ) : (
        <>
          {!result.data.length && (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
              <CheckCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500 font-medium">No accounts in this category.</p>
              <p className="text-gray-400">All caught up!</p>
            </div>
          )}
          
          <div className="grid xl:grid-cols-2 gap-8">
            {result.data.map(account => (
              <ReviewCard 
                key={account.id} 
                account={account} 
                showToast={showToast}
                onReviewed={id => setResult(previous => ({ ...previous, data: previous.data.filter(item => item.id !== id) }))} 
              />
            ))}
          </div>

          {result.last_page > 1 && (
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-8">
              <button disabled={page === 1} onClick={() => changePage(page - 1)} className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 disabled:opacity-50 transition-colors">
                &larr; Previous Page
              </button>
              <span className="font-bold text-gray-700">Page {page} of {result.last_page}</span>
              <button disabled={page >= result.last_page} onClick={() => changePage(page + 1)} className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 disabled:opacity-50 transition-colors">
                Next Page &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
