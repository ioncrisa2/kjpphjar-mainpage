import { connectDB } from '~/server/utils/db'
import { User } from '~/server/models/User'
import bcrypt from 'bcryptjs'

import { Branch } from '~/server/models/Branch'
import { Service } from '~/server/models/Service'
import { Leader } from '~/server/models/Leader'
export default defineNitroPlugin(async () => {
  try {
    await connectDB()
    
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
      await Service.insertMany([
        {
          title: 'Penilaian Properti',
          titleEn: 'Property Valuation',
          slug: 'penilaian-properti',
          description: 'Layanan penilaian aset properti meliputi tanah, bangunan, mesin, peralatan, dan aset tetap lainnya untuk berbagai keperluan seperti jual beli, agunan, asuransi, dan pelaporan keuangan.',
          icon: 'fas fa-building',
          content: '<p>Layanan penilaian aset properti meliputi tanah, bangunan, mesin, peralatan, dan aset tetap lainnya untuk berbagai keperluan seperti jual beli, agunan, asuransi, dan pelaporan keuangan. Kami memberikan opini nilai yang independen dan obyektif berdasarkan Standar Penilaian Indonesia (SPI).</p>',
          isActive: true,
          order: 1
        },
        {
          title: 'Penilaian Bisnis',
          titleEn: 'Business Valuation',
          slug: 'penilaian-bisnis',
          description: 'Penilaian atas entitas bisnis, penyertaan saham, surat berharga, dan aktiva tak berwujud untuk keperluan merger, akuisisi, restrukturisasi, dan privatisasi.',
          icon: 'fas fa-chart-line',
          content: '<p>Penilaian atas entitas bisnis, penyertaan saham, surat berharga, dan aktiva tak berwujud (intangible assets) untuk berbagai keperluan, antara lain merger, akuisisi, restrukturisasi, privatisasi, dan pelaporan keuangan.</p>',
          isActive: true,
          order: 2
        },
        {
          title: 'Studi Kelayakan',
          titleEn: 'Feasibility Study',
          slug: 'studi-kelayakan',
          description: 'Layanan jasa konsultasi berupa kajian komprehensif terkait kelayakan suatu proyek investasi dari aspek pasar, teknis, manajemen, lingkungan, dan keuangan.',
          icon: 'fas fa-project-diagram',
          content: '<p>Layanan jasa konsultasi berupa kajian komprehensif terkait kelayakan suatu proyek investasi dari aspek pasar, teknis, manajemen, lingkungan, hukum, dan keuangan. Hasil kajian digunakan sebagai referensi bagi investor atau pihak perbankan.</p>',
          isActive: true,
          order: 3
        },
        {
          title: 'Pengawasan Proyek',
          titleEn: 'Project Monitoring',
          slug: 'pengawasan-proyek',
          description: 'Layanan pemantauan pelaksanaan proyek pembangunan untuk memastikan kesesuaian antara progres fisik di lapangan dengan jadwal dan rencana anggaran biaya.',
          icon: 'fas fa-hard-hat',
          content: '<p>Layanan pemantauan pelaksanaan proyek pembangunan (Project Monitoring) untuk memastikan kesesuaian antara kemajuan fisik di lapangan dengan jadwal waktu penyelesaian dan rencana anggaran biaya. Sangat bermanfaat bagi pihak perbankan dalam pencairan termin pinjaman.</p>',
          isActive: true,
          order: 4
        }
      ])
      console.log('✅ Default services created')
    }

    // 3. Seed Branches
    const branchCount = await Branch.countDocuments()
    if (branchCount === 0) {
      await Branch.insertMany([
        {
          name: 'Kantor Pusat Jakarta',
          city: 'Jakarta',
          address: 'Gedung Perkantoran Pusat, Jl. Jend. Sudirman No. 1, Jakarta Pusat',
          phone: '(021) 1234567',
          email: 'pusat@kjpphjar.com',
          latitude: -6.2235,
          longitude: 106.8123,
          isActive: true,
          order: 1
        },
        {
          name: 'Cabang Surabaya',
          city: 'Surabaya',
          address: 'Jl. Pemuda No. 10, Surabaya',
          phone: '(031) 7654321',
          email: 'surabaya@kjpphjar.com',
          latitude: -7.2656,
          longitude: 112.7483,
          isActive: true,
          order: 2
        },
        {
          name: 'Cabang Medan',
          city: 'Medan',
          address: 'Jl. Diponegoro No. 20, Medan',
          phone: '(061) 9876543',
          email: 'medan@kjpphjar.com',
          latitude: 3.5852,
          longitude: 98.6756,
          isActive: true,
          order: 3
        }
      ])
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
