import { hashSync } from 'bcrypt';
import { BasicRole, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const admin = {
  email: 'user@admin.app',
  username: 'admin',
  fullname: 'ADMIN',
  password: hashSync('Admin@123', 3),
};

const centers = [
  { label: 'Lycée Mathieu BOUKE' },
  { label: 'CEG 1 DASSA-ZOUME' },
  { label: 'Lycée Technique Coulibaly' },
  { label: "Lycée Technique d'Amitié Sino Béninoise d'Akassato" },
];

const main = async () => {
  await prisma.auth.upsert({
    where: { email: admin.email },
    create: {
      ...admin,
      role: BasicRole.ADMIN,
      isVerified: true,
    },
    update: {
      fullname: admin.fullname,
      isVerified: true,
    },
  });

  for (const center of centers) {
    const _center = await prisma.center.findFirst({
      where: { label: center.label },
    });

    if (!_center) {
      await prisma.center.create({ data: center });
    }
  }
};

main().then(async () => {
  await prisma.$disconnect();
});
