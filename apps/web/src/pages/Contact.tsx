import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useContactForm, type ContactFormData } from '../hooks/useContactForm';
import { useSettings } from '../hooks/useSettings';

const Contact = () => {
    const { data: settings } = useSettings();
    const siteName = settings?.siteName || 'Haryanti';

    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: '',
    });

    // Use the contact form hook for API integration
    const { mutate: sendMessage, isPending, isSuccess, isError, error, reset } = useContactForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(formData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        reset();
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <>
            <Helmet>
                <title>Contact - {siteName}</title>
                <meta
                    name="description"
                    content={`Get in touch with ${siteName} for your next design project.`}
                />
            </Helmet>

            <section className="section-container pt-32">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-golden-7">
                        <h1 className="text-2xl md:text-3xl font-bold mb-golden-4">
                            Let's Work Together
                        </h1>
                        <p className="text-muted text-lg">
                            Have a project in mind? I'd love to hear from you.
                        </p>
                    </div>

                    {isSuccess ? (
                        /* Success State */
                        <div className="card text-center py-golden-7">
                            <div className="text-5xl mb-golden-5">🎉</div>
                            <h2 className="text-xl font-bold mb-golden-3">
                                Message Sent Successfully!
                            </h2>
                            <p className="text-muted mb-golden-5">
                                Thank you for reaching out. I'll get back to you soon.
                            </p>
                            <button
                                onClick={handleReset}
                                className="magnetic-btn"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        /* Contact Form */
                        <form onSubmit={handleSubmit} className="card">
                            <div className="space-y-golden-5">
                                {/* Error Message */}
                                {isError && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                        {error?.message || 'Failed to send message. Please try again.'}
                                    </div>
                                )}

                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium mb-golden-2"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="Your name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium mb-golden-2"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium mb-golden-2"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                                        placeholder="Tell me about your project..."
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="magnetic-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12" cy="12" r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </>
    );
};

export default Contact;
