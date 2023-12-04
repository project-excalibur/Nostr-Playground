import Button from '@components/Button';
import { Heading } from '@components/Heading';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AnimatedLabelInput from './AnimatedLabelInput';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(`Thanks for contacting us! We'll get back to you as soon as possible.`);
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('Error sending email.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error sending email.');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-sm mt-8 md:max-w-lg">
      <div className="p-4 rounded-lg">
        <Heading id="e2e-whitepaper-heading" className="mt-4 text-xl font-bold leading-10 md:text-2xl xl:text-3xl">
          Contact Us{' '}
        </Heading>
        <section className="mt-4">
          If you need any help, want to give any feedback, or want to upload your first audio, please reach out to us
          at:{' '}
          <a className="underline" href="mailto:support@excalibur.fm">
            support@excalibur.fm.
          </a>
          <p className="mt-2"> Alternatively you can send us a message using the form below.</p>{' '}
        </section>
        <form onSubmit={handleSubmit} className="flex flex-col items-start w-full mt-8" action="">
          <AnimatedLabelInput
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            label="Name*"
            htmlFor="name"
          />
          <AnimatedLabelInput
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            label="Email*"
            htmlFor="email"
            inputType={'email'}
          />
          <AnimatedLabelInput
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            label="Message*"
            htmlFor="message"
            messageField
          />

          <Button type="submit" text="Submit" className="flex items-center mt-8" />
        </form>
      </div>
    </div>
  );
};

export default ContactForm;