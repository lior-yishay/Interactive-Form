export const callIfExsist = (func, ...props) =>
  func ? func(...props) : undefined;
