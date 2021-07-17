const { uniqueNamesGenerator, NumberDictionary } = require('unique-names-generator');

export default function generateUsername(name) {
  const numberDictionary = NumberDictionary.generate({ length: 4 });
  name = name.map((item) => item.toLowerCase());

  return uniqueNamesGenerator({
    dictionaries: [[name[0]], [name[1]], numberDictionary],
    length: 3,
    style: 'capital',
    separator: '',
  });
}
