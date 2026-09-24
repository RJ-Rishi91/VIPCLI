/**
 * EnviroRise Clearance (ERC) — Interactive Diagrams & Process Visualizations
 * Powers the Assessment Hub, Clearances Flow, Monitoring Hub, and Audit Cycle.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAssessmentHub();
  initClearancesTimeline();
  initMonitoringHub();
  initAuditCycle();
});

// 1. Assessment Hub Interaction
function initAssessmentHub() {
  const hubContainer = document.getElementById('assessment-hub-container');
  if (!hubContainer) return;

  const nodes = hubContainer.querySelectorAll('.assessment-node');
  const previewTitle = document.getElementById('hub-preview-title');
  const previewDesc = document.getElementById('hub-preview-desc');
  const previewPill = document.getElementById('hub-preview-pill');

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => {
        n.classList.remove('ring-4', 'ring-fresh-green', 'bg-mint-tint');
        n.classList.add('bg-white');
      });
      node.classList.add('ring-4', 'ring-fresh-green', 'bg-mint-tint');
      node.classList.remove('bg-white');

      const title = node.getAttribute('data-title');
      const desc = node.getAttribute('data-desc');
      const category = node.getAttribute('data-category') || 'ASSESSMENT SERVICE';

      if (previewTitle) previewTitle.textContent = title;
      if (previewDesc) previewDesc.textContent = desc;
      if (previewPill) previewPill.textContent = category;
    });
  });
}

// 2. Clearances Process Timeline
function initClearancesTimeline() {
  const steps = document.querySelectorAll('.clearance-step-item');
  const detailsTitle = document.getElementById('clearance-detail-title');
  const detailsText = document.getElementById('clearance-detail-text');

  if (!steps.length) return;

  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => {
        s.classList.remove('active-step', 'border-fresh-green', 'bg-mint-tint');
        s.classList.add('border-border', 'bg-white');
      });
      step.classList.add('active-step', 'border-fresh-green', 'bg-mint-tint');
      step.classList.remove('border-border', 'bg-white');

      const title = step.getAttribute('data-title');
      const text = step.getAttribute('data-text');

      if (detailsTitle) detailsTitle.textContent = title;
      if (detailsText) detailsText.textContent = text;
    });
  });
}

// 3. Monitoring Hub
function initMonitoringHub() {
  const nodes = document.querySelectorAll('.monitoring-node');
  const previewBox = document.getElementById('monitoring-preview-box');
  const titleEl = document.getElementById('monitoring-preview-title');
  const descEl = document.getElementById('monitoring-preview-desc');

  if (!nodes.length || !previewBox) return;

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('active-mon-node', 'ring-4', 'ring-fresh-green'));
      node.classList.add('active-mon-node', 'ring-4', 'ring-fresh-green');

      const title = node.getAttribute('data-title');
      const desc = node.getAttribute('data-desc');

      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
    });
  });
}

// 4. Audit & Compliance Cycle
function initAuditCycle() {
  const cycleSteps = document.querySelectorAll('.audit-cycle-step');
  if (!cycleSteps.length) return;

  cycleSteps.forEach(step => {
    step.addEventListener('mouseenter', () => {
      cycleSteps.forEach(s => s.classList.remove('scale-105', 'shadow-xl', 'bg-mint-tint'));
      step.classList.add('scale-105', 'shadow-xl', 'bg-mint-tint');
    });
  });
}
