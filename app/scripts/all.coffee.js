var Person;

Person = (function() {
  function Person(options) {
    this.name = options.name, this.lastname = options.lastname, this.age = options.age, this.height = options.height, this.weight = options.weight;
  }

  return Person;

})();
