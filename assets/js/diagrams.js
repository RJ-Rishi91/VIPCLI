/**
 * EnviroRise Clearance (ERC) — Interactive Diagrams & Process Visualizations
 * Powers the Assessment Hub, Clearances Flow, Monitoring Hub, and Audit Cycle.
 * Fully responsive for both desktop cursor navigation and mobile touchscreens.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAssessmentHub();
  initClearancesTimeline();
  initMonitoringHub();
  initAuditCycle();
});

// 1. Assessment Hub Interaction
function initAssessmentHub() {
  const customNodes = document.querySelectorAll('.assessment-node');
  const targetNodes = customNodes.length 
    ? customNodes 
    : document.querySelectorAll('#assessment-hub-container .flex.items-start, main section .lg\\:col-span-4 .flex.items-start');
    
  if (!targetNodes.length) return;

  targetNodes.forEach(node => {
    node.classList.add('cursor-pointer', 'transition-all', 'duration-200');
    
    const activate = () => {
      targetNodes.forEach(n => {
        n.classList.remove('ring-2', 'ring-fresh-green', 'bg-mint-tint/80', 'shadow-md');
      });
      node.classList.add('ring-2', 'ring-fresh-green', 'bg-mint-tint/80', 'shadow-md');
    };

    node.addEventListener('click', activate);
    node.addEventListener('mouseenter', activate);
  });
}

// 2. Clearances Process Timeline
function initClearancesTimeline() {
  const customSteps = document.querySelectorAll('.clearance-step-item');
  const steps = customSteps.length 
    ? customSteps 
    : document.querySelectorAll('main section .md\\:grid-cols-5 > div');
    
  if (!steps.length) return;

  steps.forEach(step => {
    step.classList.add('cursor-pointer', 'transition-all', 'duration-200', 'rounded-2xl', 'p-2');
    
    const activate = () => {
      steps.forEach(s => {
        s.classList.remove('scale-105', 'bg-mint-tint/60', 'ring-2', 'ring-fresh-green', 'shadow-md');
      });
      step.classList.add('scale-105', 'bg-mint-tint/60', 'ring-2', 'ring-fresh-green', 'shadow-md');
    };

    step.addEventListener('click', activate);
    step.addEventListener('mouseenter', activate);
  });
}

// 3. Monitoring Hub Interaction
function initMonitoringHub() {
  const customNodes = document.querySelectorAll('.monitoring-node');
  const nodes = customNodes.length 
    ? customNodes 
    : document.querySelectorAll('main section .lg\\:col-span-4 .rounded-2xl.bg-surface');
    
  if (!nodes.length) return;

  nodes.forEach(node => {
    node.classList.add('cursor-pointer', 'transition-all', 'duration-200');

    const activate = () => {
      nodes.forEach(n => {
        n.classList.remove('ring-2', 'ring-fresh-green', 'bg-mint-tint/80', 'shadow-md');
      });
      node.classList.add('ring-2', 'ring-fresh-green', 'bg-mint-tint/80', 'shadow-md');
    };

    node.addEventListener('click', activate);
    node.addEventListener('mouseenter', activate);
  });
}

// 4. Audit & Compliance Cycle Interaction
function initAuditCycle() {
  const customSteps = document.querySelectorAll('.audit-cycle-step');
  const cycleSteps = customSteps.length 
    ? customSteps 
    : document.querySelectorAll('main section .grid-cols-1.md\\:grid-cols-5 > .flex-col.items-center');
    
  if (!cycleSteps.length) return;

  cycleSteps.forEach(step => {
    step.classList.add('cursor-pointer', 'transition-all', 'duration-200', 'rounded-2xl', 'p-2');

    const activate = () => {
      cycleSteps.forEach(s => {
        s.classList.remove('scale-105', 'shadow-xl', 'bg-mint-tint/80');
      });
      step.classList.add('scale-105', 'shadow-xl', 'bg-mint-tint/80');
    };

    step.addEventListener('mouseenter', activate);
    step.addEventListener('click', activate);
    step.addEventListener('touchstart', activate, { passive: true });
  });
}
