
import "../../../styles/FAQ.css"

// src/pages/FAQ.tsx
import React from 'react';

const FAQ: React.FC = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="container my-5">
                <h1 className="text-center mb-4">Frequently Asked Questions</h1>

                <div className="accordion" id="faqAccordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseOne"
                                aria-expanded="true"
                                aria-controls="panelsStayOpen-collapseOne">
                                How do I book a service?
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                            <div className="accordion-body">
                                <strong>You can book our services directly through the website.</strong>
                                Select the service, specify your preferred veterinarian (optional), and choose a time slot. For consultations, ensure your Koi's information is registered in our system.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseTwo"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseTwo">
                                Can I select a specific veterinarian for my service?
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <strong>Absolutely.</strong> You can specify a veterinarian while booking, or allow our staff to assign one best suited for your Koi's needs.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseThree"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseThree">
                                What payment options do you offer?
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <strong>We offer both online and offline payment options.</strong> Online payments are required for certain services, including online consultations.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseFour"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseFour">
                                Are emergency services available?
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <strong>Yes, emergency services are available upon request.</strong> Please contact us directly to arrange for immediate assistance.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseFive"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseFive">
                                What should I do if my Koi fish is sick?
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseFive" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <strong>If you suspect your Koi fish is sick,</strong> it's best to book a consultation with one of our veterinarians as soon as possible. Make sure to note any symptoms you observe for better diagnosis.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseSix"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseSix">
                                How often should I bring my Koi fish for checkups?
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseSix" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <strong>We recommend annual health checkups for Koi fish.</strong> However, if your Koi exhibits any signs of illness or stress, you should schedule an appointment immediately.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseSeven"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseSeven">
                                Can I watch the procedure when my Koi fish is being treated?
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseSeven" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <strong>Yes, we encourage pet owners to be involved in their pet's care.</strong> You can observe the treatment process as long as it does not interfere with the veterinarian’s work.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseEight"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseEight">
                                What are the signs of stress or illness in Koi fish?
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseEight" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <strong>Signs of stress or illness in Koi fish can include:</strong>
                                <ul>
                                    <li>Changes in color or fading</li>
                                    <li>Listlessness or lack of movement</li>
                                    <li>Gasping at the water surface</li>
                                    <li>Abnormal swimming patterns</li>
                                    <li>Loss of appetite</li>
                                    <li>Visible lesions or ulcers</li>
                                </ul>
                                If you notice any of these symptoms, please contact us for a consultation.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseNine"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseNine">
                                How can I maintain a healthy environment for my Koi fish?
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseNine" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <strong>To maintain a healthy environment for your Koi fish:</strong>
                                <ul>
                                    <li>Regularly check and maintain water quality.</li>
                                    <li>Perform routine water changes.</li>
                                    <li>Ensure proper filtration and aeration.</li>
                                    <li>Provide appropriate nutrition.</li>
                                    <li>Avoid overstocking your pond.</li>
                                </ul>
                                If you have questions about specific products or practices, don’t hesitate to ask our veterinarians.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseTen"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseTen">
                                Can I bring my Koi fish to the clinic?
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseTen" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <strong>Yes, you can bring your Koi fish to our clinic.</strong> Please use a suitable container and ensure that the water conditions are similar to their home environment to minimize stress during transport.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FAQ;
