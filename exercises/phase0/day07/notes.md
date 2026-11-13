1. user.name在对象键没有用-符号连接时使用，user[]在对象键有`-`符号时使用避免`-`识别为减号；键名存在变量里也只能使用user[];
2. const只锁定变量名，所以可以改属性;
3. such as: 
function copyUser(user){
    const copy ={};
    for(const key of Object.keys(user)){
        copy[key]=user[key];
    }
    return copy;
}
这种复制只复制第一层，嵌套对象仍然共享（浅拷贝）;
4. increamentAge use{...user}也是用的浅拷贝