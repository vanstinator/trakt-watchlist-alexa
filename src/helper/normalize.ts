export default (input: string): string => {
  // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\W/, '')
    .toLowerCase();
};