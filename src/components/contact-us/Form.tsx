import { useState, ChangeEvent } from 'react';

type FormData = {
  fullName: string;
  email: string;
  affiliation: string;
  message: string;
};

function Form() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    affiliation: '',
    message: '',
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
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

                {/* Phone & Email */}
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

                {/* Submit Button */}
                <div>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#123524] text-white px-8 py-3 rounded-lg hover:bg-[#1a4a32] transition-colors duration-200 font-medium"
                  >
                    Submit
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

export default Form;
