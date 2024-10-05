import z from 'zod';

const TransferCitizen = z.object({
  citizenName: z.string(),
  citizenEmail: z.string(),
  transferAPIURL: z.string(),
});

export type TTransferCitizen = z.infer<typeof TransferCitizen>;

const validateTransfer = (object: any) => {
  return TransferCitizen.safeParse(object);
};

const transferSchema = {
  validateTransfer,
};

export default transferSchema;
