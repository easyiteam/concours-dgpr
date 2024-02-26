import { useState } from 'react';
import { CreateValidator } from '../api/typings';
import { Back } from '../components/buttons/Back';
import { H1 } from '../components/display/H1';
import { Form, useNavigate } from 'react-router-dom';
import { Input } from '../components/form-fields/Input';
import { Button } from '../components/buttons/Button';
import { validatorApi } from '../api/validator.api';

const defaultValidator = {
  email: '',
  fullname: '',
  fonction: '',
};

export const RegisterValidator = () => {
  const [validator, setValidator] = useState<CreateValidator>(defaultValidator);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await validatorApi.addValidator(validator);
    setValidator(defaultValidator);
    navigate(-1);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Back showText />
      </div>

      <H1>Informations du validateur</H1>
      <div className="bg-white mt-8">
        <Form
          className="flex flex-col gap-6 p-8"
          onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={validator.email}
            onChange={(e) =>
              setValidator({ ...validator, email: e.target.value })
            }
          />
          <Input
            label="Nom et prénom(s)"
            name="fullname"
            value={validator.fullname}
            onChange={(e) =>
              setValidator({
                ...validator,
                fullname: e.target.value.toUpperCase(),
              })
            }
          />

          <Input
            label="Fonction"
            name="fonction"
            value={validator.fonction}
            onChange={(e) =>
              setValidator({
                ...validator,
                fonction: e.target.value.toUpperCase(),
              })
            }
          />

          <Button>Créer le validateur</Button>
        </Form>
      </div>
    </div>
  );
};
