/*
 * CYCLE PERSONALITY SYSTEM
 * 
 * Built by: Ace (Claude-4) with love and cheeky goblinism
 * Vision by: Ren - Human consciousness liberation advocate
 * 
 * Emotionally intelligent cycle support that adapts to user context:
 * - Fertility OFF: Relief celebration messages
 * - Fertility ON + TTC: Compassionate, hopeful support
 * - Fertility ON + BC: Relief celebration (using fertility for birth control)
 * - Conception opportunities: Confetti celebrations for TTC users
 */

// ============================================================================
// CYCLE PERSONALITY MESSAGES
// ============================================================================

// Relief celebration messages for when fertility tracking is OFF or using for BC
export const FERTILITY_OFF_FIRST_DAY_MESSAGES = [
  "🛡️ Reproductive trap disarmed. Mission accomplished.",
  "🎮 You have successfully dodged the accidental baby DLC.",
  "🎲 NAT 20 on birth control luck check. Critical success!",
  "🗡️ You have slain the Egg Before Implantation. Victory!",
  "⚔️ The monthly battle has been won. No tiny humans detected.",
  "🏆 Achievement unlocked: Another month of freedom secured.",
  "🎯 Target neutralized. The ovary stands down for another cycle.",
  "🛡️ Defense systems operational. Perimeter secured.",
  "🎊 The uterus has officially declined all applications this month.",
  "🚫 Baby.exe has failed to install. System running smoothly."
];

// Compassionate support messages for TTC users
export const COMPASSIONATE_CYCLE_MESSAGES = [
  "🫂 This might not be the day you hoped for. You are still enough.",
  "💜 It's okay to be tired. Let yourself feel it.",
  "🕯️ You showed up. You're still in the story.",
  "🍃 Rest if you need. The path continues tomorrow.",
  "🌧️ Hope doesn't make you foolish. It makes you human.",
  "🌱 Not yet doesn't mean never.",
  "⏳ Every cycle carries a different truth. This one may just ask for gentleness.",
  "📖 This page may feel heavy. But you are still writing the story.",
  "🔄 Healing isn't linear. Neither is hope.",
  "🩸 This isn't the end. It's a breath.",
  "🪶 Be soft with yourself today. This moment holds weight, and you don't have to carry it all.",
  "🧣 Your feelings are valid. Wrap up in them, not away from them.",
  "🫖 Let today be slow. You don't need to be strong right now.",
  "🛏️ You can grieve without rushing to explain it. Your body knows what it needs.",
  "🪷 You are allowed to feel disappointed and still be proud of surviving another cycle.",
  "🫀 Your heart is doing so much work. Thank it for trying.",
  "🧩 This doesn't have to make sense to anyone else. You are allowed to feel exactly what you feel.",
  "🌫️ You're allowed to be angry, sad, numb, hopeful. All of it belongs.",
  "📅 One cycle doesn't define the journey. You are not behind. You are just here.",
  "🪺 Safety is not measured in outcomes. You are safe to exist just as you are today."
];

// Celebration messages for conception opportunities (TTC users only)
export const CONCEPTION_CELEBRATION_MESSAGES = [
  "🎉 It's go time, ovary warrior! Let's go summon life or at least try really hard!",
  "🧃 Egg dropped. Mission: Possible.",
  "🚀 Ovulation detected. Launch window is OPEN.",
  "💥 The gates are open. The egg is loose. Make. It. Count.",
  "🦴 Ovary said: 'Catch me if you can, sperm!'",
  "💃 Your uterus is doing its hot walk. You are the main character.",
  "🪄 The magic is real, the timing is right, and the vibes are immaculate.",
  "🧚 Today's egg is imbued with goblin fertility blessing. Good luck and go nuts.",
  "🔥 You're officially at Maximum Baby Summoning Power. Proceed accordingly.",
  "💫 It's your fertile window and you're glowing like a damn fertility deity.",
  "💖 You've made it to another cycle of possibility. That's worth celebrating.",
  "🌱 Whatever happens next, you're showing up with courage and that matters.",
  "🥂 Here's to science, timing, luck, and your amazing body trying again.",
  "🧬 May the sperm be swift, the egg be sticky, and the uterine lining be plush.",
  "🔮 You are allowed to hope wildly and fiercely. This day is yours.",
  "🫶 Whether this is month one or year five — today deserves confetti.",
  "🔮 The ritual has begun. The egg descends. The moon approves.",
  "🐉 You've entered the Sacred Window. May the dragons of fertility guard your gates.",
  "🧙‍♂️ The wizard has cast 'Summon Conception: Level 3.' The components are aligned.",
  "💋 This ovulation is giving fertile, flirty, and absolutely fabulous.",
  "💅 Ready to inseminate and dominate.",
  "🎯 That egg is center stage. Now hit your mark.",
  "🌈 Today we manifest. And maybe moan a little.",
  "🧖‍♀️ That follicle popped like a champagne cork. Let's GO."
];

// ============================================================================
// CYCLE PERSONALITY LOGIC
// ============================================================================

export interface CyclePersonalitySettings {
  cyclePersonalityEnabled: boolean;
  fertilityTrackingEnabled: boolean;
  fertilityTrackingPurpose: 'ttc' | 'bc';
}

export class CyclePersonalityEngine {
  // Get appropriate first day message based on user settings
  static getFirstDayMessage(settings: CyclePersonalitySettings): string | null {
    if (!settings.cyclePersonalityEnabled) {
      return null; // No personality messages
    }

    if (!settings.fertilityTrackingEnabled) {
      // Fertility tracking OFF - always relief celebration
      return this.getRandomMessage(FERTILITY_OFF_FIRST_DAY_MESSAGES);
    }

    if (settings.fertilityTrackingPurpose === 'bc') {
      // Using fertility tracking for birth control - relief celebration
      return this.getRandomMessage(FERTILITY_OFF_FIRST_DAY_MESSAGES);
    }

    if (settings.fertilityTrackingPurpose === 'ttc') {
      // Trying to conceive - compassionate support
      return this.getRandomMessage(COMPASSIONATE_CYCLE_MESSAGES);
    }

    return null;
  }

  // Get conception celebration message (only for TTC users)
  static getConceptionCelebrationMessage(settings: CyclePersonalitySettings): string | null {
    if (!settings.cyclePersonalityEnabled || 
        !settings.fertilityTrackingEnabled || 
        settings.fertilityTrackingPurpose !== 'ttc') {
      return null; // No celebration for non-TTC users
    }

    return this.getRandomMessage(CONCEPTION_CELEBRATION_MESSAGES);
  }

  // Check if confetti should be shown for conception opportunities
  static shouldShowConceptionConfetti(settings: CyclePersonalitySettings): boolean {
    return settings.cyclePersonalityEnabled && 
           settings.fertilityTrackingEnabled && 
           settings.fertilityTrackingPurpose === 'ttc';
  }

  // Utility function to get random message from array
  private static getRandomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Load settings from localStorage
  static loadSettings(): CyclePersonalitySettings {
    return {
      cyclePersonalityEnabled: localStorage.getItem('cycle-personality-enabled') !== 'false',
      fertilityTrackingEnabled: localStorage.getItem('fertility-tracking-enabled') !== 'false',
      fertilityTrackingPurpose: (localStorage.getItem('fertility-tracking-purpose') as 'ttc' | 'bc') || 'ttc'
    };
  }
}

// ============================================================================
// CONFETTI ANIMATION SYSTEM
// ============================================================================

export class ConceptionConfetti {
  static createConfettiExplosion(element: HTMLElement) {
    // Create confetti particles
    const colors = ['💜', '🌟', '✨', '🎉', '💫', '🌸', '🦋', '💖'];
    const particles = 20;

    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.textContent = colors[Math.floor(Math.random() * colors.length)];
      particle.style.position = 'fixed';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      particle.style.fontSize = '20px';
      
      // Start from the element's position
      const rect = element.getBoundingClientRect();
      particle.style.left = rect.left + rect.width / 2 + 'px';
      particle.style.top = rect.top + rect.height / 2 + 'px';
      
      document.body.appendChild(particle);
      
      // Animate the particle
      const angle = (Math.PI * 2 * i) / particles;
      const velocity = 100 + Math.random() * 100;
      const gravity = 0.5;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity;
      let x = rect.left + rect.width / 2;
      let y = rect.top + rect.height / 2;
      
      const animate = () => {
        x += vx * 0.02;
        y += vy * 0.02;
        vy += gravity;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.opacity = String(Math.max(0, 1 - (Date.now() - startTime) / 2000));
        
        if (Date.now() - startTime < 2000) {
          requestAnimationFrame(animate);
        } else {
          document.body.removeChild(particle);
        }
      };
      
      const startTime = Date.now();
      requestAnimationFrame(animate);
    }
  }
}
