import Footer from '../components/layout/Footer';
import '../styles/News.css';

const News = () => (
    <div>
        <div className="container my-5 news-container">
            <h2 className="text-center mb-4 content-header">Welcome to Our News!</h2>
            <p className="text-center text-muted">
                In this section, you will find the latest updates, articles, and announcements related to Koi care, veterinary services, and events at our center. We aim to keep our community informed and engaged with valuable information and resources.
            </p>

            {/* Recent Articles Section */}
            <div className="my-5">
                <h3>Recent Articles</h3>

                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Koi Health Tips for Spring</h5>
                        <p className="card-text"><strong>Date:</strong> 29/10/2024</p>
                        <p className="card-text">As the weather warms up, it's essential to prepare your Koi for the changing conditions. Discover our top tips for ensuring their health and wellbeing this spring.</p>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Upcoming Koi Show 2024</h5>
                        <p className="card-text"><strong>Date:</strong>10/11/2024</p>
                        <p className="card-text">Join us for the annual Koi Show! Learn about the event details, how to participate, and what to expect.</p>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">New Veterinary Services Launched</h5>
                        <p className="card-text"><strong>Date:</strong> 30/11/2024</p>
                        <p className="card-text">We are excited to announce the addition of new specialized services for Koi health. Read more about what we offer!</p>
                    </div>
                </div>
            </div>

            {/* Event Announcements Section */}
            <div className="my-5">
                <h3>Event Announcements</h3>

                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Koi Care Workshop</h5>
                        <p className="card-text"><strong>Date:</strong> 1/12/2024</p>
                        <p className="card-text"><strong>Location:</strong> [Insert Location]</p>
                        <p className="card-text">Join us for an informative workshop where our veterinarians will share insights on Koi care, feeding, and disease prevention. Register now!</p>
                    </div>
                </div>
            </div>

            {/* Newsletter Subscription Section */}
            <div className="my-5 text-center">
                <h3>Subscribe to Our Newsletter</h3>
                <p>Stay updated with our latest news, tips, and events! Subscribe to our newsletter by entering your email address below:</p>
                <form className="d-flex justify-content-center">
                    <input type="email" className="form-control me-2 mxw-300" placeholder="Enter your email" />
                    <button type="submit" className="btn btn-primary">Subscribe</button>
                </form>
            </div>

            {/* Follow Us Section */}
            <div className="my-5 text-center" >
                <h3>Follow Us on Social Media</h3>
                <p>Stay connected and follow us for daily updates, tips, and community stories:</p>
                <p>
                <a style={{ marginBottom: '1rem', color: '#Fff' }} href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary me-2">Facebook</a>
                <a style={{ marginBottom: '1rem', color: '#Fff' }} href="https://chat.zalo.me/" target="_blank" rel="noopener noreferrer" className="btn btn-info  me-2">Zalo</a>
                <a style={{ marginBottom: '1rem', color: '#Fff' }} href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="btn btn-danger   me-2">Youtube</a>
                </p>
            </div>
        </div>
        <Footer />
    </div>
);

export default News;
