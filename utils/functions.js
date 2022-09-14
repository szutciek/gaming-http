exports.validateEmail = (email) => {
  if (email.length > 150) return false;
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
  return re.test(email);
};

exports.validateLetters = (str) => {
  if (str.length > 200) return false;
  const pattern = /^[A-Za-z ąćęłńóśżźĄĆĘŁŃÓŚŻŹ-]+$/;
  return pattern.test(str);
};

exports.validateNumbers = (str) => {
  if (str.length > 150) return false;
  const pattern = /^[0-9 +-]+$/;
  return pattern.test(str);
};

exports.validateCharacters = (str) => {
  if (str.length > 200) return false;
  const pattern = /^[A-Za-z0-9 .ąćęłńóśżźĄĆĘŁŃÓŚŻŹ-]*$/;
  return pattern.test(str);
};

exports.validateManyCharacters = (str) => {
  if (str.length > 300) return false;
  const pattern = /^[A-Za-z0-9 ._/!%&#@ąćęłńóśżźĄĆĘŁŃÓŚŻŹ-]*$/;
  return pattern.test(str);
};
