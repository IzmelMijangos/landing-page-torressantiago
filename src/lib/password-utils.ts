/**
 * Password Utilities
 * Helper functions for password generation and validation
 */

/**
 * Generates a secure temporary password
 * Format: 3 words + number + special char
 * Example: "Luna42@Cielo", "Mar15!Verde"
 */
export function generateTemporaryPassword(): string {
  const words = [
    'Luna', 'Sol', 'Mar', 'Rio', 'Luz', 'Paz', 'Flor', 'Vida',
    'Cielo', 'Nube', 'Viento', 'Fuego', 'Agua', 'Tierra', 'Verde',
    'Azul', 'Rojo', 'Oro', 'Plata', 'Estrella', 'Montana', 'Valle',
  ];

  const specialChars = ['!', '@', '#', '$', '%', '&', '*'];

  // Pick 2 random words
  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];

  // Random number between 10-99
  const number = Math.floor(Math.random() * 90) + 10;

  // Random special char
  const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];

  // Combine: Word1 + Number + SpecialChar + Word2
  return `${word1}${number}${specialChar}${word2}`;
}

/**
 * Validates password strength
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
