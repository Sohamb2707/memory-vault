require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const cron = require('node-cron');


const app = express();
app.use(cors());
app.use(express.json());

// Firebase admin setup
const serviceAccount =  JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Nodemailer setup

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Endpoint to send invite email after capsule creation
app.post('/send-invite', async (req, res) => {
  const { trustedContacts, userEmail, title, unlockDate } = req.body;

  try {
    const recipients = [...trustedContacts, userEmail];

    const emailContent = {
      from: process.env.EMAIL_FROM,
      subject: `Capsule "${title}" Shared With You`,
      text: `This capsule will be unlocked on ${new Date(unlockDate).toLocaleString()}. Stay tuned!`,
    };

    for (const recipient of recipients) {
      await transporter.sendMail({ ...emailContent, to: recipient });
    }

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

// CRON job to send unlock reminders 1 day before unlock
cron.schedule('0 9 * * *', async () => {
  const now = new Date();
  const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const capsulesRef = db.collection('capsules');
  const snapshot = await capsulesRef.get();

  snapshot.forEach(async (doc) => {
    const data = doc.data();
    const unlock = new Date(data.unlockDate.seconds * 1000);

    if (
      unlock.toDateString() === nextDay.toDateString() &&
      data.privacy !== 'private'
    ) {
      const recipients = [...(data.trustedContacts || []), data.userEmail];
      const emailContent = {
        from: process.env.EMAIL_FROM,
        subject: `Reminder: Capsule "${data.title}" Unlocks Tomorrow!`,
        text: `Your capsule "${data.title}" will unlock on ${unlock.toLocaleString()}`,
      };

      for (const email of recipients) {
        try {
          await transporter.sendMail({ ...emailContent, to: email });
        } catch (err) {
          console.error(`Failed to send to ${email}:`, err);
        }
      }
    }
  });

  console.log('🔔 Daily reminder check complete');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
