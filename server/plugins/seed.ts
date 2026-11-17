import { connectDB } from '~/server/utils/db'
import { User } from '~/server/models/User'
import { Role } from '~/server/models/Role'
import bcrypt from 'bcryptjs'
import { SUPER_ADMIN_ROLE_KEY, type Permission } from '~/shared/permissions'

import { Branch } from '~/server/models/Branch'
import { Service } from '~/server/models/Service'
import { Leader } from '~/server/models/Leader'
import { SERVICE_CONTENT_CATALOG } from '~/shared/service-content'
import { COMPANY_DATA } from '~/shared/company-data'

// Contoh role untuk Penilai Publik / Pimpinan Cabang. Hanya dibuat sekali saat
// koleksi role masih kosong, sehingga perubahan atau penghapusan oleh admin
// tidak dikembalikan pada restart berikutnya.
const CONTRIBUTOR_PERMISSIONS: Permission[] = [
  'blog.view',
  'blog.create',
  'blog.update',
  'gallery.view',
  'gallery.create',
  'gallery.update',
  'clients.view',
  'clients.create',
  'clients.update',
]

async function seedRoles() {
  const isFirstRun = (await Role.countDocuments()) === 0

  // Role sistem selalu dipastikan ada; permission-nya tidak dipakai karena
  // super admin selalu memiliki semua akses.
  await Role.updateOne(
    { key: SUPER_ADMIN_ROLE_KEY },
    {
      $set: { isSystem: true, permissions: [] },
      $setOnInsert: {
        name: 'Super Admin',
        description: 'Akses penuh ke seluruh panel, termasuk kelola pengguna dan role.',
      },
    },
    { upsert: true }
  )

  if (isFirstRun) {
    await Role.create({
      key: 'kontributor',
      name: 'Kontributor Cabang',
      description:
        'Penilai Publik / Pimpinan Cabang: menulis artikel (draft), mengunggah foto galeri, dan menambah klien. Hanya data milik sendiri.',
      permissions: CONTRIBUTOR_PERMISSIONS,
    })
    console.log('✅ Default roles created')
  }
}

export default defineNitroPlugin(async () => {
  try {
    await connectDB()

    await seedRoles()

    // 1. Seed Admin User
    const adminCount = await User.countDocuments()
    if (adminCount === 0) {
      const bootstrapUsername = process.env.ADMIN_USERNAME?.trim() || ''
      const bootstrapPassword = process.env.ADMIN_PASSWORD || ''

      if (!bootstrapUsername || !bootstrapPassword) {
        console.warn(
          'Admin belum dibuat. Atur ADMIN_USERNAME dan ADMIN_PASSWORD untuk bootstrap database kosong.'
        )
      } else if (bootstrapUsername.length > 120 || bootstrapPassword.length < 12) {
        console.error(
          'Bootstrap admin dibatalkan: username maksimal 120 karakter dan password minimal 12 karakter.'
        )
      } else {
        const hashedPassword = await bcrypt.hash(bootstrapPassword, 12)
        const defaultAdmin = new User({
          username: bootstrapUsername,
          password: hashedPassword,
          name: 'Administrator',
          role: 'admin'
        })
        await defaultAdmin.save()
        console.log(`Admin bootstrap berhasil dibuat untuk username ${bootstrapUsername}.`)
      }
    }

    // Demo content is opt-in. Automatic content seeding on an empty production
    // database would create conflicting IDs before a disaster-recovery restore.
    if (process.env.SEED_DEMO_DATA !== 'true') return

    // 2. Seed Services
    const serviceCount = await Service.countDocuments()
    if (serviceCount === 0) {
      await Service.insertMany(
        Object.values(SERVICE_CONTENT_CATALOG).map((item) => ({
          title: item.title,
          titleEn: item.titleEn,
          slug: item.slug,
          description: item.description,
          icon: item.icon,
          content: item.content,
          isActive: true,
          order: item.order,
        }))
      )
      console.log('✅ Default services created')
    }

    // 3. Seed Branches
    const branchCount = await Branch.countDocuments()
    if (branchCount === 0) {
      await Branch.insertMany(
        COMPANY_DATA.branches.map((b) => ({
          name: b.name,
          city: b.city,
          address: b.address,
          phone: b.phone,
          email: b.email,
          latitude: b.latitude,
          longitude: b.longitude,
          mapsUrl: b.mapsUrl,
          isActive: true,
          order: b.order,
        }))
      )
      console.log('✅ Default branches created')
    }

    // 4. Seed Leaders
    const leaderCount = await Leader.countDocuments()
    if (leaderCount === 0) {
      await Leader.insertMany([
        {
          name: 'Henricus Judi Adrianto',
          position: 'Managing Partner',
          photoUrl: '/assets/images/team/member1.jpg',
          bio: 'Memiliki pengalaman lebih dari 20 tahun di bidang penilaian properti dan bisnis.',
          isActive: true,
          order: 1
        },
        {
          name: 'Budi Santoso',
          position: 'Partner Penilai Publik',
          photoUrl: '/assets/images/team/member2.jpg',
          bio: 'Ahli dalam studi kelayakan dan pengawasan proyek.',
          isActive: true,
          order: 2
        },
        {
          name: 'Siti Aminah',
          position: 'Partner Konsultan Keuangan',
          photoUrl: '/assets/images/team/member3.jpg',
          bio: 'Spesialis penilaian bisnis dan aset tak berwujud.',
          isActive: true,
          order: 3
        }
      ])
      console.log('✅ Default leaders created')
    }

  } catch (error) {
    console.error('❌ Failed to seed default data:', error)
  }
})
