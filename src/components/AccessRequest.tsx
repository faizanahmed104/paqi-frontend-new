'use client';

import React, { useState } from 'react';
import Button from '@/ui-elements/Button';

interface AccessRequestProps {
  slug?: string;
  title?: string;
}

export default function AccessRequest({ slug, title }: AccessRequestProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName('');
    setEmail('');
    setAffiliation('');
    setLoading(false);
    setError(null);
    setSuccess(null);
  };

  const handleOpen = () => {
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const validate = () => {
    if (!name.trim()) return false;
    // simple email validation
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) {
      setError('Please provide a valid name and email.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        access_key: process.env.NEXT_PUBLIC_FORM_API_KEY,
        name: name.trim(),
        email: email.trim(),
        affiliation: affiliation.trim(),
        subject: `Access request: ${title ?? slug ?? ''}`,
        from_name: name.trim() || 'Website Visitor',
        message: `Requesting access to document: ${title ?? slug ?? ''}`,
        // honeypot field for spam protection
        botcheck: '',
      };

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.success) {
        setSuccess(
          'Request submitted. We will email the document if approved.'
        );
        setLoading(false);
        setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        setError(data?.message || 'Submission failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Submission failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Button shape="square" size="lg" onClick={handleOpen}>
          Access Request this document
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
            aria-hidden
          />

          {/* Modal panel */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-6">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Request Access</h3>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Provide your name and email to request access to this document.
              </p>

              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Affiliation
                  </label>
                  <input
                    type="text"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Your organization or institution"
                  />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}
                {success && (
                  <div className="text-sm text-green-600">{success}</div>
                )}

                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm rounded-md border"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-[#123524] text-white rounded-md text-sm disabled:opacity-60"
                  >
                    {loading && (
                      <svg
                        className="animate-spin mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    )}
                    {loading ? 'Submitting...' : 'Request Access'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
