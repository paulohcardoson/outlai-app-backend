// biome-ignore lint/suspicious/noExplicitAny: <Its necessary>
export const isValueAnObject = (value: any) => {
  const isObject = Object.prototype.toString.call(value) === '[object Object]';

  return isObject;
}