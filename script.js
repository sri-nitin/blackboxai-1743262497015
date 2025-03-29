// DOM Elements
const sensitivityControls = document.querySelector('.sensitivity-controls');
const presetsContainer = document.querySelector('.preset-buttons');

// Sensitivity presets (values for each scope)
const PRESETS = {
  headshot: {
    general: 65,
    redDot: 60, 
    holo: 55,
    x2: 50,
    x4: 45,
    awm: 40,
    hipFire: 70
  },
  balanced: {
    redDot: 70,
    holo: 65,
    x2: 60,
    x4: 55,
    awm: 50,
    general: 60
  },
  aggressive: {
    redDot: 95,
    holo: 90,
    x2: 85,
    x4: 80,
    awm: 75,
    general: 85
  }
};

// Scope types and their display names
const SCOPE_TYPES = [
  { id: 'general', name: 'General Sensitivity' },
  { id: 'redDot', name: 'Red Dot' },
  { id: 'holo', name: 'Holo Sight' },
  { id: 'x2', name: '2x Scope' },
  { id: 'x4', name: '4x Scope' },
  { id: 'awm', name: 'AWM Scope' }
];

// Create sensitivity sliders for each scope type
function createSensitivityControls() {
  SCOPE_TYPES.forEach(scope => {
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';
    
    const label = document.createElement('div');
    label.className = 'slider-label';
    label.innerHTML = `
      <span>${scope.name}</span>
      <span id="${scope.id}-value">50</span>
    `;
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'slider';
    slider.min = '0';
    slider.max = '100';
    slider.value = '50';
    slider.id = scope.id;
    
    slider.addEventListener('input', (e) => {
      const value = e.target.value;
      document.getElementById(`${scope.id}-value`).textContent = value;
      
      // Visual feedback for optimal headshot range
      const optimalRanges = {
        general: [60, 70],
        redDot: [55, 65],
        holo: [50, 60],
        x2: [45, 55],
        x4: [40, 50],
        awm: [35, 45]
      };
      
      const valueEl = document.getElementById(`${scope.id}-value`);
      if (optimalRanges[scope.id] && 
          value >= optimalRanges[scope.id][0] && 
          value <= optimalRanges[scope.id][1]) {
        valueEl.style.color = '#4cd137'; // Green for optimal
        valueEl.style.fontWeight = 'bold';
      } else {
        valueEl.style.color = '';
        valueEl.style.fontWeight = '';
      }
    });
    
    sliderContainer.appendChild(label);
    sliderContainer.appendChild(slider);
    sensitivityControls.appendChild(sliderContainer);
  });
}

// Apply preset to all sliders
function applyPreset(preset, event) {
  SCOPE_TYPES.forEach(scope => {
    const slider = document.getElementById(scope.id);
    const value = preset[scope.id] || 50;
    slider.value = value;
    document.getElementById(`${scope.id}-value`).textContent = value;
    
    // Visual feedback
    const sliderContainer = slider.closest('.slider-container');
    sliderContainer.style.transition = 'all 0.3s ease';
    sliderContainer.style.transform = 'scale(1.02)';
    setTimeout(() => {
      sliderContainer.style.transform = 'scale(1)';
    }, 300);
  });
  
  // Highlight active preset button
  if (event) {
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.style.backgroundColor = '#535c68';
    });
    event.target.style.backgroundColor = 'var(--primary)';
  }
}

// Save current settings
function saveCustomPreset() {
  const customPreset = {};
  SCOPE_TYPES.forEach(scope => {
    customPreset[scope.id] = parseInt(document.getElementById(scope.id).value);
  });
  localStorage.setItem('customPreset', JSON.stringify(customPreset));
  alert('Custom settings saved!');
}

// Load saved settings
function loadCustomPreset() {
  const saved = localStorage.getItem('customPreset');
  if (saved) {
    applyPreset(JSON.parse(saved));
  } else {
    alert('No saved settings found');
  }
}

// Add save/load buttons
function addCustomPresetButtons() {
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'preset-buttons';
  buttonsDiv.innerHTML = `
    <button class="preset-btn" id="save-preset">
      <i class="fas fa-save"></i> Save Current
    </button>
    <button class="preset-btn" id="load-preset">
      <i class="fas fa-folder-open"></i> Load Saved
    </button>
  `;
  document.querySelector('.presets').appendChild(buttonsDiv);
  
  document.getElementById('save-preset').addEventListener('click', saveCustomPreset);
  document.getElementById('load-preset').addEventListener('click', loadCustomPreset);
}

// Setup preset buttons
function setupPresetButtons() {
  document.getElementById('headshot-preset').addEventListener('click', () => {
    applyPreset(PRESETS.headshot);
  });
  
  document.getElementById('balanced-preset').addEventListener('click', () => {
    applyPreset(PRESETS.balanced);
  });
  
  document.getElementById('aggressive-preset').addEventListener('click', () => {
    applyPreset(PRESETS.aggressive);
  });
}

// Initialize the app
function init() {
  createSensitivityControls();
  setupPresetButtons();
  applyPreset(PRESETS.headshot); // Default to headshot preset
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);