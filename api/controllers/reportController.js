const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendReportEmail = async (req, res) => {
  const { username, reason } = req.body;

  if (!username || !reason) {
    console.error('Validation Error: Username and reason are required');
    return res.status(400).json({ error: 'Username and reason are required' });
  }

  // Log the request details
  console.log('Request received:', { username, reason });

  try {
    // Email content and settings
    const msg = {
      to: process.env.TO_EMAIL, // Recipient email
      from: process.env.FROM_EMAIL, // Sender email
      subject: `Report: User ${username}`, // Email subject
      text: `User ${username} has been reported for the following reason:\n\n${reason}`, // Plain text body
      html: `<p>User <b>${username}</b> has been reported for the following reason:</p><p>${reason}</p>`, // HTML body
    };

    // Log the email content
    console.log('Email content:', msg);

    // Send email
    const response = await sgMail.send(msg);

    // Log the response from SendGrid
    console.log('SendGrid response:', response);

    res.status(200).json({ message: 'Report submitted successfully' });
  } catch (error) {
    // Detailed error logging
    if (error.response) {
      console.error('Error response from SendGrid:', error.response.body);
    } else {
      console.error('Error sending email:', error.message);
    }

    res.status(500).json({ error: 'Failed to send report' });
  }
};

exports.sendBugReportEmail = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    console.error('Validation Error: Bug description is required');
    return res.status(400).json({ error: 'Bug description is required' });
  }

  // Log the request details
  console.log('Bug report received:', { description });

  try {
    // Email content and settings
    const msg = {
      to: process.env.TO_EMAIL, // Recipient email
      from: process.env.FROM_EMAIL, // Sender email
      subject: `Bug Report`, // Email subject
      text: `A new bug report has been submitted with the following description:\n\n${description}`, // Plain text body
      html: `<p>A new bug report has been submitted with the following description:</p><p>${description}</p>`, // HTML body
    };

    // Log the email content
    console.log('Email content:', msg);

    // Send email
    const response = await sgMail.send(msg);

    // Log the response from SendGrid
    console.log('SendGrid response:', response);

    res.status(200).json({ message: 'Bug report submitted successfully' });
  } catch (error) {
    // Detailed error logging
    if (error.response) {
      console.error('Error response from SendGrid:', error.response.body);
    } else {
      console.error('Error sending email:', error.message);
    }

    res.status(500).json({ error: 'Failed to send bug report' });
  }
};
