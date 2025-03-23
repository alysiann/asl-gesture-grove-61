
import { monkeyPatchHandUtils } from './signLanguageUtils';

/**
 * Initialize all patches and extensions to read-only files
 */
export function initializePatches() {
  // Patch the handUtils recognizeASLLetter function to support different languages
  monkeyPatchHandUtils();
  
  console.log("Patches initialized for multilingual sign language support");
}
