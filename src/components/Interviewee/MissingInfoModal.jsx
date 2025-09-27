import React, { useState } from 'react';
import Modal from '../common/modal';
/**
 * A modal form to collect missing candidate information.
 * @param {object} props
 * @param {object} props.initialInfo - The info that was successfully parsed from the resume.
 * @param {function(object): void} props.onSubmit - Callback function when the form is submitted.
 * @param {function(): void} props.onClose - Callback to close the modal.
 */
const MissingInfoModal = ({ initialInfo, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: initialInfo.name || '',
    email: initialInfo.email || '',
    phone: initialInfo.phone || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.name || !formData.email || !formData.phone) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onSubmit(formData); // Send the complete data to the parent component
  };

  return (
    <Modal title="Complete Your Profile" onClose={onClose}>
      <p>We couldn't find all your details from the resume. Please complete the information below to start the interview.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          style={{ padding: '0.5rem' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={{ padding: '0.5rem' }}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          style={{ padding: '0.5rem' }}
        />
        {error && <p className="error-message">{error}</p>}
        <div className="modal-actions">
          <button type="submit">Start Interview</button>
        </div>
      </form>
    </Modal>
  );
};

export default MissingInfoModal;