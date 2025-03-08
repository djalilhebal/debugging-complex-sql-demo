<template>
  <button 
    class="ink-button" 
    :class="{ 
      'disabled': disabled, 
      'loading': loading,
      'ready': !loading && !disabled 
    }"
    :disabled="disabled || loading"
    @click="$emit('click')">
    <span v-if="loading" class="loading-indicator">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: 'InkButton',
  props: {
    text: {
      type: String,
      default: 'Run code'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.ink-button {
  position: relative;
  padding: 12px 24px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: #fff;
  background-color: #1a1a1a;
  border: none;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  /* Grunge effect with a subtle texture */
  background-image: 
    radial-gradient(
      circle at 100% 0%, 
      rgba(255, 255, 255, 0.05) 0%, 
      transparent 25%
    ),
    linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 50%,
      transparent 100%
    );
  
  /* Irregular border using a subtle box-shadow */
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(0, 0, 0, 0.8);
}

.ink-button:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.05;
  pointer-events: none;
}

.ink-button:hover {
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(0, 0, 0, 0.8);
}

.ink-button:active {
  background-color: #131313;
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(0, 0, 0, 0.8);
}

/* States */
.ink-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 0 0 1px rgba(0, 0, 0, 0.5);
  background-color: #2a2a2a;
}

.ink-button.loading {
  cursor: wait;
  background-color: #222;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.loading-indicator .dot {
  width: 6px;
  height: 6px;
  background-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 1.4s infinite ease-in-out;
}

.loading-indicator .dot:nth-child(1) {
  animation-delay: 0s;
}

.loading-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.6;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Ready state - subtle pulse effect */
.ink-button.ready:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 70%, rgba(255, 255, 255, 0.03) 100%);
  animation: readyPulse 2s infinite;
  pointer-events: none;
}

@keyframes readyPulse {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
