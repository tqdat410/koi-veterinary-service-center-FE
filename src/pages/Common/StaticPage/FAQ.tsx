// src/pages/FAQ.tsx
import React from 'react';
import "../../../styles/FAQ.css";
import Footer from "../../../components/layout/Footer";

export const faqData = [
    {
        question: "How do I book a service?",
        answer: "You can book our services directly through the website. Select the service, specify your preferred veterinarian (optional), and choose a time slot. For consultations, ensure your Koi's information is registered in our system."
    },
    {
        question: "Can I select a specific veterinarian for my service?",
        answer: "Absolutely. You can specify a veterinarian while booking, or allow our staff to assign one best suited for your Koi's needs."
    },
    {
        question: "What payment options do you offer?",
        answer: "We offer both online and offline payment options. Online payments are required for certain services, including online consultations."
    },
    {
        question: "Are emergency services available?",
        answer: "Yes, emergency services are available upon request. Please contact us directly to arrange for immediate assistance."
    },
    {
        question: "What should I do if my Koi fish is sick?",
        answer: "If you suspect your Koi fish is sick, it's best to book a consultation with one of our veterinarians as soon as possible. Make sure to note any symptoms you observe for better diagnosis."
    },
    {
        question: "How often should I bring my Koi fish for checkups?",
        answer: "We recommend annual health checkups for Koi fish. However, if your Koi exhibits any signs of illness or stress, you should schedule an appointment immediately."
    },
    {
        question: "Can I watch the procedure when my Koi fish is being treated?",
        answer: "Yes, we encourage pet owners to be involved in their pet's care. You can observe the treatment process as long as it does not interfere with the veterinarian’s work."
    },
    {
        question: "What are the signs of stress or illness in Koi fish?",
        answer: [
            "Signs of stress or illness in Koi fish can include:",
            "- Changes in color or fading",
            "- Listlessness or lack of movement",
            "- Gasping at the water surface",
            "- Abnormal swimming patterns",
            "- Loss of appetite",
            "- Visible lesions or ulcers.",
            "If you notice any of these symptoms, please contact us for a consultation."
        ]    },
    {
        question: "How can I maintain a healthy environment for my Koi fish?",
        answer: [
            "To maintain a healthy environment for your Koi fish:",
            "- Regularly check and maintain water quality.",
            "- Perform routine water changes.",
            "- Ensure proper filtration and aeration.",
            "- Provide appropriate nutrition.",
            "- Avoid overstocking your pond.",
            "If you have questions about specific products or practices, don’t hesitate to ask our veterinarians."
        ]    },
    {
        question: "Can I bring my Koi fish to the clinic?",
        answer: "Yes, you can bring your Koi fish to our clinic. Please use a suitable container and ensure that the water conditions are similar to their home environment to minimize stress during transport."
    },
    {
        question: "What should I feed my Koi fish?",
        answer: "Koi fish thrive on a balanced diet of high-quality pellets, supplemented with occasional fruits and vegetables. Avoid overfeeding and provide just enough that they can consume in a few minutes to prevent water quality issues."
    },
    {
        question: "How can I tell the age of my Koi fish?",
        answer: "Determining a Koi's age can be challenging without precise records. However, experienced veterinarians can provide an estimate based on size, scale condition, and general health. Larger Koi with thick, sturdy bodies are often older."
    },
    {
        question: "What should I do if I need to transport my Koi fish?",
        answer: "Transporting Koi requires careful preparation. Use an aerated, clean container with pond water. Ensure the temperature and oxygen levels remain stable, especially for longer trips. We recommend contacting our clinic for guidance on safe transportation practices."
    },
    {
        question: "Can Koi fish live indoors?",
        answer: "Koi can live indoors in a large enough tank or aquarium. Indoor tanks need proper filtration, aeration, and regular water maintenance to provide a healthy environment. Be mindful of space as Koi can grow quite large."
    }
];


const FAQ: React.FC = () => {
    return (
        <div>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="container my-5">
                <h1 className="text-center mb-4" style={{ fontWeight: "bold", color: "#02033B", fontSize: "2.5rem" }}>Frequently Asked Questions</h1>

                <div className="accordion" id="faqAccordion">
                    {faqData.map((faq, index) => (
                        <div className="accordion-item" key={index}>
                            <h2 className="accordion-header">
                                <button
                                    className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#panelsStayOpen-collapse${index}`}
                                    aria-expanded={index === 0 ? 'true' : 'false'}
                                    aria-controls={`panelsStayOpen-collapse${index}`}>
                                    {faq.question}
                                </button>
                            </h2>
                            <div id={`panelsStayOpen-collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}>
                                <div className="accordion-body">
                                    {Array.isArray(faq.answer) ? (
                                        faq.answer.map((line, lineIndex) => (
                                            <p key={lineIndex}>{line}</p>
                                        ))
                                    ) : (
                                        <p>{faq.answer}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
        <Footer/>
        </div>
    );
}

export default FAQ;
