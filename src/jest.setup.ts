// Make this a proper module
export {};

// Add BigInt serialization to JSON
// @ts-ignore - TypeScript doesn't recognize this property but it works at runtime
BigInt.prototype.toJSON = function() {
  return this.toString();
};

// Define globally for TypeScript
declare global {
  interface BigInt {
    toJSON(): string;
  }
} 