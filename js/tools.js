/* ============================================================
   NUTRIGENIX — TOOLS.JS
   BMI Calculator, Calorie Calculator, Multi-step Forms
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initBMICalculator();
  initCalorieCalculator();
  initMultiStepForm();
  initFormValidation();
  initContactForm();
  initBookingForm();
  initSubscribeForm();
  initHealthAssessmentForm();
});

/* ══════════════════════════════════════════
   BMI CALCULATOR
   ══════════════════════════════════════════ */
function initBMICalculator() {
  const form = document.getElementById('bmi-form');
  if (!form) return;

  const heightEl  = document.getElementById('bmi-height');
  const weightEl  = document.getElementById('bmi-weight');
  const resultDiv = document.getElementById('bmi-result');
  const bmiVal    = document.getElementById('bmi-value');
  const bmiCat    = document.getElementById('bmi-category');
  const bmiMsg    = document.getElementById('bmi-message');
  const heightDisplay = document.getElementById('height-display');
  const weightDisplay = document.getElementById('weight-display');

  // Live display for range sliders
  heightEl?.addEventListener('input', () => {
    if (heightDisplay) heightDisplay.textContent = `${heightEl.value} cm`;
  });

  weightEl?.addEventListener('input', () => {
    if (weightDisplay) weightDisplay.textContent = `${weightEl.value} kg`;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const unit   = form.querySelector('[name="unit"]')?.value || 'metric';
    let height, weight;

    if (unit === 'metric') {
      height = parseFloat(heightEl?.value) / 100; // cm to m
      weight = parseFloat(weightEl?.value);
    } else {
      const feet   = parseFloat(form.querySelector('#bmi-feet')?.value || 0);
      const inches = parseFloat(form.querySelector('#bmi-inches')?.value || 0);
      height = (feet * 12 + inches) * 0.0254; // to meters
      weight = parseFloat(weightEl?.value) * 0.453592; // lbs to kg
    }

    if (!height || !weight || height <= 0 || weight <= 0) {
      showToast?.('Please enter valid height and weight.', 'error');
      return;
    }

    const bmi = weight / (height * height);
    const { category, message, cssClass } = getBMICategory(bmi);

    if (bmiVal) bmiVal.textContent = bmi.toFixed(1);
    if (bmiCat) {
      bmiCat.textContent = category;
      bmiCat.className = `bmi-category ${cssClass}`;
    }
    if (bmiMsg) bmiMsg.textContent = message;

    resultDiv?.classList.add('show');
    resultDiv?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return {
    category: 'Underweight',
    cssClass: 'bmi-underweight',
    message: 'You may need to increase your calorie intake. Consult our nutritionist for a personalized weight gain plan.'
  };
  if (bmi < 25) return {
    category: 'Normal Weight ✓',
    cssClass: 'bmi-normal',
    message: 'Excellent! Your weight is in the healthy range. Maintain it with balanced nutrition and regular activity.'
  };
  if (bmi < 30) return {
    category: 'Overweight',
    cssClass: 'bmi-overweight',
    message: 'Consider a personalized weight management plan. Our certified nutritionists can help you achieve your goals.'
  };
  return {
    category: 'Obese',
    cssClass: 'bmi-obese',
    message: 'We recommend scheduling a consultation with our specialist nutritionist for a DNA-based weight management program.'
  };
}

/* ══════════════════════════════════════════
   CALORIE CALCULATOR
   ══════════════════════════════════════════ */
function initCalorieCalculator() {
  const form = document.getElementById('calorie-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const age      = parseFloat(form.querySelector('#cal-age')?.value);
    const gender   = form.querySelector('[name="cal-gender"]:checked')?.value;
    const weight   = parseFloat(form.querySelector('#cal-weight')?.value); // kg
    const height   = parseFloat(form.querySelector('#cal-height')?.value); // cm
    const activity = parseFloat(form.querySelector('#cal-activity')?.value || 1.2);
    const goal     = form.querySelector('#cal-goal')?.value || 'maintain';

    if (!age || !gender || !weight || !height) {
      showToast?.('Please fill in all fields.', 'error');
      return;
    }

    // Mifflin-St Jeor BMR
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    let tdee = bmr * activity;

    // Adjust for goal
    const goalAdjust = { lose: -500, maintain: 0, gain: 300, 'muscle-gain': 400 };
    const calories = Math.round(tdee + (goalAdjust[goal] || 0));

    // Macros (rough guidelines)
    const protein = Math.round(weight * (goal === 'muscle-gain' ? 2.0 : 1.6));
    const fat     = Math.round((calories * 0.25) / 9);
    const carbs   = Math.round((calories - (protein * 4) - (fat * 9)) / 4);

    // Display result
    const resultDiv = document.getElementById('calorie-result');
    const calVal  = document.getElementById('calorie-value');
    const protVal = document.getElementById('protein-value');
    const fatVal  = document.getElementById('fat-value');
    const carbVal = document.getElementById('carb-value');
    const bmrVal  = document.getElementById('bmr-value');

    if (calVal)  calVal.textContent  = calories.toLocaleString();
    if (bmrVal)  bmrVal.textContent  = Math.round(bmr).toLocaleString();
    if (protVal) protVal.textContent = protein + 'g';
    if (fatVal)  fatVal.textContent  = fat + 'g';
    if (carbVal) carbVal.textContent = carbs + 'g';

    resultDiv?.classList.add('show');
    resultDiv?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ══════════════════════════════════════════
   MULTI-STEP FORM
   ══════════════════════════════════════════ */
function initMultiStepForm() {
  const forms = document.querySelectorAll('[data-multistep]');
  forms.forEach(setupMultiStep);
}

function setupMultiStep(formEl) {
  const steps   = Array.from(formEl.querySelectorAll('.form-step'));
  const dots    = Array.from(formEl.querySelectorAll('.step-dot'));
  const lines   = Array.from(formEl.querySelectorAll('.step-line'));
  const nextBtns = formEl.querySelectorAll('[data-next]');
  const prevBtns = formEl.querySelectorAll('[data-prev]');

  let current = 0;

  function updateUI() {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === current);
    });

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.classList.toggle('done', i < current);
    });

    lines.forEach((l, i) => {
      l.classList.toggle('done', i < current);
    });

    // Update step counter if present
    const counter = formEl.querySelector('[data-step-current]');
    if (counter) counter.textContent = current + 1;
    const total = formEl.querySelector('[data-step-total]');
    if (total) total.textContent = steps.length;
  }

  function validateCurrentStep() {
    const activeStep = steps[current];
    const required   = activeStep.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--clr-error)';
        field.style.boxShadow   = '0 0 0 4px rgba(239,68,68,0.1)';
        valid = false;
      } else {
        field.style.borderColor = '';
        field.style.boxShadow   = '';
      }
    });

    if (!valid) {
      required[0]?.focus();
      showToast?.('Please fill in all required fields.', 'error');
    }

    return valid;
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!validateCurrentStep()) return;
      if (current < steps.length - 1) {
        current++;
        updateUI();
        formEl.querySelector('.form-steps')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (current > 0) { current--; updateUI(); }
    });
  });

  updateUI();
}

/* ══════════════════════════════════════════
   FORM VALIDATION (general)
   ══════════════════════════════════════════ */
function initFormValidation() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('[required]');
      let allValid = true;

      inputs.forEach(input => {
        const errorEl = input.closest('.form-group')?.querySelector('.form-error');

        if (!input.value.trim()) {
          input.style.borderColor = 'var(--clr-error)';
          if (errorEl) { errorEl.textContent = 'This field is required.'; errorEl.classList.add('show'); }
          allValid = false;
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input.style.borderColor = 'var(--clr-error)';
          if (errorEl) { errorEl.textContent = 'Please enter a valid email.'; errorEl.classList.add('show'); }
          allValid = false;
        } else if (input.type === 'tel' && !/^\+?[\d\s\-()]{7,15}$/.test(input.value)) {
          input.style.borderColor = 'var(--clr-error)';
          if (errorEl) { errorEl.textContent = 'Please enter a valid phone number.'; errorEl.classList.add('show'); }
          allValid = false;
        } else {
          input.style.borderColor = 'var(--clr-success)';
          if (errorEl) errorEl.classList.remove('show');
        }
      });

      if (!allValid) e.preventDefault();
    });
  });
}

/* ══════════════════════════════════════════
   CONTACT FORM
   ══════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = await submitForm(form, 'backend/contact.php');
      if (data.success) {
        showToast('Message sent! We\'ll get back to you within 24 hours.', 'success');
        form.reset();
      } else {
        showToast(data.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please check your connection.', 'error');
    }
  });
}

/* ══════════════════════════════════════════
   BOOKING FORM
   ══════════════════════════════════════════ */
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  // Set minimum date to today
  const dateInput = form.querySelector('#booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = await submitForm(form, 'backend/booking.php');
      if (data.success) {
        showToast('🎉 Consultation booked! You\'ll receive a confirmation email shortly.', 'success', 6000);
        form.closest('[data-multistep]') ? null : form.reset();
        const successSection = document.getElementById('booking-success');
        if (successSection) {
          successSection.style.display = 'block';
          successSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        showToast(data.message || 'Booking failed. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    }
  });
}

/* ══════════════════════════════════════════
   NEWSLETTER SUBSCRIBE
   ══════════════════════════════════════════ */
function initSubscribeForm() {
  document.querySelectorAll('[data-subscribe-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('[type="email"]')?.value;
      if (!email) return;

      try {
        const data = await submitForm(form, 'backend/subscribe.php');
        if (data.success) {
          showToast('🎉 Subscribed! Check your email for a free health guide.', 'success');
          form.reset();
        } else {
          showToast(data.message || 'Subscription failed. Please try again.', 'error');
        }
      } catch {
        showToast('Network error. Please try again.', 'error');
      }
    });
  });
}

/* ══════════════════════════════════════════
   HEALTH ASSESSMENT FORM
   ══════════════════════════════════════════ */
function initHealthAssessmentForm() {
  const form = document.getElementById('health-assessment-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = await submitForm(form, 'backend/assessment.php');
      if (data.success) {
        showToast('Assessment submitted! Our nutritionist will review and contact you.', 'success', 6000);
        const resultSection = document.getElementById('assessment-result');
        if (resultSection) {
          resultSection.style.display = 'block';
          resultSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        showToast(data.message || 'Submission failed. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    }
  });
}

/* ══════════════════════════════════════════
   UTILITY: Format number with commas
   ══════════════════════════════════════════ */
function formatNumber(n) {
  return n.toLocaleString('en-IN');
}

window.formatNumber = formatNumber;
