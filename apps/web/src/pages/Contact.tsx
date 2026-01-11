import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

const Contact = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement form submission
        setIsSubmitted(true);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Helmet>
                <title>Contact - Haryanti</title>
                <meta
                    name="description"
                    content="Get in touch with Haryanti for your next design project."
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

                    {isSubmitted ? (
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
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setFormData({ name: '', email: '', message: '' });
                                }}
                                className="magnetic-btn"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        /* Contact Form */
                        <form onSubmit={handleSubmit} className="card">
                            <div className="space-y-golden-5">
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
                                        className="w-full px-golden-4 py-golden-3 bg-tertiary/50 border border-secondary/30 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
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
                                        className="w-full px-golden-4 py-golden-3 bg-tertiary/50 border border-secondary/30 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
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
                                        className="w-full px-golden-4 py-golden-3 bg-tertiary/50 border border-secondary/30 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                        placeholder="Tell me about your project..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="magnetic-btn w-full">
                                    Send Message ✨
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
