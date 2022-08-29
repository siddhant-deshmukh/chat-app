const {faker} = require('@faker-js/faker')
const mongoose = require('mongoose')

const ans = [];
const members = ["6308ea4868a34f510810c692","6308ea1168a34f510810c689"]

for(var i=0;i<100;i++){
    const msg={};
    msg.author = members[Math.floor(Math.random()*2)] //mongoose.Types.ObjectId(
    msg.message= faker.lorem.sentence(Math.floor(Math.random()*30));
    msg.type= "String";

    ans.push(msg);
}
//console.log(ans);
const str = JSON.stringify(ans)
  let result = str.replace("'", '"');

console.log(result)
console.log("Meow")
console.log(faker.lorem.sentence())