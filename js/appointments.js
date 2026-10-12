/**
 * STACKLY HEALTHCARE - APPOINTMENT BOOKING JOURNEY (js/appointments.js)
 * 3-step interactive booking, slot selection, dynamic summary, confirmation modal, reschedule/cancel demos
 */

document.addEventListener('DOMContentLoaded', () => {
  initAppointmentBooking();
  initRescheduleDemo();
});

const DEPT_DOCTOR_MAP = {
  cardiology: [
    { id: 'doc-1', name: 'Dr. Sarah Jenkins (Cardiology)' },
    { id: 'doc-7', name: 'Dr. Ananya Sen (Electrophysiology)' }
  ],
  neurology: [
    { id: 'doc-2', name: 'Dr. Rajesh Sharma (Neurosurgery)' }
  ],
  orthopedics: [
    { id: 'doc-3', name: 'Dr. Marcus Vance (Joint Replacement)' },
    { id: 'doc-8', name: 'Dr. Michael Chang (Spine & Sports)' }
  ],
  pediatrics: [
    { id: 'doc-4', name: 'Dr. Elena Rostova (Pediatrics)' }
  ],
  'general-medicine': [
    { id: 'doc-5', name: 'Dr. Priya Patel (Internal Medicine)' }
  ],
  diagnostics: [
    { id: 'doc-6', name: 'Dr. David Kim (Diagnostics & Imaging)' }
  ]
};

function initAppointmentBooking() {
  const deptSelect = document.getElementById('booking-dept');
  const doctorSelect = document.getElementById('booking-doctor');
  const dateInput = document.getElementById('booking-date');
  const slotContainer = document.getElementById('time-slots-container');
  const bookingForm = document.getElementById('appointment-form');

  // Summary elements
  const sumDept = document.getElementById('sum-dept');
  const sumDoctor = document.getElementById('sum-doctor');
  const sumDate = document.getElementById('sum-date');
  const sumTime = document.getElementById('sum-time');
  const sumPatient = document.getElementById('sum-patient');

  let selectedSlot = '09:30 AM';

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
    if (sumDate) sumDate.innerText = today;
  }

  // Check URL parameters for preselected doctor
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedDocId = urlParams.get('doctor');

  function updateDoctorsList(selectedDept, autoSelectDocId = null) {
    if (!doctorSelect) return;
    doctorSelect.innerHTML = '<option value="">-- Choose Specialist Doctor --</option>';

    const doctors = DEPT_DOCTOR_MAP[selectedDept] || [];
    doctors.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.name;
      if (autoSelectDocId === d.id) {
        opt.selected = true;
      }
      doctorSelect.appendChild(opt);
    });

    if (doctors.length > 0 && !autoSelectDocId) {
      doctorSelect.selectedIndex = 1;
    }

    if (sumDept && deptSelect) {
      sumDept.innerText = deptSelect.options[deptSelect.selectedIndex]?.text || 'Not selected';
    }
    if (sumDoctor && doctorSelect) {
      sumDoctor.innerText = doctorSelect.options[doctorSelect.selectedIndex]?.text || 'Not selected';
    }
  }

  if (deptSelect) {
    deptSelect.addEventListener('change', () => {
      updateDoctorsList(deptSelect.value);
    });

    // Handle preselected doctor
    if (preselectedDocId) {
      for (const [deptKey, docList] of Object.entries(DEPT_DOCTOR_MAP)) {
        if (docList.some(d => d.id === preselectedDocId)) {
          deptSelect.value = deptKey;
          updateDoctorsList(deptKey, preselectedDocId);
          break;
        }
      }
    } else {
      updateDoctorsList(deptSelect.value);
    }
  }

  if (doctorSelect) {
    doctorSelect.addEventListener('change', () => {
      if (sumDoctor) {
        sumDoctor.innerText = doctorSelect.options[doctorSelect.selectedIndex]?.text || 'Not selected';
      }
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', () => {
      if (sumDate) sumDate.innerText = dateInput.value || 'Not selected';
    });
  }

  // Time slot buttons
  if (slotContainer) {
    const slotBtns = slotContainer.querySelectorAll('.slot-pill-btn');
    slotBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        slotBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSlot = btn.getAttribute('data-time') || btn.innerText.trim();
        if (sumTime) sumTime.innerText = selectedSlot;

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(btn, { scale: 0.92 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
        }
      });
    });
  }

  // Patient name live update
  const patientNameInput = document.getElementById('patient-name');
  if (patientNameInput && sumPatient) {
    patientNameInput.addEventListener('input', () => {
      sumPatient.innerText = patientNameInput.value.trim() || 'Guest Patient';
    });
  }

  // Form submit and validation
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const requiredInputs = bookingForm.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else {
          if (group) group.classList.remove('has-error');
        }
      });

      if (!isValid) {
        if (typeof showToast === 'function') {
          showToast('Please fill all required appointment fields.', 'fa-triangle-exclamation');
        }
        return;
      }

      // Generate Reference Code
      const refCode = 'STK-' + Math.floor(100000 + Math.random() * 900000);
      const doctorName = doctorSelect?.options[doctorSelect.selectedIndex]?.text || 'Assigned Specialist';
      const chosenDate = dateInput?.value || '2026-10-15';
      const patientName = patientNameInput?.value || 'Patient';

      showBookingConfirmation({
        refCode,
        patientName,
        doctorName,
        date: chosenDate,
        time: selectedSlot,
        dept: deptSelect?.options[deptSelect.selectedIndex]?.text || 'General'
      });
    });
  }
}

/**
 * Show Booking Confirmation Screen / Modal
 */
function showBookingConfirmation(details) {
  let modal = document.getElementById('confirmation-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'confirmation-modal';
    modal.style.cssText = `
      position: fixed; inset: 0; background: rgba(18, 60, 70, 0.75);
      backdrop-filter: blur(8px); display: flex; align-items: center;
      justify-content: center; z-index: 10000; padding: 20px;
    `;
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="
      background: #FFFFFF; border-radius: 24px; max-width: 540px; width: 100%;
      padding: 40px 32px; text-align: center; box-shadow: 0 24px 60px rgba(18, 60, 70, 0.3);
      position: relative; animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    ">
      <div style="
        width: 76px; height: 76px; border-radius: 50%; background: rgba(66, 191, 165, 0.15);
        color: #42BFA5; display: inline-flex; align-items: center; justify-content: center;
        font-size: 2.2rem; margin-bottom: 20px;
      ">
        <i class="fa-solid fa-circle-check"></i>
      </div>

      <span style="display: block; font-size: 0.85rem; font-weight: 700; color: #42BFA5; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
        Appointment Confirmed
      </span>

      <h2 style="font-family: var(--font-heading); color: #123C46; font-size: 1.8rem; margin-bottom: 12px;">
        Thank You, ${details.patientName}!
      </h2>

      <p style="color: rgba(18, 60, 70, 0.75); font-size: 0.95rem; margin-bottom: 24px;">
        Your appointment request has been coordinated. A confirmation SMS and email pass have been scheduled.
      </p>

      <div style="background: #F4F8F7; border: 1px dashed #42BFA5; border-radius: 14px; padding: 20px; text-align: left; margin-bottom: 28px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem;">
          <span style="color: rgba(18, 60, 70, 0.65);">Booking Ref:</span>
          <strong style="color: #123C46; font-family: monospace; font-size: 1.05rem;">${details.refCode}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem;">
          <span style="color: rgba(18, 60, 70, 0.65);">Specialist:</span>
          <strong style="color: #123C46;">${details.doctorName}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem;">
          <span style="color: rgba(18, 60, 70, 0.65);">Date & Time:</span>
          <strong style="color: #123C46;">${details.date} at ${details.time}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
          <span style="color: rgba(18, 60, 70, 0.65);">Department:</span>
          <strong style="color: #123C46;">${details.dept}</strong>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        <button id="close-confirm-modal" class="btn btn-primary" style="width: 100%;">
          Back to Appointment Overview
        </button>
        <a href="ClientDashboard.html" class="btn btn-outline" style="width: 100%;">
          View in Patient Portal
        </a>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const card = modal.firstElementChild;
  const icon = modal.querySelector('i.fa-circle-check')?.parentElement;

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    if (card) {
      gsap.fromTo(card,
        { opacity: 0, scale: 0.82, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }
      );
    }
    if (icon) {
      gsap.fromTo(icon,
        { scale: 0, rotation: -60 },
        { scale: 1, rotation: 0, duration: 0.65, delay: 0.15, ease: 'elastic.out(1.2, 0.5)' }
      );
    }
  }

  function closeConfirmModal() {
    if (typeof gsap !== 'undefined' && card) {
      gsap.to(card, {
        opacity: 0,
        scale: 0.88,
        y: 20,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(modal, {
            opacity: 0,
            duration: 0.15,
            onComplete: () => {
              modal.style.display = 'none';
              document.body.style.overflow = '';
            }
          });
        }
      });
    } else {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  document.getElementById('close-confirm-modal').addEventListener('click', closeConfirmModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeConfirmModal();
    }
  });
}

/**
 * Reschedule and Cancellation Demonstrations
 */
function initRescheduleDemo() {
  const rescheduleBtn = document.getElementById('demo-reschedule-btn');
  const cancelBtn = document.getElementById('demo-cancel-btn');
  const demoStatus = document.getElementById('demo-appointment-status');

  if (rescheduleBtn) {
    rescheduleBtn.addEventListener('click', () => {
      const newTime = prompt('Select new preferred time slot for Dr. Sarah Jenkins (e.g., Tomorrow at 02:30 PM):', 'Tomorrow at 02:30 PM');
      if (newTime) {
        if (demoStatus) {
          demoStatus.innerHTML = `<span class="status-pill status-confirmed">Rescheduled</span> to ${newTime}`;
        }
        if (typeof showToast === 'function') {
          showToast(`Appointment rescheduled to ${newTime}!`, 'fa-clock-rotate-left');
        }
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      const confirmCancel = confirm('Are you sure you want to simulate cancelling this appointment?');
      if (confirmCancel) {
        if (demoStatus) {
          demoStatus.innerHTML = `<span class="status-pill status-cancelled">Cancelled</span> (Slot Released)`;
        }
        if (typeof showToast === 'function') {
          showToast('Appointment successfully cancelled.', 'fa-xmark');
        }
      }
    });
  }
}
