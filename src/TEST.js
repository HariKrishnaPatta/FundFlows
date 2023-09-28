function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  let a = 0;
  let b = 1;
  let c = 1;
  for (let i = 2; i <= n; i++) {
  c = a + b;
  a = b;
  b = c;
  }
  return c;
}
const n = 5;
for (let i = 0; i <= n; i++) {
console.log(fibonacci(i));
}

 