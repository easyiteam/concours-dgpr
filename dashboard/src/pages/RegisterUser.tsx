/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from '../api/enums';
import { Input } from '../components/form-fields/Input';
import { Option, Select } from '../components/form-fields/Select';
import { Form } from '../components/form-fields/Form';
import { useMemo, useState } from 'react';
import { AuthRegister, Exam, ROLES } from '../api/typings';
import { authApi } from '../api/auth.api';
import { Button } from '../components/buttons/Button';
import { Back } from '../components/buttons/Back';
import { H1 } from '../components/display/H1';
import { useFindAll } from '../hooks/useFindAll';
import { examApi } from '../api/exam.api';
import { useToast } from '../components/providers/ToastProvider';

const defaultUser = {
  email: '',
  fullname: '',
  role: Role.USER,
};

type Link = { exam: string; filter: string; value: string };

export const RegisterUser = () => {
  const [user, setUser] = useState<AuthRegister>(defaultUser);
  const openToast = useToast();

  const { rows } = useFindAll(() => examApi.findAll({ limit: -1 }), []);
  const exams = useMemo(() => {
    const _exams = [];

    for (const _row of rows) {
      const row: Exam = _row as unknown as Exam;
      _exams.push({
        ...row,
        filters: row.participantProfileDefinition.reduce(
          (acc: unknown[], cur: { value: unknown[] }) => [...acc, ...cur.value],
          [],
        ),
      });
    }
    return _exams;
  }, [rows]);
  const [links, setLinks] = useState<Link[]>([]);

  const addLink = (link: Link) => {
    setLinks((links) => [...links, link]);
    setUser((user) => ({ ...user, links: [...links, link] }));
  };

  const getExam = (id: string) => {
    return exams.find((e) => e.id === id);
  };

  const handleSubmit = async () => {
    await authApi.register(user);
    setUser(defaultUser);
    openToast({ info: 'Utilisateur créé avec succès', type: 'success' });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Back showText />
      </div>

      <H1>Informations de l'utilisateur</H1>
      <div className="bg-white mt-8">
        <Form
          className="flex flex-col gap-6 p-8"
          onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <Input
            label="Nom et prénom(s)"
            name="fullname"
            value={user.fullname}
            onChange={(e) =>
              setUser({ ...user, fullname: e.target.value.toUpperCase() })
            }
          />
          <Select
            options={ROLES}
            optionLabel="label"
            label="Rôle"
            onChange={(e) =>
              setUser({ ...user, role: (e as { id: string }).id as Role })
            }
          />

          {user.role === Role.EXAM_MANAGER && (
            <LinkExam
              exams={exams}
              addLink={addLink}
              getExam={getExam}
            />
          )}
          {links.map((link) => (
            <div key={link.exam}>
              <div className="text-xs font-semibold">
                {getExam(link.exam)?.label}
              </div>
              <div className="text-sm font-light">
                {link.filter}: {link.value}
              </div>
            </div>
          ))}

          <Button>Créer l'utilisateur</Button>
        </Form>
      </div>
    </div>
  );
};

function LinkExam({
  exams,
  addLink,
  getExam,
}: {
  exams: unknown[];
  addLink: (link: Link) => void;
  getExam: (id: string) => (Exam & { filters: unknown }) | undefined;
}) {
  const [link, setLink] = useState<{
    exam: string;
    filter: string;
    value: string;
  }>({
    exam: '',
    filter: '',
    value: '',
  });

  const filters = useMemo(() => {
    if (!link.exam) return [];
    const exam = exams.find(
      (e: unknown) => (e as { id: string; label: string }).id === link.exam,
    );
    return (exam as { filters: Record<string, any>[] }).filters.map(
      (it: Record<string, any>) => ({
        ...it,
        id: it.key,
        label: it.label,
        values: it.validation.values,
      }),
    );
  }, [link.exam, exams]);

  const getFilter = (filter: string) => {
    return filters.find((f) => f.id === filter);
  };

  return (
    <div>
      <div className="text-gray-600 font-semibold text-sm">
        Associer à un concours
      </div>
      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4">
        <Select
          options={exams as Option[]}
          optionLabel="label"
          defaultValue={getExam(link.exam)?.label ?? ''}
          placeholder="Concours"
          onChange={(e) => setLink({ ...link, exam: (e as { id: string }).id })}
        />

        <Select
          options={filters as Option[]}
          optionLabel="label"
          placeholder="Filtre"
          defaultValue={getFilter(link.filter)?.label ?? ''}
          onChange={(e) =>
            setLink({
              ...link,
              filter: (
                e as {
                  id: string;
                  label: string;
                  values: string;
                }
              ).id,
            })
          }
        />

        <Select
          options={getFilter(link.filter)?.values.split(';') ?? []}
          placeholder="Valeur"
          onChange={(e) => setLink({ ...link, value: e as string })}
        />

        <Button
          type="button"
          onClick={() => {
            addLink(link);
            setLink({
              exam: '',
              filter: '',
              value: '',
            });
          }}
          className="text-xs bg-gray-600 text-white mt-1.5">
          Associer
        </Button>
      </div>
    </div>
  );
}
