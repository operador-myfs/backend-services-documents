import amqplib from 'amqplib';
import { TTransferCitizen } from '../schemas/transferCitizen';

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

export const transferQueueSender = async (transactionId: string, transferData: TTransferCitizen): Promise<void> => {
  const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
  const channel = await connection.createChannel();

  try {
    const queue = 'transfer_citizen';

    await channel.assertQueue(queue, { durable: true });

    for (const key in transferData.urlDocuments) {
      if (Object.prototype.hasOwnProperty.call(transferData.urlDocuments, key)) {
        const doc = transferData.urlDocuments[key];
        const message = {
          transactionId,
          id: transferData.id,
          url: doc[0],
          key,
        };
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await channel.close();
    await connection.close();
  }
};
