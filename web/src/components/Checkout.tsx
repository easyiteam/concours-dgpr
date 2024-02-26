import { useState } from 'react';
import { Button } from './display/Button';
import { FileUpload } from './form-fields/FileUpload';

type CheckoutProps = {
  amount: number;
  apiKey: string;
  form: Record<string, string | number>;
  emailKey: string;
  firstnameKey: string;
  lastnameKey: string;
  onChange: (transactionId: string) => void;
  slip?: boolean;
};

export const Checkout = ({
  amount,
  apiKey,
  form,
  emailKey,
  firstnameKey,
  lastnameKey,
  slip = false,
  onChange,
}: CheckoutProps) => {
  const [isNotPaid, setIsNotPaid] = useState(true);
  const [paiementInProgress, setPaiementInProgress] = useState(false);
  const [hasSlip, setHasSlip] = useState(slip);

  const checkout = () => {
    setIsNotPaid(false);
    setPaiementInProgress(true);

    // onChange('1231|sqdS|qsdqsd|12312');
    // setIsNotPaid(true);
    // setPaiementInProgress(false);

    window.TresorPay?.init('#pay-btn', {
      onComplete: (data: {
        transaction: {
          status: 'approved' | 'rejected';
          id: number;
          reference: string;
          transaction_key: string;
          customer_id: number;
        };
      }) => {
        console.log(data.transaction);
        if (data.transaction.status === 'approved') {
          const { id, reference, transaction_key, customer_id } =
            data.transaction;
          const transactionRefs = [
            id,
            reference,
            transaction_key,
            customer_id,
          ].join('|');
          onChange(transactionRefs);
          setPaiementInProgress(false);
          return;
        }
        setIsNotPaid(true);
        setPaiementInProgress(false);
      },
      public_key: apiKey,
      transaction: {
        amount,
        description: 'Paiement récépissé concours DGEFC',
        custom_metadata: {
          receipe_nature: 'national',
          receipe_class: 1142,
          ts_account_number: null,
          details: [],
          equittance: {},
        },
      },
      customer: {
        email: form[emailKey],
        lastname: form[lastnameKey],
        firstname: form[firstnameKey],
      },
      currency: {
        iso: 'XOF',
      },
    });
  };

  const toggleSlip = () => {
    setHasSlip((hasSlip) => !hasSlip);
    onChange('');
  };

  return (
    <>
      {!hasSlip ? (
        <div>
          <Button
            id="pay-btn"
            onClick={checkout}
            // disabled={!isNotPaid}
            className="text-sm !bg-gray-700 w-full"
            icon="payments">
            Payer {amount} F CFA
          </Button>
          {!isNotPaid && (
            <div>{paiementInProgress ? '' : '✅ Paiement effectué'}</div>
          )}

          <div
            onClick={toggleSlip}
            className="text-blue-500 underline text-center mt-6 cursor-pointer">
            J'ai déjà ma quittance
          </div>
        </div>
      ) : (
        <div>
          <FileUpload
            label="Quittance de droit d'inscription"
            onChange={({ url }) => {
              console.log(url);
              onChange(`uploaded|${url}`);
            }}
          />
          {!slip && (
            <div
              onClick={toggleSlip}
              className="text-blue-500 underline text-center mt-6 cursor-pointer">
              Je n'ai pas encore ma quittance
            </div>
          )}
        </div>
      )}
    </>
  );
};
