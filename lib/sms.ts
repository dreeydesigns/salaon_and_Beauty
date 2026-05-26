import AfricasTalking from 'africastalking';

const credentials = {
  apiKey: process.env.AT_API_KEY as string,
  username: process.env.AT_USERNAME as string,
};

const at = AfricasTalking(credentials);

export const sendSMS = async (to: string, message: string) => {
  try {
    const result = await at.SMS.send({
      to: [to],
      message: message,
      from: 'MobileSalon', // This is your sandbox sender ID
    });
    console.log('SMS sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};