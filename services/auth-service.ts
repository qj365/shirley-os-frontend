export function getPasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  const feedback: string[] = [];
  const penaltyReasons: string[] = [];

  // Basic length requirements
  if (password.length >= 8) {
    score += 20;
  } else {
    feedback.push('Use at least 8 characters');
    return { score: 0, strength: 'Very Weak', feedback, is_strong: false };
  }

  if (password.length >= 12) {
    score += 10;
  } else {
    feedback.push('Use 12+ characters for better security');
  }

  if (password.length >= 16) {
    score += 10;
  }

  // Character variety checks
  let varietyCount = 0;
  if (/[a-z]/.test(password)) {
    score += 10;
    varietyCount++;
  } else {
    feedback.push('Include lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 10;
    varietyCount++;
  } else {
    feedback.push('Include uppercase letters');
  }

  if (/\d/.test(password)) {
    score += 10;
    varietyCount++;
  } else {
    feedback.push('Include numbers');
  }

  if (/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/'~`]/.test(password)) {
    score += 15;
    varietyCount++;
  } else {
    feedback.push('Include special characters (!@#$%^&* etc.)');
  }

  // Bonus for character variety
  if (varietyCount === 4) {
    score += 5;
  }

  // SECURITY PENALTIES - These significantly reduce the score

  // Common weak patterns that should never be "strong"
  const weakPatterns = [
    {
      pattern: /^[A-Z][a-z]+\d+[!@#$%^&*]?$/,
      penalty: 40,
      reason: "Avoid predictable patterns like 'Word123!'",
    },
    {
      pattern: /^[A-Z][a-z]+\d*[!@#$%^&*]+$/,
      penalty: 35,
      reason: 'Avoid simple word + symbols pattern',
    },
    {
      pattern: /(password|pass|pwd)/i,
      penalty: 50,
      reason: "Don't use variations of 'password'",
    },
    {
      pattern: /^.*(123|234|345|456|567|678|789|890|012).*$/,
      penalty: 25,
      reason: 'Avoid sequential numbers',
    },
    {
      pattern:
        /^.*(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz).*$/i,
      penalty: 25,
      reason: 'Avoid sequential letters',
    },
    {
      pattern: /^.*(qwerty|asdf|zxcv|1234|4321|abcd|dcba).*$/i,
      penalty: 30,
      reason: 'Avoid keyboard patterns',
    },
  ];

  // Common weak words/names that reduce strength
  const commonWeakWords = [
    'admin',
    'user',
    'guest',
    'test',
    'demo',
    'temp',
    'login',
    'welcome',
    'hello',
    'world',
    'secret',
    'private',
    'secure',
    'master',
    'super',
    'john',
    'jane',
    'smith',
    'admin',
    'root',
    'god',
    'love',
    'money',
    'letmein',
    'changeme',
    'qwerty',
    'keyboard',
    'computer',
    'internet',
  ];

  // Check for weak patterns
  for (const { pattern, penalty, reason } of weakPatterns) {
    if (pattern.test(password)) {
      score -= penalty;
      penaltyReasons.push(reason);
    }
  }

  // Check for common weak words
  const lowerPassword = password.toLowerCase();
  for (const weakWord of commonWeakWords) {
    if (lowerPassword.includes(weakWord)) {
      score -= 20;
      penaltyReasons.push(`Avoid common words like '${weakWord}'`);
      break; // Only penalize once for weak words
    }
  }

  // Repetition penalties
  const repeatedChars = password.match(/(.)\1{2,}/g);
  if (repeatedChars) {
    score -= repeatedChars.length * 10;
    penaltyReasons.push('Avoid repeating characters (aaa, 111, etc.)');
  }

  // Dictionary word detection (basic check for common patterns)
  const possibleWords = password.replace(/[^a-zA-Z]/g, '').toLowerCase();
  if (possibleWords.length >= 4) {
    const commonWords = [
      'love',
      'hate',
      'life',
      'work',
      'home',
      'time',
      'year',
      'good',
      'best',
      'true',
      'real',
      'cool',
      'nice',
      'great',
    ];
    for (const word of commonWords) {
      if (possibleWords.includes(word)) {
        score -= 15;
        penaltyReasons.push(`Avoid dictionary words like '${word}'`);
        break;
      }
    }
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  // Add penalty feedback to main feedback
  feedback.push(...penaltyReasons);

  // Determine strength level with stricter thresholds
  let strength: PasswordStrengthResult['strength'];
  if (score >= 80 && penaltyReasons.length === 0) {
    strength = 'Very Strong';
  } else if (score >= 65 && penaltyReasons.length <= 1) {
    strength = 'Strong';
  } else if (score >= 45) {
    strength = 'Moderate';
  } else if (score >= 25) {
    strength = 'Weak';
  } else {
    strength = 'Very Weak';
  }

  // Override: If there are significant penalties, cap at "Moderate" max
  if (penaltyReasons.length >= 2) {
    if (strength === 'Very Strong' || strength === 'Strong') {
      strength = 'Moderate';
    }
  }

  return {
    score,
    strength,
    feedback: feedback.slice(0, 5), // Limit feedback to avoid overwhelming UI
    is_strong: score >= 65 && penaltyReasons.length <= 1,
  };
}

export interface PasswordStrengthResult {
  score: number;
  strength: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  feedback: string[];
  is_strong: boolean;
}
