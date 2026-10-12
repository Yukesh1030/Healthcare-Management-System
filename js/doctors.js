/**
 * STACKLY HEALTHCARE - DOCTORS DIRECTORY (js/doctors.js)
 * Doctor data, dynamic live search, department filters, and profile modal
 */

const DOCTORS_DATA = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    dept: 'cardiology',
    deptName: 'Cardiology',
    title: 'Senior Interventional Cardiologist',
    qualifications: 'MD, FACC, Harvard Medical School',
    experience: '14+ Years Experience',
    availability: 'Mon - Thu, 09:00 AM - 02:00 PM',
    rating: '4.9 (184 reviews)',
    image: 'assets/images/doctors/dr-sarah-cardiology.webp',
    bio: 'Specializing in preventative cardiology, coronary interventions, and cardiovascular imaging with extensive clinical research at leading institutions.',
    slots: ['09:30 AM', '11:00 AM', '01:30 PM']
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Sharma',
    dept: 'neurology',
    deptName: 'Neurology',
    title: 'Consultant Neurosurgeon & Specialist',
    qualifications: 'MBBS, MS, MCh (Neurosurgery), AIIMS',
    experience: '16+ Years Experience',
    availability: 'Mon, Wed, Fri, 10:00 AM - 04:00 PM',
    rating: '4.95 (220 reviews)',
    image: 'assets/images/doctors/dr-rajesh-neurology.webp',
    bio: 'Expert in cranial surgery, spine reconstruction, and neuro-oncology with specialized fellowship in minimally invasive neurological procedures.',
    slots: ['10:15 AM', '01:00 PM', '03:30 PM']
  },
  {
    id: 'doc-3',
    name: 'Dr. Marcus Vance',
    dept: 'orthopedics',
    deptName: 'Orthopedics',
    title: 'Chief Orthopedic & Joint Surgeon',
    qualifications: 'MD, FRCS (Orth), Johns Hopkins',
    experience: '12+ Years Experience',
    availability: 'Tue, Thu, Sat, 08:30 AM - 01:30 PM',
    rating: '4.88 (142 reviews)',
    image: 'assets/images/doctors/dr-marcus-orthopedics.webp',
    bio: 'Pioneering robotic joint replacements and sports trauma arthroscopy. Dedicated to accelerating post-surgical rehabilitation and athletic recovery.',
    slots: ['09:00 AM', '11:45 AM', '01:00 PM']
  },
  {
    id: 'doc-4',
    name: 'Dr. Elena Rostova',
    dept: 'pediatrics',
    deptName: 'Pediatrics',
    title: 'Pediatric Care Specialist & Neonatologist',
    qualifications: 'MD (Pediatrics), FAAP, King’s College',
    experience: '10+ Years Experience',
    availability: 'Mon - Fri, 09:00 AM - 03:00 PM',
    rating: '4.98 (310 reviews)',
    image: 'assets/images/doctors/dr-elena-pediatrics.webp',
    bio: 'Compassionate pediatric healthcare focusing on neonatal care, developmental milestones, vaccination schedules, and adolescent wellness.',
    slots: ['10:00 AM', '11:30 AM', '02:00 PM']
  },
  {
    id: 'doc-5',
    name: 'Dr. Priya Patel',
    dept: 'general-medicine',
    deptName: 'General Medicine',
    title: 'Internal Medicine Lead Consultant',
    qualifications: 'MD (Internal Medicine), MRCP (UK)',
    experience: '15+ Years Experience',
    availability: 'Daily, 08:00 AM - 02:00 PM',
    rating: '4.92 (275 reviews)',
    image: 'assets/images/doctors/dr-priya-medicine.webp',
    bio: 'Holistic chronic illness management, diabetic care, endocrine health, and preventative wellness examinations tailored to long-term health.',
    slots: ['08:30 AM', '11:00 AM', '01:15 PM']
  },
  {
    id: 'doc-6',
    name: 'Dr. David Kim',
    dept: 'diagnostics',
    deptName: 'Diagnostics & Imaging',
    title: 'Director of Clinical Diagnostics',
    qualifications: 'MD, DABR (Diagnostic Radiology)',
    experience: '13+ Years Experience',
    availability: 'Mon - Fri, 09:00 AM - 05:00 PM',
    rating: '4.85 (119 reviews)',
    image: 'assets/images/doctors/dr-david-diagnostics.webp',
    bio: 'Leading high-precision 3T MRI interpretation, PET-CT scans, and early pathology screening with artificial intelligence diagnostics assistance.',
    slots: ['09:45 AM', '01:30 PM', '04:00 PM']
  },
  {
    id: 'doc-7',
    name: 'Dr. Ananya Sen',
    dept: 'cardiology',
    deptName: 'Cardiology',
    title: 'Clinical Electrophysiologist',
    qualifications: 'MD, DM (Cardiology), Stanford Medical',
    experience: '11+ Years Experience',
    availability: 'Tue, Wed, Fri, 10:00 AM - 03:00 PM',
    rating: '4.91 (160 reviews)',
    image: 'assets/images/doctors/dr-ananya-oncology.webp',
    bio: 'Specialist in cardiac arrhythmias, pacemaker implantations, and catheter ablation therapies with advanced 3D cardiac mapping.',
    slots: ['10:30 AM', '12:00 PM', '02:30 PM']
  },
  {
    id: 'doc-8',
    name: 'Dr. Michael Chang',
    dept: 'orthopedics',
    deptName: 'Orthopedics',
    title: 'Spine & Sports Rehabilitation Surgeon',
    qualifications: 'MD, Orthopedic Spine Fellow (UCSF)',
    experience: '9+ Years Experience',
    availability: 'Mon, Wed, Thu, 09:00 AM - 01:00 PM',
    rating: '4.89 (135 reviews)',
    image: 'assets/images/doctors/dr-michael-surgery.webp',
    bio: 'Focused on complex spinal deformities, endoscopic disc surgery, and sports medicine biomechanics.',
    slots: ['09:15 AM', '10:45 AM', '12:30 PM']
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const directoryContainer = document.getElementById('doctors-directory-grid');
  if (directoryContainer) {
    initDoctorsDirectory(directoryContainer);
  }
});

function initDoctorsDirectory(container) {
  const searchInput = document.getElementById('doctor-search');
  const deptButtons = document.querySelectorAll('.dept-tab-btn');
  let currentDept = 'all';
  let currentSearch = '';

  function renderDoctors() {
    const filtered = DOCTORS_DATA.filter(doc => {
      const matchDept = (currentDept === 'all' || doc.dept === currentDept);
      const searchTerms = currentSearch.toLowerCase();
      const matchSearch = doc.name.toLowerCase().includes(searchTerms) ||
                          doc.deptName.toLowerCase().includes(searchTerms) ||
                          doc.title.toLowerCase().includes(searchTerms);
      return matchDept && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <div style="font-size: 3rem; color: #42BFA5; margin-bottom: 16px;"><i class="fa-solid fa-user-doctor"></i></div>
          <h3 style="font-family: var(--font-heading); margin-bottom: 8px;">No doctors found</h3>
          <p style="color: var(--primary-muted);">Try adjusting your search terms or filter criteria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(doc => `
      <div class="doctor-card" data-dept="${doc.dept}">
        <div class="doctor-avatar-wrap">
          <img src="${doc.image}" alt="${doc.name}" loading="lazy" width="400" height="280">
          <div class="doctor-badge-status">
            <span class="status-dot"></span> Available
          </div>
        </div>
        <div class="doctor-info">
          <div class="doctor-specialty">${doc.deptName}</div>
          <h3 class="doctor-name">${doc.name}</h3>
          <p class="doctor-quals">${doc.qualifications}</p>
          <div class="doctor-availability">
            <i class="fa-regular fa-clock" style="color: var(--accent);"></i>
            <span>${doc.availability}</span>
          </div>
          <div class="doctor-actions">
            <button class="btn btn-outline btn-sm view-profile-btn" data-doc-id="${doc.id}">
              View Profile
            </button>
            <a href="appointments.html?doctor=${doc.id}" class="btn btn-primary btn-sm">
              Book Visit
            </a>
          </div>
        </div>
      </div>
    `).join('');

    // Attach profile modal listeners
    container.querySelectorAll('.view-profile-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const docId = btn.getAttribute('data-doc-id');
        openDoctorModal(docId);
      });
    });
  }

  // Initial render
  renderDoctors();

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderDoctors();
    });
  }

  // Department button events
  deptButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      deptButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDept = btn.getAttribute('data-dept');
      renderDoctors();
    });
  });
}

/**
 * Doctor Profile Modal Dialog
 */
function openDoctorModal(docId) {
  const doc = DOCTORS_DATA.find(d => d.id === docId);
  if (!doc) return;

  let modal = document.getElementById('doctor-profile-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'doctor-profile-modal';
    modal.className = 'modal-overlay';
    modal.style.cssText = `
      position: fixed; inset: 0; background: rgba(18, 60, 70, 0.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; padding: 20px; backdrop-filter: blur(8px);
    `;
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="
      background: #FFFFFF; border-radius: 24px; max-width: 600px; width: 100%;
      overflow: hidden; box-shadow: 0 20px 50px rgba(18, 60, 70, 0.25);
      position: relative; animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    ">
      <button id="close-doc-modal-btn" style="
        position: absolute; top: 18px; right: 18px; background: rgba(244, 248, 247, 0.9);
        border: none; width: 36px; height: 36px; border-radius: 50%;
        font-size: 1.1rem; color: #123C46; cursor: pointer; display: flex;
        align-items: center; justify-content: center; z-index: 10;
      "><i class="fa-solid fa-xmark"></i></button>
      
      <div style="display: flex; flex-direction: column;">
        <div style="height: 220px; position: relative; overflow: hidden; background: #EBF3F1;">
          <img src="${doc.image}" alt="${doc.name}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(18, 60, 70, 0.8) 100%);"></div>
          <div style="position: absolute; bottom: 16px; left: 24px; color: #FFFFFF;">
            <span style="background: #42BFA5; color: #0A242B; padding: 3px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
              ${doc.deptName}
            </span>
            <h2 style="font-family: var(--font-heading); color: #FFFFFF; margin-top: 6px; font-size: 1.6rem;">${doc.name}</h2>
          </div>
        </div>

        <div style="padding: 28px 24px;">
          <p style="font-weight: 600; color: #123C46; font-size: 0.95rem; margin-bottom: 4px;">${doc.title}</p>
          <p style="color: rgba(18, 60, 70, 0.7); font-size: 0.88rem; margin-bottom: 16px;">${doc.qualifications} • ${doc.experience}</p>
          
          <p style="font-size: 0.94rem; line-height: 1.7; color: rgba(18, 60, 70, 0.8); margin-bottom: 20px;">
            ${doc.bio}
          </p>

          <div style="background: #F4F8F7; padding: 14px 18px; border-radius: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.8rem; color: rgba(18, 60, 70, 0.6); display: block;">Weekly Schedule:</span>
              <strong style="font-size: 0.9rem; color: #123C46;">${doc.availability}</strong>
            </div>
            <div style="color: #42BFA5; font-weight: 700; font-size: 0.9rem;">
              <i class="fa-solid fa-star" style="color: #F5A623;"></i> ${doc.rating}
            </div>
          </div>

          <div style="display: flex; gap: 12px;">
            <a href="appointments.html?doctor=${doc.id}" class="btn btn-primary" style="flex: 1; padding: 14px; text-align: center;">
              Book Appointment with ${doc.name}
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('close-doc-modal-btn');
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}
