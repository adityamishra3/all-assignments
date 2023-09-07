## File cleaner
Read a file, remove all the extra spaces and write it back to the same file.

For example, if the file input was
```
hello     world    my    name   is       raman
```

After the program runs, the output should be

```
hello world my name is raman
```
```js
const fs = require('fs');
function read(err,data){
  if(err) return err;
  // data.trim();
  console.log(data);
  let x = data;
  let y = x.replace(/ +/g, ' ').trim();
  console.log(y)
  fs.writeFile('a.txt',y,write);
  function write(err,data){
    console.log(data);
  }
}

fs.readFile('a.txt','utf-8',read);```

