import { useState, ChangeEvent } from 'react';

/**
 * Form component with spam protection.  This version integrates Web3Forms
 * and includes a hidden honeypot field (`botcheck`) to help prevent
 * submissions from bots. Replace `YOUR_ACCESS_KEY_HERE` with your
 * Web3Forms access key.
 */
export type FormData = {
  fullName: string;
  email: string;
  affiliation: string;
  message: string;
};

function FormWithSpamProtection() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    affiliation: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        access_key: process.env.NEXT_PUBLIC_FORM_API_KEY,
        fullName: formData.fullName,
        email: formData.email,
        affiliation: formData.affiliation,
        message: formData.message,
        subject: `New message from ${formData.fullName || 'Website Visitor'}`,
        from_name: formData.fullName || 'Website Contact',
        // Honeypot field. Keep empty to indicate this is not a bot submission.
        botcheck: '',
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setResultMessage('Form submitted successfully!');
        setFormData({ fullName: '', email: '', affiliation: '', message: '' });
      } else {
        setResultMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      setResultMessage('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-[77rem] mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
            {/* Left Sidebar - Contact Info */}
            <div className="p-4">
              <div className="bg-[#c8e6c9] p-8 space-y-6 rounded-xl h-full">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                  Contact Us
                </h2>
                <p className="text-black leading-relaxed">
                  Looking for any air quality monitoring data or solutions?
                </p>
              </div>
            </div>

            {/* Right Content - Form */}
            <div className="lg:col-span-2 p-8">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-2 py-3 border-0 border-b border-gray-300 bg-transparent focus:outline-none focus:border-green-500 focus:border-b-2"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-2 py-3 border-0 border-b border-gray-300 bg-transparent focus:outline-none focus:border-green-500 focus:border-b-2"
                  />
                </div>

                {/* Affiliation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affiliation:
                  </label>
                  <input
                    type="text"
                    name="affiliation"
                    placeholder="Organisation"
                    value={formData.affiliation}
                    onChange={handleInputChange}
                    className="w-full px-2 py-3 border-0 border-b border-gray-300 bg-transparent focus:outline-none focus:border-green-500 focus:border-b-2"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Write your message here:
                  </label>
                  <textarea
                    name="message"
                    placeholder="Write your message here"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-2 py-3 border-0 border-b border-gray-300 bg-transparent focus:outline-none focus:border-green-500 focus:border-b-2"
                  />
                </div>

                {/* Hidden botcheck input for honeypot (spam protection) */}
                <div style={{ display: 'none' }}>
                  <input type="checkbox" name="botcheck" tabIndex={-1} readOnly />
                </div>

                {/* Submission result */}
                {resultMessage && (
                  <p
                    className={`$${resultMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'} text-sm`}
                  >
                    {resultMessage}
                  </p>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#123524] text-white px-8 py-3 rounded-lg hover:bg-[#1a4a32] transition-colors duration-200 font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormWithSpamProtection;
