import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with real data...')

  // Clean existing data
  await prisma.appointment.deleteMany()
  await prisma.prescription.deleteMany()
  await prisma.consultation.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.user.deleteMany()
  await prisma.mIRoom.deleteMany()

  // Create MI Rooms
  const miRoom1 = await prisma.mIRoom.create({
    data: {
      name: 'Khanna MI Room',
      village: 'Khanna',
      address: 'Main Road, Khanna, Punjab',
      pincode: '141401'
    }
  })

  const miRoom2 = await prisma.mIRoom.create({
    data: {
      name: 'Nabha MI Room',
      village: 'Nabha',
      address: 'Civil Hospital Road, Nabha, Punjab',
      pincode: '147201'
    }
  })

  const miRoom3 = await prisma.mIRoom.create({
    data: {
      name: 'Ludhiana MI Room',
      village: 'Ludhiana',
      address: 'GT Road, Ludhiana, Punjab',
      pincode: '141001'
    }
  })

  // Create MI Room Incharges
  const incharge1 = await prisma.user.create({
    data: {
      email: 'incharge.khanna@miroom.gov.in',
      password: await hashPassword('password123'),
      name: 'Rajesh Kumar',
      role: 'MI_ROOM_INCHARGE',
      miRoomId: miRoom1.id
    }
  })

  const incharge2 = await prisma.user.create({
    data: {
      email: 'incharge.nabha@miroom.gov.in',
      password: await hashPassword('password123'),
      name: 'Sunita Sharma',
      role: 'MI_ROOM_INCHARGE',
      miRoomId: miRoom2.id
    }
  })

  const incharge3 = await prisma.user.create({
    data: {
      email: 'incharge.ludhiana@miroom.gov.in',
      password: await hashPassword('password123'),
      name: 'Amarjit Singh',
      role: 'MI_ROOM_INCHARGE',
      miRoomId: miRoom3.id
    }
  })

  // Create Hospital Doctors
  const doctor1 = await prisma.user.create({
    data: {
      email: 'dr.preet@nabhahospital.gov.in',
      password: await hashPassword('doctor123'),
      name: 'Dr. Preet Kaur',
      role: 'HOSPITAL_DOCTOR',
      specialization: 'General Medicine',
      licenseNumber: 'PMC/2018/12345'
    }
  })

  const doctor2 = await prisma.user.create({
    data: {
      email: 'dr.manpreet@nabhahospital.gov.in',
      password: await hashPassword('doctor123'),
      name: 'Dr. Manpreet Singh',
      role: 'HOSPITAL_DOCTOR',
      specialization: 'Cardiology',
      licenseNumber: 'PMC/2020/67890'
    }
  })

  const doctor3 = await prisma.user.create({
    data: {
      email: 'dr.simran@nabhahospital.gov.in',
      password: await hashPassword('doctor123'),
      name: 'Dr. Simran Kaur',
      role: 'HOSPITAL_DOCTOR',
      specialization: 'Pediatrics',
      licenseNumber: 'PMC/2019/54321'
    }
  })

  // Create Patients
  const patient1 = await prisma.patient.create({
    data: {
      name: 'Gurpreet Singh',
      age: 45,
      gender: 'Male',
      phone: '+91-9876543210',
      address: 'Village Khanna, Tehsil Khanna',
      village: 'Khanna',
      aadharNumber: '123456789012',
      bloodGroup: 'B+',
      allergies: 'None',
      miRoomId: miRoom1.id,
      registeredById: incharge1.id
    }
  })

  const patient2 = await prisma.patient.create({
    data: {
      name: 'Jasbir Kaur',
      age: 32,
      gender: 'Female',
      phone: '+91-9876543211',
      address: 'Village Nabha, Tehsil Nabha',
      village: 'Nabha',
      aadharNumber: '234567890123',
      bloodGroup: 'O+',
      allergies: 'Penicillin',
      miRoomId: miRoom2.id,
      registeredById: incharge2.id
    }
  })

  const patient3 = await prisma.patient.create({
    data: {
      name: 'Harpreet Singh',
      age: 58,
      gender: 'Male',
      phone: '+91-9876543212',
      address: 'Village Ludhiana, Tehsil Ludhiana',
      village: 'Ludhiana',
      aadharNumber: '345678901234',
      bloodGroup: 'A+',
      allergies: 'Dust allergy',
      miRoomId: miRoom3.id,
      registeredById: incharge3.id
    }
  })

  const patient4 = await prisma.patient.create({
    data: {
      name: 'Kuldeep Kaur',
      age: 28,
      gender: 'Female',
      phone: '+91-9876543213',
      address: 'Village Khanna, Tehsil Khanna',
      village: 'Khanna',
      aadharNumber: '456789012345',
      bloodGroup: 'AB+',
      allergies: 'None',
      miRoomId: miRoom1.id,
      registeredById: incharge1.id
    }
  })

  const patient5 = await prisma.patient.create({
    data: {
      name: 'Baldev Singh',
      age: 65,
      gender: 'Male',
      phone: '+91-9876543214',
      address: 'Village Nabha, Tehsil Nabha',
      village: 'Nabha',
      aadharNumber: '567890123456',
      bloodGroup: 'O-',
      allergies: 'Aspirin',
      miRoomId: miRoom2.id,
      registeredById: incharge2.id
    }
  })

  // Create Consultations
  const consultation1 = await prisma.consultation.create({
    data: {
      symptoms: 'High fever (102°F), severe headache, body aches for 3 days. Patient reports chills and loss of appetite.',
      vitals: {
        temperature: '102.4°F',
        bloodPressure: '140/90',
        heartRate: '95 bpm',
        oxygenSaturation: '98%',
        weight: '70 kg'
      },
      isUrgent: true,
      patientId: patient1.id,
      miRoomId: miRoom1.id,
      inchargeId: incharge1.id,
      status: 'PENDING'
    }
  })

  const consultation2 = await prisma.consultation.create({
    data: {
      symptoms: 'Persistent cough with mucus, chest tightness, mild fever for 5 days. Difficulty breathing during physical activity.',
      vitals: {
        temperature: '100.8°F',
        bloodPressure: '130/85',
        heartRate: '88 bpm',
        oxygenSaturation: '96%',
        weight: '65 kg'
      },
      isUrgent: false,
      patientId: patient2.id,
      miRoomId: miRoom2.id,
      inchargeId: incharge2.id,
      status: 'PENDING'
    }
  })

  const consultation3 = await prisma.consultation.create({
    data: {
      symptoms: 'Chest pain radiating to left arm, shortness of breath, sweating. Patient has history of hypertension.',
      vitals: {
        temperature: '98.6°F',
        bloodPressure: '160/100',
        heartRate: '110 bpm',
        oxygenSaturation: '94%',
        weight: '80 kg'
      },
      isUrgent: true,
      patientId: patient3.id,
      miRoomId: miRoom3.id,
      inchargeId: incharge3.id,
      doctorId: doctor2.id,
      status: 'IN_PROGRESS'
    }
  })

  const consultation4 = await prisma.consultation.create({
    data: {
      symptoms: 'Abdominal pain, nausea, vomiting since morning. Patient reports eating outside food yesterday.',
      vitals: {
        temperature: '99.2°F',
        bloodPressure: '120/80',
        heartRate: '85 bpm',
        oxygenSaturation: '99%',
        weight: '55 kg'
      },
      isUrgent: false,
      patientId: patient4.id,
      miRoomId: miRoom1.id,
      inchargeId: incharge1.id,
      status: 'PENDING'
    }
  })

  const consultation5 = await prisma.consultation.create({
    data: {
      symptoms: 'Joint pain in knees and hands, morning stiffness, swelling. Patient reports difficulty in walking.',
      vitals: {
        temperature: '98.4°F',
        bloodPressure: '150/95',
        heartRate: '78 bpm',
        oxygenSaturation: '98%',
        weight: '75 kg'
      },
      isUrgent: false,
      patientId: patient5.id,
      miRoomId: miRoom2.id,
      inchargeId: incharge2.id,
      status: 'PENDING'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Created:')
  console.log(`- 3 MI Rooms (Khanna, Nabha, Ludhiana)`)
  console.log(`- 3 MI Room Incharges`)
  console.log(`- 3 Hospital Doctors`)
  console.log(`- 5 Patients`)
  console.log(`- 5 Consultations`)
  
  console.log('\n🔐 Login Credentials:')
  console.log('\nMI Room Incharges:')
  console.log('- incharge.khanna@miroom.gov.in / password123')
  console.log('- incharge.nabha@miroom.gov.in / password123')
  console.log('- incharge.ludhiana@miroom.gov.in / password123')
  
  console.log('\nHospital Doctors:')
  console.log('- dr.preet@nabhahospital.gov.in / doctor123')
  console.log('- dr.manpreet@nabhahospital.gov.in / doctor123')
  console.log('- dr.simran@nabhahospital.gov.in / doctor123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })